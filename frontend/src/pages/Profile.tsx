import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Profile() {
  const user = useUser();
  if (!user) return null;
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Profile</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Role:</span> <span className="uppercase text-primary">{user.role}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
