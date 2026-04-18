import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("sa7ar_admin")?.value;

  if (isAdmin !== "yes") {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <p className="text-gray-600">
        Welcome back Mohamed 👋
      </p>
    </div>
  );
}