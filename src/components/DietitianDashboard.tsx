/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Search, 
  UserPlus, 
  Flame, 
  Dumbbell, 
  FileText, 
  Activity, 
  Utensils, 
  SearchCode,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Phone,
  Mail,
  Edit2
} from 'lucide-react';
import { Client, DietPlan, FoodItem, DietPlanItem, MealLog, UserRole } from '../types';

interface DietitianDashboardProps {
  clients: Client[];
  dietPlans: DietPlan[];
  mealLogs: MealLog[];
  foodDatabase: FoodItem[];
  currentDietitianId: string;
  onUpdateClients: (updated: Client[]) => void;
  onUpdateDietPlans: (updated: DietPlan[]) => void;
}

export default function DietitianDashboard({
  clients,
  dietPlans,
  mealLogs,
  foodDatabase,
  currentDietitianId,
  onUpdateClients,
  onUpdateDietPlans
}: DietitianDashboardProps) {
  // Tabs: 'clients' | 'builder' | 'logs'
  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'builder' | 'logs'>('clients');
  
  // Search states
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);

  // Client Profile Form Modal
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);

  // Diet Plan Builder states
  const [builderClientID, setBuilderClientID] = useState<string>(clients[0]?.ClientID || '');
  const [builderPlanName, setBuilderPlanName] = useState('New Custom Target Diet Plan');
  const [builderStartDate, setBuilderStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [builderItems, setBuilderItems] = useState<DietPlanItem[]>([]);
  const [builderMealType, setBuilderMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [builderSelectedFoodId, setBuilderSelectedFoodId] = useState<string>(foodDatabase[0]?.FoodID || '');
  const [builderPortionSize, setBuilderPortionSize] = useState('100g');
  const [builderPortionRatio, setBuilderPortionRatio] = useState<number>(1.0); // modifier ratio for food nutrients
  const [isPlanSaved, setIsPlanSaved] = useState(false);

  // Filter clients mapped to this dietitian
  const dietitianClients = clients.filter(c => c.DietitianID === currentDietitianId);
  const filteredClients = dietitianClients.filter(c => 
    c.Name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.Goal.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Calculate live nutrition totals for the plan builder
  const builderTotals = builderItems.reduce((acc, item) => {
    return {
      calories: acc.calories + item.Calories,
      protein: acc.protein + item.Protein,
      carbs: acc.carbs + item.Carbs,
      fat: acc.fat + item.Fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Handle client registration / edit profile
  const handleOpenClientModal = (client?: Client) => {
    if (client) {
      setEditingClient({ ...client });
      setIsNewClient(false);
    } else {
      setEditingClient({
        ClientID: 'C' + Math.floor(Math.random() * 9000 + 1000),
        Name: '',
        Age: 30,
        Gender: 'Female',
        Weight: 70,
        Height: 170,
        Goal: 'Weight Loss',
        MedicalHistory: 'None',
        Phone: '',
        Email: '',
        DietitianID: currentDietitianId
      });
      setIsNewClient(true);
    }
    setShowClientModal(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    if (isNewClient) {
      onUpdateClients([...clients, editingClient]);
    } else {
      onUpdateClients(clients.map(c => c.ClientID === editingClient.ClientID ? editingClient : c));
    }
    
    // Auto-select
    setSelectedClient(editingClient);
    setShowClientModal(false);
    setEditingClient(null);
  };

  // Diet builder functions
  const handleAddFoodToPlan = () => {
    const food = foodDatabase.find(f => f.FoodID === builderSelectedFoodId);
    if (!food) return;

    const nutrientMultiplier = builderPortionRatio;
    const newItem: DietPlanItem = {
      id: 'it_' + Math.floor(Math.random() * 1000000),
      MealType: builderMealType,
      FoodID: food.FoodID,
      Name: food.Name,
      PortionSize: builderPortionSize,
      Calories: Math.round(food.Calories * nutrientMultiplier),
      Protein: Number((food.Protein * nutrientMultiplier).toFixed(1)),
      Carbs: Number((food.Carbs * nutrientMultiplier).toFixed(1)),
      Fat: Number((food.Fat * nutrientMultiplier).toFixed(1))
    };

    setBuilderItems([...builderItems, newItem]);
    setIsPlanSaved(false);
  };

  const handleRemoveBuilderItem = (itemId: string) => {
    setBuilderItems(builderItems.filter(item => item.id !== itemId));
    setIsPlanSaved(false);
  };

  const handleSaveDietPlan = () => {
    if (!builderClientID) return;
    
    const newPlan: DietPlan = {
      PlanID: 'P' + Math.floor(Math.random() * 9000 + 1000),
      DietitianID: currentDietitianId,
      ClientID: builderClientID,
      PlanName: builderPlanName,
      StartDate: builderStartDate,
      Calories: builderTotals.calories,
      Protein: builderTotals.protein,
      Carbs: builderTotals.carbs,
      Fat: builderTotals.fat,
      Items: builderItems
    };

    // Remove old plans for this client to assign new active plan
    const updatedPlans = dietPlans.filter(p => p.ClientID !== builderClientID);
    onUpdateDietPlans([...updatedPlans, newPlan]);

    setIsPlanSaved(true);
    setTimeout(() => setIsPlanSaved(false), 3000);
  };

  // Select food database update
  const handleFoodSelectChange = (id: string) => {
    setBuilderSelectedFoodId(id);
    const selected = foodDatabase.find(f => f.FoodID === id);
    if (selected) {
      setBuilderPortionSize(selected.DefaultPortion || '100g');
      setBuilderPortionRatio(1.0);
    }
  };

  // Quick preset sizes
  const applyPresetPortion = (preset: number, label: string) => {
    setBuilderPortionRatio(preset);
    setBuilderPortionSize(label);
  };

  // Retrieve client active plan & logs
  const clientPlan = selectedClient ? dietPlans.find(p => p.ClientID === selectedClient.ClientID) : null;
  const clientLogs = selectedClient ? mealLogs.filter(l => l.ClientID === selectedClient.ClientID).sort((a,b) => b.Date.localeCompare(a.Date)) : [];

  return (
    <div className="space-y-6" id="dietitian-id-panel">
      {/* Dietitian Header Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
              Dietitian Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Nutrition & Progress Command Room</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage clients, build clinical diet boards, and evaluate caloric logs.</p>
        </div>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => {
              setActiveSubTab('builder');
              if (selectedClient) setBuilderClientID(selectedClient.ClientID);
            }} 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Diet Builder
          </button>
          
          <button 
            type="button"
            onClick={() => handleOpenClientModal()} 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Register Client
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`pb-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'clients' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Clients & Profiles ({dietitianClients.length})
        </button>
        <button
          onClick={() => setActiveSubTab('builder')}
          className={`pb-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'builder' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-4 h-4" />
          Plan Builder & Live Nutri-Calculator
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`pb-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'logs' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Client Meal Logs Review ({mealLogs.length})
        </button>
      </div>

      {/* RENDER ACTIVE TABS */}
      {activeSubTab === 'clients' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Client Selection Column */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-hidden flex flex-col h-[650px]">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients or goals..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <div className="text-xs font-semibold text-slate-400 px-2 mb-2 uppercase tracking-wider">Assigned Clients</div>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No clients found matching query.</div>
              ) : (
                filteredClients.map(c => {
                  const isActive = selectedClient?.ClientID === c.ClientID;
                  return (
                    <button
                      key={c.ClientID}
                      onClick={() => setSelectedClient(c)}
                      className={`w-full text-left p-3.5 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' 
                          : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-1.5">
                          {c.Name}
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">
                            {c.ClientID}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.Goal}</div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                          <span>{c.Age} yrs • {c.Weight} kg</span>
                        </div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Client Details View */}
          <div className="lg:col-span-8 space-y-6">
            {selectedClient ? (
              <>
                {/* Profile Overview Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {selectedClient.Name}
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-xs font-medium">
                          ID: {selectedClient.ClientID}
                        </span>
                      </h3>
                      <p className="text-emerald-600 font-medium text-sm mt-1 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" /> Goal: {selectedClient.Goal}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenClientModal(selectedClient)}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                      title="Edit Client Metrics"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Body Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Age / Gender</span>
                      <div className="text-lg font-bold text-slate-800 mt-1">{selectedClient.Age} yrs / {selectedClient.Gender}</div>
                    </div>
                    <div className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Weight (kg)</span>
                      <div className="text-lg font-bold text-slate-800 mt-1">{selectedClient.Weight} kg</div>
                    </div>
                    <div className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Height (cm)</span>
                      <div className="text-lg font-bold text-slate-800 mt-1">{selectedClient.Height} cm</div>
                    </div>
                    <div className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Calculated BMI</span>
                      <div className="text-lg font-bold text-slate-800 mt-1">
                        {Math.round(selectedClient.Weight / Math.pow(selectedClient.Height/100, 2) * 10) / 10}
                      </div>
                    </div>
                  </div>

                  {/* Contact & Medical */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Contact Information
                      </span>
                      <div className="mt-2 text-sm text-slate-700 font-medium">
                        <div>📞 Phone: {selectedClient.Phone || 'N/A'}</div>
                        <div className="mt-1">✉️ Email: {selectedClient.Email || 'No Email Registered'}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Medical History & Allergies
                      </span>
                      <p className="mt-2 text-sm text-amber-800 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/50">
                        ⚠️ {selectedClient.MedicalHistory || 'No diagnosed conditions'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assigned Diet Plan Status */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h4 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-emerald-600" /> Active Diet Plan Setup
                    </span>
                    {clientPlan && (
                      <span className="text-xs bg-slate-100 px-2.5 py-1 text-slate-600 rounded-full font-medium">
                        Starts: {clientPlan.StartDate}
                      </span>
                    )}
                  </h4>

                  {clientPlan ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-emerald-50/30 border border-emerald-100/30 rounded-xl">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{clientPlan.PlanName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Macro profile generated to reach primary goal</p>
                        </div>
                        <div className="flex items-center gap-4 text-center">
                          <div className="px-2.5 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Calories</span>
                            <div className="text-sm font-bold text-emerald-700">{clientPlan.Calories} kcal</div>
                          </div>
                          <div className="px-2.5 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Protein</span>
                            <div className="text-sm font-bold text-blue-700">{clientPlan.Protein}g</div>
                          </div>
                          <div className="px-2.5 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Carbs</span>
                            <div className="text-sm font-bold text-amber-700">{clientPlan.Carbs}g</div>
                          </div>
                          <div className="px-2.5 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Fat</span>
                            <div className="text-sm font-bold text-red-700">{clientPlan.Fat}g</div>
                          </div>
                        </div>
                      </div>

                      {/* Display breakdown of items briefly */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                          const meals = clientPlan.Items.filter(item => item.MealType === type);
                          return (
                            <div key={type} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {type}
                              </span>
                              <div className="mt-1 space-y-1">
                                {meals.length === 0 ? (
                                  <span className="text-xs text-slate-400 italic">No assigned food items</span>
                                ) : (
                                  meals.map(m => (
                                    <div key={m.id} className="text-xs text-slate-700 flex justify-between">
                                      <span>• {m.Name} ({m.PortionSize})</span>
                                      <span className="font-semibold text-slate-900">{m.Calories} kcal</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 mt-4 rounded-xl">
                      <p className="text-slate-500 text-sm">No active diet plan found assigned.</p>
                      <button
                        onClick={() => {
                          setActiveSubTab('builder');
                          setBuilderClientID(selectedClient.ClientID);
                        }}
                        className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
                      >
                        Create One Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Client Compliance Evaluation widget */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h4 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-emerald-600" /> Recent Progress Logs Tracking
                  </h4>

                  {clientLogs.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-400">No meal logs submitted by this client yet.</p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {clientLogs.map(log => {
                        const targetCalories = clientPlan?.Calories || 1800;
                        const logCalories = log.Items.reduce((acc, i) => acc + i.Calories, 0);
                        const isCompliant = Math.abs(logCalories - (targetCalories / 3)) < 150; // simple mock evaluation per meal type

                        return (
                          <div key={log.LogID} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 capitalize text-sm">{log.MealType}</span>
                                <span className="text-xs font-mono text-slate-400">{log.Date}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 italic">"{log.Notes}"</p>
                              
                              {/* Log items */}
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {log.Items.map(item => (
                                  <span key={item.id} className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.IsAlternative ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-white text-slate-600 border border-slate-200'}`}>
                                    {item.Name} ({item.PortionSize}) • {item.Calories} kcal
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                              <span className="text-xs font-bold text-slate-800">{logCalories} kcal consumed</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                isCompliant ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {isCompliant ? (
                                  <><CheckCircle className="w-3 h-3" /> Balanced Compliance</>
                                ) : (
                                  <><AlertCircle className="w-3 h-3" /> Deviated Intake</>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
                Please select or register a client first to activate profile overview.
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLAN BUILDER TAB */}
      {activeSubTab === 'builder' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Diet Plan Architect & Live Macro-Calculator</span>
            {isPlanSaved && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle className="w-3.5 h-3.5" /> Plan Assigned Succesfully!
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            {/* Design Config Form */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Client Target</label>
                <select
                  value={builderClientID}
                  onChange={(e) => setBuilderClientID(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none"
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map(c => (
                    <option key={c.ClientID} value={c.ClientID}>
                      {c.Name} (Goal: {c.Goal})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Diet Plan Name / Directive</label>
                <input
                  type="text"
                  value={builderPlanName}
                  onChange={(e) => setBuilderPlanName(e.target.value)}
                  placeholder="e.g. Keto Weight Fast Phase 1"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={builderStartDate}
                    onChange={(e) => setBuilderStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assign Meal Type Section</label>
                  <select
                    value={builderMealType}
                    onChange={(e) => setBuilderMealType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none capitalize"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              {/* Live Food Database Injector section */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                  <SearchCode className="w-3.5 h-3.5 text-emerald-600" /> Database Fast-Add Selector
                </span>

                <div>
                  <label className="block text-[11px] text-slate-500 font-semibold mb-1">Select Food Item</label>
                  <select
                    value={builderSelectedFoodId}
                    onChange={(e) => handleFoodSelectChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                  >
                    {foodDatabase.map(f => (
                      <option key={f.FoodID} value={f.FoodID}>
                        {f.Name} (Portion: {f.DefaultPortion})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Portion Label</label>
                    <input
                      type="text"
                      value={builderPortionSize}
                      onChange={(e) => setBuilderPortionSize(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Macro Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      value={builderPortionRatio}
                      onChange={(e) => setBuilderPortionRatio(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Preset quick actions */}
                <div className="flex gap-1.5 flex-wrap">
                  <button type="button" onClick={() => applyPresetPortion(0.5, '50g / Half Portion')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-medium cursor-pointer">0.5x Half</button>
                  <button type="button" onClick={() => applyPresetPortion(1.0, '100g / Standard Portion')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-medium cursor-pointer">1.0x Base</button>
                  <button type="button" onClick={() => applyPresetPortion(1.5, '150g Portion')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-medium cursor-pointer">1.5x Med</button>
                  <button type="button" onClick={() => applyPresetPortion(2.0, '200g Double Portion')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-medium cursor-pointer">2.0x Double</button>
                </div>

                <button
                  type="button"
                  onClick={handleAddFoodToPlan}
                  className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Inject into Diet Plan
                </button>
              </div>
            </div>

            {/* Live Nutrient Calculator Progress Bars */}
            <div className="lg:col-span-7 border-l border-slate-100 lg:pl-6 space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Live Clinical Nutrition Calculator</span>
                
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-3xl font-extrabold text-emerald-400">{builderTotals.calories}</span>
                    <span className="text-slate-300 text-xs ml-1 font-semibold">Total Target Calories (kcal)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-850">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Protein target</div>
                    <div className="text-sm font-bold text-white mt-1">{builderTotals.protein}g</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: `${Math.min((builderTotals.protein/180)*100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Carbs target</div>
                    <div className="text-sm font-bold text-white mt-1">{builderTotals.carbs}g</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min((builderTotals.carbs/300)*100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Fat target</div>
                    <div className="text-sm font-bold text-white mt-1">{builderTotals.fat}g</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-red-400 h-full rounded-full" style={{ width: `${Math.min((builderTotals.fat/100)*100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Live Board List */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Dietary Schedule Blueprint</h4>
                
                {builderItems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No dietary additions mapped yet. Utilize the left injector panel to assign specific meals.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                      const mealItems = builderItems.filter(item => item.MealType === mealType);
                      if (mealItems.length === 0) return null;

                      return (
                        <div key={mealType} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider mb-2">
                            🍱 {mealType} Section
                          </span>
                          <div className="space-y-1.5">
                            {mealItems.map(item => (
                              <div key={item.id} className="flex items-center justify-between text-xs bg-white p-2 border border-slate-100 rounded-lg">
                                <div>
                                  <span className="font-semibold text-slate-800">{item.Name}</span>
                                  <span className="text-slate-400 font-mono text-[10px] ml-1.5">({item.PortionSize})</span>
                                  <span className="text-blue-600 text-[10px] font-mono ml-4">P: {item.Protein}g • C: {item.Carbs}g • F: {item.Fat}g</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-slate-700">{item.Calories} kcal</span>
                                  <button
                                    onClick={() => handleRemoveBuilderItem(item.id)}
                                    className="p-1 text-slate-300 hover:text-red-600 rounded cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={!builderClientID || builderItems.length === 0}
                onClick={handleSaveDietPlan}
                className={`w-full py-3.5 rounded-xl font-bold text-center text-sm transition flex items-center justify-center gap-2 ${
                  (!builderClientID || builderItems.length === 0)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md shadow-emerald-600/15'
                }`}
              >
                <CheckCircle className="w-4.5 h-4.5" /> Assign & Save Active Diet Plan Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECENT CLIENT MEAL LOGS REVIEW */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">Client Meal Diary Streams</h3>
          
          <div className="mt-6 space-y-6">
            {mealLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No logs returned in current session.</div>
            ) : (
              mealLogs.map(log => {
                const owner = clients.find(c => c.ClientID === log.ClientID);
                const sumCalories = log.Items.reduce((acc, i) => acc + i.Calories, 0);

                return (
                  <div key={log.LogID} className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    {/* Attachment Photo */}
                    <div className="md:w-40 h-32 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 relative">
                      {log.PhotoUrl ? (
                        <img 
                          src={log.PhotoUrl} 
                          alt="meal submission" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                          <Utensils className="w-8 h-8 opacity-40" />
                          <span className="text-[10px] font-semibold text-slate-550 uppercase">No Photo Attached</span>
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                            {owner ? owner.Name : 'System Client'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono ml-2">({log.Date})</span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-lg">
                          Logged: {new Date(log.LoggedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <div>
                        <div className="text-sm font-bold text-slate-800 capitalize flex items-center gap-1.5">
                          Meal Session: <span className="underline decoration-emerald-500 decoration-2">{log.MealType}</span>
                        </div>
                        <p className="text-xs text-slate-500 italic mt-1 bg-white p-2.5 rounded-lg border border-slate-150 inline-block w-full">
                          💬 Notes: {log.Notes || 'No notes submitticed'}
                        </p>
                      </div>

                      {/* Log consumed ingredients */}
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Items Consumed</span>
                        <div className="flex flex-wrap gap-1.5">
                          {log.Items.map(fi => (
                            <span 
                              key={fi.id} 
                              className={`px-2.5 py-1 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${
                                fi.IsAlternative 
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              {fi.Name} ({fi.PortionSize})
                              <span className="font-bold opacity-70 border-l border-slate-200 pl-1">{fi.Calories} kcal</span>
                              {fi.IsAlternative && <span className="bg-indigo-600 text-white px-1 rounded-[4px] text-[8px] uppercase">Alt</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right summary block */}
                    <div className="md:w-44 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-5 flex flex-col justify-center items-center text-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Calculated Calories</span>
                      <div className="text-2xl font-black text-slate-800">{sumCalories}</div>
                      <span className="text-xs text-slate-500">Kcal Intake logged</span>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* EDIT/ADD CLIENT DIALOG MODAL */}
      {showClientModal && editingClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 text-white p-5">
              <h3 className="text-md font-bold">{isNewClient ? 'Register New Client Account' : 'Edit Physical Metrics & Settings'}</h3>
              <p className="text-xs text-slate-400/80 mt-1">Configure profile dimensions, phone, goal, and medical issues for clinical sync.</p>
            </div>

            <form onSubmit={handleSaveClient} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Client Name</label>
                  <input
                    type="text"
                    required
                    value={editingClient.Name}
                    onChange={(e) => setEditingClient({ ...editingClient, Name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age (Years)</label>
                  <input
                    type="number"
                    required
                    value={editingClient.Age}
                    onChange={(e) => setEditingClient({ ...editingClient, Age: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                  <select
                    value={editingClient.Gender}
                    onChange={(e) => setEditingClient({ ...editingClient, Gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingClient.Weight}
                    onChange={(e) => setEditingClient({ ...editingClient, Weight: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Height (cm)</label>
                  <input
                    type="number"
                    required
                    value={editingClient.Height}
                    onChange={(e) => setEditingClient({ ...editingClient, Height: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Contact</label>
                  <input
                    type="text"
                    required
                    value={editingClient.Phone}
                    onChange={(e) => setEditingClient({ ...editingClient, Phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    placeholder="+90 532 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={editingClient.Email || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, Email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  placeholder="contact@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dietary Focus / Goal</label>
                <input
                  type="text"
                  required
                  value={editingClient.Goal}
                  onChange={(e) => setEditingClient({ ...editingClient, Goal: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  placeholder="e.g. Lose 5kg in 2 months with low sodium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medical Warnings / Allergy History</label>
                <textarea
                  value={editingClient.MedicalHistory}
                  onChange={(e) => setEditingClient({ ...editingClient, MedicalHistory: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs outline-none h-20 resize-none"
                  placeholder="e.g. Celiac patient with severe peanut allergy Warning."
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isNewClient ? 'Register Profile' : 'Apply Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
