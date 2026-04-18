import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (
    body.username === "admin" &&
    body.password === "sa7ar123"
  ) {
    const res = NextResponse.json({ ok: true });

    res.cookies.set("sa7ar_admin", "yes", {
      path: "/",
      httpOnly: true,
    });

    return res;
  }

  return NextResponse.json(
    { error: "wrong" },
    { status: 401 }
  );
}