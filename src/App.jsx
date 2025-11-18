import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react'
import Spline from '@splinetool/react-spline'

// Theme tokens
const colors = {
  bg: '#0a0a0a',
  surface: '#141414',
  purple: '#8b5cf6',
  blue: '#3b82f6',
}

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] } },
}

function useLenisSmoothScroll() {
  useEffect(() => {
    let destroy
    ;(async () => {
      try {
        const { default: Lenis } = await import('lenis')
        const lenis = new Lenis({
          duration: 1.2,
          smoothWheel: true,
          smoothTouch: false,
        })
        const raf = (time) => {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
        destroy = () => lenis.destroy()
      } catch {}
    })()
    return () => destroy && destroy()
  }, [])
}

function ParticleGrid() {
  // Render a low-opacity animated grid of dots
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="dot" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={colors.purple} opacity="0.12" />
        </pattern>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.purple} stopOpacity="0.15" />
          <stop offset="100%" stopColor={colors.blue} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot)" />
      <rect width="100%" height="100%" fill="url(#glow)" />
    </svg>
  )
}

function GradientButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`relative inline-flex items-center justify-center rounded-[12px] px-5 py-3 font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        boxShadow: '0 10px 30px rgba(139,92,246,0.25)',
      }}
    >
      {children}
    </button>
  )
}

function TopNav() {
  const [open, setOpen] = useState(false)
  const lastScroll = useRef(0)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setHidden(current > lastScroll.current && current > 80)
      lastScroll.current = current
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <div className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-4 flex h-14 items-center justify-between rounded-xl bg-[#0f0f10]/70 backdrop-blur-md ring-1 ring-white/10">
          <Link to="/" className="flex items-center gap-3 pl-4">
            <div className="h-8 w-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }} />
            <span className="text-white font-semibold">Haestus.dev</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 pr-4">
            {[
              { to: '/', label: 'Home' },
              { to: '/portfolio', label: 'Portfolio' },
              { to: '/process', label: 'Process' },
              { to: '/connect', label: 'Connect' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="text-sm text-white/80 hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
          <button className="md:hidden pr-3 text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <div className={`md:hidden fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-[#0f0f10] ring-1 ring-white/10 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 space-y-6">
          {[
            { to: '/', label: 'Home' },
            { to: '/portfolio', label: 'Portfolio' },
            { to: '/process', label: 'Process' },
            { to: '/connect', label: 'Connect' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="block text-lg text-white/90">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between border-r border-white/10 bg-[#0c0c0c]/60 backdrop-blur-md px-6 py-6">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }} />
          <div>
            <div className="text-white font-semibold">Haestus.dev</div>
            <div className="text-xs text-white/60">AI Engineering</div>
          </div>
        </div>
        <nav className="flex flex-col gap-3">
          <Link to="/" className="text-white/80 hover:text-white">Home</Link>
          <Link to="/portfolio" className="text-white/80 hover:text-white">Portfolio</Link>
          <Link to="/process" className="text-white/80 hover:text-white">Process</Link>
          <Link to="/connect" className="text-white/80 hover:text-white">Connect</Link>
        </nav>
      </div>
      <p className="text-sm text-white/50">More powerful. More simple. More direct.</p>
    </aside>
  )
}

function ParticleBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <ParticleGrid />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_70%_10%,rgba(139,92,246,0.15),transparent_60%)]" />
    </div>
  )
}

function SplineHero() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10">
      <Spline scene="https://prod.spline.design/wwTRdG1D9CkNs368/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
    </div>
  )
}

function HomePage() {
  useLenisSmoothScroll()

  // ChatGPT-style demo typing and streaming
  const question = 'What is haestus.dev?'
  const response = "More powerful. More simple. More direct. We are Haestus — building the future of AI-powered applications through full-stack engineering excellence. We don't just write code. We craft digital intelligence that transforms how people interact with technology."

  const [typedQ, setTypedQ] = useState('')
  const [showButton, setShowButton] = useState(false)
  const [streamed, setStreamed] = useState('')
  const [stage, setStage] = useState('typing') // typing -> ready -> streaming -> done

  useEffect(() => {
    let timer
    if (stage === 'typing') {
      let i = 0
      timer = setInterval(() => {
        setTypedQ((prev) => prev + question[i])
        i++
        if (i >= question.length) {
          clearInterval(timer)
          setStage('ready')
          setTimeout(() => setShowButton(true), 600)
          setTimeout(() => setStage('streaming'), 3000)
        }
      }, 60)
    }
    return () => clearInterval(timer)
  }, [stage])

  useEffect(() => {
    let t
    if (stage === 'streaming') {
      const words = response.split(' ')
      let i = 0
      t = setInterval(() => {
        setStreamed((prev) => (prev ? prev + ' ' + words[i] : words[i]))
        i++
        if (i >= words.length) {
          clearInterval(t)
          setStage('done')
          setShowButton(true)
        }
      }, 50)
    }
    return () => clearInterval(t)
  }, [stage])

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative min-h-screen bg-[#0a0a0a] text-white">
      <ParticleBackdrop />
      <TopNav />
      <Sidebar />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24 lg:pl-72">
        <div className="grid grid-cols-1 gap-10">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Conversational engineering, Linear-grade polish</h1>
            <p className="text-white/60">Haestus is a full‑stack AI engineering consultancy. We bring ChatGPT’s clarity to your product process and Linear’s craft to your interface.</p>
          </div>

          <SplineHero />

          {/* Chat demo card */}
          <div className="rounded-[24px] border border-white/10 bg-[#0d0d0d]/80 p-6 sm:p-8 shadow-[0_0_40px_rgba(139,92,246,0.08)]">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 font-bold grid place-items-center">H</div>
              <div className="flex-1">
                <div className="rounded-2xl bg-[#141414] border border-white/10 p-4">{typedQ}<span className="animate-pulse">{stage==='typing' ? '|' : ''}</span></div>
                <div className="mt-6 rounded-2xl bg-[#141414] border border-white/10 p-4 min-h-[120px]">
                  {stage === 'streaming' || stage === 'done' ? (
                    <p className="leading-relaxed text-white/90">{streamed}</p>
                  ) : (
                    <p className="text-white/40">Waiting for response…</p>
                  )}
                </div>
                <div className="mt-6">
                  <GradientButton className={`transition ${showButton ? 'opacity-100' : 'opacity-0'} `} onClick={() => setStage('streaming')}>
                    Explore our work <ArrowRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}

function PortfolioPage() {
  useLenisSmoothScroll()
  const projects = [
    {
      name: 'Atlas Analytics',
      desc: 'Self-serve BI with NLQ copilots',
      tech: ['Next.js', 'tRPC', 'Postgres', 'OpenAI'],
      img: 'https://images.unsplash.com/photo-1551281044-8d8d0d8d0d8d?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Nimbus Studio',
      desc: 'Realtime video generation pipeline',
      tech: ['Rust', 'FFmpeg', 'WebRTC'],
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'VectorVault',
      desc: 'Enterprise RAG and evaluation suite',
      tech: ['Python', 'FastAPI', 'Weaviate'],
      img: 'https://images.unsplash.com/photo-1527443224154-c4f2a9c13f58?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'PromptForge',
      desc: 'Prompt ops and governance platform',
      tech: ['Next.js', 'Prisma', 'OpenAI'],
      img: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop',
    },
  ]

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative min-h-screen bg-[#0a0a0a] text-white">
      <ParticleBackdrop />
      <TopNav />
      <Sidebar />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24 lg:pl-72">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-3">Our Work</h1>
          <p className="text-white/60">Crafting experiences that matter</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#0f0f10]/70 backdrop-blur-md hover:shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-shadow"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={p.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-95 group-hover:brightness-110" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm">View Project</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{p.name}</h3>
                <p className="text-white/60 mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-purple-500/30 bg-purple-500/5 px-3 py-1 text-xs text-purple-200">{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.main>
  )
}

function ProcessPage() {
  useLenisSmoothScroll()
  const steps = [
    { title: 'Strategize', desc: 'Align on vision, scope, and success metrics' },
    { title: 'Prototype', desc: 'Rapid design iteration and user validation' },
    { title: 'Engineer', desc: 'Ship production-ready code with pixel-perfect execution' },
    { title: 'Scale', desc: 'Optimize, measure, and evolve your product' },
  ]

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative min-h-screen bg-[#0a0a0a] text-white">
      <ParticleBackdrop />
      <TopNav />
      <Sidebar />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24 lg:pl-72">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-3">How We Work</h1>
          <p className="text-white/60">Engineering excellence, delivered</p>
        </header>

        <div className="relative">
          {/* connectors */}
          <div className="absolute left-0 right-0 top-24 hidden md:block">
            <div className="mx-auto max-w-3xl flex items-center justify-between">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-px w-40 border-t border-dashed border-purple-500/40" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.2 }}
                className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent p-6 hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]"
              >
                <div className="absolute right-3 top-2 text-7xl font-black text-white/10 select-none">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-white/60">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  )
}

function ConnectPage() {
  useLenisSmoothScroll()
  const { register, handleSubmit, formState, reset, trigger } = require('react-hook-form')()
  const { z } = require('zod')
  const [sent, setSent] = useState(false)

  const schema = z.object({
    name: z.string().min(2, 'Please enter your name'),
    email: z.string().email('Enter a valid email'),
    description: z.string().min(10, 'Tell us a bit more'),
    budget: z.string().min(1, 'Select a budget'),
  })

  const onSubmit = async (data) => {
    // Simulate success state
    await new Promise((r) => setTimeout(r, 700))
    setSent(true)
    reset()
  }

  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative min-h-screen bg-[#0a0a0a] text-white">
      <ParticleBackdrop />
      <TopNav />
      <Sidebar />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24 lg:pl-72">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-3">Let&apos;s build something amazing</h1>
          <p className="text-white/60">Get in touch to start your project</p>
        </header>

        <div className="relative mx-auto max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-[24px] border border-purple-500/30 bg-[#0f0f10]/80 p-6 sm:p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] space-y-5">
            <div>
              <label className="block text-sm text-white/70 mb-2">Name</label>
              <input {...register('name', { required: true, minLength: 2 })} onBlur={() => trigger('name')} className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-0 px-4 py-3 outline-none" placeholder="Your name" />
              {formState.errors.name && <p className="mt-1 text-sm text-red-400">{formState.errors.name.message || 'Please enter your name'}</p>}
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Email</label>
              <input type="email" {...register('email', { required: true })} onBlur={() => trigger('email')} className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-0 px-4 py-3 outline-none" placeholder="you@company.com" />
              {formState.errors.email && <p className="mt-1 text-sm text-red-400">{formState.errors.email.message || 'Enter a valid email'}</p>}
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Project Description</label>
              <textarea rows={6} {...register('description', { required: true, minLength: 10 })} onBlur={() => trigger('description')} className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-0 px-4 py-3 outline-none" placeholder="What are we building together?" />
              {formState.errors.description && <p className="mt-1 text-sm text-red-400">{formState.errors.description.message || 'Tell us a bit more'}</p>}
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Budget Range</label>
              <select {...register('budget', { required: true })} onBlur={() => trigger('budget')} className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-0 px-4 py-3 outline-none">
                <option value="">Select a range</option>
                <option>Under $5k</option>
                <option>$5-10k</option>
                <option>$10-25k</option>
                <option>$25-50k</option>
                <option>$50k+</option>
                <option>Not sure yet</option>
              </select>
              {formState.errors.budget && <p className="mt-1 text-sm text-red-400">{formState.errors.budget.message || 'Select a budget range'}</p>}
            </div>

            <GradientButton type="submit" className="w-full">Send Message <ArrowRight className="ml-2 h-4 w-4" /></GradientButton>
          </form>

          {/* Success overlay */}
          {sent && (
            <div className="absolute inset-0 grid place-items-center rounded-[24px] bg-black/60 backdrop-blur-sm">
              <div className="rounded-2xl border border-white/10 bg-[#0f0f10] p-8 text-center shadow-[0_0_60px_rgba(139,92,246,0.25)]">
                <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-400" />
                <h3 className="text-xl font-semibold mb-1">Message sent successfully!</h3>
                <p className="text-white/60">We&apos;ll respond within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm text-purple-300 hover:text-purple-200">Close</button>
              </div>
            </div>
          )}

          <div className="mt-10 space-y-3 text-center">
            <a href="mailto:hello@haestus.dev" className="block text-purple-300 hover:text-purple-200">hello@haestus.dev</a>
            <div className="flex items-center justify-center gap-5 text-white/60">
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">GitHub</a>
            </div>
            <p className="text-xs text-white/40">We respond within 24 hours</p>
          </div>
        </div>
      </section>
    </motion.main>
  )
}

function Layout() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/connect" element={<ConnectPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return <Layout />
}
