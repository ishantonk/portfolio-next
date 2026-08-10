export type Project = {
  id: string
  title: string
  description: string
  tech: string[]
  features: string[]
  year: string
  accent: string
  liveUrl: string
  githubUrl: string
}

export type Profile = {
  name: string
  role: string
  location: string
  email: string
  phone: string
  bio: string
  availability: string
  skills: string[]
}

export type Social = { id: string; label: string; url: string; handle: string }

export const defaultProfile: Profile = {
  name: 'Ishan Tonk',
  role: 'Web Developer',
  location: 'Pilkhuwa (Hapur), India',
  email: 'ishantonk.w@gmail.com',
  phone: '+91 9368851234',
  bio: 'Full-stack web developer with hands-on experience building scalable web applications — from dynamic e-commerce platforms to social media apps. Proficient in JavaScript, React, Next.js, Node.js, SQL, Prisma, Git, and Firebase. Equally comfortable working independently or in a team setting.',
  availability: 'Available for freelance work',
  skills: ['HTML & CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Flutter', 'SQL', 'Git', 'Firebase'],
}

export const defaultProjects: Project[] = [
  {
    id: 'blog', title: 'Blog web app', year: '2026', accent: 'lime',
    description: 'A full-stack blog platform built with Next.js and Prisma ORM, featuring user authentication, rich-text post creation, and server-side rendering.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    features: ['Create, edit and delete blog posts with rich-text editor', 'User authentication, profiles and session management', 'SEO-optimized with SSR/SSG and category filtering'],
    liveUrl: '#', githubUrl: '#'
  },
  {
    id: 'spotify', title: 'Spotify clone', year: '2026', accent: 'dark',
    description: 'A pixel-faithful Spotify clone built with Next.js, integrating the Spotify Web API for real-time music playback and playlist management.',
    tech: ['Next.js', 'Tailwind CSS', 'Spotify Web API'],
    features: ['Real-time music playback and controls via Spotify API', 'Playlist and library management', 'Responsive dark-themed UI replicating Spotify design'],
    liveUrl: '#', githubUrl: '#'
  },
  {
    id: 'nirmaan', title: 'Nirmaan Academy', year: '2025', accent: 'orange',
    description: 'Education e-commerce platform covering course management, payments, authentication, and a responsive learner experience.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Razorpay'],
    features: ['Course management and checkout flows', 'Payment gateway integration', 'Authentication and role-aware experiences'],
    liveUrl: '#', githubUrl: '#'
  }
]

export const defaultSocials: Social[] = [
  { id: 'github', label: 'GitHub', handle: '@ishantonk', url: 'https://github.com/' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'Ishan Tonk', url: 'https://www.linkedin.com/' },
  { id: 'instagram', label: 'Instagram', handle: '@ishantonk', url: 'https://instagram.com/' },
  { id: 'email', label: 'Email', handle: 'ishantonk.w@gmail.com', url: 'mailto:ishantonk.w@gmail.com' },
]
