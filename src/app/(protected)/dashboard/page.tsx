import { getServerSession } from "@/core/auth/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { FileText, Upload, User } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user.name || session?.user.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/files">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage your uploaded files and documents
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/files">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload new files to your storage
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{session?.user.email}</p>
            </div>
            <div className="mt-2 text-sm">
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{session?.user.role}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
