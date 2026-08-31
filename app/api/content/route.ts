import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), 'data', 'site-content.json');

function readLocalData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (e) {
    console.error('Error reading local site content data file:', e);
  }
  return null;
}

function writeLocalData(data: any) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing local site content data file (serverless read-only):', e);
    return false;
  }
}

export async function GET() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: dbContent, error: contentError } = await supabase
        .from('site_content')
        .select('*');

      if (!contentError) {
        const local = readLocalData() || {};
        let siteConfig: any = {};
        if (dbContent && dbContent.length > 0) {
          dbContent.forEach((row: any) => {
            if (row.key === 'global_config') {
              siteConfig = { ...siteConfig, ...row.value };
            } else {
              siteConfig[row.key] = row.value;
            }
          });
        }

        const mergedData = {
          ...local,
          ...siteConfig,
        };

        return NextResponse.json({ success: true, data: mergedData, source: 'supabase' });
      }
    } catch (err) {
      console.error('Supabase GET error, falling back to local storage:', err);
    }
  }

  const content = readLocalData();
  if (content) {
    return NextResponse.json({ success: true, data: content, source: 'local' });
  }

  return NextResponse.json(
    { success: false, message: 'Khởi tạo dữ liệu thất bại' },
    { status: 404 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = readLocalData() || {};

    const updatedData = {
      ...currentData,
      ...body,
    };

    // Safely write to local JSON file (works in dev, ignored safely in Vercel serverless read-only filesystem)
    let localSuccess = false;
    try {
      localSuccess = writeLocalData(updatedData);
    } catch (e) {
      console.warn('Local JSON write skipped on serverless environment');
    }

    let supabaseSuccess = false;
    let supabaseErrorMessage = '';

    // If Supabase is configured, sync to Supabase database
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: configErr } = await supabase.from('site_content').upsert(
          [
            {
              key: 'global_config',
              value: updatedData,
              updated_at: new Date().toISOString(),
            },
          ],
          { onConflict: 'key' }
        );
        if (configErr) {
          console.error('Supabase site_content upsert error:', configErr);
          if (!supabaseErrorMessage) {
            supabaseErrorMessage = `Lỗi Supabase SiteContent: ${configErr.message}`;
          }
        }

        if (!supabaseErrorMessage) {
          supabaseSuccess = true;
        }
      } catch (sbErr: any) {
        console.error('Error syncing to Supabase:', sbErr);
        supabaseErrorMessage = `Lỗi Supabase Client: ${sbErr?.message || sbErr}`;
      }
    }

    if (supabaseSuccess || localSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Cập nhật dữ liệu thành công!',
        data: updatedData,
      });
    }

    // If Supabase failed explicitly, return the exact Supabase error
    if (supabaseErrorMessage) {
      return NextResponse.json(
        { success: false, message: `${supabaseErrorMessage}. Vui lòng kiểm tra RLS Policy trên Supabase.` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Lỗi khi ghi dữ liệu. Vui lòng kiểm tra cấu hình Supabase.' },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('API /content POST error:', err);
    return NextResponse.json(
      { success: false, message: `Lỗi định dạng dữ liệu: ${err?.message || err}` },
      { status: 400 }
    );
  }
}
