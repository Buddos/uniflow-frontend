import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(regName, regEmail, regPassword, regRole);
    setLoading(false);
    if (result.success) {
      toast.success(result.message || "Successfully created an account!");
    } else {
      toast.error(result.message || "Error during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background opacity-50 pointer-events-none" />
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4 shadow-lg text-primary-foreground">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">UniFlow</h1>
          <p className="text-muted-foreground mt-1 text-sm">Collaborative Academic Requirements System</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/80 backdrop-blur-md">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground text-center">Sign in to your account</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@university.ac.ke" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Sign In
                  </Button>
                </form>


              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
             <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95 animate-fade-in">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground text-center">Create an account</h2>
                <CardDescription className="text-center">Join UniFlow to manage scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="regName">Full Name</Label>
                    <Input id="regName" placeholder="Dr. John Doe" value={regName} onChange={e => setRegName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email Address</Label>
                    <Input id="regEmail" type="email" placeholder="you@university.ac.ke" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={regRole} onValueChange={setRegRole} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TIMETABLING_ADMIN">Timetabling Admin</SelectItem>
                        <SelectItem value="COD">Head of Department (COD)</SelectItem>
                        <SelectItem value="LECTURER">Lecturer</SelectItem>
                        <SelectItem value="CLASS_REP">Class Rep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <Input id="regPassword" type="password" placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Register
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
