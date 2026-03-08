import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Github, Linkedin, Mail, Phone, ExternalLink, Download,
  ChevronRight, ChevronLeft, Cpu, Zap, Shield, Code2, Layers, Terminal,
  ArrowRight, Star, GitBranch, Box, Sparkles, Menu, X, Globe,
  Play, Bot, Send, RefreshCw, Wifi, WifiOff, Loader2
} from 'lucide-react'

// ─── STOMP Demo constants ────────────────────────────────────────────────────
const CHAR_DELAY = 15
const LINE_GAP   = 155
const PROMPT     = '$ '
const BORDER     = 47

const LINE_COLORS = {
  cmd:         '#22d3ee',
  output:      '#94a3b8',
  error:       '#f87171',
  success:     '#4ade80',
  info:        '#818cf8',
  'frame-in':  '#c084fc',
  'frame-err': '#f87171',
  sql:         '#fb923c',
}

const AF_EVENTS = [
  { time: '0:00',  type: 'kickoff',  desc: 'Argentina vs France — 2022 FIFA World Cup Final' },
  { time: '36:00', type: 'goal!!!!', desc: 'Di María fires Argentina ahead — 2:0!' },
  { time: '80:00', type: 'goal!!!!', desc: 'Mbappé converts penalty — 2:1' },
  { time: '81:00', type: 'goal!!!!', desc: 'Mbappé volleys in — 2:2. France level!' },
]

function buildFrame(frameType, headers, body) {
  const top = `┌─ ${frameType} ${'─'.repeat(Math.max(0, BORDER - frameType.length - 2))}`
  const bot = `└${'─'.repeat(BORDER)}`
  const hdr = headers.map(h => `│ ${h}`)
  const bdy = body.map(b => `│ ${b}`)
  return (body.length ? [top, ...hdr, '│', ...bdy, bot] : [top, ...hdr, bot]).join('\n')
}

// ─── Agent Demo constants ────────────────────────────────────────────────────
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080'
  : 'https://agent-sales-bot.onrender.com'

const DEMO_COMPANIES = [
  { domain: 'geula-surf.co.il', label: 'מועדון גלישה אלמוג', type: 'B2C', id: null },
  { domain: 'scaleit.co.il',    label: 'SCALE IT',            type: 'B2B', id: null },
]

const PRESET_MESSAGES = {
  'geula-surf.co.il': [
    'מה השיעורי גלישה שאתם מציעים?',
    'כמה עולה מנוי חודשי?',
    'אני מתחיל לגלוש, במה להתחיל?',
  ],
  'scaleit.co.il': [
    'What integrations do you support?',
    'How does pricing scale with team size?',
    'Can I book a product demo?',
  ],
}

// ─── Intersection Observer hook ─────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.1, ...options })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

// ─── Background orbs ────────────────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-15%',
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '40%',
        width: '30vw', height: '30vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
        filter: 'blur(30px)'
      }} />
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = [
    { label: 'About', href: '#about' },
    { label: 'Stack', href: '#stack' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'background 0.3s ease, border-color 0.3s ease',
      background: scrolled ? 'rgba(5,8,16,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="#" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          OZ<span style={{ color: '#00d4ff' }}>.</span>
        </a>
        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden-mobile">
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link" style={{ textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="mailto:omerzilber1403@gmail.com" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
            Hire Me
          </a>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              display: 'none', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: '#e2e8f0', cursor: 'pointer',
              padding: 0, width: 44, height: 44,
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer" style={{
          background: 'rgba(5,8,16,0.97)', backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '24px 24px 32px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="nav-link card-interactive"
              style={{
                textDecoration: 'none', fontSize: '1.05rem', fontWeight: 500,
                padding: '14px 12px', borderRadius: 10,
                display: 'flex', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
              onClick={() => setMenuOpen(false)}
            >{l.label}</a>
          ))}
          <a href="mailto:omerzilber1403@gmail.com"
            className="btn-primary"
            style={{ marginTop: 12, textAlign: 'center', justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >Hire Me</a>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
// ─── Hero ────────────────────────────────────────────────────────────────────
const HERO_ROLES = ['Full-Stack Developer', 'AI Automation Expert', 'C++ Systems Thinker']

// Compact floating stat card — absolutely positioned over the photo
function FloatCard({ value, label, sub, color, style }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute', zIndex: 20, minWidth: 128,
        borderRadius: 14, padding: '11px 14px',
        background: hov ? 'rgba(8,10,20,0.94)' : 'rgba(8,10,20,0.82)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
        backdropFilter: 'blur(24px)',
        boxShadow: hov ? '0 16px 48px rgba(0,0,0,0.65)' : '0 8px 28px rgba(0,0,0,0.45)',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        ...style,
      }}
    >
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900,
        fontSize: '1.3rem', letterSpacing: '-0.04em', lineHeight: 1,
        background: `linear-gradient(135deg, #f1f5f9 25%, ${color})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', marginBottom: 4,
      }}>{value}</div>
      <div style={{ fontSize: '0.71rem', fontWeight: 600, color: 'rgba(226,232,240,0.68)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '0.61rem', color: 'rgba(226,232,240,0.3)', fontFamily: 'monospace' }}>{sub}</div>
    </div>
  )
}

function Hero() {
  const [roleIdx,      setRoleIdx]      = useState(0)
  const [roleVisible,  setRoleVisible]  = useState(true)
  const [primaryHov,   setPrimaryHov]   = useState(false)
  const [rightHov,     setRightHov]     = useState(false)
  const [photoTilt,    setPhotoTilt]    = useState({ x: 0, y: 0 })
  const photoColRef = useRef(null)

  const handlePhotoMove = useCallback((e) => {
    const rect = photoColRef.current?.getBoundingClientRect()
    if (!rect) return
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)
    setPhotoTilt({ x: dx * 5, y: -dy * 4 })
  }, [])

  const handlePhotoLeave = useCallback(() => {
    setRightHov(false)
    setPhotoTilt({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setRoleVisible(false)
      setTimeout(() => { setRoleIdx(i => (i + 1) % HERO_ROLES.length); setRoleVisible(true) }, 350)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // Spring easing for push-out
  const spring = '0.45s cubic-bezier(0.34,1.56,0.64,1)'
  const cardTransition = `background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform ${spring}`

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: 'clamp(80px,10vh,120px) clamp(20px,5vw,48px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}
        className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

        {/* ── LEFT COLUMN ─────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Pulse badge */}
          <div className="animate-fade-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, alignSelf: 'flex-start',
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0,
              boxShadow: '0 0 8px rgba(34,197,94,0.9)', animation: 'glow-pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(226,232,240,0.65)', letterSpacing: '0.03em' }}>
              Available for Student / Freelance Roles
            </span>
          </div>

          {/* Name */}
          <h1 className="animate-fade-in-up delay-100" style={{ marginBottom: 14, lineHeight: 1.1 }}>
            <span style={{
              display: 'block', fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              fontWeight: 500, color: 'rgba(226,232,240,0.45)', letterSpacing: '0.02em', marginBottom: 6,
            }}>Hi, I'm</span>
            <span className="text-gradient" style={{
              display: 'block', fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.9rem, 5.5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em',
            }}>Omer Zilbershtein</span>
          </h1>

          {/* Rotating role */}
          <div className="animate-fade-in-up delay-200" style={{
            height: 34, display: 'flex', alignItems: 'center', marginBottom: 24,
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', fontWeight: 600,
            color: 'rgba(226,232,240,0.5)', letterSpacing: '-0.01em',
          }}>
            <span style={{
              opacity: roleVisible ? 1 : 0,
              filter: roleVisible ? 'blur(0px)' : 'blur(4px)',
              transform: roleVisible ? 'translateY(0)' : 'translateY(-6px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease',
            }}>{HERO_ROLES[roleIdx]}</span>
          </div>

          {/* Bio */}
          <p className="animate-fade-in-up delay-300" style={{
            fontSize: '0.93rem', lineHeight: 1.78, color: 'rgba(226,232,240,0.48)',
            marginBottom: 36, maxWidth: 460,
          }}>
            Rooted in strict military software fundamentals, accelerated by modern AI.
            I build production-grade systems from low-level C++ to autonomous LangGraph agents at unprecedented velocity.
          </p>

          {/* CTA row */}
          <div className="animate-fade-in-up delay-400 hero-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            <a href="#projects"
              onMouseEnter={() => setPrimaryHov(true)}
              onMouseLeave={() => setPrimaryHov(false)}
              className="btn-primary animate-glow-pulse"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              View My Work
              <ArrowRight size={15} style={{
                transform: primaryHov ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform 0.2s ease',
              }} />
            </a>
            <a href="/Omer_Zilbershtein_CV.pdf" download
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Download size={15} /> Resume
            </a>
          </div>

          {/* Social circles */}
          <div className="animate-fade-in-up delay-500" style={{ display: 'flex', gap: 10 }}>
            {[
              { href: 'https://github.com/omerzilber1403',             icon: <Github size={16} />,   label: 'GitHub'   },
              { href: 'https://www.linkedin.com/in/omer-zilbershtein/', icon: <Linkedin size={16} />, label: 'LinkedIn' },
              { href: 'mailto:omerzilber1403@gmail.com',               icon: <Mail size={16} />,     label: 'Email'    },
            ].map(s => (
              <a key={s.label} href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer" title={s.label}
                className="social-link"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(226,232,240,0.55)', textDecoration: 'none',
                  transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                  e.currentTarget.style.color = '#e2e8f0'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'rgba(226,232,240,0.55)'
                  e.currentTarget.style.transform = 'none'
                }}
              >{s.icon}</a>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ─── */}
        <div
          ref={photoColRef}
          className="hero-photo-col"
          style={{ position: 'relative', minWidth: 300 }}
          onMouseEnter={() => setRightHov(true)}
          onMouseMove={handlePhotoMove}
          onMouseLeave={handlePhotoLeave}
        >
          {/* ── z-0: Background orbs ── */}
          <div style={{
            position: 'absolute', zIndex: 0, top: '5%', left: '10%',
            width: 260, height: 260, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(0,212,255,${rightHov ? 0.25 : 0.2}) 0%, transparent 65%)`,
            filter: 'blur(52px)', animation: 'float 7s ease-in-out infinite', pointerEvents: 'none',
            transition: 'background 0.4s ease',
          }} />
          <div style={{
            position: 'absolute', zIndex: 0, bottom: '8%', right: '8%',
            width: 230, height: 230, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(168,85,247,${rightHov ? 0.24 : 0.2}) 0%, transparent 65%)`,
            filter: 'blur(52px)', animation: 'float 9s ease-in-out infinite reverse', pointerEvents: 'none',
            transition: 'background 0.4s ease',
          }} />
          <div style={{
            position: 'absolute', zIndex: 0, top: '40%', left: '40%',
            width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 65%)',
            filter: 'blur(36px)', animation: 'float 5s ease-in-out infinite 1.5s', pointerEvents: 'none',
          }} />

          {/* ── Subtle rings on hover ── */}
          {[0, 1].map(i => (
            <div key={i} style={{
              position: 'absolute', zIndex: 2,
              bottom: '2%', left: '50%',
              width:  `${220 + i * 100}px`,
              height: `${220 + i * 100}px`,
              borderRadius: '50%',
              transform: 'translateX(-50%)',
              border: `1px solid rgba(0,212,255,${0.18 - i * 0.06})`,
              opacity: rightHov ? 1 : 0,
              animation: rightHov ? `incRing 3s ease-out ${i * 0.5}s infinite` : 'none',
              transition: 'opacity 0.5s ease',
              pointerEvents: 'none',
            }} />
          ))}

          {/* ── z-10: Photo (transparent PNG) ── */}
          <img
            src="/hero-photo.png"
            alt="Omer Zilbershtein"
            style={{
              position: 'absolute', zIndex: 10,
              bottom: 0, left: '50%',
              height: '95%', maxHeight: 490,
              objectFit: 'contain', objectPosition: 'bottom center',
              transform: rightHov
                ? `translateX(-50%) perspective(900px) rotateY(${photoTilt.x}deg) rotateX(${photoTilt.y}deg) scale(1.03)`
                : 'translateX(-50%) perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)',
              filter: rightHov
                ? 'drop-shadow(0 0 28px rgba(0,212,255,0.28)) drop-shadow(0 20px 48px rgba(0,0,0,0.72))'
                : 'drop-shadow(0 0 20px rgba(0,212,255,0.15)) drop-shadow(0 20px 48px rgba(0,0,0,0.7))',
              transition: rightHov
                ? 'transform 0.1s linear, filter 0.4s ease'
                : 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), filter 0.5s ease',
            }}
          />
          <style>{`
            @keyframes incRing {
              0%   { transform: translateX(-50%) scale(0.85); opacity: 0.5; }
              100% { transform: translateX(-50%) scale(1.35); opacity: 0; }
            }
          `}</style>
        </div>

      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.35 }}>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.7))', borderRadius: 1 }} />
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,212,255,0.7)' }}>Scroll</span>
      </div>
    </section>
  )
}

// ─── Tech Stack Marquee ──────────────────────────────────────────────────────
const TECH = [
  { label: 'Python', icon: '🐍' },
  { label: 'React', icon: '⚛️' },
  { label: 'C++', icon: '⚙️' },
  { label: 'LangGraph', icon: '🤖' },
  { label: 'TypeScript', icon: '📘' },
  { label: 'Node.js', icon: '🟢' },
  { label: 'Unity3D', icon: '🎮' },
  { label: 'Claude API', icon: '🧠' },
]

function TechStack() {
  const items = [...TECH, ...TECH] // duplicate for seamless loop
  return (
    <section id="stack" style={{ padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
      {/* label */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.35)' }}>
          Tech I work with daily
        </span>
      </div>

      {/* Top fade edges */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 2,
        background: 'linear-gradient(90deg, #050810 0%, transparent 12%, transparent 88%, #050810 100%)' }} />

      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <div className="animate-marquee" style={{ display: 'flex', gap: 16, whiteSpace: 'nowrap', willChange: 'transform' }}>
          {items.map((t, i) => (
            <div key={i} className="glass" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '12px 22px', borderRadius: 12, whiteSpace: 'nowrap', flexShrink: 0
            }}>
              <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'rgba(226,232,240,0.85)' }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About ──────────────────────────────────────────────────────────────────
const TRAITS = [
  {
    icon: <Cpu size={18} />,
    title: 'Systems Thinker',
    desc: 'Built multi-threaded C++ systems and protocol parsers from scratch. Understands what happens under the hood.',
    color: '#22d3ee', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.22)', glow: 'rgba(6,182,212,0.09)',
  },
  {
    icon: <Zap size={18} />,
    title: 'AI-Accelerated',
    desc: 'Pairs AI tooling with deep fundamentals to ship production systems at unprecedented velocity.',
    color: '#e879f9', bg: 'rgba(217,70,239,0.1)', border: 'rgba(217,70,239,0.22)', glow: 'rgba(217,70,239,0.09)',
  },
  {
    icon: <Shield size={18} />,
    title: 'Military Discipline',
    desc: '3 years IDF Navy software development. Mission-critical reliability is a default, not an option.',
    color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.22)', glow: 'rgba(16,185,129,0.09)',
  },
  {
    icon: <Layers size={18} />,
    title: 'Full-Stack',
    desc: 'From low-level C++ to React frontends, LangGraph agents to PostgreSQL — end-to-end ownership.',
    color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.22)', glow: 'rgba(245,158,11,0.09)',
  },
]

function TraitCard({ trait: t, delay, inView }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16, padding: '20px', position: 'relative', overflow: 'hidden',
        cursor: 'default',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? t.border : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(14px)',
        opacity: inView ? 1 : 0,
        transform: inView
          ? (hovered ? 'translateY(-4px)' : 'translateY(0)')
          : 'translateY(20px)',
        transition: !inView
          ? `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
          : 'transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.35), 0 0 48px ${t.glow}`
          : '0 2px 12px rgba(0,0,0,0.18)',
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 130, height: 130,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${t.glow.replace('0.09', '0.18')} 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 9, marginBottom: 14,
        background: t.bg, border: `1px solid ${hovered ? t.border : 'rgba(255,255,255,0.06)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.color,
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hovered ? `0 0 18px ${t.glow.replace('0.09', '0.3')}` : 'none',
      }}>
        {t.icon}
      </div>

      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem',
        color: '#e2e8f0', marginBottom: 8, letterSpacing: '-0.01em',
      }}>
        {t.title}
      </h3>
      <p style={{ fontSize: '0.78rem', lineHeight: 1.6, color: 'rgba(226,232,240,0.55)', margin: 0 }}>
        {t.desc}
      </p>
    </div>
  )
}

function About() {
  const [ref, inView] = useInView()
  return (
    <section id="about" ref={ref} style={{ padding: '80px 24px 60px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="about-grid">

          {/* Left col: text */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: 16 }}>About Me</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
              One Dev.<br />Full-Stack<br />
              <span className="text-gradient">AI-Powered.</span>
            </h2>
            <p style={{ lineHeight: 1.75, color: 'rgba(226,232,240,0.7)', marginBottom: 20, fontSize: '0.95rem' }}>
              I'm a 4th-semester Computer Science student at Ben-Gurion University, specializing in Data Science.
              But my foundation runs deeper than the classroom — I spent <strong style={{ color: '#e2e8f0' }}>3 years as an IDF Navy Software Developer</strong>, building
              simulation systems used to train hundreds of naval and submarine cadets every year.
            </p>
            <p style={{ lineHeight: 1.75, color: 'rgba(226,232,240,0.7)', marginBottom: 28, fontSize: '0.95rem' }}>
              I replaced an external vendor's solution with a Unity3D/C# simulator suite — saving the military
              <strong style={{ color: '#00d4ff' }}> ₪500,000/year</strong>. That's when I learned what production-grade, mission-critical software actually means.
            </p>
            {/* Military badge */}
            <div className="glass" style={{ borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={20} style={{ color: '#00d4ff' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e2e8f0' }}>IDF Navy Software Developer</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.5)', marginTop: 2 }}>2020 – 2023 · Unity3D / C# Simulation Systems</div>
              </div>
            </div>
            {/* Academic grades */}
            <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.3)', marginBottom: 10 }}>
              BGU Grades
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { course: 'Data Structures', grade: 98 },
                { course: 'Probability', grade: 93 },
                { course: 'Intro to CS', grade: 92 },
                { course: 'Systems Prog.', grade: 87 },
              ].map(g => (
                <div key={g.course} className="glass" style={{ borderRadius: 8, padding: '6px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.5)' }}>{g.course}</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '0.85rem', color: '#00d4ff' }}>{g.grade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right col: trait cards */}
          <div className="trait-grid">
            {TRAITS.map((t, i) => (
              <TraitCard key={i} trait={t} delay={i * 100 + 200} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TerminalPanel ───────────────────────────────────────────────────────────
function TerminalPanel({ title, subtitle, lines, bottomRef }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(5,8,16,0.9)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.15)', flexShrink: 0 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
        <span style={{ marginLeft: 6, fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{title}</span>
        <span style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: '#475569', marginLeft: 4 }}>{subtitle}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 10px 14px', fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: '0.64rem', lineHeight: 1.55, background: '#030a16' }}>
        {lines.map((line, idx) => {
          const isFrame = line.type === 'frame-in' || line.type === 'frame-err'
          if (isFrame) return (
            <pre key={idx} style={{
              color: line.type === 'frame-err' ? '#f87171' : '#c084fc',
              background: line.type === 'frame-err' ? 'rgba(248,113,113,0.07)' : 'rgba(192,132,252,0.07)',
              borderLeft: `2px solid ${line.type === 'frame-err' ? '#f87171' : '#c084fc'}`,
              borderRadius: '0 4px 4px 0', padding: '3px 7px', margin: '3px 0',
              fontSize: '0.61rem', lineHeight: 1.5, whiteSpace: 'pre', overflowX: 'auto', fontFamily: 'inherit'
            }}>{line.text}</pre>
          )
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', minHeight: '1.05rem' }}>
              <span style={{ color: LINE_COLORS[line.type] || '#94a3b8', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{line.text}</span>
              {idx === lines.length - 1 && !line.complete && (
                <span style={{ display: 'inline-block', width: 5, height: 12, marginLeft: 1, background: '#22d3ee', flexShrink: 0, marginTop: 1, animation: 'stompBlink 1s step-end infinite' }} />
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <style>{`@keyframes stompBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}

// ─── StompSection (full walkthrough, ForcePoint One Pager style) ─────────────
function StompSection() {
  const initMessi   = () => [{ type: 'info', text: 'StompWCIClient — messi',                   complete: true }, { type: 'output', text: 'Click a step button above to run a scenario →', complete: true }]
  const initRonaldo = () => [{ type: 'info', text: 'StompWCIClient — ronaldo',                 complete: true }, { type: 'output', text: 'Click a step button above to run a scenario →', complete: true }]
  const initServer  = () => [{ type: 'info', text: 'Java Reactor :7777  |  Python SQL :7778',  complete: true }, { type: 'output', text: 'Click a step button above to run a scenario →', complete: true }]

  const [activeStep,   setActiveStep]   = useState(null)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [messiLines,   setMessiLines]   = useState(initMessi)
  const [ronaldoLines, setRonaldoLines] = useState(initRonaldo)
  const [serverLines,  setServerLines]  = useState(initServer)

  const messiBot   = useRef(null)
  const ronaldoBot = useRef(null)
  const serverBot  = useRef(null)
  const tosRef     = useRef([])
  const eventsRef  = useRef([])

  useEffect(() => { const p = messiBot.current?.parentElement;   if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight }) }, [messiLines])
  useEffect(() => { const p = ronaldoBot.current?.parentElement; if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight }) }, [ronaldoLines])
  useEffect(() => { const p = serverBot.current?.parentElement;  if (p) requestAnimationFrame(() => { p.scrollTop = p.scrollHeight }) }, [serverLines])
  useEffect(() => () => { tosRef.current.forEach(clearTimeout) }, [])

  const stompStories = [
    {
      stepId: 'boot', badge: '01 / Architecture', headline: 'A Three-Tier Stack',
      body: [
        { label: 'Java Server (top tier):', text: 'Supports both Thread-Per-Client (TPC) — each connection owns a dedicated OS thread — and a non-blocking Reactor model where a selector loop dispatches I/O events to a bounded thread pool.' },
        { label: 'Python DB bridge (middle):', text: 'A Python server bridging raw TCP on port 7778, executing SQL queries on SQLite. Keeps the Java server fully stateless.' },
        { label: 'C++ Client (bottom tier):', text: 'Acting as the client-side STOMP 1.2 interface for channel subscription, event reporting, and summary generation.' },
      ],
      btnLabel: 'Boot the System →',
    },
    {
      stepId: 'login', badge: '02 / Concurrency', headline: 'Two-Thread Client Model',
      body: [
        { label: 'Keyboard thread:', text: 'Exclusively reads from stdin and writes outgoing STOMP frames to the socket. Never reads from the socket — ownership is strict.' },
        { label: 'Socket thread:', text: 'Exclusively listens on the socket and dispatches incoming frames to registered handlers. Owns the read side from login to teardown.' },
        { label: 'No shared I/O:', text: 'The two threads operate on disjoint halves of the socket — zero lock contention on the critical path.' },
      ],
      btnLabel: 'Connect Clients →',
    },
    {
      stepId: 'pubsub', badge: '03 / Protocol', headline: 'STOMP 1.2 from Scratch',
      body: [
        { label: 'Full frame lifecycle:', text: 'Implements the complete STOMP frame set — CONNECT, SUBSCRIBE, SEND, MESSAGE, DISCONNECT, RECEIPT, ERROR — across both client and server.' },
        { label: 'Client-generated IDs:', text: 'Subscription IDs and receipt IDs are generated uniquely by the client and tracked locally. The server echoes them back for O(1) client-side lookup.' },
        { label: 'Frame parsing:', text: 'Reads the raw socket stream, parses header:value pairs line by line, and extracts the body until the null-char (\\0) terminator.' },
      ],
      btnLabel: 'Subscribe & Report →',
    },
    {
      stepId: 'summary', badge: '04 / Data Structures', headline: 'Client-Side Aggregation',
      body: [
        { label: 'Event tracking:', text: 'Game events stored in a nested map keyed by channel name and reporting user. The server only persists raw frames — all aggregation logic lives on the client.' },
        { label: 'Chronological ordering:', text: 'Events stored and printed by occurrence time. A secondary sort on the event list by the time field produces the final output.' },
        { label: 'Lexicographical stats:', text: 'Stats aggregated locally and printed in lexicographical order — the data structure guarantees this without a post-sort step.' },
      ],
      btnLabel: 'Generate Summary →',
    },
    {
      stepId: 'logout', badge: '05 / Lifecycle', headline: 'Graceful Shutdown',
      body: [
        { label: 'DISCONNECT frame:', text: 'Client sends a DISCONNECT frame with a unique receipt ID before closing. Skipping this risks silently dropping bytes still queued in the kernel send buffer.' },
        { label: 'Server acknowledgment:', text: 'Client strictly waits for the matching RECEIPT frame before calling close(sockfd). The keyboard thread blocks on a condition variable until receipt is confirmed.' },
        { label: 'Zero message loss:', text: 'Per STOMP 1.2 RFC, a RECEIPT is cumulative — it acknowledges all preceding frames. Every SEND before the DISCONNECT is guaranteed to have been processed.' },
      ],
      btnLabel: 'Graceful Logout →',
    },
  ]

  function playScenario(id) {
    tosRef.current.forEach(clearTimeout)
    tosRef.current = []
    eventsRef.current = []
    setIsPlaying(true)
    setActiveStep(id)
    setMessiLines([{   type: 'info', text: 'bash — messi@stomp-client',               complete: true }])
    setRonaldoLines([{ type: 'info', text: 'bash — ronaldo@stomp-client',             complete: true }])
    setServerLines([{  type: 'info', text: 'Java Reactor :7777  |  Python SQL :7778', complete: true }])

    const tos = tosRef.current
    const T   = { messi: 200, ronaldo: 200, server: 200 }
    const set = { messi: setMessiLines, ronaldo: setRonaldoLines, server: setServerLines }

    function ln(panel, type, text, extra = 0) {
      T[panel] += extra
      const d = T[panel]
      tos.push(setTimeout(() => { set[panel](prev => [...prev, { type, text, complete: true }]) }, d))
      T[panel] += LINE_GAP
    }
    function cmd(panel, text, extra = 0) {
      T[panel] += extra
      const t0   = T[panel]
      const full = PROMPT + text
      tos.push(setTimeout(() => { set[panel](prev => [...prev, { type: 'cmd', text: '', complete: false }]) }, t0))
      for (let c = 1; c <= full.length; c++) {
        const partial = full.slice(0, c)
        const done    = c === full.length
        tos.push(setTimeout(() => {
          set[panel](prev => { const copy = [...prev]; copy[copy.length - 1] = { type: 'cmd', text: partial, complete: done }; return copy })
        }, t0 + c * CHAR_DELAY))
      }
      T[panel] = t0 + full.length * CHAR_DELAY + LINE_GAP
    }
    function atLeast(panel, t) { T[panel] = Math.max(T[panel], t) }

    if (id === 'boot') {
      ln('server', 'info',    '=== SPL STOMP System Start Sequence ===')
      cmd('server', 'rm -f stomp_server.db', 100)
      ln('server', 'success', '[Python] Stale database removed.')
      cmd('server', 'python3 sql_server.py 7778 &', 80)
      ln('server', 'output',  '[Python SQL :7778] Initialising schema: stomp_server.db')
      ln('server', 'success', '[Python SQL :7778] Listening on port 7778 — Ready ✓')
      cmd('server', 'mvn exec:java -Dexec.args="7777 reactor"', 200)
      ln('server', 'output',  '[INFO] Scanning for projects...')
      ln('server', 'output',  '[INFO] BUILD SUCCESS')
      ln('server', 'info',    '[Reactor] STOMP server up — port 7777  |  mode: REACTOR')
      ln('server', 'success', '[Reactor] Thread pool ready. Awaiting connections...')
      ln('messi',  'output',  '(server is up — ready to connect)')
      ln('ronaldo','output',  '(server is up — ready to connect)')
    }

    if (id === 'login') {
      ln('server', 'info', '[Reactor] Selector loop active — accepting connections...')
      cmd('messi', 'login 127.0.0.1:7777 messi pass123')
      const messiRefT = T.messi
      ln('messi', 'frame-in', buildFrame('SEND → CONNECT', ['accept-version:1.2', 'host:stomp.cs.bgu.ac.il', 'login:messi', 'passcode:pass123'], []))
      cmd('ronaldo', 'login 127.0.0.1:7777 ronaldo pass12', 200)
      ln('ronaldo', 'frame-in', buildFrame('SEND → CONNECT', ['accept-version:1.2', 'host:stomp.cs.bgu.ac.il', 'login:ronaldo', 'passcode:pass12'], []))
      atLeast('server', messiRefT - 100)
      ln('server', 'info',    '[Reactor] New connection → Thread-1 assigned to: messi')
      ln('server', 'info',    '[Thread-1] CONNECT messi ......... AUTH OK ✓')
      atLeast('messi', T.server)
      ln('messi', 'frame-in', buildFrame('RECV ← CONNECTED', ['version:1.2', 'session:sess-messi-4f8a2c'], []))
      ln('messi', 'success',  'Login successful — user: messi  |  session: 4f8a2c')
      ln('server', 'info',    '[Reactor] New connection → Thread-2 assigned to: ronaldo')
      ln('server', 'info',    '[Thread-2] CONNECT ronaldo ....... AUTH OK ✓')
      atLeast('ronaldo', T.server)
      ln('ronaldo', 'frame-in', buildFrame('RECV ← CONNECTED', ['version:1.2', 'session:sess-ronaldo-9d3b1a'], []))
      ln('ronaldo', 'success',  'Login successful — user: ronaldo  |  session: 9d3b1a')
    }

    if (id === 'pubsub') {
      ln('messi',   'success', 'CONNECTED — user: messi   |  session: 4f8a2c')
      ln('ronaldo', 'success', 'CONNECTED — user: ronaldo |  session: 9d3b1a')
      ln('server',  'info',    '[Thread-1] Client: messi   — authenticated ✓')
      ln('server',  'info',    '[Thread-2] Client: ronaldo — authenticated ✓')
      cmd('messi',   'join argentina_france', 150)
      ln('messi', 'frame-in', buildFrame('SEND → SUBSCRIBE', ['destination:/argentina_france', 'id:sub-0', 'receipt:r-001'], []))
      cmd('ronaldo', 'join argentina_france', 300)
      ln('ronaldo', 'frame-in', buildFrame('SEND → SUBSCRIBE', ['destination:/argentina_france', 'id:sub-0', 'receipt:r-001'], []))
      const subEnd = Math.max(T.messi, T.ronaldo) + 100
      atLeast('server', subEnd); atLeast('messi', subEnd); atLeast('ronaldo', subEnd)
      ln('server',  'info',    '[Thread-1] SUBSCRIBE /argentina_france  id:sub-0 (messi)')
      ln('server',  'info',    '[Thread-2] SUBSCRIBE /argentina_france  id:sub-0 (ronaldo)')
      ln('messi',   'success', 'Joined channel: argentina_france ✓')
      ln('ronaldo', 'success', 'Joined channel: argentina_france ✓')
      cmd('messi', 'report data/argentina_france_events.json', 300)
      ln('messi', 'output', `Parsing argentina_france_events.json — ${AF_EVENTS.length} events`)
      const eventMeta = [
        { hdr: ['event_name:kickoff', 'time:0', 'active:true'],             body: ['description: Argentina vs France — 2022 FIFA World Cup Final'] },
        { hdr: ['event_name:goal!!!!', 'time:2160', 'team_a goals:2'],      body: ['description: Di María fires Argentina ahead — 2:0!'] },
        { hdr: ['event_name:goal!!!!', 'time:4800', 'team_b goals:1'],      body: ['description: Mbappé converts penalty — 2:1'] },
        { hdr: ['event_name:goal!!!!', 'time:4860', 'team_b goals:2'],      body: ['description: Mbappé volleys in — 2:2. France level!'] },
      ]
      for (let i = 0; i < AF_EVENTS.length; i++) {
        const ev  = AF_EVENTS[i]
        const pad = '.'.repeat(Math.max(2, 22 - ev.time.length - ev.type.length))
        ln('messi', 'output', `  [${ev.time}]  ${ev.type} ${pad} publishing`)
        const publishedAt = T.messi - LINE_GAP
        atLeast('server', publishedAt + 60)
        ln('server', 'info',     `[Thread-1] SEND /argentina_france  event:${ev.type}`)
        ln('server', 'frame-in', buildFrame('SEND → server', ['destination:/argentina_france', 'user:messi', ...eventMeta[i].hdr], eventMeta[i].body))
        ln('server', 'sql',      `[Python SQL :7778] INSERT INTO events row ${i + 1} — channel:argentina_france`)
        const storedAt = T.server - LINE_GAP
        tos.push(setTimeout(() => { eventsRef.current.push(ev) }, storedAt))
        atLeast('ronaldo', T.server + 100)
        ln('ronaldo', 'frame-in', buildFrame('RECV ← MESSAGE', ['subscription:sub-0', `message-id:msg-${String(i + 1).padStart(3, '0')}`, 'destination:/argentina_france', ...eventMeta[i].hdr], eventMeta[i].body))
      }
      atLeast('messi', Math.max(T.messi, T.server))
      ln('server', 'sql',     '[Python SQL :7778] Committed. 4 rows — argentina_france')
      ln('server', 'success', '[Reactor] Broadcast complete — 1 subscriber (ronaldo) notified ✓')
      atLeast('messi', T.server - LINE_GAP)
      ln('messi', 'success', `All ${AF_EVENTS.length} events published to argentina_france ✓`)
    }

    if (id === 'summary') {
      ln('messi',   'success', 'CONNECTED — user: messi   |  subscribed: argentina_france')
      ln('ronaldo', 'success', 'CONNECTED — user: ronaldo |  subscribed: argentina_france')
      cmd('ronaldo', 'summary argentina_france messi file.txt', 400)
      ln('ronaldo', 'output', 'Requesting summary from server...')
      atLeast('server', T.ronaldo - LINE_GAP - 80)
      ln('server', 'info',    '[Thread-2] SUMMARY request — channel:argentina_france  user:messi')
      ln('server', 'sql',     "[Python SQL :7778] SELECT * FROM events WHERE channel='argentina_france' AND user='messi'")
      const evSrc = eventsRef.current.length > 0 ? eventsRef.current : AF_EVENTS
      ln('server', 'sql',     `[Python SQL :7778] Fetched ${evSrc.length} rows — computing stats...`)
      ln('server', 'success', '[Thread-2] SUMMARY payload → dispatching to ronaldo')
      atLeast('ronaldo', T.server + 100)
      for (const sl of [
        { type: 'info',    text: '─────────────────────────────────────────────────' },
        { type: 'output',  text: 'Argentina vs France' },
        { type: 'info',    text: 'General stats:' },
        { type: 'output',  text: '  active:          true' },
        { type: 'output',  text: '  before_halftime: 1 event' },
        { type: 'output',  text: '  total_goals:     4  (ARG 3, FRA 3 — penalties)' },
        { type: 'info',    text: 'Argentina stats:' },
        { type: 'output',  text: '  goals_scored:    3  (Messi ×2 pen, Di María ×1)' },
        { type: 'output',  text: '  possession:      55%' },
        { type: 'info',    text: 'France stats:' },
        { type: 'output',  text: '  goals_scored:    3  (Mbappé ×3)' },
        { type: 'output',  text: '  possession:      45%' },
        { type: 'info',    text: 'Game event reports (reporter: messi):' },
        { type: 'output',  text: '  0:00   kickoff  — Argentina vs France — 2022 FIFA World Cup Final' },
        { type: 'output',  text: '  36:00  goal!!!! — Di María fires Argentina ahead — 2:0!' },
        { type: 'output',  text: '  80:00  goal!!!! — Mbappé converts penalty — 2:1' },
        { type: 'output',  text: '  81:00  goal!!!! — Mbappé volleys in — 2:2. France level!' },
        { type: 'info',    text: '─────────────────────────────────────────────────' },
        { type: 'success', text: 'FINAL (AET): Argentina 3 — 3 France  |  ARG win on penalties ✓' },
      ]) ln('ronaldo', sl.type, sl.text)
      ln('ronaldo', 'success', 'Summary written → file.txt ✓')
    }

    if (id === 'logout') {
      ln('messi',   'success', 'CONNECTED — user: messi')
      ln('ronaldo', 'success', 'CONNECTED — user: ronaldo')
      ln('server',  'info',   '[Thread-1] messi   — active connection')
      ln('server',  'info',   '[Thread-2] ronaldo — active connection')
      cmd('messi', 'logout')
      ln('messi', 'frame-in', buildFrame('SEND → DISCONNECT', ['receipt:r-113'], []))
      ln('messi', 'output',   '[Keyboard thread] DISCONNECT sent — cv.wait() blocking...')
      atLeast('server', T.messi - LINE_GAP - 80)
      ln('server', 'info',    '[Thread-1] DISCONNECT messi → dispatching RECEIPT:r-113')
      atLeast('messi', T.server)
      ln('messi', 'frame-in', buildFrame('RECV ← RECEIPT', ['receipt-id:r-113'], []))
      ln('messi', 'success',  'RECEIPT received — receipt-id: r-113')
      ln('messi', 'output',   '[Socket thread]   receiptReceived = true → cv.notify_one()')
      ln('messi', 'output',   '[Keyboard thread] CV unblocked → close(sockfd)')
      ln('messi', 'success',  'Socket closed. Both threads joined cleanly. ✓')
      cmd('ronaldo', 'logout', 200)
      ln('ronaldo', 'frame-in', buildFrame('SEND → DISCONNECT', ['receipt:r-114'], []))
      ln('ronaldo', 'output',   '[Keyboard thread] DISCONNECT sent — cv.wait() blocking...')
      atLeast('server', T.ronaldo - LINE_GAP - 80)
      ln('server', 'info',    '[Thread-2] DISCONNECT ronaldo → dispatching RECEIPT:r-114')
      ln('server', 'output',  '[Reactor] All clients disconnected — selector loop idle.')
      atLeast('ronaldo', T.server)
      ln('ronaldo', 'frame-in', buildFrame('RECV ← RECEIPT', ['receipt-id:r-114'], []))
      ln('ronaldo', 'success',  'RECEIPT received — receipt-id: r-114')
      ln('ronaldo', 'output',   '[Socket thread]   receiptReceived = true → cv.notify_one()')
      ln('ronaldo', 'output',   '[Keyboard thread] CV unblocked → close(sockfd)')
      ln('ronaldo', 'success',  'Socket closed. Both threads joined cleanly. ✓')
    }

    const maxT = Math.max(T.messi, T.ronaldo, T.server) + 400
    tos.push(setTimeout(() => setIsPlaying(false), maxT))
  }

  return (
    <section id="stomp-demo" style={{ padding: '96px 0', background: 'rgba(5,8,16,0.95)', borderTop: '1px solid rgba(124,58,237,0.12)', borderBottom: '1px solid rgba(124,58,237,0.12)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* Section header */}
        <div style={{ marginBottom: 72, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', marginBottom: 20 }}>
            <Terminal size={12} style={{ color: '#a78bfa' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a78bfa' }}>Interactive Demo</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#e2e8f0', marginBottom: 14, lineHeight: 1.1 }}>
            C++ World Cup STOMP System
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(226,232,240,0.5)', maxWidth: 560, margin: '0 auto 10px' }}>
            STOMP 1.2 pub/sub over raw TCP — two-threaded C++ clients, Java Reactor server, Python/SQLite bridge.
          </p>
          <span style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.28)', fontFamily: 'monospace' }}>⚡ Simulated — all terminal output runs client-side in your browser</span>
        </div>

        {/* Split layout */}
        <div className="agent-grid">

          {/* Left: story cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {stompStories.map(s => (
              <div key={s.stepId} style={{
                borderRadius: 16, padding: '24px 26px',
                border: activeStep === s.stepId ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.07)',
                background: activeStep === s.stepId ? 'rgba(124,58,237,0.07)' : 'rgba(255,255,255,0.02)',
                transition: 'border-color 0.25s ease, background 0.25s ease'
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 10, opacity: 0.8 }}>{s.badge}</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.3 }}>{s.headline}</h3>
                {s.body.map((b, j) => (
                  <p key={j} style={{ fontSize: '0.82rem', lineHeight: 1.72, color: 'rgba(226,232,240,0.6)', marginBottom: j < s.body.length - 1 ? 10 : 0 }}>
                    <strong style={{ color: 'rgba(167,139,250,0.9)', fontWeight: 600 }}>{b.label}</strong>{' '}{b.text}
                  </p>
                ))}
                <button
                  onClick={() => playScenario(s.stepId)}
                  disabled={isPlaying && activeStep !== s.stepId}
                  style={{
                    marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '7px 16px', borderRadius: 8,
                    background: activeStep === s.stepId ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.08)',
                    border: activeStep === s.stepId ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(124,58,237,0.3)',
                    color: '#a78bfa', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    opacity: isPlaying && activeStep !== s.stepId ? 0.3 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isPlaying && activeStep === s.stepId
                    ? <><Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> Running…</>
                    : s.btnLabel
                  }
                </button>
              </div>
            ))}
          </div>

          {/* Right: sticky terminal panels */}
          <div style={{ position: 'sticky', top: 80, height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TerminalPanel title="messi" subtitle="— C++ client" lines={messiLines} bottomRef={messiBot} />
            <TerminalPanel title="ronaldo" subtitle="— C++ client" lines={ronaldoLines} bottomRef={ronaldoBot} />
            <TerminalPanel title="server" subtitle="— Java Reactor" lines={serverLines} bottomRef={serverBot} />
          </div>

        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </section>
  )
}

// ─── AgentSection (full walkthrough, ForcePoint One Pager style) ──────────────
function AgentSection() {
  const [companies, setCompanies] = useState(DEMO_COMPANIES)
  const [selectedDomain, setSelectedDomain] = useState('geula-surf.co.il')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [mobileTab, setMobileTab] = useState('walkthrough')

  const messagesEndRef = useRef(null)
  const pollTimerRef   = useRef(null)
  const sessionIds     = useRef({})
  const inputRef       = useRef(null)

  const getSessionId = (domain) => {
    if (!sessionIds.current[domain]) sessionIds.current[domain] = `portfolio_${domain}_${Date.now()}`
    return sessionIds.current[domain]
  }

  const selectedCompany = companies.find(c => c.domain === selectedDomain) ?? companies[0]

  // Backend warm-up: poll /health up to 3 times, then give up
  const startWarmup = useCallback(() => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
    setBackendStatus('checking')
    let attempts = 0
    const MAX_ATTEMPTS = 3
    const poll = async () => {
      attempts++
      try {
        const r = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(4500) })
        if (r.ok) { setBackendStatus('online'); return }
      } catch {}
      if (attempts >= MAX_ATTEMPTS) { setBackendStatus('offline'); return }
      pollTimerRef.current = setTimeout(poll, 5_000)
    }
    poll()
  }, [])

  useEffect(() => {
    startWarmup()
    return () => { if (pollTimerRef.current) clearTimeout(pollTimerRef.current) }
  }, [startWarmup])

  // Fetch company IDs once online
  useEffect(() => {
    if (backendStatus !== 'online') return
    fetch(`${API_URL}/api/v1/admin/companies`)
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        setCompanies(prev => prev.map(c => {
          const match = list.find(x => x.domain === c.domain)
          return match ? { ...c, id: match.id } : c
        }))
      })
      .catch(() => {})
  }, [backendStatus])

  // Auto-scroll
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement
    if (container) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight })
  }, [messages, sending])

  const sendMessage = useCallback(async (text, override) => {
    if (!text.trim() || sending) return
    setInputValue('')
    const companyId = override?.companyId ?? selectedCompany.id
    const domain    = override?.domain    ?? selectedDomain
    if (!companyId) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'system', content: 'Backend offline — start the server to continue.' }])
      return
    }
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text }])
    setSending(true)
    try {
      const resp = await fetch(`${API_URL}/api/v1/agent/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId, user_id: '1', session_id: getSessionId(domain), message: text, channel: 'demo' }),
      })
      if (resp.ok) {
        const data = await resp.json()
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: data.text, executionPath: data.execution_path, handoff: data.handoff }])
      } else throw new Error('non-ok')
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: `Connection error — could not reach ${API_URL}`, isError: true }])
    } finally {
      setSending(false)
    }
  }, [sending, selectedCompany, selectedDomain])

  const switchCompany = (domain) => {
    if (domain === selectedDomain) return
    const next = companies.find(c => c.domain === domain)
    if (!next) return
    setSelectedDomain(domain)
    setMessages([{ id: Date.now(), role: 'system', content: `Switched to ${next.label} (${next.type}) — new conversation` }])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue) }
  }

  // Rich message renderer — handles newlines, bullets, numbered lists, **bold**
  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} style={{ color: '#22d3ee', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    )
  }

  const renderContent = (text) => {
    const lines = text.split('\n')
    const out = []
    let bullets = []
    let numbered = []

    const flushBullets = (key) => {
      if (!bullets.length) return
      out.push(
        <ul key={`ul-${key}`} style={{ margin: '6px 0 6px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {bullets.map((b, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.83rem', lineHeight: 1.65, color: 'rgba(226,232,240,0.85)' }}>
              <span style={{ color: '#22d3ee', marginTop: 2, flexShrink: 0, fontSize: '0.7rem' }}>◆</span>
              <span>{renderInline(b)}</span>
            </li>
          ))}
        </ul>
      )
      bullets = []
    }

    const flushNumbered = (key) => {
      if (!numbered.length) return
      out.push(
        <ol key={`ol-${key}`} style={{ margin: '6px 0 6px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {numbered.map((n, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.83rem', lineHeight: 1.65, color: 'rgba(226,232,240,0.85)' }}>
              <span style={{ color: '#22d3ee', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.78rem', minWidth: 18, flexShrink: 0 }}>{j + 1}.</span>
              <span>{renderInline(n)}</span>
            </li>
          ))}
        </ol>
      )
      numbered = []
    }

    lines.forEach((raw, i) => {
      const line = raw.trimEnd()
      if (/^[-•*]\s+/.test(line)) {
        flushNumbered(i)
        bullets.push(line.replace(/^[-•*]\s+/, ''))
      } else if (/^\d+[.)]\s+/.test(line)) {
        flushBullets(i)
        numbered.push(line.replace(/^\d+[.)]\s+/, ''))
      } else if (line.trim() === '') {
        flushBullets(i); flushNumbered(i)
        if (out.length) out.push(<div key={`sp-${i}`} style={{ height: 6 }} />)
      } else {
        flushBullets(i); flushNumbered(i)
        out.push(<p key={`p-${i}`} style={{ margin: 0, fontSize: '0.83rem', lineHeight: 1.7, color: 'rgba(226,232,240,0.85)' }}>{renderInline(line)}</p>)
      }
    })
    flushBullets('end'); flushNumbered('end')
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{out}</div>
  }


  const agentStories = [
    {
      sectionId: 'architecture',
      badge: '01 / Architecture',
      headline: 'Multi-Tenant LangGraph Agent',
      body: [
        { label: 'One graph, many tenants:', text: 'Company configs — products, ICP, objection playbook, competitive map — hot-swap from a single DB row per tenant. Zero code changes, zero restarts.' },
        { label: 'FastAPI backend:', text: 'Python FastAPI exposes a REST API. The React frontend connects directly, sending company_id and session_id per request for full isolation.' },
      ],
      btnLabel: 'Ask About the Platform →',
      triggerDomain: 'scaleit.co.il',
      triggerMsg: 'What kind of companies use your platform and how does it work?',
    },
    {
      sectionId: 'routing',
      badge: '02 / Graph Routing',
      headline: 'Adaptive Conversation Strategy',
      body: [
        { label: 'Dynamic node selection:', text: 'Separate nodes handle qualification, objection handling, comparison, and closing. The graph picks the next node based on intent signals in real time.' },
        { label: 'Live execution trace:', text: 'Every reply includes the node execution path — visible as colored node badges below each bot message in this demo.' },
      ],
      btnLabel: 'See Graph Routing →',
      triggerDomain: 'geula-surf.co.il',
      triggerMsg: 'אני שוקל ללמוד לגלוש אבל לא בטוח מאיפה להתחיל',
    },
    {
      sectionId: 'handoff',
      badge: '03 / Handoff Guard',
      headline: 'Guardrails & Human Handoff',
      body: [
        { label: 'No hallucination:', text: 'Guardrails prevent price or availability invention. Any out-of-scope query routes to the handoff node instead of generating a plausible-but-wrong answer.' },
        { label: 'Intent-based handoff:', text: 'High-intent signals gracefully escalate to a human rep — flagged with a ⚡ HANDOFF badge in the UI.' },
      ],
      btnLabel: 'Trigger Handoff →',
      triggerDomain: 'scaleit.co.il',
      triggerMsg: "I'd like to speak with your sales team about enterprise pricing",
    },
    {
      sectionId: 'b2c',
      badge: '04 / Multi-Tenant Switch',
      headline: 'B2C Persona — Hebrew UX',
      body: [
        { label: 'Language-aware response:', text: 'The surf club tenant responds in Hebrew, adapts tone to a casual B2C audience, and understands local context — all from its company config.' },
        { label: 'Same graph, different persona:', text: 'Switching tenants requires only a different company_id. The same LangGraph graph handles both the B2B SaaS and the Hebrew surf club.' },
      ],
      btnLabel: 'Switch to Hebrew B2C →',
      triggerDomain: 'geula-surf.co.il',
      triggerMsg: 'כמה עולה מנוי חודשי?',
    },
  ]

  const handleTrigger = useCallback((story) => {
    if (story.triggerDomain && story.triggerDomain !== selectedDomain) {
      const next = companies.find(c => c.domain === story.triggerDomain)
      setSelectedDomain(story.triggerDomain)
      setMessages([{ id: Date.now(), role: 'system', content: `Switched to ${next?.label ?? story.triggerDomain} — new conversation` }])
      setTimeout(() => {
        sendMessage(story.triggerMsg, { domain: story.triggerDomain, companyId: next?.id })
      }, 300)
    } else {
      sendMessage(story.triggerMsg)
    }
  }, [selectedDomain, companies, sendMessage])

  return (
    <section id="agent-demo" style={{ padding: '96px 0', background: 'rgba(3,6,14,0.7)', borderTop: '1px solid rgba(0,212,255,0.1)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* Section header */}
        <div style={{ marginBottom: 72, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', marginBottom: 20 }}>
            <Bot size={12} style={{ color: '#00d4ff' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00d4ff' }}>Live Demo</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#e2e8f0', marginBottom: 14, lineHeight: 1.1 }}>
            LangGraph AI Sales Bot
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(226,232,240,0.5)', maxWidth: 560, margin: '0 auto 10px' }}>
            Multi-tenant LangGraph agent — 5.6× faster lead qualification, adaptive strategies, live execution traces.
          </p>
          <span style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.28)', fontFamily: 'monospace' }}>
            {backendStatus === 'checking' && '⏳ Backend warming up…'}
            {backendStatus === 'online' && `✓ Backend online — ${API_URL}`}
            {backendStatus === 'offline' && `⚠ Backend offline — ${API_URL}`}
          </span>
        </div>

        {/* Mobile tab bar */}
        <div className="agent-mobile-tabs">
          <button className={`agent-mobile-tab${mobileTab === 'walkthrough' ? ' active' : ''}`} onClick={() => setMobileTab('walkthrough')}>
            📋 Walkthrough
          </button>
          <button className={`agent-mobile-tab${mobileTab === 'chat' ? ' active' : ''}`} onClick={() => { setMobileTab('chat'); setTimeout(() => inputRef.current?.focus(), 150) }}>
            💬 Chat with Agent
          </button>
        </div>

        {/* Split layout */}
        <div className="agent-grid">

          {/* Left: story cards */}
          <div style={{ display: mobileTab !== 'walkthrough' ? 'none' : 'flex', flexDirection: 'column', gap: 24 }}>
            {agentStories.map(s => (
              <div key={s.sectionId} style={{
                borderRadius: 16, padding: '24px 26px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'border-color 0.25s ease, background 0.25s ease'
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: 10, opacity: 0.8 }}>{s.badge}</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.3 }}>{s.headline}</h3>
                {s.body.map((b, j) => (
                  <p key={j} style={{ fontSize: '0.82rem', lineHeight: 1.72, color: 'rgba(226,232,240,0.6)', marginBottom: j < s.body.length - 1 ? 10 : 0 }}>
                    <strong style={{ color: 'rgba(0,212,255,0.85)', fontWeight: 600 }}>{b.label}</strong>{' '}{b.text}
                  </p>
                ))}
                <button
                  onClick={() => handleTrigger(s)}
                  disabled={backendStatus !== 'online' || sending}
                  style={{
                    marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '7px 16px', borderRadius: 8,
                    background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)',
                    color: '#00d4ff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    opacity: backendStatus !== 'online' || sending ? 0.35 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {s.btnLabel}
                </button>
              </div>
            ))}
          </div>

          {/* Right: sticky chat pane */}
          <div className={`agent-chat-pane${mobileTab !== 'chat' ? ' agent-tab-hidden' : ' agent-chat-fullscreen'}`} style={{ position: 'sticky', top: 80, height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', background: 'rgba(8,12,24,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 16, overflow: 'hidden' }}>

            {/* Company tabs + status */}
            <div style={{ display: 'flex', gap: 8, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Mobile back to walkthrough */}
                <button className="agent-chat-back" onClick={() => setMobileTab('walkthrough')}>
                  <ChevronLeft size={16} />
                </button>
                {companies.map(c => (
                  <button key={c.domain} onClick={() => switchCompany(c.domain)}
                    style={{
                      padding: '5px 14px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      border: selectedDomain === c.domain ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedDomain === c.domain ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                      color: selectedDomain === c.domain ? '#00d4ff' : 'rgba(226,232,240,0.5)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {c.label}
                    <span style={{ marginLeft: 6, fontSize: '0.62rem', opacity: 0.6, fontFamily: 'monospace' }}>{c.type}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.68rem', fontFamily: 'monospace', flexShrink: 0 }}>
                {backendStatus === 'checking' && <><Loader2 size={10} style={{ color: '#94a3b8', animation: 'spin 1s linear infinite' }} /><span style={{ color: '#94a3b8' }}>connecting</span></>}
                {backendStatus === 'online'   && <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} /><span style={{ color: '#4ade80' }}>online</span></>}
                {backendStatus === 'offline'  && <><WifiOff size={10} style={{ color: '#f87171' }} /><span style={{ color: '#f87171' }}>offline</span></>}
              </div>
            </div>

            {/* Chat body */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {backendStatus === 'checking' && messages.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, color: 'rgba(226,232,240,0.4)' }}>
                  <Loader2 size={26} style={{ animation: 'spin 1s linear infinite', color: '#00d4ff' }} />
                  <div style={{ fontSize: '0.82rem', textAlign: 'center' }}>
                    Warming up the backend…<br />
                    <span style={{ fontSize: '0.73rem', opacity: 0.6 }}>May take up to 60s on cold start</span>
                  </div>
                </div>
              )}
              {backendStatus === 'offline' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(248,113,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WifiOff size={22} style={{ color: '#f87171' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 6, fontSize: '0.9rem' }}>Backend Offline</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.45)', marginBottom: 14, fontFamily: 'monospace' }}>
                      {API_URL}
                    </div>
                    <button onClick={startWarmup} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 8, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                      <RefreshCw size={12} /> Retry
                    </button>
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'system' && (
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '0.7rem', color: 'rgba(226,232,240,0.35)', fontFamily: 'monospace', padding: '4px 0' }}>{msg.content}</div>
                  )}
                  {msg.role === 'user' && (
                    <div dir="auto" style={{ maxWidth: '72%', background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', fontSize: '0.83rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                      {msg.content}
                    </div>
                  )}
                  {msg.role === 'bot' && (
                    <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div dir="auto" style={{ background: msg.isError ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${msg.isError ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: '0.83rem', color: 'rgba(226,232,240,0.85)', lineHeight: 1.7 }}>
                        {renderContent(msg.content)}
                      </div>
                      {msg.handoff && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)', fontSize: '0.65rem', fontWeight: 700, color: '#fb923c', letterSpacing: '0.05em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                          ⚡ HANDOFF
                        </div>
                      )}
                      {msg.executionPath && msg.executionPath.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {msg.executionPath.map((node, i) => (
                            <span key={i} style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(129,140,248,0.6)', background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 4, padding: '1px 7px' }}>{node}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px 16px 16px 4px', padding: '12px 18px', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', opacity: 0.5, animation: `botDot 1.2s ${i * 0.2}s ease-in-out infinite alternate` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              <style>{`@keyframes botDot { from{opacity:0.2;transform:translateY(2px)} to{opacity:0.8;transform:translateY(-2px)} }`}</style>
            </div>

            {/* Preset messages */}
            {backendStatus === 'online' && (
              <div className="agent-preset-row" style={{ display: 'flex', gap: 6, padding: '10px 20px 0', flexWrap: 'wrap', flexShrink: 0 }}>
                {(PRESET_MESSAGES[selectedDomain] || []).map((msg, i) => (
                  <button key={i} dir="auto" onClick={() => sendMessage(msg)} disabled={sending}
                    style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.71rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(226,232,240,0.55)', transition: 'all 0.2s ease', opacity: sending ? 0.4 : 1 }}
                    onMouseEnter={e => { if (!sending) { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.color = '#00d4ff' } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(226,232,240,0.55)' }}
                  >{msg}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ display: 'flex', gap: 10, padding: '12px 20px 16px', flexShrink: 0 }}>
              <input
                ref={inputRef}
                dir={selectedDomain === 'geula-surf.co.il' ? 'rtl' : 'auto'}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={backendStatus !== 'online' || sending}
                placeholder={
                  backendStatus !== 'online'
                    ? (backendStatus === 'checking' ? 'Waiting for backend…' : 'Backend offline')
                    : selectedDomain === 'geula-surf.co.il'
                      ? `כתוב הודעה ל${selectedCompany?.label ?? ''}…`
                      : `Message ${selectedCompany?.label ?? ''}…`
                }
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: '0.83rem',
                  outline: 'none', fontFamily: 'inherit',
                  opacity: backendStatus !== 'online' ? 0.5 : 1,
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={backendStatus !== 'online' || sending || !inputValue.trim()}
                style={{
                  width: 42, height: 42, borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: sending || !inputValue.trim() ? 'rgba(0,212,255,0.06)' : 'rgba(0,212,255,0.14)',
                  color: '#00d4ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s ease', flexShrink: 0,
                  opacity: backendStatus !== 'online' ? 0.4 : 1
                }}
              >
                {sending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
              </button>
            </div>
          </div>

        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </section>
  )
}


// ─── Project Card ────────────────────────────────────────────────────────────
function ProjectCard({ project, delay = 0, inView, onDemo }) {
  const [hovered, setHovered] = useState(false)
  const [btnHov,  setBtnHov]  = useState(false)
  const accent       = project.accentColor  || '#00d4ff'
  const accentBg     = project.accentBg     || 'rgba(0,212,255,0.1)'
  const accentHover  = project.accentHoverBg || 'rgba(0,212,255,0.18)'
  const accentBorder = project.accentBorder || 'rgba(0,212,255,0.25)'
  const isLive = !!project.demo

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, padding: '28px',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? 'translateY(-5px)' : 'translateY(0)') : 'translateY(28px)',
        transition: !inView
          ? `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`
          : `opacity 0.65s ease ${delay}ms, transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease, background 0.28s ease`,
        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? accentBorder : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(16px)',
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${project.glowColor || 'rgba(0,212,255,0.06)'}`
          : '0 4px 24px rgba(0,0,0,0.24)',
      }}
    >
      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;box-shadow:0 0 6px rgba(16,185,129,0.9)} 50%{opacity:0.5;box-shadow:0 0 14px rgba(16,185,129,0.4)} }
        @keyframes termCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes demoPing { 75%,100%{transform:scale(1.55);opacity:0} }
      `}</style>

      {/* Ambient glow top-right */}
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%',
        background: `radial-gradient(circle, ${project.glowColor || 'rgba(0,212,255,0.1)'} 0%, transparent 68%)`,
        pointerEvents: 'none', opacity: hovered ? 1.4 : 0.8, transition: 'opacity 0.4s ease',
      }} />

      {/* ── 1. LIVE Pulse Badge ── */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px 4px 8px', borderRadius: 999,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.28)',
          backdropFilter: 'blur(12px)',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: '#10b981',
            animation: 'livePulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em', color: '#10b981', textTransform: 'uppercase' }}>Live</span>
        </div>
      )}

      {/* ── Row 1: Icon + Flex Metric Badge ───────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `linear-gradient(135deg, ${accentBg}, rgba(0,0,0,0.1))`,
          border: `1px solid ${accentBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0,
          boxShadow: hovered ? `0 0 20px ${project.glowColor || 'rgba(0,212,255,0.12)'}` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}>
          {project.icon}
        </div>

        {/* Flex Metric Badge */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
          padding: '7px 12px', borderRadius: 11,
          background: `linear-gradient(135deg, ${accentBg}, rgba(0,0,0,0))`,
          border: `1px solid ${accentBorder}`,
          boxShadow: `0 0 18px ${project.glowColor || 'rgba(0,212,255,0.05)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>{project.flexMetric.emoji}</span>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
              fontSize: '0.9rem', color: accent, letterSpacing: '-0.02em', lineHeight: 1,
            }}>{project.flexMetric.value}</span>
          </div>
          {project.flexMetric.sub && (
            <span style={{ fontSize: '0.59rem', color: 'rgba(226,232,240,0.38)', fontFamily: 'monospace', lineHeight: 1 }}>
              {project.flexMetric.sub}
            </span>
          )}
        </div>
      </div>

      {/* Category */}
      <div style={{
        fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: accent, marginBottom: 7, opacity: 0.75,
      }}>
        {project.category}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.15rem',
        color: '#e2e8f0', letterSpacing: '-0.025em', marginBottom: 9, lineHeight: 1.2,
      }}>
        {project.title}
      </h3>

      {/* Hook */}
      <p style={{
        fontSize: '0.83rem', lineHeight: 1.6, color: 'rgba(226,232,240,0.52)', marginBottom: isLive ? 14 : 20,
      }}>
        {project.hook}
      </p>

      {/* ── 2. Terminal Teaser (live cards only) ── */}
      {isLive && (
        <div style={{
          marginBottom: 18, borderRadius: 10,
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          {/* Window chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
            {['#ff5f57','#ffbd2e','#28c840'].map(c => (
              <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
            <span style={{ marginLeft: 6, fontSize: '0.58rem', color: 'rgba(226,232,240,0.25)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {project.demo === 'agent' ? 'agent-sales-bot — bash' : 'stomp-client — bash'}
            </span>
          </div>
          {/* Terminal lines */}
          <div style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {project.demo === 'agent' ? <>
              <div><span style={{ color: 'rgba(148,163,184,0.4)' }}>$ </span><span style={{ color: 'rgba(148,163,184,0.6)' }}>langgraph run --tenant geula-surf</span></div>
              <div><span style={{ color: 'rgba(148,163,184,0.4)' }}>{'>'} </span><span style={{ color: accent }}>Loading tenant config...</span></div>
              <div><span style={{ color: 'rgba(148,163,184,0.4)' }}>{'>'} </span><span style={{ color: '#e2e8f0' }}>Initializing Agent... </span><span style={{ color: '#10b981', fontWeight: 700 }}>[Ready]</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <span style={{ color: 'rgba(148,163,184,0.4)' }}>{'>'} </span>
                <span style={{ display: 'inline-block', width: 7, height: 13, background: accent, marginLeft: 1, opacity: 0.9, animation: 'termCursor 1s step-end infinite' }} />
              </div>
            </> : <>
              <div><span style={{ color: 'rgba(148,163,184,0.4)' }}>$ </span><span style={{ color: 'rgba(148,163,184,0.6)' }}>./stomp-client --host localhost --port 8080</span></div>
              <div><span style={{ color: 'rgba(148,163,184,0.4)' }}>{'>'} </span><span style={{ color: accent }}>TCP Connect → PORT 8080... </span><span style={{ color: '#10b981', fontWeight: 700 }}>[ESTABLISHED]</span></div>
              <div><span style={{ color: 'rgba(148,163,184,0.4)' }}>{'>'} </span><span style={{ color: '#e2e8f0' }}>SUBSCRIBE /topic/matches </span><span style={{ color: '#a855f7' }}>✓</span></div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'rgba(148,163,184,0.4)' }}>{'>'} </span>
                <span style={{ display: 'inline-block', width: 7, height: 13, background: accent, marginLeft: 1, opacity: 0.9, animation: 'termCursor 1s step-end infinite' }} />
              </div>
            </>}
          </div>
        </div>
      )}

      {/* ── Bullets ───────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22, flexGrow: 1 }}>
        {project.bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, flexShrink: 0,
              background: accentBg,
              border: `1px solid ${accentBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
            }}>
              {b.icon}
            </div>
            <span style={{ fontSize: '0.81rem', lineHeight: 1.58, color: 'rgba(226,232,240,0.7)', paddingTop: 4 }}>
              {b.text}
            </span>
          </div>
        ))}
      </div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 18 }} />

      {/* ── Tags ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20 }}>
        {project.tags.map(tag => (
          <span key={tag} style={{
            fontSize: '0.67rem', fontWeight: 600, color: 'rgba(226,232,240,0.48)',
            padding: '3px 9px', borderRadius: 5,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
          }}>{tag}</span>
        ))}
      </div>

      {/* ── CTAs ──────────────────────────────────────────── */}
      {(project.links?.length > 0 || onDemo) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {onDemo && (
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              {/* ── 3. Ping ring ── */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 10,
                background: 'rgba(16,185,129,0.3)',
                animation: 'demoPing 2.2s cubic-bezier(0,0,0.2,1) infinite',
                pointerEvents: 'none',
              }} />
              <button
                onClick={onDemo}
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                style={{
                  position: 'relative', zIndex: 1,
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 18px', borderRadius: 10,
                  background: btnHov
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(16,185,129,0.14))'
                    : 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.08))',
                  border: `1px solid ${btnHov ? 'rgba(16,185,129,0.6)' : 'rgba(16,185,129,0.35)'}`,
                  fontSize: '0.8rem', fontWeight: 700, color: '#10b981',
                  cursor: 'pointer', letterSpacing: '0.01em',
                  boxShadow: btnHov ? '0 0 24px rgba(16,185,129,0.35), 0 4px 16px rgba(0,0,0,0.4)' : '0 0 12px rgba(16,185,129,0.15)',
                  transform: btnHov ? 'translateY(-1px)' : 'none',
                  transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease, transform 0.2s ease',
                }}
              >
                <Zap size={13} style={{ flexShrink: 0 }} /> Launch Demo →
              </button>
            </div>
          )}
          {project.links && project.links.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.78rem', fontWeight: 600, color: 'rgba(226,232,240,0.7)',
                textDecoration: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = accentBg
                e.currentTarget.style.borderColor = accentBorder
                e.currentTarget.style.color = accent
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(226,232,240,0.7)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {link.icon || <ExternalLink size={13} />} {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Projects ────────────────────────────────────────────────────────────────
function Projects() {
  const [ref, inView] = useInView()
  const navigate = useNavigate()
  const projects = [
    {
      icon: <Sparkles size={20} />,
      title: 'LangGraph AI Sales Bot',
      category: 'AI / Agents',
      accentColor: '#00d4ff',
      accentBg: 'rgba(0,212,255,0.1)',
      accentHoverBg: 'rgba(0,212,255,0.18)',
      accentBorder: 'rgba(0,212,255,0.25)',
      glowColor: 'rgba(0,212,255,0.12)',
      flexMetric: { emoji: '🏢', value: 'Multi-Tenant', sub: '1 agent · N companies' },
      hook: 'Multi-tenant LangGraph agent for autonomous B2B/B2C lead qualification.',
      bullets: [
        { icon: <GitBranch size={14} />, text: 'Adapts conversation strategy in real-time via dynamic graph routing' },
        { icon: <Zap size={14} />, text: 'Zero-restart config hot-swap — entire tenant profile from one DB row' },
        { icon: <Shield size={14} />, text: 'Full guardrails block LLM hallucination on price & availability' },
      ],
      tags: ['LangGraph', 'FastAPI', 'Python', 'OpenAI GPT-4o', 'React', 'SQLite'],
      links: [{ label: 'GitHub', href: 'https://github.com/omerzilber1403/agent-sales-bot', icon: <Github size={13} /> }],
      demo: 'agent',
    },
    {
      icon: <Terminal size={20} />,
      title: 'C++ World Cup STOMP System',
      category: 'Low-Level / Systems',
      accentColor: '#a78bfa',
      accentBg: 'rgba(124,58,237,0.12)',
      accentHoverBg: 'rgba(124,58,237,0.22)',
      accentBorder: 'rgba(124,58,237,0.3)',
      glowColor: 'rgba(124,58,237,0.12)',
      flexMetric: { emoji: '⏱️', value: '2-Day Delivery', sub: 'vs. 3–4 week norm' },
      hook: 'Real-time pub/sub event system built from scratch over raw TCP, STOMP 1.2.',
      bullets: [
        { icon: <Cpu size={14} />, text: 'Two-threaded C++ client — strict I/O ownership, zero lock contention' },
        { icon: <Layers size={14} />, text: 'Java Reactor server + Python/SQLite bridge — full 3-tier stack' },
        { icon: <Zap size={14} />, text: 'Delivered thread-safe & protocol-correct via AI pair programming' },
      ],
      tags: ['C++', 'Java', 'Multi-threading', 'Reactor Pattern', 'STOMP 1.2', 'TCP'],
      links: [{ label: 'GitHub', href: 'https://github.com/omerzilber1403/assignment3-world-cup', icon: <Github size={13} /> }],
      demo: 'stomp',
    },
    {
      icon: <Globe size={20} />,
      title: 'Web & AI Agency',
      category: 'Freelance / Production',
      accentColor: '#4ade80',
      accentBg: 'rgba(34,197,94,0.08)',
      accentHoverBg: 'rgba(34,197,94,0.16)',
      accentBorder: 'rgba(34,197,94,0.2)',
      glowColor: 'rgba(34,197,94,0.08)',
      flexMetric: { emoji: '🚀', value: 'End-to-End', sub: 'Discovery → Deploy' },
      hook: 'Production-grade systems for real clients across multiple industries.',
      bullets: [
        { icon: <Layers size={14} />, text: 'Full lifecycle ownership — discovery, architecture, dev, and deploy' },
        { icon: <Bot size={14} />, text: 'AI-powered B2B SaaS platforms to artisan brand sites' },
        { icon: <Star size={14} />, text: 'Built to last, not just to demo — real users, real scale' },
      ],
      tags: ['React', 'Next.js', 'Node.js', 'AI Integration', 'Tailwind', 'Vercel'],
      links: [
        { label: 'ScaleIt AI', href: 'https://scaleit-ai.com' },
        { label: 'Ziv Edits', href: 'https://z-i-v-edits.netlify.app' },
        { label: 'Inbar Metal', href: 'https://inbarmetal.com' },
      ],
    },
    {
      icon: <Box size={20} />,
      title: '"Existence Test" Study App',
      category: 'Open Source / PWA',
      accentColor: '#fb923c',
      accentBg: 'rgba(251,146,60,0.08)',
      accentHoverBg: 'rgba(251,146,60,0.18)',
      accentBorder: 'rgba(251,146,60,0.2)',
      glowColor: 'rgba(251,146,60,0.08)',
      flexMetric: { emoji: '📚', value: '400+ Questions', sub: 'Recycled exam bank' },
      hook: "Interactive flashcard & quiz PWA that became the cohort's go-to study tool.",
      bullets: [
        { icon: <Code2 size={14} />, text: 'Scraped & formatted 400+ recycled BGU exam questions into structured Q&A' },
        { icon: <Star size={14} />, text: 'Shared pre-exam — adopted by the entire cohort within days' },
        { icon: <Box size={14} />, text: 'PWA — works offline, no install required, full mobile support' },
      ],
      tags: ['React', 'TypeScript', 'PWA', 'Netlify'],
      links: [{ label: 'Live App', href: 'https://existnece-test.netlify.app' }],
    },
  ]

  return (
      <section id="projects" ref={ref} style={{ padding: '64px 24px 80px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ marginBottom: 56, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: 14 }}>Selected Work</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: 560, lineHeight: 1.1 }}>
              Systems Built.<br />Problems Solved.
            </h2>
          </div>

          <div className="projects-grid">
            {projects.map((p, i) => (
              <ProjectCard
                key={i}
                project={p}
                delay={i * 120}
                inView={inView}
                onDemo={p.demo === 'stomp' ? () => navigate('/projects/stomp') : p.demo === 'agent' ? () => navigate('/projects/agent') : undefined}
              />
            ))}
          </div>
        </div>
      </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
const CONTACT_LINKS = [
  {
    icon: <Mail size={22} />, label: 'Email', value: 'omerzilber1403@gmail.com',
    href: 'mailto:omerzilber1403@gmail.com', color: '#22d3ee', glow: 'rgba(34,211,238,0.18)',
  },
  {
    icon: <Linkedin size={22} />, label: 'LinkedIn', value: 'omer-zilbershtein',
    href: 'https://www.linkedin.com/in/omer-zilbershtein/', color: '#818cf8', glow: 'rgba(129,140,248,0.18)',
  },
  {
    icon: <Github size={22} />, label: 'GitHub', value: 'omerzilber1403',
    href: 'https://github.com/omerzilber1403', color: '#a78bfa', glow: 'rgba(167,139,250,0.18)',
  },
]

function ContactCard({ c, delay }) {
  const [hov, setHov] = useState(false)
  return (
    <a href={c.href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 14, padding: '32px 24px', borderRadius: 20, textDecoration: 'none',
        background: hov ? `rgba(255,255,255,0.05)` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hov ? c.color + '55' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hov ? `0 0 48px ${c.glow}, 0 12px 40px rgba(0,0,0,0.5)` : '0 4px 24px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(16px)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov ? `${c.color}22` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hov ? c.color + '44' : 'rgba(255,255,255,0.08)'}`,
        color: hov ? c.color : 'rgba(226,232,240,0.5)',
        transform: hov ? 'scale(1.1)' : 'scale(1)',
        transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>{c.icon}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.35)', marginBottom: 5 }}>{c.label}</div>
        <div style={{ fontSize: '0.88rem', fontWeight: 500, color: hov ? c.color : 'rgba(226,232,240,0.7)', transition: 'color 0.25s ease', wordBreak: 'break-all' }}>{c.value}</div>
      </div>
    </a>
  )
}

function Contact() {
  const [ref, inView] = useInView()
  return (
    <section id="contact" ref={ref} style={{ padding: 'clamp(80px,10vh,120px) clamp(20px,5vw,48px)', position: 'relative', overflow: 'hidden' }}>
      {/* ambient glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* eyebrow */}
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
          padding: '5px 14px', borderRadius: 999,
          background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 7px rgba(34,197,94,0.9)' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(226,232,240,0.55)', letterSpacing: '0.06em' }}>OPEN TO OPPORTUNITIES</span>
        </div>

        {/* headline */}
        <h2 style={{
          opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900,
          fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 20,
        }}>
          <span className="text-gradient">Let's Build</span>{' '}
          <span style={{ color: '#e2e8f0' }}>Something.</span>
        </h2>

        {/* sub */}
        <p style={{
          opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          fontSize: '1rem', lineHeight: 1.75, color: 'rgba(226,232,240,0.5)', maxWidth: 520, margin: '0 auto 52px',
        }}>
          Open to student internships, freelance projects, and interesting engineering problems. Reach out — I reply within a day.
        </p>

        {/* cards */}
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)',
          transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
          display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center',
        }}>
          {CONTACT_LINKS.map((c, i) => <ContactCard key={c.label} c={c} delay={i * 60} />)}
        </div>

        {/* divider */}
        <div style={{ marginTop: 72, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            OZ<span style={{ color: '#00d4ff' }}>.</span>
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.22)' }}>© {new Date().getFullYear()} Omer Zilbershtein · Built with React + Tailwind CSS</span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.22)' }}>+972-54-697-0612</span>
        </div>
      </div>
    </section>
  )
}

// ─── Demo Page Wrapper ───────────────────────────────────────────────────────
function DemoPageWrapper({ children, title }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#050810' }}>
      <BackgroundOrbs />
      {/* Topbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 16,
      }}>
        <Link to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(226,232,240,0.6)', fontSize: '0.78rem', fontWeight: 500,
            textDecoration: 'none', transition: 'background 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#e2e8f0' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(226,232,240,0.6)' }}
        >
          ← Portfolio
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: 'rgba(226,232,240,0.75)' }}>
          {title}
        </span>
      </div>
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 56 }}>
        {children}
      </main>
    </div>
  )
}

function StompPage() {
  return (
    <DemoPageWrapper title="C++ World Cup STOMP System — Interactive Demo">
      <StompSection />
    </DemoPageWrapper>
  )
}

function AgentPage() {
  return (
    <DemoPageWrapper title="LangGraph AI Sales Bot — Interactive Demo">
      <AgentSection />
    </DemoPageWrapper>
  )
}

// ─── Portfolio Page ───────────────────────────────────────────────────────────
function PortfolioPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#050810', overflowX: 'hidden' }}>
      <BackgroundOrbs />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, overflowX: 'hidden' }}>
        <Hero />
        <TechStack />
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/projects/stomp" element={<StompPage />} />
        <Route path="/projects/agent" element={<AgentPage />} />
      </Routes>
    </>
  )
}
