import { UserList } from "@/features/admin-users";

export default function AdminUsersPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          View and manage user accounts
        </p>
      </div>

      <UserList />
    </div>
  );
}
