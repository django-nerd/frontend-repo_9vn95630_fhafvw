import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ArrowRight, CheckCircle2, Menu, X } from 'lucide-react'

// New theme: light, editorial, emerald-teal accent with sand surfaces
const theme = {
  bg: '#f7f7f5',
  paper: '#ffffff',
  sand: '#f2efe9',
  ink: '#0b0f14',
  sub: 'rgba(11,15,20,0.65)',
  accentFrom: '#10b981', // emerald
  accentTo: '#14b8a6',   // teal
  amber: '#f59e0b',
}

function useLenisSmoothScroll() {
  useEffect(() => {
    let destroy
    ;(async () => {
      try {
        const { default: Lenis } = await import('lenis')
        const lenis = new Lenis({
          duration: 1.1,
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

// Soft noise + gradient backdrop
function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `radial-gradient(80vw 60vh at 20% 10%, ${theme.sand}, transparent 60%), radial-gradient(80vw 60vh at 80% 0%, rgba(20,184,166,0.12), transparent 60%), radial-gradient(100vw 70vh at 50% 100%, rgba(16,185,129,0.12), transparent 60%), ${theme.bg}`,
      }} />
      <svg aria-hidden className="absolute -top-40 right-[-10%] h-[80vh] w-[80vw] opacity-60">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme.accentFrom} stopOpacity="0.35" />
            <stop offset="100%" stopColor={theme.accentTo} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <g filter="url(#blur)">
          <path d="M0,200 C200,-50 600,-50 800,200 C600,450 200,450 0,200 Z" fill="url(#grad)" />
        </g>
        <filter id="blur">
          <feGaussianBlur stdDeviation="60" />
        </filter>
      </svg>
    </div>
  )
}

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.1, 0.5, 1] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

function Nav() {
  const [open, setOpen] = useState(false)
  const ids = useMemo(() => ['hero', 'expertise', 'work', 'process', 'contact'], [])
  const active = useScrollSpy(ids)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const LinkItem = ({ id, label }) => (
    <a
      href={`#${id}`}
      onClick={() => setOpen(false)}
      className={`text-sm transition-colors ${active === id ? 'text-emerald-600' : 'text-black/60 hover:text-black/80'}`}
    >
      {label}
    </a>
  )

  return (
    <div className="fixed top-4 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-black/10 bg-white/70 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.accentFrom}, ${theme.accentTo})` }} />
            <span className="font-semibold text-black">Haestus.dev</span>
          </div>
          <div className="hidden md:flex items-center gap-7">
            <LinkItem id="hero" label="Home" />
            <LinkItem id="expertise" label="Expertise" />
            <LinkItem id="work" label="Work" />
            <LinkItem id="process" label="Process" />
            <LinkItem id="contact" label="Contact" />
          </div>
          <button className="md:hidden text-black" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {/* Mobile sheet */}
      <div className={`md:hidden fixed inset-0 z-40 transition ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} style={{ background: 'rgba(0,0,0,0.25)' }} />
      <div className={`md:hidden fixed inset-y-0 right-0 z-40 w-full max-w-xs border-l border-black/10 bg-white p-6 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="space-y-5">
          <LinkItem id="hero" label="Home" />
          <LinkItem id="expertise" label="Expertise" />
          <LinkItem id="work" label="Work" />
          <LinkItem id="process" label="Process" />
          <LinkItem id="contact" label="Contact" />
        </div>
      </div>
    </div>
  )
}

function AccentButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`relative inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] ${className}`}
      style={{ background: `linear-gradient(135deg, ${theme.accentFrom}, ${theme.accentTo})`, boxShadow: '0 8px 30px rgba(16,185,129,0.25)' }}
    >
      {children}
    </button>
  )
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-28 ${className}`}>
      {children}
    </section>
  )
}

function Hero() {
  return (
    <Section id="hero" className="pt-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-7">
            <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700">AI Engineering Consultancy</span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-black sm:text-5xl md:text-6xl">
              We turn complex problems into elegant, intelligent products
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/70">
              Strategy, design, and engineering for world‑class AI experiences. Pragmatic, production‑ready, and measurably effective.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <AccentButton>
                Start a project <ArrowRight className="ml-2 h-4 w-4" />
              </AccentButton>
              <button className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/80 hover:bg-black/5">See our work</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="md:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxEYXRhJTIwdmlzdWFsaXphdGlvbnxlbnwwfDB8fHwxNzYzNDQyMjExfDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Data visualization" className="h-64 w-full object-cover sm:h-80" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 mix-blend-multiply" />
            </div>
          </motion.div>
        </div>

        {/* Metrics */}
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {[
            ['98%', 'Client satisfaction'],
            ['<6w', 'Prototype to prod'],
            ['25+', 'Delivered products'],
            ['90+', 'Lighthouse score'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-black/10 bg-white/70 p-5 text-center backdrop-blur-sm">
              <div className="text-2xl font-semibold text-black">{k}</div>
              <div className="text-xs text-black/60">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Expertise() {
  const items = [
    {
      title: 'Product Strategy',
      body: 'Roadmaps, opportunity mapping, and KPI‑driven execution that aligns teams and accelerates outcomes.',
    },
    {
      title: 'Design Systems',
      body: 'Accessible, scalable UI systems with motion, states, and usage guidance baked‑in.',
    },
    {
      title: 'AI Engineering',
      body: 'RAG, agents, evals, and observability—built with reliability and cost efficiency in mind.',
    },
    {
      title: 'Full‑Stack Delivery',
      body: 'TypeScript frontends, Python backends, cloud infra, and data pipelines—production ready.',
    },
  ]

  return (
    <Section id="expertise" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-black sm:text-4xl">What we do best</h2>
          <span className="hidden text-sm text-black/60 sm:block">End‑to‑end, zero fluff</span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-2xl" style={{ background: `linear-gradient(135deg, ${theme.accentFrom}22, ${theme.accentTo}22)` }} />
              <h3 className="text-lg font-semibold text-black">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/70">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Work() {
  const projects = [
    {
      name: 'Atlas Analytics',
      desc: 'Self‑serve BI with NLQ copilots',
      img: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?q=80&w=1800&auto=format&fit=crop',
    },
    {
      name: 'Nimbus Studio',
      desc: 'Realtime video generation pipeline',
      img: 'https://images.unsplash.com/photo-1527443224154-c4f2a9c13f58?q=80&w=1800&auto=format&fit=crop',
    },
    {
      name: 'VectorVault',
      desc: 'Enterprise RAG and evals suite',
      img: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1800&auto=format&fit=crop',
    },
  ]

  return (
    <Section id="work" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-black sm:text-4xl">Selected work</h2>
          <a href="#contact" className="hidden text-sm font-medium text-emerald-700 hover:text-emerald-600 sm:block">Work with us</a>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <motion.article key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55, delay: i * 0.08 }} className="group overflow-hidden rounded-3xl border border-black/10 bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-black">{p.name}</h3>
                <p className="mt-1 text-sm text-black/65">{p.desc}</p>
                <div className="mt-4">
                  <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Case Study</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Process() {
  const steps = [
    ['Discover', 'We align on goals, constraints, and success metrics.'],
    ['Prototype', 'We validate with real flows and real users.'],
    ['Engineer', 'We ship scalable, observable systems.'],
    ['Evolve', 'We optimize and expand with confidence.'],
  ]

  return (
    <Section id="process" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-3xl font-semibold text-black sm:text-4xl">How we build</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {steps.map(([title, body], i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="relative rounded-3xl border border-black/10 bg-white p-6">
              <div className="mb-3 text-5xl font-black leading-none text-black/10">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="text-lg font-semibold text-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/70">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Contact() {
  const { register, handleSubmit, formState, reset, trigger } = useForm()
  const [sent, setSent] = useState(false)

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
    reset()
  }

  return (
    <Section id="contact" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold text-black sm:text-4xl">Let’s work together</h2>
          <p className="mt-2 text-black/70">Tell us about your product and we’ll reply within 24 hours.</p>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-black/70">Name</label>
                <input {...register('name', { required: 'Please enter your name', minLength: 2 })} onBlur={() => trigger('name')} placeholder="Your name" className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-emerald-200 focus:ring-2" />
                {formState.errors.name && <p className="mt-1 text-xs text-red-600">{formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-black/70">Email</label>
                <input type="email" {...register('email', { required: 'Enter a valid email' })} onBlur={() => trigger('email')} placeholder="you@company.com" className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-emerald-200 focus:ring-2" />
                {formState.errors.email && <p className="mt-1 text-xs text-red-600">{formState.errors.email.message}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-black/70">Project description</label>
              <textarea rows={6} {...register('description', { required: 'Tell us a bit more', minLength: 10 })} onBlur={() => trigger('description')} placeholder="What are we building together?" className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-emerald-200 focus:ring-2" />
              {formState.errors.description && <p className="mt-1 text-xs text-red-600">{formState.errors.description.message}</p>}
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-black/70">Budget</label>
              <select {...register('budget', { required: 'Select a budget' })} onBlur={() => trigger('budget')} className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-emerald-200 focus:ring-2">
                <option value="">Select a range</option>
                <option>Under $5k</option>
                <option>$5-10k</option>
                <option>$10-25k</option>
                <option>$25-50k</option>
                <option>$50k+</option>
                <option>Not sure yet</option>
              </select>
              {formState.errors.budget && <p className="mt-1 text-xs text-red-600">{formState.errors.budget.message}</p>}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-black/60">Prefer email? hello@haestus.dev</div>
              <AccentButton type="submit">Send message <ArrowRight className="ml-2 h-4 w-4" /></AccentButton>
            </div>
          </form>

          {sent && (
            <div className="absolute inset-0 grid place-items-center rounded-3xl bg-black/30 backdrop-blur-sm">
              <div className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-lg">
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
                <h3 className="text-lg font-semibold text-black">Message sent!</h3>
                <p className="mt-1 text-sm text-black/70">We’ll get back within a day.</p>
                <button onClick={() => setSent(false)} className="mt-5 text-sm font-medium text-emerald-700 hover:text-emerald-600">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/70 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg" style={{ background: `linear-gradient(135deg, ${theme.accentFrom}, ${theme.accentTo})` }} />
            <span className="text-sm font-medium text-black/70">© {new Date().getFullYear()} Haestus.dev</span>
          </div>
          <div className="text-xs text-black/60">Built for performance • Lighthouse 90+</div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useLenisSmoothScroll()
  return (
    <div style={{ background: theme.bg, color: theme.ink }}>
      <Backdrop />
      <Nav />
      <Hero />
      <Expertise />
      <Work />
      <Process />
      <Contact />
      <Footer />
    </div>
  )
}
