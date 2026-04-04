import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, CalendarDays, KeyRound, MapPin, Users } from 'lucide-react';

export default function Index() {
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
          <Link to="/login">
            <Button variant="ghost" className="mr-2">Login</Button>
          </Link>
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
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
            <Link to="/login">
              <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all rounded-full">
                Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium rounded-full bg-background/50 backdrop-blur border-border/50 hover:bg-muted/50">
                Register Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {[
            {
              icon: <CalendarDays className="h-6 w-6" />,
              title: "Timetable Management",
              desc: "Effortlessly coordinate complex timetables across multiple departments."
            },
            {
              icon: <MapPin className="h-6 w-6" />,
              title: "Live Venue Allocation",
              desc: "Ensure zero conflicts with real-time venue tracking and dynamic status maps."
            },
            {
              icon: <Users className="h-6 w-6" />,
              title: "Consolidated Submissions",
              desc: "Review and consolidate course unit requests efficiently via the admin dashboard."
            },
            {
              icon: <KeyRound className="h-6 w-6" />,
              title: "Role-based Access",
              desc: "Tailored views for Admins, Lecturers, CODs, and Student Class Reps."
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
