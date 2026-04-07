import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, Users, Building } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">UniFlow</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')} className="font-medium">
            Login
          </Button>
          <Button onClick={() => navigate('/login')} className="font-medium bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-4">
            Transforming Academic Operations
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Seamless Scheduling & <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Venue Allocation
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A collaborative system designed to seamlessly coordinate lecturers, department heads, and timetabling administrators in one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
              Enter Dashboard
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8 py-6 border-2 hover:bg-slate-50 transition-all">
              Create an Account
            </Button>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Timetabling</h3>
            <p className="text-slate-600">Automate and streamline your schedule creation with conflict prevention and real-time updates.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Venue Management</h3>
            <p className="text-slate-600">Efficiently allocate rooms, manage capacity constraints, and track resource availability instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Role-based Access</h3>
            <p className="text-slate-600">Dedicated workflows for Administrators, Department Heads, and Lecturers with secure access.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Trusted by Academic Institutions</h2>
            <p className="text-slate-600">Streamlining operations across departments and semesters</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">100+</div>
              <div className="text-slate-600">Venues Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">500+</div>
              <div className="text-slate-600">Courses Scheduled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
              <div className="text-slate-600">Departments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">99%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-slate-900 text-white rounded-3xl p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Academic Operations?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join leading institutions using UniFlow for seamless requirement elicitation, conflict-free scheduling, and real-time venue management.
          </p>
          <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
            Start Your Journey
          </Button>
        </div>
      </main>

      <footer className="border-t bg-white py-12 mt-auto">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>© {new Date().getFullYear()} UniFlow Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

