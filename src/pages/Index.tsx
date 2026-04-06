import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GraduationCap, ArrowRight, CalendarDays, KeyRound, MapPin, Users, Loader2, FileText, Send, Users2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Index() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
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
    if (success) {
      setAuthOpen(false);
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(regName, regEmail, regPassword, regRole);
    setLoading(false);
    if (result.success) {
      setAuthOpen(false);
      toast.success(result.message || "Successfully created an account!");
      navigate('/dashboard');
    } else {
      toast.error(result.message || "Error during registration. Please try again.");
    }
  };

  const openLogin = () => {
    setActiveTab('login');
    setAuthOpen(true);
  };

  const openRegister = () => {
    setActiveTab('register');
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] sm:left-[-20%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] sm:bottom-[-20%] right-[-10%] sm:right-[-20%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10 border-b border-border/40 backdrop-blur-sm sticky top-0 bg-background/80">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight text-foreground">UniFlow</span>
        </div>
        <div>
          <Button variant="ghost" className="mr-2" onClick={openLogin}>Login</Button>
          <Button onClick={openRegister}>Get Started</Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 relative z-10 space-y-32 py-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in fade-in-0 duration-700">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-2 shadow-sm ring-1 ring-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
            Empowering Modern Academic Workflows
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter sm:tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground leading-tight">
            Seamless Scheduling & Venue Allocation
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            A collaborative system designed to coordinate lecturers, department heads, and timetabling admins into one seamless flow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all rounded-full" onClick={openLogin}>
              Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium rounded-full bg-background/50 backdrop-blur border-border/50 hover:bg-muted/50" onClick={openRegister}>
              Register Now
            </Button>
          </div>
        </section>

        {/* Requirement Elicitation Section */}
        <section className="max-w-6xl mx-auto space-y-12 animate-fade-in fade-in-0 duration-700 delay-200">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-2 shadow-sm ring-1 ring-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Requirement Elicitation System
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Streamlined Academic Planning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform for Course of Department (COD) submissions and Class Representative issue reporting to ensure optimal timetabling and venue allocation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">COD Requirements Submission</h3>
                    <p className="text-muted-foreground">
                      Submit department course requirements using last semester templates or start fresh. Include course units, student numbers, and special needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Users2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Cross-Department Requests</h3>
                    <p className="text-muted-foreground">
                      Receive and manage course unit requests from other departments. Compile all requirements before submission deadlines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Class Representative Issues</h3>
                    <p className="text-muted-foreground">
                      Report real-time class issues including overcrowding, equipment problems, and scheduling conflicts for immediate resolution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" variant="outline" className="flex-1 h-12 rounded-full bg-background/50 backdrop-blur border-border/50 hover:bg-muted/50" onClick={openLogin}>
                  Access COD Portal
                </Button>
                <Button size="lg" variant="outline" className="flex-1 h-12 rounded-full bg-background/50 backdrop-blur border-border/50 hover:bg-muted/50" onClick={openRegister}>
                  Register as Class Rep
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 border border-border/50 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-foreground mb-2">Submission Workflow</h4>
                    <p className="text-sm text-muted-foreground">End-to-end requirement management</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { step: '1', title: 'COD Preparation', desc: 'Use templates or create new requirements' },
                      { step: '2', title: 'Cross-Department Review', desc: 'Review and incorporate requests from other departments' },
                      { step: '3', title: 'Submission to Timetabling', desc: 'Submit compiled requirements before deadline' },
                      { step: '4', title: 'Timetabling & Allocation', desc: 'Admin processes and allocates venues' },
                      { step: '5', title: 'Class Rep Feedback', desc: 'Monitor and report any issues during execution' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/30">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {item.step}
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground">{item.title}</h5>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {[
            {
              icon: <FileText className="h-6 w-6" />,
              title: "Requirement Elicitation",
              desc: "CODs submit course requirements using templates or fresh submissions for optimal timetabling."
            },
            {
              icon: <Users2 className="h-6 w-6" />,
              title: "Cross-Department Coordination",
              desc: "Manage course unit requests between departments and compile comprehensive submissions."
            },
            {
              icon: <Send className="h-6 w-6" />,
              title: "Issue Reporting System",
              desc: "Class representatives report real-time issues for immediate resolution and venue adjustments."
            },
            {
              icon: <CalendarDays className="h-6 w-6" />,
              title: "Timetabling & Allocation",
              desc: "Automated venue allocation and conflict resolution based on submitted requirements."
            }
          ].map((feat, i) => (
            <div key={i} className="group relative p-6 bg-card/60 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-card/80 backdrop-blur-sm overflow-hidden flex flex-col items-start text-left">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </section>
      </main>
      
      {/* Auth Dialog */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Create Account</h2>
                <p className="text-muted-foreground">Join UniFlow to get started</p>
              </div>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="Enter your email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-role">Role</Label>
                  <Select value={regRole} onValueChange={setRegRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="LECTURER">Lecturer</SelectItem>
                      <SelectItem value="CLASS_REP">Class Rep</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="border-t border-border/40 py-10 mt-auto bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 text-center text-muted-foreground flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">UniFlow</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} UniFlow Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
