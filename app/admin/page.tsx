import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("sa7ar_admin");

  if (!adminCookie || adminCookie.value !== "yes") {
    redirect("/admin/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">
        Admin Dashboard
      </h1>

      <p className="text-gray-600">
        Login successful. Secure access granted.
      </p>
    </div>
  );
}