import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const urlConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  const anonConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY
  );
  const serviceConfigured = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY
  );

  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: 'Chưa cấu hình biến môi trường Supabase (.env.local hoặc Vercel Environment Variables).',
      envStatus: {
        NEXT_PUBLIC_SUPABASE_URL: urlConfigured,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: anonConfigured,
        SUPABASE_SERVICE_ROLE_KEY: serviceConfigured,
      },
    });
  }

  const diagnostics: any = {
    configured: true,
    envStatus: {
      NEXT_PUBLIC_SUPABASE_URL: urlConfigured,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonConfigured,
      SUPABASE_SERVICE_ROLE_KEY: serviceConfigured,
    },
    tables: {},
    storage: {},
  };

  try {
    // 1. Test Select from site_content table
    const { data: contentData, error: contentError } = await supabase
      .from('site_content')
      .select('count', { count: 'exact' });

    diagnostics.tables.site_content = contentError
      ? { status: 'error', message: contentError.message, details: contentError.details }
      : { status: 'ok', count: contentData };

    // 2. Test Write (Upsert test config)
    const testItem = {
      key: `test_ping`,
      value: { ping: true, timestamp: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    };

    const { error: writeErr } = await supabase
      .from('site_content')
      .upsert([testItem], { onConflict: 'key' });

    diagnostics.tables.writeTest = writeErr
      ? { status: 'error', message: writeErr.message, hint: writeErr.hint || 'Vui lòng chạy lại file supabase/schema.sql để bật RLS write permission' }
      : { status: 'ok', message: 'Thử nghiệm ghi dữ liệu vào bảng site_content thành công!' };

    // Clean up dummy item
    if (!writeErr) {
      await supabase.from('site_content').delete().eq('key', 'test_ping');
    }

    // 3. Test Storage Bucket 'uploads'
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      diagnostics.storage = { status: 'error', message: bucketError.message };
    } else {
      const hasUploadsBucket = buckets.some((b: any) => b.name === 'uploads' || b.id === 'uploads');
      diagnostics.storage = {
        status: hasUploadsBucket ? 'ok' : 'warning',
        message: hasUploadsBucket
          ? 'Đã tìm thấy Bucket uploads trong Supabase Storage'
          : 'Chưa tìm thấy Bucket uploads (Hệ thống sẽ tự động tạo khi tải ảnh)',
        bucketsFound: buckets.map((b: any) => b.name),
      };
    }

    const hasErrors =
      contentError ||
      writeErr ||
      diagnostics.storage.status === 'error';

    return NextResponse.json({
      success: !hasErrors,
      message: hasErrors
        ? 'Kết nối Supabase thất bại hoặc bị chặn bởi RLS Policy. Vui lòng xem chi tiết.'
        : 'Kết nối Supabase Database & Storage thành công 100%!',
      diagnostics,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err?.message || 'Lỗi hệ thống khi kiểm tra kết nối Supabase.',
      diagnostics,
    });
  }
}
