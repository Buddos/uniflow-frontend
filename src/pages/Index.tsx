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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] sm:left-[-20%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] sm:bottom-[-20%] right-[-10%] sm:right-[-20%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10 border-b border-slate-200/50 backdrop-blur-sm sticky top-0 bg-white/80">
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
        <section className="max-w-6xl mx-auto space-y-16 animate-fade-in fade-in-0 duration-700 delay-200">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center rounded-full border border-blue-300/50 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-2 shadow-sm ring-1 ring-blue-200/50">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-3 animate-pulse" />
              Requirement Elicitation System
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-blue-900">
              Streamlined Academic Planning
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform for Course of Department (COD) submissions and Class Representative issue reporting to ensure optimal timetabling and venue allocation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200/50 hover:border-blue-300/80 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex-shrink-0 shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">COD Requirements Submission</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mt-1">
                      Submit department course requirements using last semester templates or start fresh. Include course units, student numbers, and special needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-50/50 border border-purple-200/50 hover:border-purple-300/80 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex-shrink-0 shadow-lg">
                    <Users2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Cross-Department Requests</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mt-1">
                      Receive and manage course unit requests from other departments. Compile all requirements before submission deadlines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-50/50 border border-amber-200/50 hover:border-amber-300/80 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex-shrink-0 shadow-lg">
                    <Send className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Class Representative Issues</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mt-1">
                      Report real-time class issues including overcrowding, equipment problems, and scheduling conflicts for immediate resolution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" onClick={openLogin}>
                  <Users className="h-5 w-5 mr-2" />
                  Access COD Portal
                </Button>
                <Button size="lg" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" onClick={openRegister}>
                  <Users className="h-5 w-5 mr-2" />
                  Register as Class Rep
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-3xl blur-2xl opacity-20" />
              <div className="relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 mb-2">Submission Workflow</h4>
                    <p className="text-sm text-slate-600 font-medium">End-to-end requirement management</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { step: '1', title: 'COD Preparation', desc: 'Use templates or create new requirements', color: 'from-blue-500 to-cyan-500' },
                      { step: '2', title: 'Cross-Department Review', desc: 'Review and incorporate requests from other departments', color: 'from-purple-500 to-pink-500' },
                      { step: '3', title: 'Submission to Timetabling', desc: 'Submit compiled requirements before deadline', color: 'from-amber-500 to-orange-500' },
                      { step: '4', title: 'Timetabling & Allocation', desc: 'Admin processes and allocates venues', color: 'from-green-500 to-emerald-500' },
                      { step: '5', title: 'Class Rep Feedback', desc: 'Monitor and report any issues during execution', color: 'from-red-500 to-pink-500' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-slate-300/80 transition-all hover:shadow-md">
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0`}>
                          {item.step}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900">{item.title}</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
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
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          {[
            {
              icon: <FileText className="h-6 w-6" />,
              title: "Requirement Elicitation",
              desc: "CODs submit course requirements using templates or fresh submissions for optimal timetabling.",
              gradient: 'from-blue-50 to-blue-50/50',
              borderColor: 'border-blue-200/50',
              iconGradient: 'from-blue-500 to-cyan-500',
              hoverBorder: 'hover:border-blue-300/80'
            },
            {
              icon: <Users2 className="h-6 w-6" />,
              title: "Cross-Department Coordination",
              desc: "Manage course unit requests between departments and compile comprehensive submissions.",
              gradient: 'from-purple-50 to-purple-50/50',
              borderColor: 'border-purple-200/50',
              iconGradient: 'from-purple-500 to-pink-500',
              hoverBorder: 'hover:border-purple-300/80'
            },
            {
              icon: <Send className="h-6 w-6" />,
              title: "Issue Reporting System",
              desc: "Class representatives report real-time issues for immediate resolution and venue adjustments.",
              gradient: 'from-amber-50 to-amber-50/50',
              borderColor: 'border-amber-200/50',
              iconGradient: 'from-amber-500 to-orange-500',
              hoverBorder: 'hover:border-amber-300/80'
            },
            {
              icon: <CalendarDays className="h-6 w-6" />,
              title: "Timetabling & Allocation",
              desc: "Automated venue allocation and conflict resolution based on submitted requirements.",
              gradient: 'from-green-50 to-green-50/50',
              borderColor: 'border-green-200/50',
              iconGradient: 'from-green-500 to-emerald-500',
              hoverBorder: 'hover:border-green-300/80'
            }
          ].map((feat, i) => (
            <div key={i} className={`group relative p-7 bg-gradient-to-br ${feat.gradient} rounded-2xl border ${feat.borderColor} ${feat.hoverBorder} shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col items-start text-left`}>
              <div className={`p-3 bg-gradient-to-br ${feat.iconGradient} text-white rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
              <div className="mt-auto w-full pt-4">
                <div className="h-1 bg-gradient-to-r opacity-0 from-slate-200 to-slate-100 group-hover:opacity-100 transition-opacity rounded-full" />
              </div>
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
