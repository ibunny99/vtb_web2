import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Default admin credentials
    if (username === 'admin' && password === 'horizon2026') {
      const token = 'horizon_admin_session_token_2026_secured';
      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công!',
        user: { username: 'admin', role: 'Super Admin' },
      });

      // Set cookie for session authorization
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý hệ thống.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Đã đăng xuất.' });
  response.cookies.delete('admin_token');
  return response;
}
