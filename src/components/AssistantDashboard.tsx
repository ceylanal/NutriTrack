/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Clock, 
  Plus, 
  User, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Search,
  Check,
  X,
  FileText,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Appointment, Payment, Client } from '../types';

interface AssistantDashboardProps {
  appointments: Appointment[];
  payments: Payment[];
  clients: Client[];
  onUpdateAppointments: (updated: Appointment[]) => void;
  onUpdatePayments: (updated: Payment[]) => void;
}

export default function AssistantDashboard({
  appointments,
  payments,
  clients,
  onUpdateAppointments,
  onUpdatePayments
}: AssistantDashboardProps) {
  // Tabs: 'appointments' | 'payments'
  const [assistantTab, setAssistantTab] = useState<'appointments' | 'payments'>('appointments');

  // Search/Filters states
  const [apptSearch, setApptSearch] = useState('');
  const [paySearch, setPaySearch] = useState('');

  // New Appointment Form States
  const [showApptModal, setShowApptModal] = useState(false);
  const [newApptClientId, setNewApptClientId] = useState(clients[0]?.ClientID || '');
  const [newApptDate, setNewApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [newApptTime, setNewApptTime] = useState('10:00');

  // iyzico Mock Payment checkout modal states
  const [showIyzicoModal, setShowIyzicoModal] = useState(false);
  const [payClientId, setPayClientId] = useState(clients[0]?.ClientID || '');
  const [payAmount, setPayAmount] = useState<number>(120);
  const [iyzcoCardHolder, setIyzcoCardHolder] = useState('');
  const [iyzicoCardNo, setIyzicoCardNo] = useState('4355 8890 1211 4455');
  const [isIyzicoProcessing, setIsIyzicoProcessing] = useState(false);
  const [iyzicoSuccess, setIyzicoSuccess] = useState(false);

  // Status updates
  const handleToggleApptStatus = (apptId: string, nextStatus: 'scheduled' | 'completed' | 'canceled') => {
    const updated = appointments.map(a => a.AppointmentID === apptId ? { ...a, Status: nextStatus } : a);
    onUpdateAppointments(updated);
  };

  const handleDeleteAppt = (apptId: string) => {
    if (confirm('Are you sure you want to cancel and delete this appointment?')) {
      const updated = appointments.filter(a => a.AppointmentID !== apptId);
      onUpdateAppointments(updated);
    }
  };

  // Save Scheduled Appointment Action
  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApptClientId) return;

    const newRecord: Appointment = {
      AppointmentID: 'A' + Math.floor(Math.random() * 9000 + 1000),
      ClientID: newApptClientId,
      Date: newApptDate,
      Time: newApptTime,
      Status: 'scheduled'
    };

    onUpdateAppointments([...appointments, newRecord]);
    setShowApptModal(false);
  };

  // iyzico Mock Payment processor simulate save action
  const handleProcessIyzicoCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payClientId || payAmount <= 0) return;

    setIsIyzicoProcessing(true);

    // Simulate merchant bank delay
    setTimeout(() => {
      const processedPayment: Payment = {
        PaymentID: 'PAY' + Math.floor(Math.random() * 90000 + 10000),
        ClientID: payClientId,
        Amount: payAmount,
        PaymentDate: new Date().toISOString().split('T')[0],
        Status: 'success',
        Method: 'Credit Card (iyzico Gateway)'
      };

      onUpdatePayments([...payments, processedPayment]);
      
      setIsIyzicoProcessing(false);
      setIyzicoSuccess(true);
      
      // Clean up after completion
      setTimeout(() => {
        setIyzicoSuccess(false);
        setShowIyzicoModal(false);
        setIyzcoCardHolder('');
        setPayAmount(120);
      }, 2000);
    }, 1500);
  };

  // Helper matching Client entity info
  const getClientName = (id: string) => {
    return clients.find(c => c.ClientID === id)?.Name || 'System Client';
  };

  // Filtering
  const sortedAppointments = [...appointments].sort((a,b) => b.Date.localeCompare(a.Date) || b.Time.localeCompare(a.Time));
  const filteredAppointments = sortedAppointments.filter(a => 
    getClientName(a.ClientID).toLowerCase().includes(apptSearch.toLowerCase()) || 
    a.Status.toLowerCase().includes(apptSearch.toLowerCase())
  );

  const sortedPayments = [...payments].sort((a,b) => b.PaymentDate.localeCompare(a.PaymentDate));
  const filteredPayments = sortedPayments.filter(p => 
    getClientName(p.ClientID).toLowerCase().includes(paySearch.toLowerCase()) || 
    p.Status.toLowerCase().includes(paySearch.toLowerCase()) ||
    p.Method.toLowerCase().includes(paySearch.toLowerCase())
  );

  return (
    <div className="space-y-6" id="assistant-panel-element">
      {/* Front header bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            Clinical Assistant Panel
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Appointments & Merchant Ledger</h2>
          <p className="text-sm text-slate-500 mt-0.5">Control front desk agendas, set dietitian schedules, and manage clinic subscriptions.</p>
        </div>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setShowApptModal(true)} 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Book Patient
          </button>
          
          <button 
            type="button"
            onClick={() => setShowIyzicoModal(true)} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
          >
            <CreditCard className="w-4 h-4" />
            iyzico Charge
          </button>
        </div>
      </div>

      {/* Main Tabs switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setAssistantTab('appointments')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            assistantTab === 'appointments' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Desk Appointment Diary ({appointments.length})
        </button>
        <button
          onClick={() => setAssistantTab('payments')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            assistantTab === 'payments' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          iyzico Transaction Ledger ({payments.length})
        </button>
      </div>

      {/* CHOOSE RENDERED VIEW */}
      {assistantTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Agenda Calendars</h3>
              <p className="text-xs text-slate-400">View and update patient check-in statuses.</p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Filter patient status..."
                value={apptSearch}
                onChange={(e) => setApptSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none"
              />
            </div>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-450 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Appointment ID</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Schedule Date</th>
                    <th className="p-4">Hour Slot</th>
                    <th className="p-4 text-center">Checkout Status</th>
                    <th className="p-4 text-right">Desk Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAppointments.map(appt => {
                    const statusColors = {
                      scheduled: 'bg-blue-50 text-blue-700 border border-blue-100',
                      completed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
                      canceled: 'bg-red-50 text-red-700 border border-red-100'
                    };

                    return (
                      <tr key={appt.AppointmentID} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono font-bold text-slate-500">{appt.AppointmentID}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{getClientName(appt.ClientID)}</div>
                          <span className="text-[10px] text-slate-400 font-mono">UID: {appt.ClientID}</span>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{appt.Date}</td>
                        <td className="p-4 font-medium text-slate-700">{appt.Time}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[appt.Status]}`}>
                            {appt.Status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {appt.Status === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => handleToggleApptStatus(appt.AppointmentID, 'completed')}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer"
                                  title="Mark Checked In"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleToggleApptStatus(appt.AppointmentID, 'canceled')}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold cursor-pointer"
                                  title="No Show / Cancel"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteAppt(appt.AppointmentID)}
                              className="p-1 px-1.5 text-slate-350 hover:text-red-600 rounded-lg cursor-pointer"
                              title="Delete Appointment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 italic">No appointments matched index criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* iyzico LEDGER VIEW */}
      {assistantTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">iyzico Merchant Clearing Table</h3>
              <p className="text-xs text-slate-400">Verify client subscription clearing transactions.</p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Filter invoice..."
                value={paySearch}
                onChange={(e) => setPaySearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-505 focus:bg-white rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none"
              />
            </div>
          </div>

          <div className="border border-slate-102 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-450 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Payment ID Key</th>
                    <th className="p-4">Payer Patient Name</th>
                    <th className="p-4">Clearing Date</th>
                    <th className="p-4">Processed Amount</th>
                    <th className="p-4">Acquiring Method</th>
                    <th className="p-4 text-center">Merchant Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredPayments.map(pay => {
                    const payColors = {
                      success: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
                      pending: 'bg-amber-50 text-amber-800 border border-amber-100',
                      failed: 'bg-red-50 text-red-800 border border-red-100',
                      refunded: 'bg-slate-50 text-slate-700 border border-slate-200'
                    };

                    return (
                      <tr key={pay.PaymentID} className="hover:bg-slate-50/20 transition">
                        <td className="p-4 font-mono font-bold text-indigo-800">{pay.PaymentID}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{getClientName(pay.ClientID)}</div>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {pay.ClientID}</span>
                        </td>
                        <td className="p-4 font-medium">{pay.PaymentDate}</td>
                        <td className="p-4 font-extrabold text-slate-900">${pay.Amount.toFixed(2)}</td>
                        <td className="p-4 text-slate-500 font-mono">{pay.Method}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${payColors[pay.Status]}`}>
                            {pay.Status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 italic">No historical clearings found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NEW APPOINTMENT MODAL DIALOG */}
      {showApptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 animate-pulse" /> Create Patient Schedule Slot
              </h3>
              <p className="text-xs text-slate-400 mt-1">Book the consultation date & check-in slot for the active clinic dietitian.</p>
            </div>

            <form onSubmit={handleScheduleAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Consultation Patient</label>
                <select
                  required
                  value={newApptClientId}
                  onChange={(e) => setNewApptClientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="">-- Choose Patient Name --</option>
                  {clients.map(c => (
                    <option key={c.ClientID} value={c.ClientID}>{c.Name} ({c.Goal})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Consult Date</label>
                  <input
                    type="date"
                    required
                    value={newApptDate}
                    onChange={(e) => setNewApptDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hour slot (HH:MM)</label>
                  <select
                    value={newApptTime}
                    onChange={(e) => setNewApptTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApptModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Confirm Diary Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* iyzico GATEWAY POP-UP MERCHANT SIMULATOR MODAL */}
      {showIyzicoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Payment Header branding */}
            <div className="bg-[#1C2638] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 bg-gradient-to-r from-red-500 via-pink-500 to-indigo-600 rounded text-[10px] font-black uppercase tracking-wider text-white">
                  iyzico
                </div>
                <div>
                  <h3 className="text-sm font-bold">iyzico Acquiring Gateway Model</h3>
                  <p className="text-[10px] text-slate-400">Secure Direct Merchant Sandbox Clearing Engine.</p>
                </div>
              </div>

              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <form onSubmit={handleProcessIyzicoCheckout} className="p-6 space-y-4">
              {iyzicoSuccess ? (
                <div className="py-12 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800">Clearance Approved by Acquiring Bank</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    iyzico ID: <strong>#IY{Math.floor(Math.random()*900000)}</strong> registered to payment ledger successfully.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Client Payer</label>
                      <select
                        required
                        value={payClientId}
                        onChange={(e) => setPayClientId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 text-xs outline-none min-h-[36px]"
                      >
                        {clients.map(c => (
                          <option key={c.ClientID} value={c.ClientID}>
                            {c.Name} (ID: {c.ClientID})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount ($ USD)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={payAmount}
                        onChange={(e) => setPayAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2 py-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-55 p-3.5 border border-slate-200/60 rounded-xl space-y-3 bg-slate-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Acquirer Card Credentials</span>
                    
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-bold">Mock Card Holder Name</label>
                      <input
                        type="text"
                        required
                        value={iyzcoCardHolder}
                        onChange={(e) => setIyzcoCardHolder(e.target.value)}
                        placeholder="e.g. EMMA WATSON"
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none font-semibold uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-1 font-bold">Card Number</label>
                        <input
                          type="text"
                          required
                          value={iyzicoCardNo}
                          onChange={(e) => setIyzicoCardNo(e.target.value)}
                          placeholder="4355 8890 1211 4455"
                          className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1 font-bold">CVV code</label>
                        <input
                          type="text"
                          maxLength={3}
                          required
                          defaultValue="455"
                          className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 text-[10px] text-slate-400 font-medium pt-1">
                    <ShieldCheck className="w-4 h-4 text-slate-400" /> Secure 3D merchant clearing verified under iyzico rules compliance.
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowIyzicoModal(false)}
                      className="px-4 py-2 bg-slate-105 hover:bg-slate-200 text-slate-705 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isIyzicoProcessing}
                      className="px-4 py-2 bg-[#1C2638] hover:bg-[#28354c] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      {isIyzicoProcessing ? (
                        <>
                          <Building className="w-3.5 h-3.5 animate-spin" />
                          Acquiring clearing...
                        </>
                      ) : (
                        `Process Direct $${payAmount} Charge`
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
