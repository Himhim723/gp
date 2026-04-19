'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function adminApi() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ── Types ─────────────────────────────────────────────────────

interface Vehicle {
  vehicleId: number;
  modelNumber: string;
  name: string;
  description: string;
  pictureUrl: string;
  unitPrice: number;
  vehicleType: string;
  features: string[];
  colors: string[];
}

interface Seminar {
  seminarId: number;
  vehicleId: number;
  vehicleName: string;
  seminarDate: string;
  venue: string;
  maxSeats: number;
  bookedSeats: number;
  description: string | null;
  speakerName: string | null;
  language: string;
  seminarType: string;
  registrationDeadline: string | null;
}

interface Registration {
  registrationId: number;
  customerName: string;
  vehicleName: string;
  seminarDate: string;
  venue: string;
  numSeats: number;
  status: string;
  registeredAt: string;
}

// ── Status Badge ──────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCESS: 'bg-green-100 text-green-800',
    WAIT: 'bg-yellow-100 text-yellow-800',
    CANCEL: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Vehicle Form ──────────────────────────────────────────────

function VehicleForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Vehicle>;
  onSave: (data: Omit<Vehicle, 'vehicleId'> & { features: string[]; colors: string[] }) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    modelNumber: initial?.modelNumber ?? '',
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    pictureUrl: initial?.pictureUrl ?? '',
    features: initial?.features?.join(', ') ?? '',
    colors: initial?.colors?.join(', ') ?? '',
    unitPrice: initial?.unitPrice?.toString() ?? '',
    vehicleType: initial?.vehicleType ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      await onSave({
        ...form,
        unitPrice: parseFloat(form.unitPrice),
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      });
    } catch (error: unknown) {
      const msg = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setErr(msg || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Model Number</label>
          <input className={inputCls} value={form.modelNumber} onChange={e => f('modelNumber', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle Type</label>
          <select className={inputCls} value={form.vehicleType} onChange={e => f('vehicleType', e.target.value)} required>
            <option value="">Select type</option>
            {['Sedan', 'SUV', 'Hatchback', 'Truck', 'Sports'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle Name</label>
        <input className={inputCls} value={form.name} onChange={e => f('name', e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea className={inputCls} rows={3} value={form.description} onChange={e => f('description', e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Features (comma-separated)</label>
        <textarea className={inputCls} rows={2} value={form.features} onChange={e => f('features', e.target.value)} placeholder="Level 3 Autopilot, Fast Charge, Touchscreen" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Colors (comma-separated)</label>
        <textarea className={inputCls} rows={2} value={form.colors} onChange={e => f('colors', e.target.value)} placeholder="Pearl White, Midnight Black, Racing Red" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price (HKD)</label>
          <input type="number" className={inputCls} value={form.unitPrice} onChange={e => f('unitPrice', e.target.value)} required min="1" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Picture URL</label>
          <input className={inputCls} value={form.pictureUrl} onChange={e => f('pictureUrl', e.target.value)} required placeholder="/images/ev-sedan.jpg" />
        </div>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Vehicle'}
        </button>
      </div>
    </form>
  );
}

// ── Seminar Form ──────────────────────────────────────────────

function SeminarForm({
  initial,
  vehicles,
  onSave,
  onCancel,
}: {
  initial?: Partial<Seminar>;
  vehicles: Vehicle[];
  onSave: (data: {
    vehicleId: number; seminarDate: string; venue: string; maxSeats: number;
    description: string | null; speakerName: string | null; language: string;
    seminarType: string; registrationDeadline: string | null;
  }) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    vehicleId: initial?.vehicleId?.toString() ?? '',
    seminarDate: initial?.seminarDate ? initial.seminarDate.slice(0, 16) : '',
    venue: initial?.venue ?? '',
    maxSeats: initial?.maxSeats?.toString() ?? '',
    description: initial?.description ?? '',
    speakerName: initial?.speakerName ?? '',
    language: initial?.language ?? 'Cantonese',
    seminarType: initial?.seminarType ?? 'IN_PERSON',
    registrationDeadline: initial?.registrationDeadline ? initial.registrationDeadline.slice(0, 16) : '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      await onSave({
        vehicleId: parseInt(form.vehicleId),
        seminarDate: form.seminarDate,
        venue: form.venue,
        maxSeats: parseInt(form.maxSeats),
        description: form.description || null,
        speakerName: form.speakerName || null,
        language: form.language,
        seminarType: form.seminarType,
        registrationDeadline: form.registrationDeadline || null,
      });
    } catch (error: unknown) {
      const msg = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setErr(msg || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle</label>
        <select className={inputCls} value={form.vehicleId} onChange={e => f('vehicleId', e.target.value)} required>
          <option value="">Select vehicle</option>
          {vehicles.map(v => (
            <option key={v.vehicleId} value={v.vehicleId}>{v.name} ({v.modelNumber})</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date & Time</label>
          <input type="datetime-local" className={inputCls} value={form.seminarDate} onChange={e => f('seminarDate', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Registration Deadline</label>
          <input type="datetime-local" className={inputCls} value={form.registrationDeadline} onChange={e => f('registrationDeadline', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Venue</label>
        <input className={inputCls} value={form.venue} onChange={e => f('venue', e.target.value)} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Max Seats</label>
          <input type="number" className={inputCls} value={form.maxSeats} onChange={e => f('maxSeats', e.target.value)} required min="1" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
          <select className={inputCls} value={form.language} onChange={e => f('language', e.target.value)}>
            {['Cantonese', 'Mandarin', 'English'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select className={inputCls} value={form.seminarType} onChange={e => f('seminarType', e.target.value)}>
            <option value="IN_PERSON">In-Person</option>
            <option value="ONLINE">Online</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Speaker Name</label>
        <input className={inputCls} value={form.speakerName} onChange={e => f('speakerName', e.target.value)} placeholder="Optional" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea className={inputCls} rows={3} value={form.description} onChange={e => f('description', e.target.value)} placeholder="Optional" />
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Seminar'}
        </button>
      </div>
    </form>
  );
}

// ── Main Dashboard ────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'vehicles' | 'seminars' | 'registrations'>('vehicles');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const [vehicleModal, setVehicleModal] = useState<{ mode: 'create' | 'edit'; data?: Vehicle } | null>(null);
  const [seminarModal, setSeminarModal] = useState<{ mode: 'create' | 'edit'; data?: Seminar } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'vehicle' | 'seminar'; id: number; name: string } | null>(null);

  const [searchVehicle, setSearchVehicle] = useState('');
  const [searchSeminar, setSearchSeminar] = useState('');
  const [searchReg, setSearchReg] = useState('');

  // Auth guard — must be logged in as ADMIN
  useEffect(() => {
    const token = localStorage.getItem('token');
    const customer = JSON.parse(localStorage.getItem('customer') || 'null');
    if (!token || customer?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [router]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const api = adminApi();
      const [vRes, sRes, rRes] = await Promise.all([
        api.get('/admin/vehicles'),
        api.get('/admin/seminars'),
        api.get('/admin/registrations'),
      ]);
      setVehicles(vRes.data);
      setSeminars(sRes.data);
      setRegistrations(rRes.data);
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    router.push('/login');
  };

  // ── Vehicle CRUD ──

  const saveVehicle = async (data: Omit<Vehicle, 'vehicleId'>) => {
    const api = adminApi();
    if (vehicleModal?.mode === 'edit' && vehicleModal.data) {
      await api.put(`/admin/vehicles/${vehicleModal.data.vehicleId}`, data);
    } else {
      await api.post('/admin/vehicles', data);
    }
    setVehicleModal(null);
    fetchAll();
  };

  const deleteVehicle = async (id: number) => {
    await adminApi().delete(`/admin/vehicles/${id}`);
    setDeleteConfirm(null);
    fetchAll();
  };

  // ── Seminar CRUD ──

  const saveSeminar = async (data: {
    vehicleId: number; seminarDate: string; venue: string; maxSeats: number;
    description: string | null; speakerName: string | null; language: string;
    seminarType: string; registrationDeadline: string | null;
  }) => {
    const api = adminApi();
    if (seminarModal?.mode === 'edit' && seminarModal.data) {
      await api.put(`/admin/seminars/${seminarModal.data.seminarId}`, data);
    } else {
      await api.post('/admin/seminars', data);
    }
    setSeminarModal(null);
    fetchAll();
  };

  const deleteSeminar = async (id: number) => {
    await adminApi().delete(`/admin/seminars/${id}`);
    setDeleteConfirm(null);
    fetchAll();
  };

  // ── Filtered lists ──

  const filteredVehicles = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchVehicle.toLowerCase()) ||
    v.modelNumber.toLowerCase().includes(searchVehicle.toLowerCase())
  );

  const filteredSeminars = seminars.filter(s =>
    s.vehicleName?.toLowerCase().includes(searchSeminar.toLowerCase()) ||
    s.venue?.toLowerCase().includes(searchSeminar.toLowerCase())
  );

  const filteredRegs = registrations.filter(r =>
    r.customerName?.toLowerCase().includes(searchReg.toLowerCase()) ||
    r.vehicleName?.toLowerCase().includes(searchReg.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchReg.toLowerCase())
  );

  const tabCls = (t: string) =>
    `px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      tab === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">KINETIC PRECISION</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Vehicles', value: vehicles.length, icon: '🚗' },
            { label: 'Total Seminars', value: seminars.length, icon: '📅' },
            { label: 'Total Registrations', value: registrations.length, icon: '📋' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button className={tabCls('vehicles')} onClick={() => setTab('vehicles')}>Vehicles</button>
          <button className={tabCls('seminars')} onClick={() => setTab('seminars')}>Seminars</button>
          <button className={tabCls('registrations')} onClick={() => setTab('registrations')}>Registrations</button>
        </div>

        {/* ── Vehicles Tab ── */}
        {tab === 'vehicles' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchVehicle}
                onChange={e => setSearchVehicle(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                onClick={() => setVehicleModal({ mode: 'create' })}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Vehicle
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Model</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-right">Price (HKD)</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVehicles.map(v => (
                    <tr key={v.vehicleId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-gray-600">{v.modelNumber}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{v.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{v.vehicleType}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {Number(v.unitPrice).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setVehicleModal({ mode: 'edit', data: v })}
                            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'vehicle', id: v.vehicleId, name: v.name })}
                            className="px-3 py-1.5 text-xs rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No vehicles found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Seminars Tab ── */}
        {tab === 'seminars' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search seminars..."
                value={searchSeminar}
                onChange={e => setSearchSeminar(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                onClick={() => setSeminarModal({ mode: 'create' })}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Seminar
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Vehicle</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Venue</th>
                    <th className="px-6 py-3 text-center">Seats</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSeminars.map(s => (
                    <tr key={s.seminarId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{s.vehicleName}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(s.seminarDate).toLocaleString('en-HK', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{s.venue}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-semibold ${s.bookedSeats >= s.maxSeats ? 'text-red-600' : 'text-green-600'}`}>
                          {s.bookedSeats}/{s.maxSeats}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSeminarModal({ mode: 'edit', data: s })}
                            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'seminar', id: s.seminarId, name: s.vehicleName })}
                            className="px-3 py-1.5 text-xs rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSeminars.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No seminars found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Registrations Tab ── */}
        {tab === 'registrations' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search by customer, vehicle, or status..."
                value={searchReg}
                onChange={e => setSearchReg(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <span className="text-xs text-gray-400">{filteredRegs.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Vehicle</th>
                    <th className="px-6 py-3 text-left">Seminar Date</th>
                    <th className="px-6 py-3 text-center">Seats</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-left">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegs.map(r => (
                    <tr key={r.registrationId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{r.registrationId}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{r.customerName}</td>
                      <td className="px-6 py-4 text-gray-600">{r.vehicleName}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(r.seminarDate).toLocaleDateString('en-HK', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">{r.numSeats}</td>
                      <td className="px-6 py-4 text-center"><StatusBadge status={r.status} /></td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(r.registeredAt).toLocaleDateString('en-HK')}
                      </td>
                    </tr>
                  ))}
                  {filteredRegs.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">No registrations found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Vehicle Modal ── */}
      {vehicleModal && (
        <Modal
          title={vehicleModal.mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
          onClose={() => setVehicleModal(null)}
        >
          <VehicleForm
            initial={vehicleModal.data}
            onSave={saveVehicle}
            onCancel={() => setVehicleModal(null)}
          />
        </Modal>
      )}

      {/* ── Seminar Modal ── */}
      {seminarModal && (
        <Modal
          title={seminarModal.mode === 'create' ? 'Add New Seminar' : 'Edit Seminar'}
          onClose={() => setSeminarModal(null)}
        >
          <SeminarForm
            initial={seminarModal.data}
            vehicles={vehicles}
            onSave={saveSeminar}
            onCancel={() => setSeminarModal(null)}
          />
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirm.type === 'vehicle') deleteVehicle(deleteConfirm.id);
                else deleteSeminar(deleteConfirm.id);
              }}
              className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
