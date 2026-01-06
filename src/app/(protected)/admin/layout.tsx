import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
