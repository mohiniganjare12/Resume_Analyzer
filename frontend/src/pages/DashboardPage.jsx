import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FileSearch, TrendingUp, Award, Clock, ArrowRight, Plus, BarChart3 } from 'lucide-react'
import clsx from 'clsx'

function ScoreRing({ score, size = 72 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - ((score ?? 0) / 100) * circ
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{transition:'stroke-dashoffset 1s ease'}}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        fontSize={size*0.22} fontWeight="700" fill={color} fontFamily="DM Serif Display,serif">{score ?? '—'}</text>
    </svg>
  )
}

function Badge({ score }) {
  if (score >= 80) return <span className="badge-good">Excellent</span>
  if (score >= 60) return <span className="badge-warn">Good</span>
  return <span className="badge-critical">Needs Work</span>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/analyze/history').then(r => setAnalyses(r.data)).catch(console.error).finally(()=>setLoading(false))
  }, [])

  const avg = (key) => analyses.length ? Math.round(analyses.reduce((s,a)=>s+(a[key]||0),0)/analyses.length) : 0
  const best = analyses.length ? Math.max(...analyses.map(a=>a.overall_score||0)) : 0

  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif text-slate-900">
            Good {greeting}, <span className="text-brand-600">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Your resume analysis overview</p>
        </div>
        <Link to="/analyze" className="btn-primary flex items-center gap-2 self-start">
          <Plus size={17}/> New Analysis
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileSearch,  label:'Total Analyses', value: analyses.length,           color:'text-brand-600',   bg:'bg-brand-50' },
          { icon: TrendingUp,  label:'Average Score',  value: avg('overall_score')||'—', color:'text-emerald-600', bg:'bg-emerald-50' },
          { icon: Award,       label:'Best Score',     value: best||'—',                 color:'text-amber-600',   bg:'bg-amber-50' },
          { icon: BarChart3,   label:'Avg ATS Score',  value: avg('ats_score')||'—',     color:'text-purple-600',  bg:'bg-purple-50' },
        ].map(({ icon:Icon, label, value, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon className={clsx('w-5 h-5', color)}/>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-serif text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* History */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="skeleton h-24 rounded-2xl"/>)}</div>
      ) : analyses.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-8 h-8 text-brand-500"/>
          </div>
          <h3 className="font-serif text-xl text-slate-800 mb-2">No analyses yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Upload your resume and get instant AI-powered feedback, ATS scores, and improvement suggestions.</p>
          <Link to="/analyze" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16}/> Analyze your first resume
          </Link>
        </div>
      ) : (
        <>
          <h2 className="font-serif text-xl text-slate-800 mb-4">Recent Analyses</h2>
          <div className="space-y-3">
            {analyses.map(a => (
              <div key={a.id} onClick={()=>navigate(`/result/${a.id}`)}
                className="card p-5 flex items-center gap-5 cursor-pointer hover:border-brand-200 hover:shadow-md transition-all duration-150 group">
                <ScoreRing score={a.overall_score}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-slate-800 truncate">{a.resume_filename}</p>
                    <Badge score={a.overall_score}/>
                  </div>
                  <p className="text-sm text-slate-500 mb-1.5">{a.job_title || 'General analysis'}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>ATS: <span className="font-semibold text-slate-600">{a.ats_score}/100</span></span>
                    {a.match_score!=null&&<span>Match: <span className="font-semibold text-slate-600">{a.match_score}/100</span></span>}
                    <span className="flex items-center gap-1"><Clock size={11}/>{new Date(a.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors flex-shrink-0"/>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
