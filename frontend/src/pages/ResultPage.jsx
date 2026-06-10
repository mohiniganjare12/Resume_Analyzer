import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Lightbulb, Cpu, Target, Zap, BarChart2, Download } from 'lucide-react'
import clsx from 'clsx'

function Ring({ score, size = 140, label, sublabel }) {
  const sw = size * 0.08
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = score ?? 0
  const offset = circ - (pct / 100) * circ
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
  const track = pct >= 75 ? '#d1fae5' : pct >= 50 ? '#fef3c7' : '#fee2e2'
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={score != null ? offset : circ}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{transition:'stroke-dashoffset 1.4s cubic-bezier(.34,1.56,.64,1)'}}/>
        {score != null ? (
          <>
            <text x={size/2} y={size/2-4} textAnchor="middle" dominantBaseline="middle"
              fontSize={size*.21} fontWeight="700" fill={color} fontFamily="DM Serif Display,serif">{score}</text>
            <text x={size/2} y={size/2+size*.13} textAnchor="middle"
              fontSize={size*.09} fill="#94a3b8" fontFamily="DM Sans,sans-serif">/100</text>
          </>
        ) : (
          <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
            fontSize={size*.18} fill="#cbd5e1" fontFamily="DM Serif Display,serif">-</text>
        )}
      </svg>
      {label && <p className="text-sm font-semibold text-slate-700 text-center leading-tight">{label}</p>}
      {sublabel && <p className="text-xs text-slate-400 text-center">{sublabel}</p>}
    </div>
  )
}

function ImpCard({ item }) {
  const cfg = {
    critical: { bg: 'bg-red-50 border-red-200', icon: XCircle, ic: 'text-red-500', badge: 'badge-critical', lbl: 'Critical' },
    warn: { bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, ic: 'text-amber-500', badge: 'badge-warn', lbl: 'Improve' },
    good: { bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2, ic: 'text-emerald-500', badge: 'badge-good', lbl: 'Good' },
  }
  const c = cfg[item.level] || cfg.warn
  const Icon = c.icon
  return (
    <div className={clsx('flex gap-3.5 p-4 rounded-xl border', c.bg)}>
      <Icon className={clsx('w-5 h-5 mt-0.5 flex-shrink-0', c.ic)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-semibold text-sm text-slate-800">{item.title}</p>
          <span className={c.badge}>{c.lbl}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
      </div>
    </div>
  )
}

function KwTag({ word, matched }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border',
      matched ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
    )}>
      {matched ? <CheckCircle2 size={10} /> : <XCircle size={10} />} {word}
    </span>
  )
}

function SBar({ name, score }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const bg = score >= 75 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2'
  const label = score >= 75 ? 'Strong' : score >= 50 ? 'Average' : 'Weak'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: bg, color }}>{label}</span>
          <span className="text-sm font-bold w-14 text-right" style={{ color }}>{score}/100</span>
        </div>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function downloadReport(data) {
  const sc = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'
  const lc = (l) => l === 'critical' ? '#ef4444' : l === 'warn' ? '#f59e0b' : '#10b981'
  const ll = (l) => l === 'critical' ? 'Critical' : l === 'warn' ? 'Improve' : 'Good'

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>ResumeIQ Report</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#fff;padding:40px;font-size:14px;line-height:1.6}
h1{font-size:26px;color:#1e293b;margin-bottom:4px}
.sub{color:#64748b;font-size:13px;margin-bottom:28px}
.sec{margin-bottom:28px}
.sec-title{font-size:15px;font-weight:700;color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:14px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.scard{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:center}
.snum{font-size:28px;font-weight:800}
.slbl{font-size:11px;color:#64748b;margin-top:3px}
.bar-row{margin-bottom:10px}
.bar-hdr{display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px}
.bar-track{background:#f1f5f9;border-radius:99px;height:10px;overflow:hidden}
.bar-fill{height:100%;border-radius:99px}
.imp{display:flex;gap:10px;padding:10px 12px;border-radius:8px;margin-bottom:8px;border:1px solid}
.imp-title{font-weight:700;font-size:13px}
.imp-detail{font-size:12px;color:#475569;margin-top:2px}
.badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;margin-left:6px}
.kw-wrap{display:flex;flex-wrap:wrap;gap:6px}
.kw{font-size:12px;padding:3px 9px;border-radius:99px;border:1px solid;font-weight:500}
.ats-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;margin-bottom:6px;font-size:13px}
.dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.summary{background:#f0f4ff;border:1px solid #c7d2fe;border-radius:10px;padding:14px;font-size:13px;color:#374151;line-height:1.8}
.two{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.footer{margin-top:36px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:14px}
</style>
</head>
<body>
<h1>ResumeIQ Analysis Report</h1>
<p class="sub">Generated ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}${data.jobTitle ? ' &nbsp;·&nbsp; Targeting: ' + data.jobTitle : ''}</p>

<div class="sec">
<div class="sec-title">Score Overview</div>
<div class="grid4">
${[{l:'Overall Score',s:data.overallScore},{l:'ATS Score',s:data.atsScore},{l:'Impact Score',s:data.impactScore},{l:'JD Match',s:data.matchScore}].map(x=>`
<div class="scard"><div class="snum" style="color:${sc(x.s??0)}">${x.s??'N/A'}</div><div class="slbl">${x.l}</div></div>`).join('')}
</div></div>

<div class="sec">
<div class="sec-title">Section Breakdown</div>
${(data.sections||[]).map(s=>`
<div class="bar-row">
<div class="bar-hdr"><span>${s.name}</span><span style="font-weight:700;color:${sc(s.score)}">${s.score}/100</span></div>
<div class="bar-track"><div class="bar-fill" style="width:${s.score}%;background:${sc(s.score)}"></div></div>
</div>`).join('')}
</div>

<div class="two">
<div class="sec">
<div class="sec-title">Keywords Found (${(data.matchedKeywords||[]).length})</div>
<div class="kw-wrap">${(data.matchedKeywords||[]).map(k=>`<span class="kw" style="background:#ecfdf5;color:#065f46;border-color:#a7f3d0">&#10003; ${k}</span>`).join('')}</div>
${(data.missingKeywords||[]).length>0?`<div style="margin-top:12px"><div style="font-size:12px;font-weight:700;color:#dc2626;margin-bottom:6px">MISSING</div><div class="kw-wrap">${(data.missingKeywords||[]).map(k=>`<span class="kw" style="background:#fef2f2;color:#991b1b;border-color:#fca5a5">&#10007; ${k}</span>`).join('')}</div></div>`:''}
</div>
<div class="sec">
<div class="sec-title">ATS Compatibility</div>
${(data.atsChecks||[]).map(c=>`
<div class="ats-row" style="background:${c.pass?'#ecfdf5':'#fef2f2'}">
<div class="dot" style="background:${c.pass?'#10b981':'#ef4444'}"></div>
<span style="color:${c.pass?'#065f46':'#991b1b'}">${c.text}</span>
</div>`).join('')}
</div></div>

<div class="sec">
<div class="sec-title">AI Improvement Suggestions</div>
${(data.improvements||[]).map(item=>`
<div class="imp" style="background:${item.level==='critical'?'#fef2f2':item.level==='warn'?'#fffbeb':'#ecfdf5'};border-color:${item.level==='critical'?'#fca5a5':item.level==='warn'?'#fcd34d':'#6ee7b7'}">
<div><div class="imp-title">${item.title}<span class="badge" style="background:${lc(item.level)}22;color:${lc(item.level)}">${ll(item.level)}</span></div>
<div class="imp-detail">${item.detail}</div></div></div>`).join('')}
</div>

${data.summary?`<div class="sec"><div class="sec-title">AI Summary</div><div class="summary">${data.summary}</div></div>`:''}

<div class="footer">Generated by ResumeIQ &nbsp;·&nbsp; Powered by Llama 3 &nbsp;·&nbsp; ${new Date().toISOString().split('T')[0]}</div>
</body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ResumeIQ_Report_${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/analyze/${id}`)
      .then(r => setData(r.data.analysis.result))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!data) return null

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">

      {/* Header */}
     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div>
          <h1 className="text-2xl font-serif text-slate-900">Analysis Report</h1>
          <p className="text-sm text-slate-500">
            {data.jobTitle ? `Targeting: ${data.jobTitle}` : 'General resume analysis'}
          </p>
        </div>
        <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto">
          <button onClick={() => downloadReport(data)}
            className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={15} /> Download Report
          </button>
          <Link to="/analyze" className="btn-primary flex items-center gap-2 text-sm py-2.5">
            <Zap size={15} /> New Analysis
          </Link>
        </div>
      </div>

      {/* Score rings */}
      <div className="card p-6">
        <h2 className="font-serif text-lg text-slate-800 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-500" /> Score Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <Ring score={data.overallScore} size={110} label="Overall Score" sublabel="Combined rating" />
  <Ring score={data.atsScore} size={110} label="ATS Score" sublabel="Machine readability" />
  <Ring score={data.impactScore} size={110} label="Impact Score" sublabel="Achievement clarity" />
  <Ring score={data.matchScore} size={110} label="JD Match"
    sublabel={data.matchScore != null ? 'Keyword alignment' : 'No JD provided'} />
</div>

      </div>

      {/* Section breakdown - bars only */}
      <div className="card p-6">
        <h2 className="font-serif text-lg text-slate-800 mb-6 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-500" /> Section Breakdown
        </h2>
        <div className="space-y-5">
          {(data.sections || []).map(s => <SBar key={s.name} name={s.name} score={s.score} />)}
        </div>
      </div>

      {/* AI Improvements */}
      <div className="card p-6">
        <h2 className="font-serif text-lg text-slate-800 mb-5 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" /> AI Improvement Suggestions
          <span className="text-xs text-slate-400 font-sans font-normal ml-1">via Llama 3</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {(data.improvements || []).map((item, i) => <ImpCard key={i} item={item} />)}
        </div>
      </div>

      {/* Keywords + ATS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-serif text-lg text-slate-800 mb-5">Keyword Analysis</h2>
          {(data.matchedKeywords || []).length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2.5">
                Found ({data.matchedKeywords.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {data.matchedKeywords.map(k => <KwTag key={k} word={k} matched />)}
              </div>
            </div>
          )}
          {(data.missingKeywords || []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2.5">
                Missing ({data.missingKeywords.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {data.missingKeywords.map(k => <KwTag key={k} word={k} matched={false} />)}
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-serif text-lg text-slate-800 mb-5">ATS Compatibility</h2>
          <div className="space-y-2.5">
            {(data.atsChecks || []).map((c, i) => (
              <div key={i} className={clsx('flex items-center gap-3 p-3 rounded-xl',
                c.pass ? 'bg-emerald-50' : 'bg-red-50')}>
                {c.pass
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                <span className={clsx('text-sm', c.pass ? 'text-emerald-800' : 'text-red-700')}>
                  {c.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {data.summary && (
        <div className="card p-6 bg-gradient-to-br from-brand-50 to-slate-50">
          <h2 className="font-serif text-lg text-slate-800 mb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" /> AI Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-sm">{data.summary}</p>
        </div>
      )}

    </div>
  )
}

