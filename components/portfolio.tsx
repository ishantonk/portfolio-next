"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Code2,
  FileText,
  Mail,
  Menu,
  Share2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useProjects } from "@/hooks/use-projects";
import { useSocials } from "@/hooks/use-socials";
import {
  ProfileDTO,
  ProfileWithRelationsDTO,
  ProjectWithRelationsDTO,
  SocialDTO,
} from "@/types/common";

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-[#f5f5f2] px-5 py-6 md:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-8 w-12 rounded bg-black/10" />

        <div className="grid gap-12 pt-32 lg:grid-cols-[1.4fr_.6fr]">
          <div>
            <div className="mb-7 h-8 w-44 rounded-full bg-black/10" />
            <div className="mb-5 h-4 w-48 rounded bg-black/10" />
            <div className="space-y-4">
              <div className="h-20 w-full rounded bg-black/10" />
              <div className="h-20 w-4/5 rounded bg-black/10" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-32 rounded-2xl bg-black/10" />
            <div className="flex gap-3">
              <div className="h-12 w-28 rounded-full bg-black/10" />
              <div className="h-12 w-36 rounded-full bg-black/10" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-[1fr_1.5fr]">
          <div className="min-h-[440px] rounded-[2rem] bg-black/10" />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[135px] rounded-[1.5rem] bg-black/10"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorScreen({ message }: { message?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] px-5">
      <div className="max-w-md text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-neutral-400">
          Something went wrong
        </p>

        <h1 className="font-display text-5xl font-bold">
          Couldn&apos;t load the portfolio.
        </h1>

        <p className="mt-5 leading-7 text-neutral-500">
          {message || "Please refresh the page and try again."}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Try again
          <ArrowUpRight size={16} />
        </button>
      </div>
    </main>
  );
}

function SocialIcon({ id }: { id: string }) {
  switch (id.toLowerCase()) {
    case "github":
      return <Share2 size={17} aria-hidden="true" />;

    case "linkedin":
      return <Share2 size={17} aria-hidden="true" />;

    default:
      return <Mail size={17} aria-hidden="true" />;
  }
}

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

function Header({
  menu,
  setMenu,
}: {
  menu: boolean;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const closeMenu = () => setMenu(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f5f5f2]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="#top"
          onClick={closeMenu}
          className="font-display text-2xl font-bold tracking-tight"
        >
          IT<span className="text-[#8cae28]">.</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-sm font-semibold md:flex"
        >
          <a href="#work" className="transition-colors hover:text-[#6f8d16]">
            Work
          </a>
          <a href="#about" className="transition-colors hover:text-[#6f8d16]">
            About
          </a>
          <a
            href="#experience"
            className="transition-colors hover:text-[#6f8d16]"
          >
            Experience
          </a>
          <a href="#contact" className="transition-colors hover:text-[#6f8d16]">
            Contact
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenu((value) => !value)}
          className="rounded-full p-2 transition-colors hover:bg-black/5 md:hidden"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
        >
          {menu ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-black/10 transition-all duration-300 md:hidden ${
          menu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-4 font-semibold">
          {[
            ["Work", "#work"],
            ["About", "#about"],
            ["Experience", "#experience"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 transition-colors hover:bg-black/5"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ profile }: { profile: ProfileDTO }) {
  const technologies = [
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
  ];

  return (
    <>
      <section
        id="top"
        className="grid-bg mx-auto max-w-7xl px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-30"
      >
        <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_.6fr]">
          <div className="reveal">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[.18em] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a9dc35] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8cae28]" />
              </span>
              {profile.availability}
            </div>

            <p className="mb-5 text-sm font-bold uppercase tracking-[.2em] text-neutral-500">
              {profile.role} · India
            </p>

            <h1 className="font-display max-w-5xl text-[clamp(4rem,11vw,10.5rem)] font-bold leading-[.78] tracking-[-0.055em]">
              Building <span className="italic">useful</span> digital things.
            </h1>
          </div>

          <div
            className="reveal flex flex-col gap-6 lg:pb-3"
            style={{ animationDelay: ".12s" }}
          >
            <p className="max-w-md text-lg leading-8 text-neutral-600">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-3">
              <ExternalLink
                href="/resume.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white"
              >
                <FileText size={17} />
                Resume
              </ExternalLink>

              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#b7f23d] hover:text-black"
              >
                View selected work
                <ArrowUpRight size={17} />
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white"
              >
                Let&apos;s talk
                <Mail size={17} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-[1fr_1.5fr]">
          <div className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#deded8]">
            <Image
              src="/profile.png"
              alt={profile.name || "Profile photo"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent p-5 pt-20">
              <div className="inline-block rounded-2xl border border-white/30 bg-white/85 px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur-md">
                <span className="text-neutral-500">Based in</span>
                <br />
                {profile.location}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {technologies.map((technology, index) => (
              <div
                key={technology}
                className="group flex min-h-[135px] flex-col justify-between rounded-[1.5rem] border border-black/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl hover:shadow-black/5"
              >
                <span className="text-xs font-bold text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-lg font-bold tracking-tight transition-colors group-hover:text-[#6f8d16] sm:text-xl">
                  {technology}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-black bg-[#b7f23d] py-4 text-black">
        <div className="marquee flex w-max gap-8 whitespace-nowrap font-bold uppercase tracking-[.18em]">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index}>
              Full-stack development ✦ Product-minded engineering ✦ Next.js &
              React ✦
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function Work({ projects }: { projects: ProjectWithRelationsDTO[] }) {
  return (
    <section
      id="work"
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">
            01 / Selected work
          </p>

          <h2 className="font-display text-6xl font-bold tracking-[-.04em] md:text-8xl">
            Projects.
          </h2>
        </div>

        <span className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold md:block">
          {projects.length} featured
        </span>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => {
          const isDark = project.accent === "dark";
          const isOrange = project.accent === "orange";

          const cardClass = isDark
            ? "bg-[#181818] text-white"
            : isOrange
              ? "bg-[#ead9c4]"
              : "";

          return (
            <article
              key={project.id}
              style={
                !isDark && !isOrange
                  ? { backgroundColor: project.accent }
                  : undefined
              }
              className={`group grid overflow-hidden rounded-[2rem] border border-black/10 transition-transform duration-500 hover:-translate-y-1 ${cardClass} md:grid-cols-[.9fr_1.1fr]`}
            >
              <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden p-7 md:p-10">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#b7f23d]/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />

                <div className="relative flex items-center justify-between text-xs font-bold uppercase tracking-[.15em] opacity-50">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.year}</span>
                </div>

                <div className="relative">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tech.map((technology) => (
                      <span
                        key={technology.id}
                        className="rounded-full border border-current/15 px-3 py-1 text-xs font-semibold opacity-70"
                      >
                        {technology.name}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-5xl font-bold leading-none tracking-[-.045em] md:text-6xl">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col justify-between bg-black/[.035] p-7 md:p-10">
                <p className="max-w-xl text-lg leading-8 opacity-75">
                  {project.description}
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex gap-2 text-sm font-semibold"
                    >
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      {feature.content}
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <ExternalLink
                    href={project.liveUrl}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? "bg-[#b7f23d] text-black hover:bg-white"
                        : "bg-black text-white hover:bg-[#b7f23d] hover:text-black"
                    }`}
                  >
                    Live project
                    <ArrowUpRight size={16} />
                  </ExternalLink>

                  <ExternalLink
                    href={project.sourceCodeUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-current/20 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-current hover:text-white"
                  >
                    <Code2 size={16} />
                    Code
                  </ExternalLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function About({ profile }: { profile: ProfileWithRelationsDTO }) {
  return (
    <section id="about" className="border-y border-black/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:grid-cols-[.75fr_1.25fr] md:px-8 md:py-32">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">
            02 / About
          </p>

          <h2 className="font-display text-6xl font-bold leading-none tracking-[-.045em] md:text-8xl">
            Code with
            <br />
            <span className="italic">intent.</span>
          </h2>
        </div>

        <div>
          <p className="max-w-4xl text-2xl leading-10 md:text-4xl md:leading-[1.25]">
            I care about the part after the screenshot: solid architecture, fast
            pages, clean components, thoughtful UX and products that are easy to
            keep improving.
          </p>

          <div className="mt-12 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border border-black/10 bg-[#f5f5f2] px-4 py-2 text-sm font-semibold transition-colors hover:border-black/20 hover:bg-black hover:text-white"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mb-14">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">
          03 / Experience
        </p>

        <h2 className="font-display text-6xl font-bold tracking-[-.04em] md:text-8xl">
          Experience.
        </h2>
      </div>

      <div className="border-t border-black/10">
        <ExperienceItem
          period="OCT 2021 — PRESENT"
          title="Freelance Web Developer"
          description="Designed and delivered full-stack web applications across education, e-commerce and media. Built APIs, payment integrations, reusable React/Next.js libraries, SSR/SSG experiences and real-time features."
          stack={
            <>
              Next.js · React · Node.js
              <br />
              TypeScript · Prisma · PostgreSQL
            </>
          }
        />

        <ExperienceItem
          period="MAR 2026 — JUN 2026"
          title="Front-End Developer Intern"
          description="Built responsive React interfaces, reusable components and UI improvements while collaborating with designers and backend developers."
          stack={
            <>
              HTML · CSS · JavaScript
              <br />
              React · Git
            </>
          }
        />
      </div>
    </section>
  );
}

function ExperienceItem({
  period,
  title,
  description,
  stack,
}: {
  period: string;
  title: string;
  description: string;
  stack: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 border-b border-black/10 py-8 md:grid-cols-[.35fr_1fr_.7fr]">
      <span className="text-sm font-bold text-neutral-400">{period}</span>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>

        <p className="mt-2 max-w-2xl leading-7 text-neutral-600">
          {description}
        </p>
      </div>

      <div className="text-sm font-semibold leading-6 text-neutral-500">
        {stack}
      </div>
    </div>
  );
}

function Contact({
  profile,
  socials,
}: {
  profile: ProfileDTO;
  socials: SocialDTO[];
}) {
  const socialsMap = useMemo(
    () => Object.fromEntries(socials.map((social) => [social.id, social])),
    [socials],
  );

  return (
    <section id="contact" className="bg-[#111] text-white">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-14 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-white/45">
              04 / Contact
            </p>

            <h2 className="font-display text-7xl font-bold leading-[.85] tracking-[-.055em] md:text-[9rem]">
              Have a
              <br />
              <span className="italic text-[#b7f23d]">project?</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end">
            <p className="mb-8 max-w-md text-lg leading-8 text-white/60">
              Tell me what you&apos;re building, what is not working, or what
              you want to ship next.
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="mb-10 inline-flex w-fit items-center gap-3 rounded-full bg-[#b7f23d] px-6 py-3 font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              {profile.email}
              <ArrowUpRight size={18} />
            </a>

            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <ExternalLink
                  key={social.id}
                  href={social.url}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black"
                >
                  <SocialIcon id={social.id} />
                  {social.label}
                </ExternalLink>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-5 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[.16em] text-white/35 md:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Built with Next.js</span>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  const {
    data: socials,
    loading: socialsLoading,
    error: socialsError,
  } = useSocials();

  const loading = profileLoading || projectsLoading || socialsLoading;
  const error = profileError ?? projectsError ?? socialsError;

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !profile || !projects || !socials) {
    return (
      <ErrorScreen
        message={
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : undefined
        }
      />
    );
  }

  return (
    <main className="noise min-h-screen overflow-hidden bg-[#f5f5f2]">
      <Header menu={menu} setMenu={setMenu} />

      <Hero profile={profile} />

      <Work projects={projects} />

      <About profile={profile} />

      <Experience />

      <Contact profile={profile} socials={socials} />
    </main>
  );
}
