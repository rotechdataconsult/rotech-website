'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'

// ── Constants ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'sales',     label: 'Daily Sales',  icon: '💰' },
  { id: 'expenses',  label: 'Expenses',     icon: '📋' },
  { id: 'inventory', label: 'Inventory',    icon: '📦' },
]

const EXPENSE_CATEGORIES = [
  'Rent', 'Salaries & Wages', 'Raw Materials', 'Supplies',
  'Electricity & Utilities', 'Transport & Logistics', 'Marketing',
  'Equipment', 'Repairs & Maintenance', 'Tax & Levies', 'Other',
]

const CUSTOMER_TYPES   = ['Walk-in', 'Repeat Customer', 'Online', 'Wholesale', 'Corporate']
const PAYMENT_METHODS  = ['Cash', 'Bank Transfer', 'POS / Card', 'Mobile Money', 'Credit']
const INVENTORY_CATS   = ['Food & Beverages', 'Electronics', 'Clothing & Fashion', 'Stationery', 'Household', 'Pharmaceuticals', 'Raw Materials', 'Other']

function today() {
  return new Date().toISOString().split('T')[0]
}

function fmtNGN(n) {
  return Number(n ?? 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })
}

function downloadCSV(rows, filename) {
  if (!rows.length) return
  const keys = Object.keys(rows[0]).filter(k => k !== 'id' && k !== 'user_id')
  const header = keys.join(',')
  const body = rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([header + '\n' + body], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Input style ────────────────────────────────────────────────────────────────
const INP = 'w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition'
const LBL = 'block text-xs font-medium text-[#E8E0F0] mb-1.5'

// ── Sales Tab ──────────────────────────────────────────────────────────────────
function SalesTab({ userId }) {
  const EMPTY = { date: today(), product: '', quantity: '1', unit_price: '', customer_type: 'Walk-in', payment_method: 'Cash', notes: '' }
  const [form,    setForm]    = useState(EMPTY)
  const [records, setRecords] = useState([])
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase.from('sales_records')
      .select('*').eq('user_id', userId).order('date', { ascending: false }).limit(50)
    setRecords(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.product.trim())  { setError('Product name is required.'); return }
    if (!form.unit_price)      { setError('Unit price is required.'); return }
    setSaving(true)
    const { error: err } = await supabase.from('sales_records').insert({
      user_id:        userId,
      date:           form.date,
      product:        form.product.trim(),
      quantity:       parseInt(form.quantity) || 1,
      unit_price:     parseFloat(form.unit_price),
      customer_type:  form.customer_type,
      payment_method: form.payment_method,
      notes:          form.notes.trim() || null,
    })
    if (err) { setError(err.message) } else { setForm(EMPTY); await load() }
    setSaving(false)
  }

  async function handleDelete(id) {
    await supabase.from('sales_records').delete().eq('id', id)
    setRecords(p => p.filter(r => r.id !== id))
  }

  const totalRevenue = records.reduce((s, r) => s + (r.quantity * r.unit_price), 0)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-5">Record a Sale</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Date *</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className={INP} />
            </div>
            <div>
              <label className={LBL}>Quantity *</label>
              <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} className={INP} />
            </div>
          </div>
          <div>
            <label className={LBL}>Product / Service *</label>
            <input name="product" value={form.product} onChange={handleChange} placeholder="e.g. Bag of Rice 50kg" className={INP} />
          </div>
          <div>
            <label className={LBL}>Unit Price (₦) *</label>
            <input name="unit_price" type="number" min="0" step="0.01" value={form.unit_price} onChange={handleChange} placeholder="e.g. 45000" className={INP} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Customer Type</label>
              <select name="customer_type" value={form.customer_type} onChange={handleChange} className={INP}>
                {CUSTOMER_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Payment Method</label>
              <select name="payment_method" value={form.payment_method} onChange={handleChange} className={INP}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={LBL}>Notes (optional)</label>
            <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional info..." className={INP} />
          </div>
          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#9B4FDE] hover:opacity-90 disabled:opacity-50 transition">
            {saving ? 'Saving...' : '+ Add Sale Record'}
          </button>
        </form>
      </div>

      {/* Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Sales ({records.length})</h3>
            <p className="text-xs text-[#C8D4E8] mt-0.5">Total: <span className="text-white font-semibold">{fmtNGN(totalRevenue)}</span></p>
          </div>
          <button onClick={() => downloadCSV(records, 'sales_records.csv')}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white hover:border-[#9B4FDE] transition-colors">
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center text-[#C8D4E8] text-sm">Loading...</div>
        ) : records.length === 0 ? (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center text-[#C8D4E8] text-sm">No sales recorded yet. Add your first sale.</div>
        ) : (
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {records.map(r => (
              <div key={r.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.product}</p>
                  <p className="text-xs text-[#C8D4E8] mt-0.5">
                    {r.date} · Qty {r.quantity} · {fmtNGN(r.unit_price)} each · <span className="text-white font-medium">{fmtNGN(r.quantity * r.unit_price)}</span>
                  </p>
                  <p className="text-xs text-[#C8D4E8]">{r.customer_type} · {r.payment_method}</p>
                </div>
                <button onClick={() => handleDelete(r.id)}
                  className="shrink-0 text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Expenses Tab ───────────────────────────────────────────────────────────────
function ExpensesTab({ userId }) {
  const EMPTY = { date: today(), category: 'Supplies', description: '', amount: '', paid_to: '', notes: '' }
  const [form,    setForm]    = useState(EMPTY)
  const [records, setRecords] = useState([])
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase.from('expense_records')
      .select('*').eq('user_id', userId).order('date', { ascending: false }).limit(50)
    setRecords(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount) { setError('Amount is required.'); return }
    setSaving(true)
    const { error: err } = await supabase.from('expense_records').insert({
      user_id:     userId,
      date:        form.date,
      category:    form.category,
      description: form.description.trim() || null,
      amount:      parseFloat(form.amount),
      paid_to:     form.paid_to.trim() || null,
      notes:       form.notes.trim() || null,
    })
    if (err) { setError(err.message) } else { setForm(EMPTY); await load() }
    setSaving(false)
  }

  async function handleDelete(id) {
    await supabase.from('expense_records').delete().eq('id', id)
    setRecords(p => p.filter(r => r.id !== id))
  }

  const totalExpenses = records.reduce((s, r) => s + Number(r.amount), 0)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-5">Record an Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Date *</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className={INP} />
            </div>
            <div>
              <label className={LBL}>Amount (₦) *</label>
              <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} placeholder="e.g. 15000" className={INP} />
            </div>
          </div>
          <div>
            <label className={LBL}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className={INP}>
              {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={LBL}>Description (optional)</label>
            <input name="description" value={form.description} onChange={handleChange} placeholder="e.g. Office rent for March" className={INP} />
          </div>
          <div>
            <label className={LBL}>Paid To (optional)</label>
            <input name="paid_to" value={form.paid_to} onChange={handleChange} placeholder="e.g. NEPA, Landlord, Supplier name" className={INP} />
          </div>
          <div>
            <label className={LBL}>Notes (optional)</label>
            <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional info..." className={INP} />
          </div>
          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#9B4FDE] hover:opacity-90 disabled:opacity-50 transition">
            {saving ? 'Saving...' : '+ Add Expense Record'}
          </button>
        </form>
      </div>

      {/* Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Expenses ({records.length})</h3>
            <p className="text-xs text-[#C8D4E8] mt-0.5">Total: <span className="text-white font-semibold">{fmtNGN(totalExpenses)}</span></p>
          </div>
          <button onClick={() => downloadCSV(records, 'expense_records.csv')}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white hover:border-[#9B4FDE] transition-colors">
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center text-[#C8D4E8] text-sm">Loading...</div>
        ) : records.length === 0 ? (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center text-[#C8D4E8] text-sm">No expenses recorded yet.</div>
        ) : (
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {records.map(r => (
              <div key={r.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{r.category}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[#9B4FDE]/20 text-[#C8D4E8] shrink-0">{fmtNGN(r.amount)}</span>
                  </div>
                  {r.description && <p className="text-xs text-[#E8E0F0] mt-0.5 truncate">{r.description}</p>}
                  <p className="text-xs text-[#C8D4E8]">{r.date}{r.paid_to ? ` · ${r.paid_to}` : ''}</p>
                </div>
                <button onClick={() => handleDelete(r.id)}
                  className="shrink-0 text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Inventory Tab ──────────────────────────────────────────────────────────────
function InventoryTab({ userId }) {
  const EMPTY = { product_name: '', category: 'Other', quantity_in_stock: '', unit_cost: '', selling_price: '', reorder_level: '10' }
  const [form,    setForm]    = useState(EMPTY)
  const [records, setRecords] = useState([])
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)
  const [editId,  setEditId]  = useState(null)

  const load = useCallback(async () => {
    const { data } = await supabase.from('inventory_records')
      .select('*').eq('user_id', userId).order('product_name')
    setRecords(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setError('')
  }

  function startEdit(r) {
    setEditId(r.id)
    setForm({
      product_name:      r.product_name,
      category:          r.category ?? 'Other',
      quantity_in_stock: String(r.quantity_in_stock ?? ''),
      unit_cost:         String(r.unit_cost ?? ''),
      selling_price:     String(r.selling_price ?? ''),
      reorder_level:     String(r.reorder_level ?? '10'),
    })
  }

  function cancelEdit() { setEditId(null); setForm(EMPTY) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.product_name.trim()) { setError('Product name is required.'); return }
    setSaving(true)
    const payload = {
      product_name:      form.product_name.trim(),
      category:          form.category,
      quantity_in_stock: parseInt(form.quantity_in_stock) || 0,
      unit_cost:         parseFloat(form.unit_cost) || null,
      selling_price:     parseFloat(form.selling_price) || null,
      reorder_level:     parseInt(form.reorder_level) || 10,
      updated_at:        new Date().toISOString(),
    }
    let err
    if (editId) {
      const res = await supabase.from('inventory_records').update(payload).eq('id', editId)
      err = res.error
    } else {
      const res = await supabase.from('inventory_records').insert({ ...payload, user_id: userId })
      err = res.error
    }
    if (err) { setError(err.message) } else { cancelEdit(); await load() }
    setSaving(false)
  }

  async function handleDelete(id) {
    await supabase.from('inventory_records').delete().eq('id', id)
    setRecords(p => p.filter(r => r.id !== id))
    if (editId === id) cancelEdit()
  }

  const lowStock = records.filter(r => r.quantity_in_stock <= r.reorder_level)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className={`border rounded-xl p-6 ${editId ? 'bg-[#4a1580] border-[#9B4FDE]/60' : 'bg-[#7B2FBE] border-[#9B4FDE]/30'}`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-white">{editId ? 'Edit Product' : 'Add Product'}</h3>
          {editId && (
            <button onClick={cancelEdit}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white transition-colors">
              ✕ Cancel
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={LBL}>Product Name *</label>
            <input name="product_name" value={form.product_name} onChange={handleChange} placeholder="e.g. Indomie Noodles (carton)" className={INP} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={INP}>
                {INVENTORY_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Qty in Stock</label>
              <input name="quantity_in_stock" type="number" min="0" value={form.quantity_in_stock} onChange={handleChange} placeholder="0" className={INP} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Cost Price (₦)</label>
              <input name="unit_cost" type="number" min="0" step="0.01" value={form.unit_cost} onChange={handleChange} placeholder="e.g. 3200" className={INP} />
            </div>
            <div>
              <label className={LBL}>Selling Price (₦)</label>
              <input name="selling_price" type="number" min="0" step="0.01" value={form.selling_price} onChange={handleChange} placeholder="e.g. 4000" className={INP} />
            </div>
          </div>
          <div>
            <label className={LBL}>Reorder Level (alert when stock falls below)</label>
            <input name="reorder_level" type="number" min="0" value={form.reorder_level} onChange={handleChange} placeholder="10" className={INP} />
          </div>
          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#9B4FDE] hover:opacity-90 disabled:opacity-50 transition">
            {saving ? 'Saving...' : editId ? 'Update Product' : '+ Add Product'}
          </button>
        </form>
      </div>

      {/* Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Inventory ({records.length} products)</h3>
            {lowStock.length > 0 && (
              <p className="text-xs text-yellow-400 mt-0.5">⚠ {lowStock.length} item{lowStock.length > 1 ? 's' : ''} low on stock</p>
            )}
          </div>
          <button onClick={() => downloadCSV(records, 'inventory_records.csv')}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white hover:border-[#9B4FDE] transition-colors">
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center text-[#C8D4E8] text-sm">Loading...</div>
        ) : records.length === 0 ? (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center text-[#C8D4E8] text-sm">No products added yet.</div>
        ) : (
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {records.map(r => {
              const isLow = r.quantity_in_stock <= r.reorder_level
              return (
                <div key={r.id} className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${
                  editId === r.id ? 'bg-[#4a1580] border-[#9B4FDE]/60' : 'bg-[#7B2FBE] border-[#9B4FDE]/30'
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{r.product_name}</p>
                      {isLow && <span className="text-xs text-yellow-400 shrink-0">⚠ Low</span>}
                    </div>
                    <p className="text-xs text-[#C8D4E8] mt-0.5">
                      Stock: <span className={`font-semibold ${isLow ? 'text-yellow-400' : 'text-white'}`}>{r.quantity_in_stock}</span>
                      {r.selling_price ? ` · Sell: ${fmtNGN(r.selling_price)}` : ''}
                      {r.unit_cost ? ` · Cost: ${fmtNGN(r.unit_cost)}` : ''}
                    </p>
                    <p className="text-xs text-[#C8D4E8]">{r.category}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(r)}
                      className="text-xs px-2 py-1 rounded border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white hover:border-[#9B4FDE] transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(r.id)}
                      className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DataEntryPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('sales')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [user, authLoading, router])

  if (authLoading || !user) return <PageSpinner />

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      {/* Nav */}
      <header className="border-b border-[#9B4FDE]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[#E8E0F0] hover:text-white text-sm transition-colors">
            ← Dashboard
          </Link>
          <span className="text-[#9B4FDE]/40">|</span>
          <h1 className="text-sm font-semibold text-white">Business Data Entry</h1>
        </div>
        <Link href="/analyst"
          className="text-xs px-4 py-2 rounded-lg text-white font-semibold bg-[#9B4FDE] hover:opacity-90 transition">
          Analyse Data →
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-xl font-extrabold text-white">Record Your Business Data</h2>
          <p className="text-[#E8E0F0] text-sm mt-1">
            Enter your daily business data here. Export as CSV at any time to analyse with the AI Analyst Tool.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id ? 'text-white bg-[#9B4FDE]' : 'text-[#E8E0F0] hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tip */}
        <div className="bg-[#9B4FDE]/15 border border-[#9B4FDE]/30 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-semibold text-white">Tip: How to use this with the AI Analyst</p>
            <p className="text-xs text-[#E8E0F0] mt-1">
              Record your data here regularly. When you have enough data (30+ records), click <strong>Export CSV</strong>,
              then go to the <Link href="/analyst" className="text-[#C8D4E8] underline">AI Analyst Tool</Link> and
              upload the file to get AI-powered insights and recommendations.
            </p>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'sales'     && <SalesTab     userId={user.id} />}
        {activeTab === 'expenses'  && <ExpensesTab  userId={user.id} />}
        {activeTab === 'inventory' && <InventoryTab userId={user.id} />}
      </main>
    </div>
  )
}
