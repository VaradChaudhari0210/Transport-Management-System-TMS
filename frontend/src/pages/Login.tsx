import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '@/graphql/queries';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      if (data?.login?.token) {
        localStorage.setItem('authToken', data.login.token);
        toast({ title: 'Login successful', description: `Welcome, ${data.login.user.name}` });
        navigate('/');
      }
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
        </CardHeader>
        <CardContent>
          {/* Sample credentials info */}
          <div className="mb-6 p-3 rounded bg-gray-100 border text-sm">
            <div className="mb-1 font-semibold">Test Credentials:</div>
            <div className="mb-1">
              <span className="font-medium">Admin</span>: <span className="font-mono">admin@tms.com</span> / <span className="font-mono">admin123</span>
            </div>
            <div>
              <span className="font-medium">Employee</span>: <span className="font-mono">employee@tms.com</span> / <span className="font-mono">employee123</span>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
            </Button>
            <div className="text-center text-sm mt-2">
              Don't have an account?{' '}
              <a href="/signup" className="text-primary underline">Sign up</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
