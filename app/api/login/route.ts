import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const username = body.username;
  const password = body.password;

  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (
    username === adminUser &&
    password === adminPass
  ) {
    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("sa7ar_admin", "yes", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  }

  return NextResponse.json(
    { success: false },
    { status: 401 }
  );
}