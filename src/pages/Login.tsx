import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'admin', label: 'Admin (DET)', desc: 'Directorate of Examination & Timetabling' },
  { value: 'cod', label: 'Head of Department', desc: 'Chair of Department Portal' },
  { value: 'lecturer', label: 'Lecturer', desc: 'Faculty Teaching Staff' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    login(email || 'user@uniflow.ac.ke', password, selectedRole);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/20" style={{
              width: `${200 + i * 120}px`, height: `${200 + i * 120}px`,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">UniFlow</h1>
              <p className="text-primary-foreground/60 text-xs">CARS 2.0 — Collaborative Academic Requirements System</p>
            </div>
          </div>
          <h2 className="font-display text-4xl font-bold text-primary-foreground leading-tight mb-4">
            Smarter Scheduling.<br />Better Resources.<br />One Platform.
          </h2>
          <p className="text-primary-foreground/70 text-sm max-w-md leading-relaxed">
            Optimize timetable allocation and resource utilization with data-driven insights, 
            real-time venue tracking, and seamless inter-departmental coordination.
          </p>
          <div className="flex gap-6 mt-10">
            {[{ n: '8', l: 'Venues Tracked' }, { n: '24', l: 'Departments' }, { n: '99%', l: 'Allocation Rate' }].map(s => (
              <div key={s.l}>
                <p className="font-display text-2xl font-bold text-primary-foreground">{s.n}</p>
                <p className="text-primary-foreground/50 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">UniFlow</h1>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-8">Sign in to access the scheduling platform</p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(r => (
              <button
                key={r.value}
                onClick={() => setSelectedRole(r.value)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedRole === r.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <p className={`text-xs font-semibold ${selectedRole === r.value ? 'text-primary' : 'text-foreground'}`}>{r.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.ac.ke"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-[11px] text-muted-foreground mt-8">
            Demo: Select any role and click Sign In. No credentials required.
          </p>
        </div>
      </div>
    </div>
  );
}
