-- =========================================================
-- HORIZON ROLEPLAY - SUPABASE DATABASE SCHEMA MIGRATION
-- Copy và dán toàn bộ script này vào Supabase SQL Editor để khởi tạo database.
-- =========================================================

-- 1. Bảng lưu danh sách Thư Mời (Invitations Table)
CREATE TABLE IF NOT EXISTS public.invitations (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    guest_name TEXT NOT NULL,
    guest_photo TEXT DEFAULT '',
    event_date TEXT DEFAULT '20H00, XX/XX/2026',
    show_date BOOLEAN DEFAULT TRUE,
    description TEXT DEFAULT 'THÀNH PHỐ HORIZON RP TRÂN TRỌNG GỬI LỜI MỜI GIA NHẬP ĐẾN BẠN. HÃY SẴN SÀNG TRẢI NGHIỆM THẾ GIỚI NHẬP VAI ĐỈNH CAO NHẤT.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thêm các cột nếu nâng cấp từ phiên bản cũ
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS event_date TEXT DEFAULT '20H00, XX/XX/2026';
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS show_date BOOLEAN DEFAULT TRUE;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'THÀNH PHỐ HORIZON RP TRÂN TRỌNG GỬI LỜI MỜI GIA NHẬP ĐẾN BẠN. HÃY SẴN SÀNG TRẢI NGHIỆM THẾ GIỚI NHẬP VAI ĐỈNH CAO NHẤT.';

-- Index tra cứu slug siêu nhanh cho trang công cộng /invitation/[guestSlug]
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations (slug);

-- 2. Bảng lưu Cấu hình Nội dung Website (Site Content Table)
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bật Row Level Security (RLS) để bảo mật
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 4. Phân Quyền RLS Chi Tiết (Cho phép Anon & Service Role được đọc/ghi)
DROP POLICY IF EXISTS "Public Read Invitations" ON public.invitations;
DROP POLICY IF EXISTS "All Access Invitations" ON public.invitations;
DROP POLICY IF EXISTS "Allow All Invitations" ON public.invitations;

CREATE POLICY "Allow All Invitations" ON public.invitations
    FOR ALL
    TO public, anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Site Content" ON public.site_content;
DROP POLICY IF EXISTS "All Access Site Content" ON public.site_content;
DROP POLICY IF EXISTS "Allow All Site Content" ON public.site_content;

CREATE POLICY "Allow All Site Content" ON public.site_content
    FOR ALL
    TO public, anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

-- 5. Khởi tạo Storage Bucket 'invitations' cho Supabase Storage (Upload ảnh khách mời)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invitations', 'invitations', true)
ON CONFLICT (id) DO NOTHING;

-- Phân quyền RLS cho Storage Bucket
DROP POLICY IF EXISTS "Public Read Invitations Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Invitations Storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Invitations Storage" ON storage.objects;

CREATE POLICY "Allow All Invitations Storage" ON storage.objects
    FOR ALL
    TO public, anon, authenticated, service_role
    USING (bucket_id = 'invitations')
    WITH CHECK (bucket_id = 'invitations');

-- 6. Nạp dữ liệu mẫu ban đầu (Seed Initial Data)
INSERT INTO public.invitations (id, slug, guest_name, guest_photo, event_date, show_date)
VALUES 
    ('inv-1', 'khach-moi-danh-du', 'TUWCOR', '', '20H00, XX/XX/2026', true),
    ('inv-2', 'tuitenbo', 'TUITENBO', '', '20H00, XX/XX/2026', true)
ON CONFLICT (id) DO UPDATE 
SET 
    slug = EXCLUDED.slug,
    guest_name = EXCLUDED.guest_name,
    guest_photo = EXCLUDED.guest_photo,
    event_date = EXCLUDED.event_date,
    show_date = EXCLUDED.show_date;

-- Nạp cấu hình trang chủ & máy chủ mặc định
INSERT INTO public.site_content (key, value)
VALUES (
    'global_config',
    '{
      "servers": [
        { "name": "VTB RP", "current": 542, "max": 666, "active": true },
        { "name": "Horizon RP", "current": 0, "max": 300, "active": false }
      ],
      "home": {
        "heroTitle1": "Nhập vai đỉnh cao",
        "heroTitle2": "Cổ điển - Tôn trọng",
        "heroDescription": "Horizon RP bắt đầu từ bạn. Một thế giới được xây dựng lại từ đầu với các trung tâm nhập vai được thiết kế riêng.",
        "aboutTitle": "Đa dạng. Trải nghiệm."
      },
      "applications": {
        "isOpen": false,
        "targetDate": "2026-08-11T18:00:00.000Z",
        "statusMessage": "Hệ thống duyệt hồ sơ Whitelist và nhận đơn gia nhập Horizon Roleplay đang hoàn thiện những bước cuối cùng."
      }
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
