import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FileText, BriefcaseIcon, X, Sparkles, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
  'Extracting resume text...',
  'Running ML keyword scoring...',
  'Computing ATS compatibility...',
  'Scoring resume sections...',
  'Generating Llama 3 suggestions...',
  'Finalising your report...',
]

function DropZone({ label, icon: Icon, accept, file, onFile, onClear, hint }) {
  const onDrop = useCallback(accepted => { if (accepted[0]) onFile(accepted[0]) }, [onFile])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, maxFiles: 1 })
  return (
    <div>
      <label className="label">{label}</label>
      {file ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-50 border border-brand-200">
          <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-brand-600"/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-800 truncate">{file.name}</p>
            <p className="text-xs text-brand-400">{(file.size/1024).toFixed(1)} KB</p>
          </div>
          <button onClick={onClear} className="text-brand-400 hover:text-brand-600 p-1"><X size={16}/></button>
        </div>
      ) : (
        <div {...getRootProps()} className={clsx(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150',
          isDragActive ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-slate-50 hover:border-brand-300 hover:bg-brand-50/40'
        )}>
          <input {...getInputProps()}/>
          <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3', isDragActive ? 'bg-brand-100' : 'bg-white border border-slate-200')}>
            <Icon className={clsx('w-6 h-6', isDragActive ? 'text-brand-500' : 'text-slate-400')}/>
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">{isDragActive ? 'Drop it here!' : `Drag & drop or click`}</p>
          <p className="text-xs text-slate-400">{hint}</p>
          <span className="inline-block mt-3 text-xs font-medium text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">Browse files</span>
        </div>
      )}
    </div>
  )
}

function Loader({ step }) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-brand-100 rounded-full"/>
          <div className="absolute inset-0 border-4 border-transparent border-t-brand-600 rounded-full animate-spin"/>
          <div className="absolute inset-2 border-4 border-transparent border-t-brand-300 rounded-full animate-spin" style={{animationDuration:'1.5s',animationDirection:'reverse'}}/>
          <Sparkles className="absolute inset-0 m-auto w-7 h-7 text-brand-500"/>
        </div>
        <h3 className="font-serif text-xl text-slate-800 mb-2">Analyzing your resume</h3>
        <p className="text-sm text-slate-500 mb-5">{STEPS[step] || 'Almost done...'}</p>
        <div className="flex gap-1.5 justify-center">
          {STEPS.map((_,i)=>(
            <div key={i} className={clsx('h-1.5 rounded-full transition-all duration-500', i<=step ? 'bg-brand-500 w-6' : 'bg-slate-200 w-3')}/>
          ))}
        </div>
      </div>
    </div>
  )
}

const ACCEPT_ALL = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
}

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [resumeFile, setResumeFile] = useState(null)
  const [jdFile, setJdFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  const handleAnalyze = async () => {
    if (!resumeFile) return toast.error('Please upload your resume first')
    setLoading(true); setStep(0)
    const timer = setInterval(() => setStep(s => Math.min(s+1, STEPS.length-1)), 3000)

    const fd = new FormData()
    fd.append('resume', resumeFile)
    if (jdFile) fd.append('jobDescription', jdFile)
    if (jdText.trim()) fd.append('jobDescriptionText', jdText)

    try {
const r = await axios.post('/api/analyze/', fd, { headers:{'Content-Type':'multipart/form-data'} })    
  clearInterval(timer)
      toast.success('Analysis complete!')
      navigate(`/result/${r.data.id}`)
    } catch (err) {
      clearInterval(timer)
      toast.error(err.response?.data?.detail || 'Analysis failed. Is the backend running?')
    } finally { setLoading(false) }
  }

  return (
    <>
      {loading && <Loader step={step}/>}
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-serif text-slate-900 mb-1">Analyze Resume</h1>
          <p className="text-slate-500 text-sm">Upload your resume and get instant AI-powered analysis.</p>
        </div>

        <div className="space-y-5">
          {/* Resume upload */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <h2 className="font-semibold text-slate-800">Upload your resume</h2>
              <span className="ml-auto text-xs text-red-500 font-medium">Required</span>
            </div>
            <DropZone label="Resume file" icon={FileText} accept={ACCEPT_ALL}
              file={resumeFile} onFile={setResumeFile} onClear={()=>setResumeFile(null)}
              hint="PDF, DOCX, or TXT · Max 10 MB"/>
          </div>

          {/* JD */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 bg-slate-300 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <h2 className="font-semibold text-slate-800">Job description</h2>
              <span className="ml-auto text-xs text-slate-400">Optional — improves match scoring</span>
            </div>
            <DropZone label="Job description file" icon={BriefcaseIcon} accept={ACCEPT_ALL}
              file={jdFile} onFile={setJdFile} onClear={()=>setJdFile(null)} hint="PDF, DOCX, or TXT"/>
            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-slate-200"/><span className="text-xs text-slate-400 font-medium">or paste below</span><div className="h-px flex-1 bg-slate-200"/>
            </div>
            <textarea value={jdText} onChange={e=>setJdText(e.target.value)} rows={5}
              placeholder="Paste job description text here..."
              className="input-field resize-none text-sm"/>
          </div>

          {/* Tip box */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            {/* <p className="text-xs font-semibold text-brand-700 mb-2 flex items-center gap-1.5"><CheckCircle2 size={13}/> Tips for best results</p> */}
            <ul className="text-xs text-brand-600 space-y-1 list-disc list-inside">
              {/* <li>Use <code className="bg-brand-100 px-1 rounded">.txt</code> or <code className="bg-brand-100 px-1 rounded">.docx</code> for most accurate text extraction</li>
              <li>Add a job description to get keyword match scoring</li>
              <li>Run <code className="bg-brand-100 px-1 rounded">ollama run llama3</code> for AI-powered suggestions</li> */}
            </ul>
          </div>

          <button onClick={handleAnalyze} disabled={!resumeFile||loading}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base">
            <Sparkles size={20}/> Analyze your resume
          </button>
        </div>
      </div>
    </>
  )
}
