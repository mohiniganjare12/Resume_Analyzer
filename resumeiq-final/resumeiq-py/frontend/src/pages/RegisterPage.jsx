// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { Eye, EyeOff, Sparkles, Mail, Lock, User } from 'lucide-react'
// import toast from 'react-hot-toast'

// export default function RegisterPage() {
//   const { register } = useAuth()
//   const navigate = useNavigate()
//   const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
//   const [show, setShow] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const set = k => e => setForm(p=>({...p,[k]:e.target.value}))

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (form.password !== form.confirm) return toast.error('Passwords do not match')
//     if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
//     setLoading(true)
//     try {
//       await register(form.name, form.email, form.password)
//       toast.success('Account created! Welcome 🎉')
//       navigate('/dashboard')
//     } catch (err) {
//       toast.error(err.response?.data?.detail || 'Registration failed')
//     } finally { setLoading(false) }
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Left panel */}
//       <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-brand-900 to-brand-700 flex-col justify-between p-12">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center"><Sparkles className="w-6 h-6 text-white"/></div>
//           <span className="font-serif text-2xl text-white">ResumeIQ</span>
//         </div>
//         <div className="space-y-6">
//           <h2 className="font-serif text-4xl text-white leading-tight">Land your <em className="text-brand-300">dream job</em> faster</h2>
//           <div className="space-y-4">
//             {[
//               { icon:'🎯', title:'ATS Score',      desc:'Know if your resume passes automated filters' },
//               { icon:'🔑', title:'Keyword Match',  desc:'Match your resume to any job description' },
//               { icon:'🤖', title:'Llama 3 AI',     desc:'AI suggestions running 100% locally' },
//             ].map(f=>(
//               <div key={f.title} className="flex gap-3 items-start">
//                 <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
//                 <div>
//                   <p className="text-white font-semibold text-sm">{f.title}</p>
//                   <p className="text-white/50 text-xs">{f.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <p className="text-white/30 text-sm">Your data stays on your machine. 100% private.</p>
//       </div>

//       {/* Right form */}
//       <div className="flex-1 lg:max-w-md flex items-center justify-center p-8 bg-white">
//         <div className="w-full max-w-sm">
//           <div className="lg:hidden flex items-center gap-2 mb-8">
//             <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white"/></div>
//             <span className="font-serif text-xl">ResumeIQ</span>
//           </div>
//           <h2 className="text-3xl font-serif text-slate-900 mb-1">Create account</h2>
//           <p className="text-slate-500 text-sm mb-8">Start analyzing your resume for free</p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="label">Full name</label>
//               <div className="relative">
//                 <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
//                 <input type="text" required placeholder="Jane Smith" value={form.name} onChange={set('name')} className="input-field pl-10"/>
//               </div>
//             </div>
//             <div>
//               <label className="label">Email address</label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
//                 <input type="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} className="input-field pl-10"/>
//               </div>
//             </div>
//             <div>
//               <label className="label">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
//                 <input type={show?'text':'password'} required placeholder="Min. 6 characters" value={form.password} onChange={set('password')} className="input-field pl-10 pr-10"/>
//                 <button type="button" onClick={()=>setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                   {show?<EyeOff size={16}/>:<Eye size={16}/>}
//                 </button>
//               </div>
//             </div>
//             <div>
//               <label className="label">Confirm password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
//                 <input type={show?'text':'password'} required placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} className="input-field pl-10"/>
//               </div>
//             </div>
//             <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-1">
//               {loading&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
//               {loading?'Creating account...':'Create account'}
//             </button>
//           </form>

//           <p className="text-center text-sm text-slate-500 mt-6">
//             Already have an account?{' '}
//             <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const steps = [
  { icon: '📄', title: 'Upload your resume',        desc: 'PDF or Word, any format' },
  { icon: '🤖', title: 'AI analyses instantly',      desc: 'ATS score, keywords, gaps' },
  { icon: '🎯', title: 'Get actionable feedback',    desc: 'Know exactly what to fix' },
  { icon: '🏆', title: 'Land more interviews',       desc: 'Apply with confidence' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(145deg, #312e81 0%, #4f46e5 40%, #7c3aed 100%)' }}>

        {/* Blobs */}
        <div style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%',
          background:'rgba(139,92,246,0.35)', filter:'blur(90px)', top:'-80px', right:'-60px', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:'300px', height:'300px', borderRadius:'50%',
          background:'rgba(99,102,241,0.25)', filter:'blur(80px)', bottom:'60px', left:'-40px', pointerEvents:'none' }}/>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <span className="text-white font-serif text-2xl font-bold tracking-tight">ResumeIQ</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.18)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            Free to get started · No credit card
          </div>
          <h2 className="font-serif text-5xl text-white leading-tight mb-4" style={{ letterSpacing:'-1.5px' }}>
            Land your<br/>dream job. 🏆
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color:'rgba(255,255,255,0.65)', maxWidth:'380px' }}>
            Join thousands using ResumeIQ to outsmart ATS systems and get more interviews.
          </p>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={s.title} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.12)' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none mb-0.5">{s.title}</p>
                  <p className="text-xs" style={{ color:'rgba(255,255,255,0.48)' }}>{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background:'rgba(255,255,255,0.08)' }}>
                    <span className="text-white/40 text-xs">↓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>
          Your data stays on your machine. 100% private.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-sm py-4">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <span className="font-serif text-xl font-bold text-slate-900">ResumeIQ</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-slate-900 mb-2" style={{ letterSpacing:'-0.5px' }}>Create account</h2>
            <p className="text-sm text-slate-500">Start analyzing your resume for free today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="text" required placeholder="Jane Smith"
                  className="input-field pl-10"
                  value={form.name} onChange={set('name')} />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="email" required placeholder="you@example.com"
                  className="input-field pl-10"
                  value={form.email} onChange={set('email')} />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type={show ? 'text' : 'password'} required placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-11"
                  value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type={show ? 'text' : 'password'} required placeholder="Repeat password"
                  className="input-field pl-10"
                  value={form.confirm} onChange={set('confirm')} />
              </div>
            </div>

            <div className="pt-1">
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <ArrowRight size={17} />}
                {loading ? 'Creating account…' : 'Create free account'}
              </button>
            </div>
          </form>

          {/* Trust note */}
          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <span>🔒</span> No credit card · 100% free · Private & secure
          </p>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">ALREADY HAVE AN ACCOUNT?</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <Link to="/login"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-brand-300 hover:text-brand-600 transition-all">
            Sign in instead →
          </Link>
        </div>
      </div>
    </div>
  )
}