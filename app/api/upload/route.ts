import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy file tải lên.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalExt = path.extname(file.name) || '.png';
    const safeName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${originalExt}`;

    // 1. Try uploading directly to Supabase Storage Bucket 'uploads' if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        let { data: uploadData, error: uploadErr } = await supabase.storage
          .from('uploads')
          .upload(safeName, buffer, {
            contentType: file.type || 'image/png',
            upsert: true,
          });

        // If bucket doesn't exist, try creating it and retry upload
        if (uploadErr && (uploadErr.message?.includes('not found') || uploadErr.message?.includes('Bucket'))) {
          await supabase.storage.createBucket('uploads', { public: true });
          const retryRes = await supabase.storage
            .from('uploads')
            .upload(safeName, buffer, {
              contentType: file.type || 'image/png',
              upsert: true,
            });
          uploadData = retryRes.data;
          uploadErr = retryRes.error;
        }

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('uploads')
            .getPublicUrl(safeName);

          if (publicUrlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              message: 'Tải ảnh lên Supabase Storage thành công!',
              url: publicUrlData.publicUrl,
              storage: 'supabase',
            });
          }
        } else {
          console.warn('Supabase storage upload error, falling back:', uploadErr?.message);
        }
      } catch (sbErr) {
        console.error('Supabase storage upload error:', sbErr);
      }
    }

    // 2. Try local disk write if in local environment
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);
      return NextResponse.json({
        success: true,
        message: 'Tải ảnh lên server thành công!',
        url: `/uploads/${safeName}`,
        storage: 'local',
      });
    } catch (fsErr) {
      console.warn('Local disk write skipped (Vercel serverless read-only), returning Data URL fallback');
    }

    // 3. Fallback to Data URI for Vercel serverless if storage bucket is not ready
    const mimeType = file.type || 'image/png';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      message: 'Tải ảnh thành công!',
      url: dataUrl,
      storage: 'base64',
    });
  } catch (err: any) {
    console.error('Error uploading file:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Lỗi khi tải ảnh lên server.' },
      { status: 500 }
    );
  }
}
