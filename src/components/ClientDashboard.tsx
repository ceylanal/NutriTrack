/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Search, 
  Utensils, 
  Flame, 
  Scale, 
  Camera, 
  Plus, 
  ArrowRight, 
  HelpCircle,
  TrendingDown, 
  Activity, 
  FileEdit, 
  RefreshCw, 
  Database,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { Client, DietPlan, FoodItem, AlternativeProduct, MealLog, MealLogItem } from '../types';

interface ClientDashboardProps {
  clients: Client[];
  dietPlans: DietPlan[];
  mealLogs: MealLog[];
  foodDatabase: FoodItem[];
  alternativeProducts: AlternativeProduct[];
  selectedClientId: string;
  onUpdateClients: (updated: Client[]) => void;
  onUpdateMealLogs: (updated: MealLog[]) => void;
  onChangeClient: (clientId: string) => void;
}

export default function ClientDashboard({
  clients,
  dietPlans,
  mealLogs,
  foodDatabase,
  alternativeProducts,
  selectedClientId,
  onUpdateClients,
  onUpdateMealLogs,
  onChangeClient
}: ClientDashboardProps) {
  // Find current active client structure
  const currentClient = clients.find(c => c.ClientID === selectedClientId) || clients[0];
  const activePlan = dietPlans.find(p => p.ClientID === currentClient?.ClientID);
  const clientLogs = mealLogs.filter(l => l.ClientID === currentClient?.ClientID);

  // Sub Tab states: 'plan' | 'logging' | 'alternatives' | 'profile'
  const [clientTab, setClientTab] = useState<'plan' | 'logging' | 'alternatives' | 'profile'>('plan');

  // Meal Logging Form States
  const [logMealType, setLogMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [logNotes, setLogNotes] = useState('');
  const [logPhotoUrl, setLogPhotoUrl] = useState('');
  const [logItems, setLogItems] = useState<MealLogItem[]>([]);
  
  // Custom meal logging search database
  const [foodQuery, setFoodQuery] = useState('');
  const [selectedFoodForLog, setSelectedFoodForLog] = useState<FoodItem | null>(foodDatabase[0] || null);
  const [logPortionLabel, setLogPortionLabel] = useState('100g');
  const [logNutritionMultiplier, setLogNutritionMultiplier] = useState(1.0);
  const [isLogSaved, setIsLogSaved] = useState(false);

  // Alternative food search state
  const [altSearchQuery, setAltSearchQuery] = useState('');

  // Local Profile Form State
  const [profileForm, setProfileForm] = useState<Client>({ ...currentClient });

  // Sync state if client switches
  const handleClientChangeAction = (id: string) => {
    onChangeClient(id);
    const target = clients.find(c => c.ClientID === id);
    if (target) {
      setProfileForm({ ...target });
    }
    setLogItems([]);
    setLogNotes('');
    setLogPhotoUrl('');
  };

  // Add search food item to current meal log draft
  const handleAddSearchToDraft = () => {
    if (!selectedFoodForLog) return;
    const item: MealLogItem = {
      id: 'itlog_' + Math.floor(Math.random() * 1000000),
      Name: selectedFoodForLog.Name,
      Calories: Math.round(selectedFoodForLog.Calories * logNutritionMultiplier),
      Protein: Number((selectedFoodForLog.Protein * logNutritionMultiplier).toFixed(1)),
      Carbs: Number((selectedFoodForLog.Carbs * logNutritionMultiplier).toFixed(1)),
      Fat: Number((selectedFoodForLog.Fat * logNutritionMultiplier).toFixed(1)),
      PortionSize: logPortionLabel
    };
    
    setLogItems([...logItems, item]);
  };

  const handleRemoveDraftItem = (id: string) => {
    setLogItems(logItems.filter(i => i.id !== id));
  };

  // Preset portion selection for logger
  const setLogPresetPortion = (mult: number, label: string) => {
    setLogNutritionMultiplier(mult);
    setLogPortionLabel(label);
  };

  // Save full Meal Log to global state
  const handleSaveMealLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (logItems.length === 0) return;

    const newLog: MealLog = {
      LogID: 'L' + Math.floor(Math.random() * 90000 + 10000),
      ClientID: currentClient.ClientID,
      Date: new Date().toISOString().split('T')[0],
      MealType: logMealType,
      Notes: logNotes,
      PhotoUrl: logPhotoUrl || undefined,
      Items: logItems,
      LoggedAt: new Date().toISOString()
    };

    onUpdateMealLogs([...mealLogs, newLog]);
    
    // Reset inputs
    setLogItems([]);
    setLogNotes('');
    setLogPhotoUrl('');
    setIsLogSaved(true);
    setTimeout(() => setIsLogSaved(false), 3000);
  };

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = clients.map(c => c.ClientID === profileForm.ClientID ? profileForm : c);
    onUpdateClients(updated);
    alert('Dynamic Client Profile Parameters Updated Successfully in Session State!');
  };

  // Alternative products filter based on query
  const filteredAlternatives = alternativeProducts.filter(alt => {
    const originalFood = foodDatabase.find(f => f.FoodID === alt.FoodID);
    return (
      alt.Name.toLowerCase().includes(altSearchQuery.toLowerCase()) ||
      originalFood?.Name.toLowerCase().includes(altSearchQuery.toLowerCase()) ||
      alt.Notes.toLowerCase().includes(altSearchQuery.toLowerCase())
    );
  });

  // Calculate live compliance statistics
  const loggedCaloriesToday = clientLogs
    .filter(log => log.Date === new Date().toISOString().split('T')[0])
    .reduce((acc, log) => acc + log.Items.reduce((sum, item) => sum + item.Calories, 0), 0);

  const targetPlanCalories = activePlan?.Calories || 2000;
  const targetPlanProtein = activePlan?.Protein || 120;
  const targetPlanCarbs = activePlan?.Carbs || 220;
  const targetPlanFat = activePlan?.Fat || 65;

  const currentProteinLogged = clientLogs.reduce((acc, log) => acc + log.Items.reduce((sum, item) => sum + item.Protein, 0), 0);
  const currentCarbsLogged = clientLogs.reduce((acc, log) => acc + log.Items.reduce((sum, item) => sum + item.Carbs, 0), 0);
  const currentFatLogged = clientLogs.reduce((acc, log) => acc + log.Items.reduce((sum, item) => sum + item.Fat, 0), 0);

  // Fast Mock preset photo upload items
  const presetPhotos = [
    { name: 'Oatmeal Berry Bowl', url: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=400' },
    { name: 'Avocado Toast & Egg', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400' },
    { name: 'Grilled Salmon Greens', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="space-y-6" id="client-panel-master">
      {/* Switch Mock Client Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-emerald-500 rounded-xl">
            <Scale className="w-5 h-5 text-slate-950" />
          </span>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Interactive Client Selector</div>
            <div className="text-sm font-bold mt-0.5">Simulate different assigned client logins list:</div>
          </div>
        </div>

        <select
          value={selectedClientId}
          onChange={(e) => handleClientChangeAction(e.target.value)}
          className="bg-slate-850 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-4 rounded-xl border border-slate-755 focus:outline-none flex-shrink-0"
        >
          {clients.map(c => (
            <option key={c.ClientID} value={c.ClientID}>
              {c.Name} (Goal: {c.Goal})
            </option>
          ))}
        </select>
      </div>

      {/* Main Client Panel Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
            Client Self-Portal
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">NutriTrack Companion</h2>
          <p className="text-sm text-slate-500 mt-0.5">Stay accountable, query alternative ingredients, and build your meal journal logs.</p>
        </div>

        {/* Quick Streak Widget */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commitment Streak</div>
            <div className="text-sm font-bold text-slate-800">5 Days Active Compliance</div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Bar */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        <button
          onClick={() => setClientTab('plan')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            clientTab === 'plan' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-4 h-4" />
          My Diet Plan
        </button>
        <button
          onClick={() => setClientTab('logging')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            clientTab === 'logging' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          Log Consumed Meal
        </button>
        <button
          onClick={() => setClientTab('alternatives')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            clientTab === 'alternatives' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          Alternative Food Search
        </button>
        <button
          onClick={() => setClientTab('profile')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            clientTab === 'profile' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          My Physical Metrics Form
        </button>
      </div>

      {/* RENDER SELECTED SUB-PAGES */}
      {clientTab === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Plan View */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activePlan ? activePlan.PlanName : 'Personal Maintenance Plate Setup'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Assigned dietitian blueprint and portion requirements.</p>
                </div>
                {activePlan && (
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 border border-emerald-100 rounded-full font-semibold">
                    Live Assigned plan
                  </span>
                )}
              </div>

              {activePlan ? (
                <div className="mt-6 space-y-6">
                  {/* Meal list item dividers inside client plan */}
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                    const typeItems = activePlan.Items.filter(i => i.MealType === type);
                    const typeCalories = typeItems.reduce((sum, item) => sum + item.Calories, 0);

                    return (
                      <div key={type} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 capitalize">
                            🍳 {type} Setup
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {typeCalories} kcal target
                          </span>
                        </div>

                        {typeItems.length === 0 ? (
                          <div className="text-xs text-slate-400 italic py-2">No required foods mapped for this section.</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {typeItems.map(item => (
                              <div key={item.id} className="bg-white border border-slate-150 p-3 rounded-xl flex items-center justify-between hover:border-emerald-300 transition group/item">
                                <div>
                                  <p className="font-bold text-slate-800 text-xs">{item.Name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Required Portion: {item.PortionSize}</p>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-slate-800 text-xs">{item.Calories} kcal</div>
                                  <div className="text-[9px] text-slate-400 font-mono">P: {item.Protein}g • C: {item.Carbs}g</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Utensils className="w-12 h-12 mx-auto opacity-30 mb-2" />
                  <p className="text-sm font-semibold text-slate-500">No diet plan has been structured for you by Dr. Clara Vance yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Check back soon or schedule an appointment to request one.</p>
                </div>
              )}
            </div>

            {/* Historical Food Logs Stream widget */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-emerald-600" /> My Completed Food Journals ({clientLogs.length})
              </h3>
              
              {clientLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 mt-4 rounded-xl">
                  You haven't logged any meals today. Use the "Log Consumed Meal" tab to enter yours!
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {clientLogs.map(cl => {
                    const totalCals = cl.Items.reduce((acc, current) => acc + current.Calories, 0);
                    return (
                      <div key={cl.LogID} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white bg-slate-800 py-0.5 px-2 rounded capitalize">{cl.MealType}</span>
                            <span className="text-[10px] font-mono text-slate-400">{cl.Date}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium italic">"{cl.Notes}"</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cl.Items.map(it => (
                              <span key={it.id} className="bg-white border text-[10px] font-mono px-2 py-0.5 rounded text-slate-600">
                                {it.Name} • {it.Calories} kcal
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-400 uppercase font-semibold">Logged Intake</span>
                          <div className="text-lg font-black text-slate-800">{totalCals} kcal</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Compliance Meter Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-slate-400">Nutritional Gauge (Today)</h4>
              
              {/* Daily Target Progress Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">Daily Calorie Balance</span>
                  <span className="font-bold text-slate-900">{loggedCaloriesToday} / {targetPlanCalories} kcal</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      loggedCaloriesToday > targetPlanCalories ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min((loggedCaloriesToday / targetPlanCalories) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 italic">Remaining target: {Math.max(targetPlanCalories - loggedCaloriesToday, 0)} kcal</p>
              </div>

              {/* Protein Target progress sidebar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Protein Balance</span>
                  <span className="font-bold text-slate-800">{Math.round(currentProteinLogged)}g / {targetPlanProtein}g</span>
                </div>
                <div className="w-full bg-slate-105 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((currentProteinLogged / targetPlanProtein) * 105, 100)}%` }}></div>
                </div>
              </div>

              {/* Carbohydrates progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Carbohydrates Balance</span>
                  <span className="font-bold text-slate-800">{Math.round(currentCarbsLogged)}g / {targetPlanCarbs}g</span>
                </div>
                <div className="w-full bg-slate-105 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min((currentCarbsLogged / targetPlanCarbs) * 100, 100)}%` }}></div>
                </div>
              </div>

              {/* Fat Target progress sidebar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Dietary Fat Balance</span>
                  <span className="font-bold text-slate-800">{Math.round(currentFatLogged)}g / {targetPlanFat}g</span>
                </div>
                <div className="w-full bg-slate-105 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min((currentFatLogged / targetPlanFat) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Dimensions Sidebar widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Indexed Bio Metrics</span>
              <div>
                <div className="text-xs text-slate-300">Registered Baseline Weight</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{currentClient.Weight} kg</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Assigned Target Dimensions: {currentClient.Goal}</div>
              </div>
              <div className="border-t border-slate-750 pt-2.5 flex justify-between text-xs text-slate-350">
                <span>Height: <strong>{currentClient.Height} cm</strong></span>
                <span>Age: <strong>{currentClient.Age} Years</strong></span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MEAL INPUT & LOGGING TAB */}
      {clientTab === 'logging' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">Post Daily Meal Consumed Log</h3>
          
          {isLogSaved && (
            <div className="mt-4 p-4 bg-emerald-5 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-bold flex items-center gap-2 animate-in fade-in duration-300">
              <CheckCircle className="w-4 h-4" /> Meal Log registered to your historical dietitian diary timeline!
            </div>
          )}

          <form onSubmit={handleSaveMealLog} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            {/* Form Fields column */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">When did you eat this?</label>
                <select
                  value={logMealType}
                  onChange={(e) => setLogMealType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none capitalize font-semibold"
                >
                  <option value="breakfast">Breakfast Block</option>
                  <option value="lunch">Lunch Block</option>
                  <option value="dinner">Dinner Block</option>
                  <option value="snack">Snack Block</option>
                </select>
              </div>

              {/* Food DB Quick Search Inside Log */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
                <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-indigo-600" /> Food Items Index Selector
                </span>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Search or Select Food</label>
                  <select
                    value={selectedFoodForLog?.FoodID || ''}
                    onChange={(e) => {
                      const selected = foodDatabase.find(f => f.FoodID === e.target.value);
                      if (selected) {
                        setSelectedFoodForLog(selected);
                        setLogPortionLabel(selected.DefaultPortion || '100g');
                        setLogNutritionMultiplier(1.0);
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
                  >
                    {foodDatabase.map(item => (
                      <option key={item.FoodID} value={item.FoodID}>
                        {item.Name} ({item.Calories} kcal / {item.DefaultPortion})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Portion Label</label>
                    <input
                      type="text"
                      value={logPortionLabel}
                      onChange={(e) => setLogPortionLabel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Multiplier Preset</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={logNutritionMultiplier}
                      onChange={(e) => setLogNutritionMultiplier(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <button type="button" onClick={() => setLogPresetPortion(0.5, '50g / Light')} className="px-2 py-0.5 bg-white border border-slate-200 text-[9px] font-medium rounded hover:bg-slate-1 border-slate-200 cursor-pointer">0.5x Half</button>
                  <button type="button" onClick={() => setLogPresetPortion(1.0, '100g / Standard')} className="px-2 py-0.5 bg-white border border-slate-200 text-[9px] font-medium rounded hover:bg-slate-1 cursor-pointer">1.0x Base</button>
                  <button type="button" onClick={() => setLogPresetPortion(2.0, '200g / Large')} className="px-2 py-0.5 bg-white border border-slate-200 text-[9px] font-medium rounded hover:bg-slate-1 cursor-pointer">2.0x Double</button>
                </div>

                {/* Alternative Highlight suggestion inside log search! */}
                {selectedFoodForLog && (
                  (() => {
                    const mappedAlt = alternativeProducts.find(ap => ap.FoodID === selectedFoodForLog.FoodID);
                    if (mappedAlt) {
                      return (
                        <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex gap-2 items-start text-[11px] text-indigo-900 mt-2">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5 animate-bounce" />
                          <div>
                            <span className="font-bold">Alternative Swap: </span>
                            {mappedAlt.Name} ({mappedAlt.Calories} kcal instead of {selectedFoodForLog.Calories} kcal)
                            <p className="text-[10px] text-slate-500 mt-0.5 italic">"saves {selectedFoodForLog.Calories - mappedAlt.Calories} calories per portion!"</p>
                            <button
                              type="button"
                              onClick={() => {
                                const customAltItem: MealLogItem = {
                                  id: 'itlog_' + Math.floor(Math.random() * 1000000),
                                  Name: mappedAlt.Name,
                                  Calories: mappedAlt.Calories,
                                  Protein: mappedAlt.Protein || 0,
                                  Carbs: mappedAlt.Carbs || 0,
                                  Fat: mappedAlt.Fat || 0,
                                  PortionSize: 'Standard Alternative Portion Size',
                                  IsAlternative: true
                                };
                                setLogItems([...logItems, customAltItem]);
                              }}
                              className="mt-1 text-xs font-bold text-indigo-700 underline flex items-center gap-0.5 cursor-pointer hover:text-indigo-900"
                            >
                              Add Alternative Swap instead <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()
                )}

                <button
                  type="button"
                  onClick={handleAddSearchToDraft}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  Confirm Selected Item & Add
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dietary Notes / Symptoms</label>
                <textarea
                  required
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="e.g. Added a pinch of black seed. Felt full and digestible."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Attach Log Culinary Photo (URL)</label>
                <input
                  type="text"
                  value={logPhotoUrl}
                  onChange={(e) => setLogPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs outline-none"
                />
                
                {/* Photo Preselection presets to simulate easy submission! */}
                <div className="flex gap-2 mt-2">
                  {presetPhotos.map((p, idx) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setLogPhotoUrl(p.url)}
                      className="border border-slate-200 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] text-slate-700 font-semibold cursor-pointer max-w-[120px] truncate"
                    >
                      📷 Preset {idx+1}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Consumed drafting basket column */}
            <div className="lg:col-span-7 border-l border-slate-100 lg:pl-6 space-y-4">
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400 block">Logging Meal Basket List</span>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center text-slate-800 shadow-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Active Meal Accumulator</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {logItems.reduce((acc, current) => acc + current.Calories, 0)} kcal
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div>Protein : <strong>{logItems.reduce((acc, current) => acc + current.Protein, 0).toFixed(1)}g</strong></div>
                  <div className="mt-1">Carbs : <strong>{logItems.reduce((acc, current) => acc + current.Carbs, 0).toFixed(1)}g</strong></div>
                </div>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {logItems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    No foods inserted into this logging draft yet. Tap the fast-add index database selector.
                  </div>
                ) : (
                  logItems.map(item => (
                    <div key={item.id} className="text-xs bg-white border border-slate-150 p-3 rounded-xl flex items-center justify-between shadow-xs">
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          {item.Name}
                          {item.IsAlternative && <span className="text-[8px] bg-indigo-600 text-white px-1.5 rounded uppercase font-bold tracking-widest">Alt Swap</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Quantity/Portion: {item.PortionSize}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800">{item.Calories} kcal</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDraftItem(item.id)}
                          className="p-1 text-slate-300 hover:text-red-600 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="submit"
                disabled={logItems.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-center text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  logItems.length === 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/10'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Save Standard Log & Push to Dietitian Review
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ALTERNATIVE SEARCH TIMELINE TAB */}
      {clientTab === 'alternatives' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-widest">Substitution Search Engine</span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">Alternative Food Search Index</h3>
            <p className="text-xs text-slate-500 mt-0.5">Find healthier swaps recommended by clinical dietitians to substitute carbohydrates, dairy, or gluten.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Type ingredient (e.g. Milk, Rice, Yogurt, Bread, Chicken)..."
              value={altSearchQuery}
              onChange={(e) => setAltSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlternatives.map(alt => {
              const originalFood = foodDatabase.find(f => f.FoodID === alt.FoodID);
              const calSaving = originalFood ? (originalFood.Calories - alt.Calories) : null;

              return (
                <div key={alt.AltProductID} className="border border-slate-150 rounded-2xl p-5 bg-gradient-to-tr from-indigo-50/20 to-slate-50 relative flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase font-black px-2 py-0.5 rounded-md">
                        Registered Health Alternative
                      </span>
                      {calSaving !== null && calSaving > 0 && (
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-100">
                          🔥 Saves {calSaving} kcal!
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{alt.Name}</h4>
                    
                    {originalFood && (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span>Original: <strong className="line-through decoration-red-400">{originalFood.Name}</strong></span>
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Swap: <strong className="text-indigo-700">{alt.Name}</strong></span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-150">
                      📖 <strong>Alternative Notes:</strong> "{alt.Notes}"
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-150 pt-3 mt-4 text-center">
                    <div className="bg-white/80 p-1.5 rounded-md border border-slate-200/50">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Protein</div>
                      <div className="text-xs font-bold text-slate-800">{alt.Protein || 0}g</div>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded-md border border-slate-200/50">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Carbs</div>
                      <div className="text-xs font-bold text-slate-800">{alt.Carbs || 0}g</div>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded-md border border-slate-200/50">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Calories</div>
                      <div className="text-xs font-extrabold text-slate-800">{alt.Calories} kcal</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAlternatives.length === 0 && (
              <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
                No alternative substitutions indexed for current query. Search 'Bread' or 'Milk' or 'Rice'.
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAILED PHYSICAL METRICS FORM TAB */}
      {clientTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Registered Metric Profile Forms</h3>
            <p className="text-xs text-slate-500 mt-1">Input values like biometric dimensions, objectives, phone number, and allergen lists.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Client Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.Name}
                  onChange={(e) => setProfileForm({ ...profileForm, Name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={profileForm.Phone}
                  onChange={(e) => setProfileForm({ ...profileForm, Phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Age</label>
                <input
                  type="number"
                  required
                  value={profileForm.Age}
                  onChange={(e) => setProfileForm({ ...profileForm, Age: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Gender</label>
                <select
                  value={profileForm.Gender}
                  onChange={(e) => setProfileForm({ ...profileForm, Gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={profileForm.Weight}
                  onChange={(e) => setProfileForm({ ...profileForm, Weight: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Height (cm)</label>
                <input
                  type="number"
                  required
                  value={profileForm.Height}
                  onChange={(e) => setProfileForm({ ...profileForm, Height: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Primary Objective / Goal</label>
                <input
                  type="text"
                  required
                  value={profileForm.Goal}
                  onChange={(e) => setProfileForm({ ...profileForm, Goal: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Allergies & Medical Diagnoses</label>
              <textarea
                rows={3}
                value={profileForm.MedicalHistory}
                onChange={(e) => setProfileForm({ ...profileForm, MedicalHistory: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Modify Dynamic Baseline Metrics
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
