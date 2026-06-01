import React, { useState, useRef } from 'react'
import { FileText, User, Briefcase, GraduationCap, Code, Award, Plus, Trash2, Wand2, Download, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import clsx from 'clsx'

// ─── AI helper ───────────────────────────────────────────────────────────────
async function askAI(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  return data?.content?.[0]?.text || ''
}

// ─── Empty state ─────────────────────────────────────────────────────────────
const emptyResume = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}

const newExp   = () => ({ id: Date.now(), company: '', role: '', start: '', end: '', current: false, bullets: [''] })
const newEdu   = () => ({ id: Date.now(), school: '', degree: '', field: '', start: '', end: '', gpa: '' })
const newProj  = () => ({ id: Date.now(), name: '', url: '', description: '' })
const newCert  = () => ({ id: Date.now(), name: '', issuer: '', date: '' })

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children, color = 'text-brand-600', bg = 'bg-brand-50' }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
          <Icon size={16} className={color} />
        </div>
        <span className="font-serif text-lg text-slate-800 flex-1 text-left">{title}</span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-slate-100">{children}</div>}
    </div>
  )
}

// ─── AI Button ───────────────────────────────────────────────────────────────
function AIBtn({ onClick, loading, label = 'AI Write' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
      {label}
    </button>
  )
}

// ─── Preview ─────────────────────────────────────────────────────────────────
function ResumePreview({ data }) {
  const { personal, experience, education, skills, projects, certifications } = data
  return (
    <div id="resume-preview" className="bg-white text-slate-900 p-8 font-sans text-sm leading-relaxed min-h-[1000px]">
      {/* Header */}
      <div className="border-b-2 border-brand-600 pb-4 mb-5">
        <h1 className="text-3xl font-bold text-slate-900">{personal.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-500 text-xs">
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.website  && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">Professional Summary</h2>
          <p className="text-slate-700">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map(e => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-800">{e.role || 'Role'}</span>
                  <span className="text-xs text-slate-400">{e.start}{e.start && (e.end || e.current) ? ' – ' : ''}{e.current ? 'Present' : e.end}</span>
                </div>
                <div className="text-slate-500 text-xs mb-1">{e.company}</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => <li key={i} className="text-slate-700">{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">Education</h2>
          <div className="space-y-2">
            {education.map(e => (
              <div key={e.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-800">{e.degree}{e.field ? `, ${e.field}` : ''}</span>
                  <div className="text-xs text-slate-500">{e.school}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</div>
                </div>
                <span className="text-xs text-slate-400">{e.start}{e.start && e.end ? ' – ' : ''}{e.end}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full border border-brand-100">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">Projects</h2>
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p.id}>
                <span className="font-bold text-slate-800">{p.name}</span>
                {p.url && <span className="text-xs text-brand-500 ml-2">{p.url}</span>}
                {p.description && <p className="text-slate-700 text-xs mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">Certifications</h2>
          <div className="space-y-1">
            {certifications.map(c => (
              <div key={c.id} className="flex justify-between text-sm">
                <span className="font-medium text-slate-800">{c.name}{c.issuer ? ` · ${c.issuer}` : ''}</span>
                <span className="text-xs text-slate-400">{c.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumeBuilderPage() {
  const [resume, setResume] = useState(emptyResume)
  const [aiLoading, setAiLoading] = useState({})
  const [skillInput, setSkillInput] = useState('')
  const [tab, setTab] = useState('edit') // 'edit' | 'preview'
  const previewRef = useRef()

  // ── helpers ──
  const setPersonal = (k, v) => setResume(r => ({ ...r, personal: { ...r.personal, [k]: v } }))

  const setAiLoad = (key, val) => setAiLoading(o => ({ ...o, [key]: val }))

  // ── Experience ──
  const addExp    = () => setResume(r => ({ ...r, experience: [...r.experience, newExp()] }))
  const removeExp = id => setResume(r => ({ ...r, experience: r.experience.filter(e => e.id !== id) }))
  const updateExp = (id, k, v) => setResume(r => ({ ...r, experience: r.experience.map(e => e.id === id ? { ...e, [k]: v } : e) }))
  const updateBullet = (id, idx, v) => setResume(r => ({ ...r, experience: r.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? v : b) } : e) }))
  const addBullet    = id => setResume(r => ({ ...r, experience: r.experience.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e) }))
  const removeBullet = (id, idx) => setResume(r => ({ ...r, experience: r.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e) }))

  const aiExpandBullet = async (id, idx) => {
    const exp = resume.experience.find(e => e.id === id)
    const bullet = exp?.bullets[idx]
    if (!bullet?.trim()) return
    setAiLoad(`bullet-${id}-${idx}`, true)
    try {
      const result = await askAI(`Improve this resume bullet point to be more impactful, quantified, and ATS-friendly. Return ONLY the improved bullet point text, nothing else:\n"${bullet}"`)
      updateBullet(id, idx, result.trim())
    } catch { /* silent */ } finally { setAiLoad(`bullet-${id}-${idx}`, false) }
  }

  const aiSummary = async () => {
    const { name, ...p } = resume.personal
    const expText = resume.experience.map(e => `${e.role} at ${e.company}`).join(', ')
    setAiLoad('summary', true)
    try {
      const result = await askAI(`Write a 2-3 sentence professional resume summary for someone named ${resume.personal.name || 'a professional'} with experience as: ${expText || 'various roles'}. Skills: ${resume.skills.join(', ') || 'various'}. Return ONLY the summary text.`)
      setPersonal('summary', result.trim())
    } catch { /* silent */ } finally { setAiLoad('summary', false) }
  }

  // ── Education ──
  const addEdu    = () => setResume(r => ({ ...r, education: [...r.education, newEdu()] }))
  const removeEdu = id => setResume(r => ({ ...r, education: r.education.filter(e => e.id !== id) }))
  const updateEdu = (id, k, v) => setResume(r => ({ ...r, education: r.education.map(e => e.id === id ? { ...e, [k]: v } : e) }))

  // ── Skills ──
  const addSkill    = () => { const s = skillInput.trim(); if (s && !resume.skills.includes(s)) { setResume(r => ({ ...r, skills: [...r.skills, s] })); setSkillInput('') } }
  const removeSkill = s => setResume(r => ({ ...r, skills: r.skills.filter(x => x !== s) }))

  // ── Projects ──
  const addProj    = () => setResume(r => ({ ...r, projects: [...r.projects, newProj()] }))
  const removeProj = id => setResume(r => ({ ...r, projects: r.projects.filter(p => p.id !== id) }))
  const updateProj = (id, k, v) => setResume(r => ({ ...r, projects: r.projects.map(p => p.id === id ? { ...p, [k]: v } : p) }))

  // ── Certifications ──
  const addCert    = () => setResume(r => ({ ...r, certifications: [...r.certifications, newCert()] }))
  const removeCert = id => setResume(r => ({ ...r, certifications: r.certifications.filter(c => c.id !== id) }))
  const updateCert = (id, k, v) => setResume(r => ({ ...r, certifications: r.certifications.map(c => c.id === id ? { ...c, [k]: v } : c) }))

  // ── Print / Download ──
  const handlePrint = () => {
    const content = document.getElementById('resume-preview')?.innerHTML
    if (!content) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Resume – ${resume.personal.name || 'Resume'}</title>
      <style>
        body { font-family: 'DM Sans', system-ui, sans-serif; margin: 0; padding: 32px; color: #0f172a; font-size: 13px; }
        h1 { font-size: 26px; font-weight: 700; margin: 0 0 6px; }
        h2 { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #4f46e5; margin: 0 0 8px; }
        ul { margin: 4px 0; padding-left: 16px; }
        li { margin-bottom: 2px; }
        .border-b-2 { border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px; }
        .text-xs { font-size: 11px; }
        .skill-tag { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; border-radius: 999px; padding: 2px 8px; display: inline-block; margin: 2px; font-size: 11px; }
        @media print { body { padding: 0; } }
      </style></head><body>${content}</body></html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif text-slate-900 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Resume Builder
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-12">Build an ATS-friendly resume with AI assistance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-xl p-1">
            {['edit', 'preview'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx('px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                  tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={clsx('gap-8', tab === 'edit' ? 'grid lg:grid-cols-2' : '')}>

        {/* ── Left: Form ── */}
        {tab === 'edit' && (
          <div className="space-y-4">

            {/* Personal Info */}
            <Section icon={User} title="Personal Information" color="text-brand-600" bg="bg-brand-50">
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { k: 'name',     label: 'Full Name',       ph: 'John Doe',                  full: true },
                  { k: 'email',    label: 'Email',           ph: 'john@example.com' },
                  { k: 'phone',    label: 'Phone',           ph: '+91 98765 43210' },
                  { k: 'location', label: 'Location',        ph: 'Mumbai, India' },
                  { k: 'linkedin', label: 'LinkedIn URL',    ph: 'linkedin.com/in/johndoe' },
                  { k: 'website',  label: 'Website/Portfolio', ph: 'johndoe.dev' },
                ].map(({ k, label, ph, full }) => (
                  <div key={k} className={full ? 'col-span-2' : ''}>
                    <label className="label">{label}</label>
                    <input className="input-field" placeholder={ph} value={resume.personal[k]}
                      onChange={e => setPersonal(k, e.target.value)} />
                  </div>
                ))}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label mb-0">Professional Summary</label>
                    <AIBtn onClick={aiSummary} loading={aiLoading.summary} label="AI Generate" />
                  </div>
                  <textarea rows={4} className="input-field resize-none" placeholder="A results-driven professional with..."
                    value={resume.personal.summary} onChange={e => setPersonal('summary', e.target.value)} />
                </div>
              </div>
            </Section>

            {/* Experience */}
            <Section icon={Briefcase} title="Work Experience" color="text-emerald-600" bg="bg-emerald-50">
              <div className="space-y-6 mt-4">
                {resume.experience.map(exp => (
                  <div key={exp.id} className="border border-slate-200 rounded-xl p-4 relative">
                    <button onClick={() => removeExp(exp.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="col-span-2">
                        <label className="label">Job Title</label>
                        <input className="input-field" placeholder="Software Engineer" value={exp.role}
                          onChange={e => updateExp(exp.id, 'role', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="label">Company</label>
                        <input className="input-field" placeholder="Acme Corp" value={exp.company}
                          onChange={e => updateExp(exp.id, 'company', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Start</label>
                        <input className="input-field" placeholder="Jan 2022" value={exp.start}
                          onChange={e => updateExp(exp.id, 'start', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">End</label>
                        <input className="input-field" placeholder="Present" value={exp.current ? 'Present' : exp.end}
                          disabled={exp.current} onChange={e => updateExp(exp.id, 'end', e.target.value)} />
                        <label className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 cursor-pointer">
                          <input type="checkbox" checked={exp.current} onChange={e => updateExp(exp.id, 'current', e.target.checked)} />
                          Currently working here
                        </label>
                      </div>
                    </div>
                    <label className="label">Bullet Points</label>
                    <div className="space-y-2">
                      {exp.bullets.map((b, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <textarea rows={2} className="input-field flex-1 resize-none text-xs" placeholder="Developed feature X that increased Y by Z%..."
                            value={b} onChange={e => updateBullet(exp.id, idx, e.target.value)} />
                          <div className="flex flex-col gap-1">
                            <AIBtn onClick={() => aiExpandBullet(exp.id, idx)} loading={aiLoading[`bullet-${exp.id}-${idx}`]} label="AI" />
                            {exp.bullets.length > 1 && (
                              <button onClick={() => removeBullet(exp.id, idx)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addBullet(exp.id)} className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1">
                        <Plus size={12} /> Add bullet
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExp} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Plus size={15} /> Add Experience
                </button>
              </div>
            </Section>

            {/* Education */}
            <Section icon={GraduationCap} title="Education" color="text-amber-600" bg="bg-amber-50">
              <div className="space-y-4 mt-4">
                {resume.education.map(edu => (
                  <div key={edu.id} className="border border-slate-200 rounded-xl p-4 relative">
                    <button onClick={() => removeEdu(edu.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="label">School / University</label>
                        <input className="input-field" placeholder="MIT" value={edu.school}
                          onChange={e => updateEdu(edu.id, 'school', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Degree</label>
                        <input className="input-field" placeholder="B.Tech" value={edu.degree}
                          onChange={e => updateEdu(edu.id, 'degree', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Field of Study</label>
                        <input className="input-field" placeholder="Computer Science" value={edu.field}
                          onChange={e => updateEdu(edu.id, 'field', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Start Year</label>
                        <input className="input-field" placeholder="2019" value={edu.start}
                          onChange={e => updateEdu(edu.id, 'start', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">End Year</label>
                        <input className="input-field" placeholder="2023" value={edu.end}
                          onChange={e => updateEdu(edu.id, 'end', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="label">GPA (optional)</label>
                        <input className="input-field" placeholder="8.5 / 10" value={edu.gpa}
                          onChange={e => updateEdu(edu.id, 'gpa', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEdu} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Plus size={15} /> Add Education
                </button>
              </div>
            </Section>

            {/* Skills */}
            <Section icon={Code} title="Skills" color="text-purple-600" bg="bg-purple-50">
              <div className="mt-4">
                <div className="flex gap-2 mb-3">
                  <input className="input-field flex-1" placeholder="e.g. React, Python, SQL…"
                    value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                  <button onClick={addSkill} className="btn-primary px-4 py-2 text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map(s => (
                    <span key={s} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 text-xs font-medium px-3 py-1.5 rounded-full">
                      {s}
                      <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </Section>

            {/* Projects */}
            <Section icon={FileText} title="Projects" color="text-sky-600" bg="bg-sky-50">
              <div className="space-y-4 mt-4">
                {resume.projects.map(proj => (
                  <div key={proj.id} className="border border-slate-200 rounded-xl p-4 relative">
                    <button onClick={() => removeProj(proj.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3">
                      <div>
                        <label className="label">Project Name</label>
                        <input className="input-field" placeholder="ResumeIQ" value={proj.name}
                          onChange={e => updateProj(proj.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">URL (optional)</label>
                        <input className="input-field" placeholder="github.com/you/project" value={proj.url}
                          onChange={e => updateProj(proj.id, 'url', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Description</label>
                        <textarea rows={3} className="input-field resize-none" placeholder="Built an AI-powered resume analyzer using React and Python..."
                          value={proj.description} onChange={e => updateProj(proj.id, 'description', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addProj} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Plus size={15} /> Add Project
                </button>
              </div>
            </Section>

            {/* Certifications */}
            <Section icon={Award} title="Certifications" color="text-rose-600" bg="bg-rose-50">
              <div className="space-y-4 mt-4">
                {resume.certifications.map(cert => (
                  <div key={cert.id} className="border border-slate-200 rounded-xl p-4 relative">
                    <button onClick={() => removeCert(cert.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="label">Certification Name</label>
                        <input className="input-field" placeholder="AWS Certified Solutions Architect" value={cert.name}
                          onChange={e => updateCert(cert.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Issuer</label>
                        <input className="input-field" placeholder="Amazon" value={cert.issuer}
                          onChange={e => updateCert(cert.id, 'issuer', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Date</label>
                        <input className="input-field" placeholder="Mar 2024" value={cert.date}
                          onChange={e => updateCert(cert.id, 'date', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addCert} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Plus size={15} /> Add Certification
                </button>
              </div>
            </Section>
          </div>
        )}

        {/* ── Right: Preview ── */}
        <div className={clsx(tab === 'preview' ? 'max-w-3xl mx-auto w-full' : '')}>
          <div className="card overflow-hidden sticky top-6">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
              <button onClick={handlePrint} className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors">
                <Download size={12} /> Print / Save PDF
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(100vh-200px)]">
              <ResumePreview data={resume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
