# Ishan Tonk — Portfolio & Dashboard

> A bold, editorial-style developer portfolio with a built-in content dashboard — designed to showcase work beautifully while keeping updates simple.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## ✦ What is this?

This is **Ishan Tonk's personal developer portfolio**, built to feel more like a digital experience than a traditional résumé page.

The public site introduces Ishan as a web developer, highlights selected projects, presents technical skills and experience, and makes it easy to get in touch. Behind it sits a lightweight **dashboard** that lets the portfolio owner update the content without editing the page components directly.

The visual direction is intentionally expressive: oversized typography, generous whitespace, subtle motion, bold cards, a lime accent, and an editorial layout that keeps the focus on the work.

---

## 🚀 Highlights

### Public portfolio

- **Large, expressive hero section** with availability status and introduction
- **Profile image** with location card
- **Selected projects** with descriptions, technology stacks, features, and links
- **About section** for skills and developer profile
- **Experience timeline** for professional history
- **Contact section** with social links and email CTA
- **Resume access** from the hero section
- **Responsive navigation** with a mobile menu
- **Responsive layout** built for desktop, tablet, and mobile
- **Subtle visual motion** including reveal effects, hover states, and a scrolling marquee

### Built-in dashboard

Open `/dashboard` to manage the portfolio content from one place.

**Profile**
- Name
- Role
- Location
- Email
- Phone
- Availability
- Bio
- Skills

**Projects**
- Add projects
- Edit projects
- Delete projects
- Project year
- Description
- Technologies
- Feature list
- Live project URL
- GitHub URL

**Social links**
- GitHub
- LinkedIn
- Instagram
- Email
- Custom labels, handles, and URLs

Changes made in the dashboard are stored in the browser and immediately reflected on the public portfolio in that same browser.

---

## 🧰 Tech stack

| Technology | Purpose |
| --- | --- |
| **Next.js 16** | App Router, routing, page architecture |
| **React 19** | Interactive UI and dashboard state |
| **TypeScript** | Type-safe application code |
| **Tailwind CSS 4** | Responsive styling and design system |
| **Lucide React** | Interface icons |
| **localStorage** | Local-first portfolio content storage |

---

## 📁 Project structure

```text
ishan-portfolio/
├── app/
│   ├── globals.css          # Global styles, typography, effects
│   ├── layout.tsx           # Root application layout
│   └── page.tsx             # Portfolio entry page
│
├── components/
│   ├── portfolio.tsx        # Public portfolio experience
│   └── dashboard.tsx        # Portfolio content dashboard
│
├── lib/
│   └── data.ts              # Types and default portfolio content
│
├── public/
│   ├── profile.png          # Profile image
│   └── resume.pdf           # Downloadable/viewable résumé
│
├── .gitignore
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## 🖥️ Getting started

### 1. Clone or download the project

```bash
git clone <your-repository-url>
cd ishan-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Dashboard:

```text
http://localhost:3000/dashboard
```

### 4. Create a production build

```bash
npm run build
npm run start
```

### 5. Lint the project

```bash
npm run lint
```

---

## ✍️ How content editing works

The project intentionally keeps the first version simple and dependency-light.

Default content lives in:

```text
lib/data.ts
```

The dashboard loads that default data and can save an edited version into the browser's `localStorage` under:

```text
ishan-portfolio-v1
```

The public portfolio reads the same stored data, so the flow is:

```text
Dashboard
   ↓
Edit profile / projects / socials
   ↓
Save to localStorage
   ↓
Portfolio reads updated data
   ↓
Changes appear instantly in the same browser
```

### Resetting to the original content

To reset the locally stored portfolio data, remove the `ishan-portfolio-v1` item from your browser's local storage and refresh the page.

---

## 🖼️ Updating the profile image

Replace:

```text
public/profile.png
```

with your new profile image while keeping the same filename.

The image is used by the public portfolio and the dashboard profile preview.

---

## 📄 Updating the résumé

Replace:

```text
public/resume.pdf
```

with your latest résumé.

The portfolio's **Resume** button points directly to this file.

---

## 🔗 Updating social links

You can update social URLs from:

```text
/dashboard → Socials
```

The default configuration lives in `lib/data.ts`:

```ts
export const defaultSocials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@ishantonk',
    url: 'https://github.com/'
  },
  // ...
]
```

Before deploying publicly, replace the placeholder social URLs with the actual profile URLs.

---

## 🎨 Design philosophy

The portfolio follows a few simple principles:

**Make the work the hero.**  
Large type and strong composition create hierarchy without burying the actual projects.

**Keep the interface human.**  
Rounded cards, small status labels, playful accents, and micro-interactions make the experience feel personal rather than corporate.

**Use contrast intentionally.**  
The mostly neutral canvas is interrupted by dark project cards and a bright lime accent to create rhythm while keeping the content readable.

**Make editing feel obvious.**  
The dashboard is organized around three simple content areas: profile, projects, and social links.

---

## 📱 Responsive by design

The layout adapts across:

- Desktop screens
- Laptops
- Tablets
- Mobile phones

The navigation collapses into a mobile menu, project layouts stack vertically, and dashboard editors adapt from multi-column forms to single-column layouts on smaller screens.

---

## 🔐 Current dashboard architecture

The dashboard is intentionally **local-first**.

That means:

- No database is required
- No backend API is required
- No authentication setup is required
- Edits persist in the current browser
- Portfolio content can be edited immediately during development

### Production consideration

This architecture is ideal for a lightweight prototype or personal local CMS, but it is **not a secure production admin system**.

For a real deployed CMS, the recommended next step is:

```text
Next.js
   ↓
Authenticated dashboard
   ↓
Server Actions / API
   ↓
Prisma ORM
   ↓
PostgreSQL
```

Add authentication and authorization before exposing the dashboard publicly.

---

## 🛣️ Suggested roadmap

The current project provides the portfolio experience and local editing foundation. A production-ready version could evolve with:

- [ ] Admin authentication
- [ ] PostgreSQL database
- [ ] Prisma ORM
- [ ] Server Actions for mutations
- [ ] Cloud image uploads
- [ ] Project screenshots/gallery management
- [ ] Drag-and-drop project ordering
- [ ] Blog/CMS management
- [ ] SEO metadata editor
- [ ] Analytics dashboard
- [ ] Contact form with email delivery
- [ ] Dark mode
- [ ] Deployment configuration

---

## 🌐 Deployment

The project is structured for a standard Next.js deployment.

A typical production flow is:

```bash
npm install
npm run build
npm run start
```

For a public deployment, remember to:

1. Replace placeholder GitHub/LinkedIn/Instagram URLs.
2. Add your production project URLs.
3. Replace the résumé with the latest version.
4. Replace the profile image if needed.
5. Add authentication before exposing `/dashboard`.
6. Move portfolio data from `localStorage` to a database if multiple devices/users need access.

---

## 👨‍💻 About the developer

**Ishan Tonk** is a web developer focused on building full-stack web applications with technologies including **JavaScript, React, Next.js, Node.js, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Git, and Firebase**.

The portfolio showcases projects such as a full-stack blog platform, a Spotify-inspired application, and an education e-commerce platform.

---

## ⭐ Final note

This project is meant to be more than a résumé on the web.

It is a small personal product: **a place to tell the story, show the work, and keep the content moving.**

If you build on top of it, keep that spirit — expressive on the surface, simple underneath.

---

**Built with Next.js, React, TypeScript & Tailwind CSS.**
