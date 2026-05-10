import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface ProfileProps {
  onBack: () => void;
}

interface User {
  fullName?: string;
  email?: string;
  role?: string;
}

export default function Profile({ onBack }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user) return <p className="p-6">No user data found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back
      </Button>

      <h2 className="text-2xl font-semibold mb-4">User Details</h2>

      <div className="bg-card border rounded-lg p-4 space-y-3">
        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <p className="font-medium">{user.fullName}</p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Role</label>
          <p className="font-medium capitalize">{user.role || "User"}</p>
        </div>
      </div>
    </div>
  );
}
