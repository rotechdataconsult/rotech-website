'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

const DOMAINS = [
  'Finance', 'Healthcare', 'Retail', 'Education',
  'Agriculture', 'Real Estate', 'HR', 'Marketing', 'Other',
]

const TEAL = '#9B4FDE'

const TABS = [
  { id: 'cleaning',      label: 'Data Cleaning' },
  { id: 'stats',         label: 'Statistics' },
  { id: 'charts',        label: 'Charts' },
  { id: 'insights',      label: 'AI Insights' },
]

// ── Small shared components ────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function Badge({ value, color }) {
  const colors = {
    high:   'bg-red-900 text-red-300',
    medium: 'bg-yellow-900 text-yellow-300',
    low:    'bg-[#6B28A8] text-[#E8E0F0]',
    strong: 'bg-teal-900 text-teal-300',
    moderate: 'bg-blue-900 text-blue-300',
    weak:   'bg-[#6B28A8] text-[#E8E0F0]',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${colors[value] ?? colors.low}`}>
      {value}
    </span>
  )
}

// ── Cleaning tab ───────────────────────────────────────────────────────────────

function CleaningPanel({ report }) {
  const score = report.quality_score ?? 0
  const scoreColor = score >= 80 ? '#9B4FDE' : score >= 60 ? '#facc15' : '#f87171'

  return (
    <div className="space-y-6">
      {/* Quality score */}
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6 flex items-center gap-6">
        <div className="relative shrink-0 w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none"
              stroke={scoreColor} strokeWidth="3"
              strokeDasharray={`${score} 100`}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold" style={{ color: scoreColor }}>{score}</span>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Data Quality Score</p>
          <p className="text-sm text-[#E8E0F0] mt-1">
            {score >= 80 ? 'Good — dataset is clean and ready for analysis.'
              : score >= 60 ? 'Fair — some issues were found and fixed automatically.'
              : 'Poor — significant data quality problems detected.'}
          </p>
        </div>
      </div>

      {/* Row / column summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Original Rows',    value: report.original_rows },
          { label: 'Final Rows',       value: report.final_rows },
          { label: 'Original Columns', value: report.original_columns },
          { label: 'Final Columns',    value: report.final_columns },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-5 py-4">
            <p className="text-2xl font-extrabold" style={{ color: TEAL }}>{value}</p>
            <p className="text-xs text-[#E8E0F0] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Actions taken */}
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Cleaning Actions</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#E8E0F0]">Duplicate rows removed</span>
            <span className="font-medium text-white">{report.duplicates_removed}</span>
          </div>

          {report.columns_dropped?.length > 0 && (
            <div className="flex justify-between">
              <span className="text-[#E8E0F0]">Empty columns dropped</span>
              <span className="font-medium text-white">{report.columns_dropped.join(', ')}</span>
            </div>
          )}

          {Object.keys(report.missing_values_filled ?? {}).length > 0 && (
            <div>
              <p className="text-[#E8E0F0] mb-2">Missing values filled (median / mode / &quot;Unknown&quot;)</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(report.missing_values_filled).map(([col, count]) => (
                  <span key={col} className="bg-[#6B28A8] text-[#E8E0F0] text-xs px-2 py-1 rounded">
                    {col}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {report.type_conversions?.length > 0 && (
            <div>
              <p className="text-[#E8E0F0] mb-2">Type conversions</p>
              <div className="flex flex-col gap-1">
                {report.type_conversions.map((t, i) => (
                  <span key={i} className="text-xs text-[#E8E0F0]">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Stats tab ──────────────────────────────────────────────────────────────────

function StatsPanel({ stats }) {
  const { overview, numeric_stats, categorical_stats, correlations, outliers } = stats

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Dataset Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {Object.entries(overview).map(([key, val]) => (
            <div key={key}>
              <p className="text-[#E8E0F0] capitalize">{key.replace(/_/g, ' ')}</p>
              <p className="font-semibold text-white">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Numeric stats */}
      {Object.keys(numeric_stats ?? {}).length > 0 && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Numeric Columns</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[#E8E0F0] border-b border-[#9B4FDE]/30">
                  {['Column', 'Min', 'Max', 'Mean', 'Median', 'Std Dev', 'Nulls %'].map(h => (
                    <th key={h} className="pb-2 pr-6 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#9B4FDE]/20">
                {Object.entries(numeric_stats).map(([col, s]) => (
                  <tr key={col} className="text-[#E8E0F0]">
                    <td className="py-2 pr-6 font-medium text-white">{col}</td>
                    <td className="py-2 pr-6">{s.min}</td>
                    <td className="py-2 pr-6">{s.max}</td>
                    <td className="py-2 pr-6">{s.mean}</td>
                    <td className="py-2 pr-6">{s.median}</td>
                    <td className="py-2 pr-6">{s.std}</td>
                    <td className="py-2 pr-6">{s.null_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categorical stats */}
      {Object.keys(categorical_stats ?? {}).length > 0 && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Categorical Columns</h3>
          <div className="space-y-4">
            {Object.entries(categorical_stats).map(([col, s]) => (
              <div key={col}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{col}</p>
                  <span className="text-xs text-[#E8E0F0]">{s.unique_count} unique · {s.null_percentage}% null</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.top_10_values.slice(0, 6).map(({ value, count }) => (
                    <span key={value} className="bg-[#6B28A8] text-[#E8E0F0] text-xs px-2 py-1 rounded">
                      {value} <span className="text-[#C8D4E8]">({count})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Correlations */}
      {Object.keys(correlations ?? {}).length > 0 && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Notable Correlations</h3>
          <div className="space-y-2">
            {Object.entries(correlations).map(([pair, c]) => (
              <div key={pair} className="flex items-center justify-between text-sm">
                <span className="text-[#E8E0F0]">{pair}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white">{c.value}</span>
                  <Badge value={c.strength} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outliers */}
      {Object.values(outliers ?? {}).some(o => o.outlier_count > 0) && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Outliers Detected (IQR method)</h3>
          <div className="space-y-2">
            {Object.entries(outliers)
              .filter(([, o]) => o.outlier_count > 0)
              .map(([col, o]) => (
                <div key={col} className="flex items-center justify-between text-sm">
                  <span className="text-[#E8E0F0]">{col}</span>
                  <span className="text-white font-medium">
                    {o.outlier_count} outliers ({o.outlier_percentage}%) · range {o.min_outlier} – {o.max_outlier}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Charts tab ─────────────────────────────────────────────────────────────────

function ChartsPanel({ charts }) {
  if (!Array.isArray(charts) || charts.length === 0) {
    return (
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-10 text-center text-[#C8D4E8]">
        No charts could be generated for this dataset.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart) => (
        <div key={chart.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-1">{chart.title}</p>
          <p className="text-xs text-[#E8E0F0] mb-4">{chart.description}</p>
          <Plot
            data={chart.figure.data}
            layout={{
              ...chart.figure.layout,
              autosize: true,
              height: 300,
              margin: { l: 40, r: 20, t: 30, b: 50 },
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
            useResizeHandler
          />
        </div>
      ))}
    </div>
  )
}

// ── Insights tab ───────────────────────────────────────────────────────────────

function InsightsPanel({ insights }) {
  const { summary, insights: items, recommendations, data_quality_notes } = insights

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Executive Summary</h3>
        <p className="text-sm text-[#E8E0F0] leading-relaxed">{summary}</p>
      </div>

      {/* Key insights */}
      {items?.length > 0 && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Key Insights</h3>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="border-l-2 pl-4" style={{ borderColor: TEAL }}>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <Badge value={item.significance} />
                </div>
                <p className="text-sm text-[#E8E0F0]">{item.finding}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4">
                <span className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{ backgroundColor: TEAL }}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{rec.action}</p>
                  <p className="text-sm text-[#E8E0F0] mt-0.5">{rec.rationale}</p>
                  <Badge value={rec.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data quality notes */}
      {data_quality_notes?.length > 0 && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-3">Data Quality Notes</h3>
          <ul className="space-y-2">
            {data_quality_notes.map((note, i) => (
              <li key={i} className="flex gap-2 text-sm text-[#E8E0F0]">
                <span style={{ color: TEAL }}>•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AnalystPage() {
  const { user, loading } = useAuth()

  const [file, setFile]       = useState(null)
  const [domain, setDomain]   = useState('Finance')
  const [uploading, setUploading] = useState(false)
  const [error, setError]     = useState(null)
  const [result, setResult]   = useState(null)
  const [activeTab, setActiveTab] = useState('cleaning')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file || !user) return

    setUploading(true)
    setError(null)
    setResult(null)

    // Get the current session JWT to authenticate with the backend
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setError('Session expired. Please log in again.')
      setUploading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('domain', domain)
    // user_id is now extracted server-side from the verified JWT — not sent from client

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail?.error ?? data.error ?? 'Analysis failed.')
      } else {
        setResult(data)
        setActiveTab('cleaning')
      }
    } catch {
      setError('Cannot reach the analysis server. Check your internet connection or try again later.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#5a1f9a] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">

      {/* Nav */}
      <header className="border-b border-[#9B4FDE]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[#E8E0F0] hover:text-white text-sm transition-colors">
            ← Dashboard
          </Link>
          <span className="text-[#9B4FDE]/40">|</span>
          <h1 className="text-sm font-semibold text-white">AI Data Analyst</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Upload card */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-1">Upload your dataset</h2>
          <p className="text-sm text-[#E8E0F0] mb-6">
            Supports CSV, XLSX, XLS — up to 10 MB. Your data is analysed instantly and never shared.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File input */}
            <div>
              <label className="block text-xs font-semibold text-[#E8E0F0] uppercase tracking-wider mb-2">
                Dataset file
              </label>
              <div
                className="border-2 border-dashed border-[#9B4FDE]/40 rounded-xl px-6 py-8 text-center cursor-pointer hover:border-[#9B4FDE] transition-colors"
                onClick={() => document.getElementById('file-input').click()}
              >
                {file ? (
                  <p className="text-sm font-medium text-white">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-[#E8E0F0]">Click to choose a file</p>
                    <p className="text-xs text-[#C8D4E8] mt-1">CSV · XLSX · XLS</p>
                  </>
                )}
              </div>
              <input
                id="file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={e => setFile(e.target.files[0] ?? null)}
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-xs font-semibold text-[#E8E0F0] uppercase tracking-wider mb-2">
                Domain
              </label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE]"
              >
                {DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: TEAL }}
            >
              {uploading ? (
                <>
                  <Spinner />
                  Analysing — this may take a moment...
                </>
              ) : (
                'Run Analysis'
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div>
            {/* Result header */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">Results for {result.filename}</h2>
              <p className="text-sm text-[#E8E0F0] mt-0.5">Domain: {result.domain}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-1 w-fit">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-[#E8E0F0] hover:text-white'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: TEAL } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            {activeTab === 'cleaning' && <CleaningPanel report={result.cleaning_report} />}
            {activeTab === 'stats'    && <StatsPanel    stats={result.stats} />}
            {activeTab === 'charts'   && <ChartsPanel   charts={result.charts} />}
            {activeTab === 'insights' && <InsightsPanel insights={result.insights} />}
          </div>
        )}
      </main>
    </div>
  )
}
