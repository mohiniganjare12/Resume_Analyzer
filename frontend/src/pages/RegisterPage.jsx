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
  { icon: '📄', title: 'Upload your resume', desc: 'PDF or Word, any format' },
  { icon: '🤖', title: 'AI analyses instantly', desc: 'ATS score, keywords, gaps' },
  { icon: '🎯', title: 'Get actionable feedback', desc: 'Know exactly what to fix' },
  { icon: '🏆', title: 'Land more interviews', desc: 'Apply with confidence' },
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
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .r-input { width:100%; padding:13px 16px 13px 44px; border:1.5px solid #e2e8f0; border-radius:12px; font-size:14px; font-family:inherit; outline:none; background:#f8fafc; color:#1e293b; transition:all 0.15s; box-sizing:border-box }
        .r-input:focus { border-color:#6366f1; background:#fff; box-shadow:0 0 0 3px rgba(99,102,241,0.12) }
        .r-input::placeholder { color:#94a3b8 }
        .r-btn { width:100%; padding:15px; border:none; border-radius:12px; font-size:15px; font-weight:700; font-family:inherit; cursor:pointer; color:#fff; background:linear-gradient(135deg,#4f46e5,#7c3aed); box-shadow:0 4px 20px rgba(99,102,241,0.35); transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px }
        .r-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(99,102,241,0.45) }
        .r-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none }
        .r-fcard { background:rgba(255,255,255,0.13); border:1px solid rgba(255,255,255,0.18); border-radius:12px; padding:12px 10px; backdrop-filter:blur(8px) }
        .reg-wrap { display:flex; flex-direction:column; min-height:100vh }
        .reg-mobile-hero { display:block }
        .reg-desktop-left { display:none }
        .reg-form-panel { width:100%; padding:28px 20px; background:#fff; display:flex; align-items:flex-start; justify-content:center }
        @media(min-width:1024px) {
          .reg-wrap { flex-direction:row }
          .reg-mobile-hero { display:none }
          .reg-desktop-left { display:flex }
          .reg-form-panel { max-width:480px; min-height:100vh; align-items:center; padding:40px 32px }
        }
      `}</style>

      <div className="reg-wrap">

        {/* ── MOBILE HERO ── */}
        <div className="reg-mobile-hero" style={{
          background:'linear-gradient(135deg,#312e81 0%,#4f46e5 50%,#7c3aed 100%)',
          padding:'28px 20px 32px', position:'relative', overflow:'hidden'
        }}>
          <div style={{position:'absolute',width:'200px',height:'200px',borderRadius:'50%',background:'rgba(139,92,246,0.4)',filter:'blur(60px)',top:'-40px',right:'-30px',pointerEvents:'none'}}/>
          
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px',position:'relative',zIndex:1}}>
            <div style={{width:'38px',height:'38px',borderRadius:'12px',background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Sparkles size={20} color="#fff"/>
            </div>
            <span style={{fontSize:'20px',fontWeight:'800',color:'#fff'}}>ResumeIQ</span>
          </div>

          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'4px 10px',borderRadius:'99px',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.18)',marginBottom:'12px'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#34d399'}}/>
              <span style={{fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.85)'}}>Free to get started · No credit card</span>
            </div>
            <h2 style={{fontSize:'26px',fontWeight:'800',color:'#fff',lineHeight:'1.2',marginBottom:'8px',letterSpacing:'-0.5px'}}>
              Land your dream job. 🏆
            </h2>
            <p style={{color:'rgba(255,255,255,0.65)',fontSize:'13px',lineHeight:'1.6',marginBottom:'18px'}}>
              Join thousands using ResumeIQ to outsmart ATS systems.
            </p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
              {steps.map(s=>(
                <div key={s.title} className="r-fcard" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'18px'}}>{s.icon}</span>
                  <div>
                    <p style={{color:'#fff',fontSize:'12px',fontWeight:'700',lineHeight:'1.2',marginBottom:'2px'}}>{s.title}</p>
                    <p style={{color:'rgba(255,255,255,0.45)',fontSize:'11px'}}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP LEFT PANEL ── */}
        <div className="reg-desktop-left" style={{
          flex:1, flexDirection:'column', justifyContent:'space-between',
          padding:'48px', position:'relative', overflow:'hidden',
          background:'linear-gradient(145deg,#312e81 0%,#4f46e5 40%,#7c3aed 100%)'
        }}>
          <div style={{position:'absolute',width:'400px',height:'400px',borderRadius:'50%',background:'rgba(139,92,246,0.35)',filter:'blur(90px)',top:'-80px',right:'-60px',pointerEvents:'none'}}/>
          <div style={{position:'absolute',width:'300px',height:'300px',borderRadius:'50%',background:'rgba(99,102,241,0.25)',filter:'blur(80px)',bottom:'60px',left:'-40px',pointerEvents:'none'}}/>

          <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'14px',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.2)'}}>
              <Sparkles size={22} color="#fff"/>
            </div>
            <span style={{fontSize:'22px',fontWeight:'800',color:'#fff',letterSpacing:'-0.5px'}}>ResumeIQ</span>
          </div>

          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 14px',borderRadius:'99px',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.18)',marginBottom:'20px'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#34d399'}}/>
              <span style={{fontSize:'12px',fontWeight:'600',color:'rgba(255,255,255,0.85)'}}>Free to get started · No credit card</span>
            </div>
            <h2 style={{fontSize:'48px',fontWeight:'800',color:'#fff',lineHeight:'1.1',marginBottom:'16px',letterSpacing:'-1.5px'}}>
              Land your<br/>dream job. 🏆
            </h2>
            <p style={{fontSize:'16px',lineHeight:'1.75',marginBottom:'36px',color:'rgba(255,255,255,0.65)',maxWidth:'380px'}}>
              Join thousands using ResumeIQ to outsmart ATS systems and get more interviews.
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              {steps.map(s=>(
                <div key={s.title} className="r-fcard" style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{fontSize:'22px'}}>{s.icon}</span>
                  <div>
                    <p style={{color:'#fff',fontSize:'13px',fontWeight:'700',lineHeight:'1.2',marginBottom:'3px'}}>{s.title}</p>
                    <p style={{color:'rgba(255,255,255,0.45)',fontSize:'11px'}}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p style={{position:'relative',zIndex:1,fontSize:'12px',color:'rgba(255,255,255,0.25)'}}>Your data stays on your machine. 100% private.</p>
        </div>

        {/* ── FORM PANEL ── */}
        <div className="reg-form-panel">
          <div style={{width:'100%',maxWidth:'380px'}}>

            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'26px',fontWeight:'800',color:'#0f172a',marginBottom:'6px',letterSpacing:'-0.5px'}}>Create account</h2>
              <p style={{fontSize:'14px',color:'#64748b'}}>Start analyzing your resume for free today</p>
            </div>

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'7px'}}>Full name</label>
                <div style={{position:'relative'}}>
                  <User size={16} color="#94a3b8" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  <input type="text" required placeholder="Jane Smith" className="r-input" value={form.name} onChange={set('name')}/>
                </div>
              </div>

              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'7px'}}>Email address</label>
                <div style={{position:'relative'}}>
                  <Mail size={16} color="#94a3b8" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  <input type="email" required placeholder="you@example.com" className="r-input" value={form.email} onChange={set('email')}/>
                </div>
              </div>

              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'7px'}}>Password</label>
                <div style={{position:'relative'}}>
                  <Lock size={16} color="#94a3b8" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  <input type={show?'text':'password'} required placeholder="Min. 6 characters" className="r-input" style={{paddingRight:'44px'}} value={form.password} onChange={set('password')}/>
                  <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94a3b8',display:'flex',padding:0}}>
                    {show?<EyeOff size={16}/>:<Eye size={16}/>}
                  </button>
                </div>
              </div>

              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'7px'}}>Confirm password</label>
                <div style={{position:'relative'}}>
                  <Lock size={16} color="#94a3b8" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  <input type={show?'text':'password'} required placeholder="Repeat password" className="r-input" value={form.confirm} onChange={set('confirm')}/>
                </div>
              </div>

              <button type="submit" disabled={loading} className="r-btn" style={{marginTop:'4px'}}>
                {loading?<div style={{width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.35)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>:<ArrowRight size={17}/>}
                {loading?'Creating account…':'Create free account'}
              </button>
            </form>

            <p style={{textAlign:'center',fontSize:'12px',color:'#94a3b8',marginTop:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
              <span>🔒</span> No credit card · 100% free · Private & secure
            </p>

            <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'16px 0'}}>
              <div style={{flex:1,height:'1px',background:'#f1f5f9'}}/>
              <span style={{fontSize:'11px',color:'#94a3b8',fontWeight:'600'}}>ALREADY HAVE AN ACCOUNT?</span>
              <div style={{flex:1,height:'1px',background:'#f1f5f9'}}/>
            </div>

            <Link to="/login" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e2e8f0',color:'#475569',fontSize:'14px',fontWeight:'600',textDecoration:'none',transition:'all 0.15s'}}>
              Sign in instead →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}