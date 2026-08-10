'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check, Mail, Menu, X, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { defaultProfile, defaultProjects, defaultSocials, type Profile, type Project, type Social } from '@/lib/data'

const STORE = 'ishan-portfolio-v1'

type Store = { profile: Profile; projects: Project[]; socials: Social[] }

function usePortfolioStore() {
  const [data, setData] = useState<Store>({ profile: defaultProfile, projects: defaultProjects, socials: defaultSocials })
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE)
      if (raw) setData(JSON.parse(raw))
    } catch {}
  }, [])
  return data
}

function IconFor({ id }: { id: string }) {
  if (id === 'github') return <Mail size={18} />
  if (id === 'linkedin') return <Mail size={18} />
  return <Mail size={18} />
}

export default function Portfolio() {
  const { profile, projects, socials } = usePortfolioStore()
  const [menu, setMenu] = useState(false)
  const socialsMap = Object.fromEntries(socials.map(s => [s.id, s]))

  return (
    <main className="noise min-h-screen overflow-hidden">
      <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#f5f5f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="#top" className="font-display text-2xl font-bold">IT<span className="text-[#8cae28]">.</span></Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#work">Work</a><a href="#about">About</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
            <Link href="/dashboard" className="rounded-full bg-black px-4 py-2 text-white transition hover:-translate-y-0.5">Dashboard</Link>
          </nav>
          <button onClick={() => setMenu(!menu)} className="md:hidden" aria-label="Toggle menu">{menu ? <X/> : <Menu/>}</button>
        </div>
        {menu && <div className="border-t border-black/10 px-5 py-5 md:hidden"><div className="flex flex-col gap-5 font-semibold"><a onClick={() => setMenu(false)} href="#work">Work</a><a onClick={() => setMenu(false)} href="#about">About</a><a onClick={() => setMenu(false)} href="#experience">Experience</a><a onClick={() => setMenu(false)} href="#contact">Contact</a><Link href="/dashboard">Dashboard →</Link></div></div>}
      </header>

      <section id="top" className="grid-bg mx-auto max-w-7xl px-5 pb-20 pt-32 md:px-8 md:pt-40">
        <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_.6fr]">
          <div className="reveal">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[.18em]"><span className="h-2 w-2 rounded-full bg-[#a9dc35]"/> {profile.availability}</div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[.2em] text-neutral-500">{profile.role} · India</p>
            <h1 className="font-display max-w-5xl text-[clamp(4.5rem,12vw,10.5rem)] font-bold leading-[.78]">Building <span className="italic">useful</span> digital things.</h1>
          </div>
          <div className="reveal flex flex-col gap-6 lg:pb-3" style={{ animationDelay: '.12s' }}>
            <p className="max-w-md text-lg leading-8 text-neutral-600">{profile.bio}</p>
            <div className="flex flex-wrap gap-3"><a href="/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black px-6 py-3 text-sm font-bold"><FileText size={17}/> Resume</a><a href="#work" className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:translate-y-[-2px]">View selected work <ArrowUpRight size={17}/></a><a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full border border-black px-6 py-3 text-sm font-bold">Let's talk <Mail size={17}/></a></div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-[1fr_1.5fr]">
          <div className="relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#deded8]">
            <Image src="/profile.png" alt="Ishan Tonk" fill className="object-cover object-top" priority sizes="(max-width: 768px) 100vw, 40vw" />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/85 px-4 py-3 text-sm font-semibold backdrop-blur"><span className="text-neutral-500">Based in</span><br/>{profile.location}</div>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {['Next.js', 'React', 'Node.js', 'TypeScript', 'Prisma', 'PostgreSQL'].map((x, i) => <div key={x} className="flex min-h-[135px] flex-col justify-between rounded-[1.5rem] border border-black/10 bg-white p-5"><span className="text-xs font-bold text-neutral-400">0{i+1}</span><span className="text-xl font-bold">{x}</span></div>)}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-black bg-[#b7f23d] py-4 text-black"><div className="marquee flex w-max gap-8 whitespace-nowrap font-bold uppercase tracking-[.18em]">{Array.from({length: 8}).map((_,i)=><span key={i}>Full-stack development ✦ Product-minded engineering ✦ Next.js & React ✦</span>)}</div></div>

      <section id="work" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="mb-12 flex items-end justify-between gap-6"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">01 / Selected work</p><h2 className="font-display text-6xl font-bold md:text-8xl">Projects.</h2></div><span className="hidden rounded-full border border-black/10 px-4 py-2 text-sm md:block">{projects.length} featured</span></div>
        <div className="space-y-6">
          {projects.map((project, i) => <article key={project.id} className={`group grid overflow-hidden rounded-[2rem] border border-black/10 ${project.accent === 'dark' ? 'bg-[#181818] text-white' : project.accent === 'orange' ? 'bg-[#ead9c4]' : 'bg-white'} md:grid-cols-[.9fr_1.1fr]`}>
            <div className="flex min-h-[360px] flex-col justify-between p-7 md:p-10"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.15em] opacity-50"><span>0{i+1}</span><span>{project.year}</span></div><div><div className="mb-4 flex flex-wrap gap-2">{project.tech.map(t => <span key={t} className="rounded-full border border-current/15 px-3 py-1 text-xs font-semibold opacity-70">{t}</span>)}</div><h3 className="font-display text-5xl font-bold leading-none md:text-6xl">{project.title}</h3></div></div>
            <div className="flex flex-col justify-between bg-black/[.035] p-7 md:p-10"><p className="max-w-xl text-lg leading-8 opacity-75">{project.description}</p><div className="mt-10 grid gap-3 sm:grid-cols-2">{project.features.map(f => <div key={f} className="flex gap-2 text-sm font-semibold"><Check size={17} className="mt-0.5 shrink-0"/>{f}</div>)}</div><div className="mt-10 flex gap-3"><a href={project.liveUrl} className="inline-flex items-center gap-2 rounded-full bg-current px-5 py-2.5 text-sm font-bold"><span className={project.accent === 'dark' ? 'text-black' : 'text-white'}>Live project</span><ArrowUpRight size={16} className={project.accent === 'dark' ? 'text-black' : 'text-white'}/></a><a href={project.githubUrl} className="inline-flex items-center gap-2 rounded-full border border-current/20 px-5 py-2.5 text-sm font-bold">Code <Mail size={16}/></a></div></div>
          </article>)}
        </div>
      </section>

      <section id="about" className="border-y border-black/10 bg-white"><div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:grid-cols-[.75fr_1.25fr] md:px-8 md:py-32"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">02 / About</p><h2 className="font-display text-6xl font-bold leading-none md:text-8xl">Code with<br/><span className="italic">intent.</span></h2></div><div><p className="text-2xl leading-10 md:text-4xl md:leading-[1.25]">I care about the part after the screenshot: solid architecture, fast pages, clean components, thoughtful UX and products that are easy to keep improving.</p><div className="mt-12 flex flex-wrap gap-2">{profile.skills.map(skill => <span key={skill} className="rounded-full border border-black/10 bg-[#f5f5f2] px-4 py-2 text-sm font-semibold">{skill}</span>)}</div></div></div></section>

      <section id="experience" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"><div className="mb-14"><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">03 / Experience</p><h2 className="font-display text-6xl font-bold md:text-8xl">Experience.</h2></div><div className="border-t border-black/10"><div className="grid gap-5 border-b border-black/10 py-8 md:grid-cols-[.35fr_1fr_.7fr]"><span className="text-sm font-bold text-neutral-400">OCT 2021 — PRESENT</span><div><h3 className="text-2xl font-bold">Freelance Web Developer</h3><p className="mt-2 leading-7 text-neutral-600">Designed and delivered full-stack web applications across education, e-commerce and media. Built APIs, payment integrations, reusable React/Next.js libraries, SSR/SSG experiences and real-time features.</p></div><div className="text-sm font-semibold text-neutral-500">Next.js · React · Node.js<br/>TypeScript · Prisma · PostgreSQL</div></div><div className="grid gap-5 border-b border-black/10 py-8 md:grid-cols-[.35fr_1fr_.7fr]"><span className="text-sm font-bold text-neutral-400">MAR 2026 — JUN 2026</span><div><h3 className="text-2xl font-bold">Front-End Developer Intern</h3><p className="mt-2 leading-7 text-neutral-600">Built responsive React interfaces, reusable components and UI improvements while collaborating with designers and backend developers.</p></div><div className="text-sm font-semibold text-neutral-500">HTML · CSS · JavaScript<br/>React · Git</div></div></div></section>

      <section id="contact" className="bg-[#111] text-white"><div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"><div className="grid gap-14 md:grid-cols-[1.2fr_.8fr]"><div><p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-white/45">04 / Contact</p><h2 className="font-display text-7xl font-bold leading-[.85] md:text-[9rem]">Have a<br/><span className="italic text-[#b7f23d]">project?</span></h2></div><div className="flex flex-col justify-end"><p className="mb-8 max-w-md text-lg leading-8 text-white/60">Tell me what you're building, what is not working, or what you want to ship next.</p><a href={`mailto:${profile.email}`} className="mb-10 inline-flex w-fit items-center gap-3 rounded-full bg-[#b7f23d] px-6 py-3 font-bold text-black">{profile.email} <ArrowUpRight size={18}/></a><div className="flex flex-wrap gap-3">{socials.map(s => <a key={s.id} href={s.url} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white hover:text-black"><IconFor id={s.id}/>{s.label}</a>)}</div></div></div><div className="mt-20 flex flex-col justify-between gap-5 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[.16em] text-white/35 md:flex-row"><span>© {new Date().getFullYear()} Ishan Tonk</span><span>Built with Next.js</span></div></div></section>
    </main>
  )
}
