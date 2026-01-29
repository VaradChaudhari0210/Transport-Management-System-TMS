import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '@/graphql/queries';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: { email, password, name } });
      if (data?.register?.token) {
        localStorage.setItem('authToken', data.register.token);
        toast({ title: 'Signup successful', description: `Welcome, ${data.register.user.name}` });
        navigate('/');
      }
    } catch (err: any) {
      toast({ title: 'Signup failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Input type="text" value={name} onChange={e => setName(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
            </Button>
            <div className="text-center text-sm mt-2">
              Already have an account?{' '}
              <a href="/login" className="text-primary underline">Sign in</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
