import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
