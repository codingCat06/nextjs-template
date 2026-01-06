import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (!session.user.isActive) {
    redirect("/sign-in?error=account-disabled");
  }

  return <>{children}</>;
}
