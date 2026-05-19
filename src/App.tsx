/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Users, 
  Activity, 
  Calendar, 
  DollarSign, 
  Scale, 
  Award,
  CircleDot,
  Globe,
  Settings,
  Heart
} from 'lucide-react';
import { UserRole, Client, Dietitian, DietPlan, MealLog, Appointment, Payment } from './types';

import Logo, { LogoIcon } from './components/Logo';

// RENDER PORTS
import DietitianDashboard from './components/DietitianDashboard';
import ClientDashboard from './components/ClientDashboard';
import AssistantDashboard from './components/AssistantDashboard';
import AdminDashboard from './components/AdminDashboard';

import { api } from './lib/api';

export default function App() {
  // Main database arrays in React state
  const [clients, setClients] = useState<Client[]>([]);
  const [dietitians, setDietitians] = useState<Dietitian[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  // Non-editable food database helper references
  const [foodDatabase, setFoodDatabase] = useState<any[]>([]);
  const [alternativeProducts, setAlternativeProducts] = useState<any[]>([]);

  // Swappable simulated Active User role sandbox
  const [currentRole, setCurrentRole] = useState<UserRole>('dietitian');
  
  // Active Simulated Identifiers
  const [selectedClientId, setSelectedClientId] = useState<string>('C01');
  const [currentDietitianId, setCurrentDietitianId] = useState<string>('D01');

  // Dynamic Data Fetching
  React.useEffect(() => {
    const fetchData = async () => {
      const [
        fetchedDietitians,
        fetchedClients,
        fetchedPlans,
        fetchedLogs,
        fetchedAppointments,
        fetchedPayments,
        fetchedFood,
        fetchedAlternatives
      ] = await Promise.all([
        api.getDietitians(),
        api.getClients(),
        api.getDietPlans(),
        api.getMealLogs(),
        api.getAppointments(),
        api.getPayments(),
        api.getFoodItems(),
        api.getAlternativeProducts()
      ]);

      setDietitians((fetchedDietitians || []) as any);
      setClients((fetchedClients || []) as any);
      setDietPlans((fetchedPlans || []) as any);
      setMealLogs((fetchedLogs || []) as any);
      setAppointments((fetchedAppointments || []) as any);
      setPayments((fetchedPayments || []) as any);
      setFoodDatabase((fetchedFood || []) as any);
      setAlternativeProducts((fetchedAlternatives || []) as any);
    };

    fetchData();
  }, []);

  // Multi-user state updates propagation handlers
  const handleUpdateClients = (updated: Client[]) => setClients(updated);
  const handleUpdateDietPlans = (updatedPlan: DietPlan[]) => setDietPlans(updatedPlan);
  const handleUpdateMealLogs = (updatedLogs: MealLog[]) => setMealLogs(updatedLogs);
  const handleUpdateAppointments = (updatedAppts: Appointment[]) => setAppointments(updatedAppts);
  const handleUpdatePayments = (updatedPays: Payment[]) => setPayments(updatedPays);
  const handleUpdateDietitians = (updatedDietitians: Dietitian[]) => setDietitians(updatedDietitians);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-emerald-100 selection:text-emerald-900" id="nutritrack-master">
      
      {/* Interactive Global Role Selector Left Sidebar - High Density Clinical Layout */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 hidden lg:flex">
        
        {/* Logo & Section branding */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/25">
          <Logo theme="dark" showSlogan={true} size="md" />
        </div>

        {/* Vertical Portal Selection Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider px-2 py-2">Role Portals</div>
          
          <button
            onClick={() => setCurrentRole('dietitian')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-bold text-left cursor-pointer ${
              currentRole === 'dietitian' 
                ? 'bg-emerald-600/10 text-emerald-400 border-l-2 border-emerald-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CircleDot className="w-4 h-4" />
            Dietitian Portal
          </button>
          
          <button
            onClick={() => setCurrentRole('client')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-bold text-left cursor-pointer ${
              currentRole === 'client' 
                ? 'bg-emerald-600/10 text-emerald-400 border-l-2 border-emerald-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            Client Companion
          </button>
          
          <button
            onClick={() => setCurrentRole('assistant')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-bold text-left cursor-pointer ${
              currentRole === 'assistant' 
                ? 'bg-emerald-600/10 text-emerald-400 border-l-2 border-emerald-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Clinic Assistant
          </button>
          
          <button
            onClick={() => setCurrentRole('admin')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-bold text-left cursor-pointer ${
              currentRole === 'admin' 
                ? 'bg-emerald-600/10 text-emerald-400 border-l-2 border-emerald-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Clinic Admin
          </button>

          {/* Quick Metrics Widget in Sidebar */}
          <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider px-2 py-6">Operational Info</div>
          
          <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-800 space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Compliance Rate</span>
              <span className="text-emerald-400 font-bold">92%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[92%]"></div>
            </div>
            <div className="flex justify-between items-center pt-1 text-[10px] text-slate-500">
              <span>7-Day Avg</span>
              <span>Target: 95%</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-800 space-y-2 text-[11px] mt-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Clinic MTD Rev</span>
              <span className="text-emerald-400 font-bold">+12%</span>
            </div>
            <div className="text-white font-mono font-bold text-xs">$14,250.00</div>
          </div>
        </nav>

        {/* Dynamic Logged-in profile tag */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs capitalize">
              {currentRole[0]}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">
                {currentRole === 'dietitian' ? 'Dr. Sarah Collins' : currentRole === 'client' ? 'Mark Jensen' : currentRole === 'assistant' ? 'Regina Cooper' : 'Admin Director'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium capitalize truncate">
                {currentRole === 'admin' ? 'System Admin' : currentRole + ' Portal'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Responsive Brand Logo Indicator */}
            <div className="lg:hidden flex items-center gap-2">
              <LogoIcon size="sm" />
              <span className="font-extrabold text-[#0c4524] text-sm">NutriTrack</span>
            </div>
            <div className="hidden lg:flex items-center">
              <LogoIcon size="sm" />
            </div>

            <h1 className="text-sm font-semibold text-slate-500 border-l border-slate-100 lg:border-slate-200 pl-3 hidden md:inline-block uppercase tracking-wider">
              <span className="capitalize text-slate-800 tracking-normal font-sans font-bold normal-case text-base">
                {currentRole === 'dietitian' && 'Dietitian Command Center'}
                {currentRole === 'client' && 'Client Companion Workspace'}
                {currentRole === 'assistant' && 'Clinic Operations Portal'}
                {currentRole === 'admin' && 'Enterprise Admin Portal'}
              </span>
            </h1>
            <div className="hidden sm:inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded uppercase tracking-wide">
              Live Registry Sync
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Session Date</div>
              <div className="text-xs font-semibold text-slate-700">May 19, 2026</div>
            </div>

            {/* Micro Portal Selector Switcher for Mobile / Responsive tablet viewports where Sidebar is hidden */}
            <div className="flex lg:hidden items-center gap-1.5 p-1.5 bg-zinc-900 text-white border border-zinc-800 rounded-lg">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-1 hidden md:inline">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-zinc-900 text-white text-xs font-bold outline-none border-none py-0.5 px-1 cursor-pointer"
              >
                <option value="dietitian" className="bg-zinc-900 text-white">Dietitian</option>
                <option value="client" className="bg-zinc-900 text-white">Client</option>
                <option value="assistant" className="bg-zinc-900 text-white">Assistant</option>
                <option value="admin" className="bg-zinc-900 text-white">Admin</option>
              </select>
            </div>
          </div>
        </header>

        {/* Dynamic port container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {currentRole === 'dietitian' && (
            <DietitianDashboard
              clients={clients}
              dietPlans={dietPlans}
              mealLogs={mealLogs}
              foodDatabase={foodDatabase}
              currentDietitianId={currentDietitianId}
              onUpdateClients={handleUpdateClients}
              onUpdateDietPlans={handleUpdateDietPlans}
            />
          )}

          {currentRole === 'client' && (
            <ClientDashboard
              clients={clients}
              dietPlans={dietPlans}
              mealLogs={mealLogs}
              foodDatabase={foodDatabase}
              alternativeProducts={alternativeProducts}
              selectedClientId={selectedClientId}
              onUpdateClients={handleUpdateClients}
              onUpdateMealLogs={handleUpdateMealLogs}
              onChangeClient={setSelectedClientId}
            />
          )}

          {currentRole === 'assistant' && (
            <AssistantDashboard
              appointments={appointments}
              payments={payments}
              clients={clients}
              onUpdateAppointments={handleUpdateAppointments}
              onUpdatePayments={handleUpdatePayments}
            />
          )}

          {currentRole === 'admin' && (
            <AdminDashboard
              clients={clients}
              dietitians={dietitians}
              payments={payments}
              appointments={appointments}
              userRole={currentRole}
              currentUserId="ADMIN01"
              onUpdateDietitians={handleUpdateDietitians}
              onUpdateClients={handleUpdateClients}
              onUpdatePayments={handleUpdatePayments}
            />
          )}

        </main>

        {/* High Density System footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-[10px] text-slate-400 bg-slate-50 px-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 font-medium">
              <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 animate-pulse" /> Authorized NutriTrack Clinical Enterprise Sandbox environment.
            </div>
            <div className="font-mono text-slate-400">
              SYSTEM STATUS: ONLINE • ALL SECURITY LOCKS ACTIVE
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
