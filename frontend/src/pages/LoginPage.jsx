// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { Eye, EyeOff, Sparkles, Mail, Lock } from 'lucide-react'
// import toast from 'react-hot-toast'

// export default function LoginPage() {
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const [form, setForm] = useState({ email: '', password: '' })
//   const [show, setShow] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       await login(form.email, form.password)
//       toast.success('Welcome back!')
//       navigate('/dashboard')
//     } catch (err) {
//       toast.error(err.response?.data?.detail || 'Login failed')
//     } finally { setLoading(false) }
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Left panel */}
//       <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 flex-col justify-between p-12">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center"><Sparkles className="w-6 h-6 text-white" /></div>
//           <span className="font-serif text-2xl text-white">ResumeIQ</span>
//         </div>
//         <div>
//           <blockquote className="text-white/80 text-xl leading-relaxed italic font-serif mb-8">
//             "Know exactly what recruiters and ATS systems see — before you apply."
//           </blockquote>
//           <div className="flex gap-4">
//             {[['Llama 3','AI model'],['Local','100% private'],['Instant','Results']].map(([v,l])=>(
//               <div key={l} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
//                 <div className="text-white font-serif text-xl">{v}</div>
//                 <div className="text-white/50 text-xs mt-0.5">{l}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <p className="text-white/30 text-sm">Powered by FastAPI + Python + Ollama</p>
//       </div>

//       {/* Right form */}
//       <div className="flex-1 lg:max-w-md flex items-center justify-center p-8 bg-white">
//         <div className="w-full max-w-sm">
//           <div className="lg:hidden flex items-center gap-2 mb-8">
//             <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
//             <span className="font-serif text-xl">ResumeIQ</span>
//           </div>
//           <h2 className="text-3xl font-serif text-slate-900 mb-1">Welcome back</h2>
//           <p className="text-slate-500 text-sm mb-8">Sign in to your account</p>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="label">Email address</label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <input type="email" required placeholder="you@example.com"
//                   value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
//                   className="input-field pl-10"/>
//               </div>
//             </div>
//             <div>
//               <label className="label">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
//                 <input type={show?'text':'password'} required placeholder="Your password"
//                   value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
//                   className="input-field pl-10 pr-10"/>
//                 <button type="button" onClick={()=>setShow(!show)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                   {show?<EyeOff size={16}/>:<Eye size={16}/>}
//                 </button>
//               </div>
//             </div>
//             <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
//               {loading&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
//               {loading?'Signing in...':'Sign in'}
//             </button>
//           </form>

//           <p className="text-center text-sm text-slate-500 mt-6">
//             No account?{' '}
//             <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">Create one free</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media(min-width:1024px) { .login-left { display: flex !important } .login-mobile-logo { display: none !important } }
        .a-input { width:100%; padding:13px 16px 13px 44px; border:1.5px solid #e2e8f0; border-radius:12px; font-size:14px; font-family:inherit; outline:none; background:#f8fafc; color:#1e293b; transition:all 0.15s; box-sizing:border-box }
        .a-input:focus { border-color:#6366f1; background:#fff; box-shadow:0 0 0 3px rgba(99,102,241,0.12) }
        .a-input::placeholder { color:#94a3b8 }
        .a-btn { width:100%; padding:15px; border:none; border-radius:12px; font-size:15px; font-weight:700; font-family:inherit; cursor:pointer; color:#fff; background:linear-gradient(135deg,#4f46e5,#7c3aed); box-shadow:0 4px 20px rgba(99,102,241,0.35); transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px }
        .a-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(99,102,241,0.45) }
        .a-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none }
        .f-card { background:rgba(255,255,255,0.13); border:1px solid rgba(255,255,255,0.18); border-radius:14px; padding:15px 12px; text-align:center; backdrop-filter:blur(8px) }
      `}</style>

      {/* LEFT — purple gradient */}
      <div className="login-left" style={{
        flex:1, display:'none', flexDirection:'column', justifyContent:'space-between',
        padding:'48px', position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg,#4f46e5 0%,#7c3aed 45%,#6d28d9 75%,#4c1d95 100%)'
      }}>
        <div style={{position:'absolute',width:'320px',height:'320px',borderRadius:'50%',background:'rgba(139,92,246,0.4)',filter:'blur(80px)',top:'-60px',right:'-50px',pointerEvents:'none'}}/>
        <div style={{position:'absolute',width:'240px',height:'240px',borderRadius:'50%',background:'rgba(99,102,241,0.3)',filter:'blur(70px)',bottom:'80px',left:'-30px',pointerEvents:'none'}}/>

        {/* Logo */}
        <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'44px',height:'44px',borderRadius:'14px',background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)'}}>
            <Sparkles size={22} color="#fff"/>
          </div>
          <span style={{fontSize:'22px',fontWeight:'800',color:'#fff',letterSpacing:'-0.5px'}}>ResumeIQ</span>
        </div>

        {/* Hero */}
        <div style={{position:'relative',zIndex:1}}>
          <h2 style={{fontSize:'46px',fontWeight:'800',color:'#fff',lineHeight:'1.15',marginBottom:'14px',letterSpacing:'-1px'}}>
            Get hired faster 🚀
          </h2>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:'16px',lineHeight:'1.75',marginBottom:'36px',maxWidth:'400px'}}>
            AI-powered resume analysis with ATS scoring, skill gaps, and job matching — all in seconds.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
            {[['AI','Llama 3'],['Secure','Local'],['Fast','Instant']].map(([v,l])=>(
              <div key={v} className="f-card">
                <div style={{fontSize:'16px',fontWeight:'800',color:'#fff',marginBottom:'3px'}}>{v}</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{position:'relative',zIndex:1,color:'rgba(255,255,255,0.28)',fontSize:'12px'}}>
          Powered by FastAPI + Python + Ollama
        </p>
      </div>

      {/* RIGHT — white form */}
      <div style={{width:'100%',maxWidth:'500px',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 20px',background:'#fff',minHeight:'100vh'}}>
      <div style={{width:'100%',maxWidth:'360px',paddingTop:'20px',paddingBottom:'20px'}}>

          {/* Mobile logo */}
          <div className="login-mobile-logo" style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'36px'}}>
            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Sparkles size={18} color="#fff"/>
            </div>
            <span style={{fontSize:'18px',fontWeight:'800',color:'#1e293b'}}>ResumeIQ</span>
          </div>

          <h2 style={{fontSize:'30px',fontWeight:'800',color:'#0f172a',marginBottom:'6px',letterSpacing:'-0.5px'}}>Welcome back</h2>
          <p style={{color:'#64748b',fontSize:'14px',marginBottom:'32px'}}>Sign in to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'7px'}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail size={16} color="#94a3b8" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                <input type="email" required placeholder="you@example.com" className="a-input"
                  value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
              </div>
            </div>

            <div style={{marginBottom:'26px'}}>
              <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'7px'}}>Password</label>
              <div style={{position:'relative'}}>
                <Lock size={16} color="#94a3b8" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                <input type={show?'text':'password'} required placeholder="Your password"
                  className="a-input" style={{paddingRight:'44px'}}
                  value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}/>
                <button type="button" onClick={()=>setShow(!show)}
                  style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94a3b8',display:'flex',padding:0}}>
                  {show?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="a-btn">
              {loading&&<div style={{width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.35)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>}
              {loading?'Signing in...':'Sign in'}
            </button>
          </form>

          <p style={{textAlign:'center',fontSize:'14px',color:'#64748b',marginTop:'24px'}}>
            No account?{' '}
            <Link to="/register" style={{color:'#4f46e5',fontWeight:'700',textDecoration:'none'}}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}