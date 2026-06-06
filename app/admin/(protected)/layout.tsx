import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import AdminShell from "../AdminShell";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
