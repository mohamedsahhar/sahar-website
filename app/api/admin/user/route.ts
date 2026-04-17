import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, password, role } = body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error creating user", { status: 500 });
  }
}