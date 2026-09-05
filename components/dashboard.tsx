"use client";

import { useMemo, useState } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/use-projects";
import {
  useCreateSocial,
  useDeleteSocial,
  useSocials,
  useUpdateSocial,
} from "@/hooks/use-socials";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Edit2,
  ExternalLink,
  FileText,
  ImageIcon,
  LayoutDashboard,
  Link2,
  Loader2,
  LogOut,
  LucideIcon,
  Plus,
  Save,
  Settings2,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Field,
  ImageUploader,
  MobileTabNavigation,
  Sparkle,
  Stat,
} from "@/components/ui";
import Link from "next/link";
import {
  ProfileWithRelationsDTO,
  ProjectWithRelationsDTO,
  SkillDTO,
  SocialDTO,
} from "@/types/common";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";
import { signOut } from "next-auth/react";

type TabItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const TAB_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "projects",
    label: "Projects",
    icon: Settings2,
  },
  {
    id: "socials",
    label: "Social",
    icon: ExternalLink,
  },
] as const satisfies TabItem[];

type TabID = (typeof TAB_ITEMS)[number]["id"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabID>("overview");

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    refetch: profileRetch,
  } = useProfile();

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: projectRetch,
  } = useProjects();

  const {
    data: socials,
    loading: socialsLoading,
    error: socialsError,
    refetch: socialsRetch,
  } = useSocials();

  const loading = profileLoading || projectsLoading || socialsLoading;

  const error = profileError ?? projectsError ?? socialsError;

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError message={error} />;
  }

  return (
    <div>
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-white p-5 md:block">
        <div className="flex h-full flex-col">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="font-display text-2xl font-bold">
              IT<span className="text-[#8cae28]">.</span>
            </Link>

            <span className="rounded-full bg-[#b7f23d] px-2 py-1 text-[10px] font-bold uppercase">
              Admin
            </span>
          </div>

          <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />

          <div className="mt-auto space-y-2">
            <Link
              href="/"
              className="group flex items-center justify-between rounded-2xl border border-black/5 bg-[#f4f4f0] px-4 py-3.5 transition hover:border-black/10 hover:bg-white"
            >
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-neutral-400">
                  Live site
                </span>

                <span className="mt-1 block text-sm font-bold">
                  View portfolio
                </span>
              </span>

              <ArrowLeft
                className="rotate-180 transition-transform group-hover:translate-x-0.5"
                size={16}
              />
            </Link>

            <AccountMenu name={profile?.name} image={profile?.image} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-bg/90 px-5 py-4 backdrop-blur md:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
              Portfolio CMS
            </p>

            <h1 className="mt-1 text-xl font-bold">
              {TAB_ITEMS.find((tab) => tab.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold md:flex"
            >
              View site
            </Link>

            <div className="md:hidden">
              <AccountMenu name={profile?.name} image={profile?.image} />
            </div>
          </div>
        </header>

        {/* Mobile tab navigation */}
        <MobileTabNavigation
          tabs={TAB_ITEMS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab content */}
        <div className="mx-auto max-w-6xl p-5 pb-16 md:p-10">
          <DashboardContent
            activeTab={activeTab}
            profile={profile}
            projects={projects}
            socials={socials}
            onTabChange={setActiveTab}
            refetchProjects={projectRetch}
            refetchSocials={socialsRetch}
          />
        </div>
      </main>
    </div>
  );
}

function DashboardTabs({
  activeTab,
  onChange,
}: {
  activeTab: TabID;
  onChange: (tab: TabID) => void;
}) {
  return (
    <nav className="space-y-1">
      {TAB_ITEMS.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={active ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
              active ? "bg-black text-white" : "hover:bg-black/5"
            }`}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

function DashboardContent({
  activeTab,
  profile,
  projects,
  socials,
  onTabChange,
  refetchProjects,
  refetchSocials,
}: {
  activeTab: TabID;
  profile: ProfileWithRelationsDTO | null;
  projects: ProjectWithRelationsDTO[];
  socials: SocialDTO[];
  onTabChange: (tab: TabID) => void;
  refetchProjects: () => Promise<ProjectWithRelationsDTO[]>;
  refetchSocials: () => Promise<SocialDTO[]>;
}) {
  switch (activeTab) {
    case "overview":
      return (
        <OverviewTab
          profile={profile}
          projects={projects}
          socials={socials}
          onTabChange={onTabChange}
        />
      );

    case "profile":
      return <ProfileTab profile={profile} />;

    case "projects":
      return (
        <ProjectsTab projects={projects} refetchProjects={refetchProjects} />
      );

    case "socials":
      return <SocialsTab socials={socials} refetchSocials={refetchSocials} />;

    default:
      return null;
  }
}

interface OverviewTabProps {
  profile: ProfileWithRelationsDTO | null;
  projects: ProjectWithRelationsDTO[];
  socials: SocialDTO[];
  onTabChange: (tab: TabID) => void;
}

function OverviewTab({
  profile,
  projects,
  socials,
  onTabChange,
}: OverviewTabProps) {
  return (
    <div className="space-y-7">
      <div className="grid gap-5 md:grid-cols-3">
        <Stat n={String(projects.length).padStart(2, "0")} label="Projects" />

        <Stat
          n={String(profile?.skills?.length ?? 0).padStart(2, "0")}
          label="Skills"
        />

        <Stat
          n={String(socials.length).padStart(2, "0")}
          label="Social links"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
                Profile snapshot
              </p>

              <h2 className="mt-2 font-display text-4xl font-bold">
                {profile?.name ?? "—"}
              </h2>

              <p className="mt-1 text-neutral-500">
                {profile?.role ?? "—"}
                {" · "}
                {profile?.location ?? "—"}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => onTabChange("profile")}
              startIcon={<Edit2 size={16} />}
            >
              Edit
            </Button>
          </div>

          <div className="mt-7 flex gap-5">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
              <Image
                src={profile?.image ?? "/profile.png"}
                alt={profile?.name ?? "Profile"}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <p className="max-w-xl text-sm leading-7 text-neutral-600">
              {profile?.bio ?? "No bio available."}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-[#b7f23d] p-7">
          <Sparkle />

          <p className="mt-8 text-xs font-bold uppercase tracking-[.18em]">
            Quick action
          </p>

          <h2 className="mt-2 font-display text-4xl font-bold">
            Keep the work fresh.
          </h2>

          <p className="mt-3 text-sm leading-6">
            Your dashboard edits are reflected on the public portfolio instantly
            in this browser.
          </p>

          <Button
            type="button"
            onClick={() => onTabChange("projects")}
            endIcon={<ArrowRight size={16} />}
            className="mt-7"
          >
            Manage projects
          </Button>
        </section>
      </div>

      <section className="rounded-3xl border border-black/10 bg-white p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
              Featured projects
            </p>

            <h2 className="mt-1 text-2xl font-bold">Your current portfolio</h2>
          </div>

          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => onTabChange("projects")}
            startIcon={<BriefcaseBusiness size={16} />}
          >
            Edit all
          </Button>
        </div>

        <div className="divide-y divide-black/10">
          {projects.length === 0 ? (
            <p className="py-6 text-sm text-neutral-500">No projects yet.</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-bold">{project.title}</p>

                  <p className="text-sm text-neutral-500">
                    {project.tech.map((t) => t.name).join(" · ")}
                  </p>
                </div>

                <span className="rounded-full bg-[#f4f4f0] px-3 py-1 text-xs font-bold">
                  {project.year}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ProfileTab({ profile }: { profile: ProfileWithRelationsDTO | null }) {
  const { loading, error, updateProfile } = useUpdateProfile();

  const emptyProfile: Omit<Partial<ProfileWithRelationsDTO>, "skills"> & {
    skills: Partial<SkillDTO>[];
  } = {
    name: "",
    role: "",
    bio: "",
    location: "",
    availability: "",
    email: "",
    phone: "",
    image: "",
    resume: "",
    skills: [],
  };

  type ProfileFormDTO = Omit<Partial<ProfileWithRelationsDTO>, "skills"> & {
    skills: Partial<SkillDTO>[];
  };

  const [form, setForm] = useState<ProfileFormDTO>(profile ?? emptyProfile);

  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const updateField = <K extends keyof ProfileFormDTO>(
    field: K,
    value: ProfileFormDTO[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill || !form.skills) return;

    if (
      form.skills.some(
        (existingSkill) =>
          existingSkill.name?.toLowerCase() === skill.toLowerCase(),
      )
    ) {
      setSkillInput("");
      return;
    }

    updateField("skills", [...form.skills, { name: skill }]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    if (!form.skills) return;

    updateField(
      "skills",
      form.skills.filter((skill) => skill.name !== skillToRemove),
    );
  };

  const handleSkillKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  /**
   * Replace this with your actual upload API.
   */

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    try {
      setUploadingResume(true);
      setSaved(false);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        throw new Error(body.error ?? "Upload failed");
      }

      const { url } = await res.json();

      updateField("resume", url);
    } catch {
      // Handle upload error if needed.
    } finally {
      setUploadingResume(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);

    try {
      await updateProfile(form as Partial<ProfileWithRelationsDTO>);
      setSaved(true);
    } catch {
      // The hook exposes the error state.
    }
  };

  const handleReset = () => {
    setForm(profile ?? emptyProfile);
    setSkillInput("");
    setSaved(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
          Portfolio profile
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl font-bold">
              Edit your profile
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Update the information displayed on your public portfolio.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
              loadingText="Saving…"
              successText="Saved!"
              success={saved}
              startIcon={<Save size={16} />}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>

      {/* Status */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && !error && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        {/* Main information */}
        <section className="rounded-3xl border border-black/10 bg-white p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
              Basic information
            </p>

            <h3 className="mt-1 text-xl font-bold">About you</h3>
          </div>

          <div className="mt-7 space-y-5">
            <Field
              label="Name"
              value={form.name ?? ""}
              onChange={(e) => updateField("name", e.toString())}
              placeholder="Your name"
              required
            />

            <Field
              label="Role"
              value={form.role ?? ""}
              onChange={(e) => updateField("role", e.toString())}
              placeholder="Product Designer"
              required
            />

            <Field
              label="Location"
              value={form.location ?? ""}
              onChange={(e) => updateField("location", e.toString())}
              placeholder="New York, NY"
            />

            {/* Email + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Email"
                type="email"
                value={form.email ?? ""}
                onChange={(e) => updateField("email", e.toString())}
                placeholder="you@example.com"
              />

              <Field
                label="Phone"
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => updateField("phone", e.toString())}
                placeholder="+1 555 123 4567"
              />
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="profile-availability"
                className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-neutral-500"
              >
                Availability
              </label>

              <select
                id="profile-availability"
                value={form.availability ?? ""}
                onChange={(event) =>
                  updateField("availability", event.target.value)
                }
                className="w-full appearance-none rounded-2xl border border-black/10 bg-[#f8f8f5] px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:bg-white"
              >
                <option value="">Select availability</option>
                <option value="Available for work">Available for work</option>
                <option value="Open to opportunities">
                  Open to opportunities
                </option>
                <option value="Available part-time">Available part-time</option>
                <option value="Not currently available">
                  Not currently available
                </option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-neutral-500"
              >
                Bio
              </label>

              <textarea
                id="profile-bio"
                value={form.bio ?? ""}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Tell people a little about yourself..."
                rows={7}
                className="w-full resize-y rounded-2xl border border-black/10 bg-[#f8f8f5] px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:bg-white"
              />

              <p className="mt-2 text-right text-xs text-neutral-400">
                {form.bio?.length ?? 0} characters
              </p>
            </div>
          </div>
        </section>

        {/* Right column */}
        <div className="space-y-6">
          {/* Modern profile image */}
          <section className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <div className="border-b border-black/5 p-7">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
                Profile image
              </p>

              <h3 className="mt-1 text-xl font-bold">Avatar</h3>

              <ImageUploader
                uploadUrl="api/profile/image"
                currentImage={profile?.image ?? ""}
                onUploaded={(url) => updateField("image", url)}
              />
            </div>
          </section>

          {/* Resume */}
          <section className="rounded-3xl border border-black/10 bg-white p-7">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
              Resume
            </p>

            <h3 className="mt-1 text-xl font-bold">Your resume</h3>

            <label
              htmlFor="resume-upload"
              className={`mt-5 flex cursor-pointer items-center gap-4 rounded-2xl border border-black/10 bg-[#f8f8f5] p-4 transition hover:border-black/20 hover:bg-[#f3f3ef] ${
                uploadingResume ? "pointer-events-none" : ""
              }`}
            >
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="sr-only"
                disabled={uploadingResume}
              />

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                {uploadingResume ? (
                  <Loader2
                    size={20}
                    className="animate-spin text-neutral-600"
                  />
                ) : (
                  <FileText size={20} className="text-neutral-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {form.resume ? "Resume uploaded" : "Upload your resume"}
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  {uploadingResume
                    ? "Uploading..."
                    : "PDF, DOC or DOCX · Max 10 MB"}
                </p>
              </div>

              <Upload size={18} className="shrink-0 text-neutral-400" />
            </label>

            {form.resume && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-green-600" />

                  <span className="truncate text-xs font-semibold text-green-700">
                    Resume ready
                  </span>
                </div>

                <a
                  href={form.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-green-700 hover:underline"
                >
                  View
                </a>
              </div>
            )}
          </section>

          {/* Skills */}
          <section className="rounded-3xl border border-black/10 bg-white p-7">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-400">
              Expertise
            </p>

            <h3 className="mt-1 text-xl font-bold">Skills</h3>

            <div className="mt-5 flex gap-2">
              <input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Add a skill"
                className="min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f8f8f5] px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:bg-white"
              />

              <Button
                type="button"
                variant="outline"
                onClick={addSkill}
                disabled={!skillInput.trim()}
              >
                Add
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {form.skills?.length === 0 ? (
                <p className="text-sm text-neutral-400">No skills added yet.</p>
              ) : (
                form.skills.map((skill, index) => (
                  <button
                    key={skill.id ?? `${skill.name}-${index}`}
                    type="button"
                    onClick={() => removeSkill(skill.name ?? "")}
                    className="group rounded-full bg-[#f4f4f0] px-3 py-1.5 text-xs font-bold transition hover:bg-black hover:text-white"
                    title={`Remove ${skill.name ?? ""}`}
                  >
                    {skill.name}

                    <span className="ml-1.5 opacity-40 group-hover:opacity-100">
                      ×
                    </span>
                  </button>
                ))
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-neutral-400">
              Press Enter or click Add to add a skill. Click a skill to remove
              it.
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}

type SocialInput = {
  label: string;
  handle: string;
  url: string;
};

type SocialFormState = {
  label: string;
  handle: string;
  url: string;
};

const createEmptySocial = (): SocialFormState => ({
  label: "",
  handle: "",
  url: "",
});

const socialToForm = (social: SocialDTO): SocialFormState => ({
  label: social.label ?? "",
  handle: social.handle ?? "",
  url: social.url ?? "",
});

function SocialsTab({
  socials,
  refetchSocials,
}: {
  socials: SocialDTO[];
  refetchSocials: () => Promise<SocialDTO[]>;
}) {
  const {
    loading: createLoading,
    error: createError,
    createSocial,
  } = useCreateSocial();

  const {
    loading: updateLoading,
    error: updateError,
    updateSocial,
  } = useUpdateSocial();

  const {
    loading: deleteLoading,
    error: deleteError,
    deleteSocial,
  } = useDeleteSocial();

  const loading = createLoading || updateLoading || deleteLoading;
  const error = createError ?? updateError ?? deleteError;

  const [showForm, setShowForm] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialDTO | null>(null);
  const [form, setForm] = useState<SocialFormState>(createEmptySocial());

  const isEditing = Boolean(editingSocial);

  const updateField = <K extends keyof SocialFormState>(
    field: K,
    value: SocialFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(createEmptySocial());
    setEditingSocial(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingSocial(null);
    setForm(createEmptySocial());
    setShowForm(true);

    requestAnimationFrame(() => {
      document.getElementById("social-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const openEditForm = (social: SocialDTO) => {
    setEditingSocial(social);
    setForm(socialToForm(social));
    setShowForm(true);

    requestAnimationFrame(() => {
      document.getElementById("social-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const isValid =
    form.label.trim().length > 0 &&
    form.handle.trim().length > 0 &&
    form.url.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || loading) return;

    const socialData: SocialInput = {
      label: form.label.trim(),
      handle: form.handle.trim(),
      url: form.url.trim(),
    };

    try {
      if (editingSocial) {
        await updateSocial(editingSocial.id, socialData);
      } else {
        await createSocial(socialData);
      }

      await refetchSocials();
      resetForm();
    } catch {
      // Hook exposes the error state.
    }
  };

  const handleDelete = async (social: SocialDTO) => {
    if (loading) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${social.label}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteSocial(social.id);
      await refetchSocials();
    } catch {
      // Hook exposes the error state.
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
            Online presence
          </p>

          <div className="mt-2 flex items-center gap-3">
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Social links
            </h2>

            <span className="rounded-full bg-[#b7f23d] px-3 py-1 text-xs font-bold">
              {socials.length}
            </span>
          </div>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Manage the social profiles and external links displayed on your
            portfolio.
          </p>
        </div>

        {!showForm && (
          <Button
            type="button"
            onClick={openCreateForm}
            startIcon={<Plus size={16} />}
          >
            Add social
          </Button>
        )}
      </header>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          <p className="font-bold">Something went wrong</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <section
          id="social-form"
          className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
        >
          {/* Form header */}
          <div className="flex items-start justify-between gap-4 border-b border-black/10 bg-[#fafaf7] p-6 md:p-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
                  {isEditing ? <Edit2 size={14} /> : <Plus size={16} />}
                </span>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                  {isEditing ? "Edit social" : "New social"}
                </p>
              </div>

              <h3 className="mt-3 text-2xl font-bold tracking-tight">
                {isEditing ? "Update social profile" : "Add a social profile"}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Add the details visitors need to find you online.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              aria-label="Close form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-500 transition hover:border-black/20 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-7">
            <div className="space-y-7">
              {/* Platform */}
              <section>
                <div className="mb-4">
                  <p className="text-sm font-bold">Profile information</p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Add the platform name, username, and profile URL.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Platform"
                    value={form.label}
                    onChange={(value) => updateField("label", value.toString())}
                    placeholder="GitHub"
                    required
                  />

                  <Field
                    label="Handle / username"
                    value={form.handle}
                    onChange={(value) =>
                      updateField("handle", value.toString())
                    }
                    placeholder="@username"
                    required
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="Profile URL"
                      type="url"
                      value={form.url}
                      onChange={(value) => updateField("url", value.toString())}
                      placeholder="https://github.com/username"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Preview */}
              {(form.label || form.handle || form.url) && (
                <section className="rounded-2xl border border-black/10 bg-[#f8f8f5] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Preview
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                        <ExternalLink size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold">{form.label || "Platform"}</p>

                        <p className="mt-0.5 truncate text-sm text-neutral-500">
                          {form.handle || "@username"}
                        </p>
                      </div>
                    </div>

                    {form.url && (
                      <a
                        href={form.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden shrink-0 text-xs font-bold text-neutral-500 underline-offset-4 hover:text-black hover:underline sm:block"
                      >
                        Test link
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={loading}
                  loadingText={isEditing ? "Updating…" : "Creating…"}
                  disabled={!isValid}
                  startIcon={<Save size={16} />}
                >
                  {isEditing ? "Update social" : "Add social"}
                </Button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* Social list */}
      <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-black/10 p-6 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
            Your profiles
          </p>

          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold tracking-tight">
              Social accounts
            </h3>

            {socials.length > 0 && !showForm && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={openCreateForm}
                startIcon={<Plus size={14} />}
              >
                Add social
              </Button>
            )}
          </div>
        </div>

        {socials.length === 0 ? (
          <div className="p-12 text-center md:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f4f0]">
              <Link2 size={25} className="text-neutral-500" />
            </div>

            <h3 className="mt-5 text-lg font-bold">No social links yet</h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              Add your GitHub, LinkedIn, X, Instagram, or other profiles so
              visitors can find you.
            </p>

            <Button
              type="button"
              onClick={openCreateForm}
              className="mt-6"
              startIcon={<Plus size={16} />}
            >
              Add your first social
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-black/10">
            {socials.map((social) => (
              <article
                key={social.id}
                className="group p-5 transition-colors hover:bg-[#fafaf7] md:p-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Social info */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white transition-transform group-hover:scale-105">
                      <ExternalLink size={19} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold">{social.label}</h4>

                        <span className="rounded-full bg-[#b7f23d] px-2.5 py-1 text-[10px] font-bold uppercase">
                          Active
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-neutral-500">
                        {social.handle}
                      </p>

                      <p className="mt-1 max-w-lg truncate text-xs text-neutral-400">
                        {social.url}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-black hover:bg-black hover:text-white"
                    >
                      <ExternalLink size={14} />
                      Visit
                    </a>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openEditForm(social)}
                      disabled={loading}
                      startIcon={<Edit2 size={14} />}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(social)}
                      disabled={loading}
                      startIcon={<Trash2 size={14} />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm font-medium text-neutral-500">Loading dashboard…</p>
    </div>
  );
}

function DashboardError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
        {message}
      </div>
    </div>
  );
}

type ProjectInput = {
  title: string;
  description: string;
  thumbnail: string;
  year: string;
  accent: string;
  liveUrl: string;
  sourceCodeUrl: string;

  tech: {
    name: string;
  }[];

  features: {
    content: string;
  }[];
};

type ProjectFormState = {
  title: string;
  description: string;
  thumbnail: string;
  year: string;
  tech: string;
  features: string;
  liveUrl: string;
  sourceCodeUrl: string;
  accent: string;
};

const createEmptyProject = (): ProjectFormState => ({
  title: "",
  description: "",
  thumbnail: "",
  year: new Date().getFullYear().toString(),
  tech: "",
  features: "",
  liveUrl: "",
  sourceCodeUrl: "",
  accent: "",
});

const projectToForm = (project: ProjectWithRelationsDTO): ProjectFormState => ({
  title: project.title ?? "",
  description: project.description ?? "",
  thumbnail: project.thumbnail ?? "",
  year: project.year ?? "",
  tech: project.tech?.map((item) => item.name).join(", ") ?? "",
  features: project.features?.map((item) => item.content).join("\n") ?? "",
  liveUrl: project.liveUrl ?? "",
  sourceCodeUrl: project.sourceCodeUrl ?? "",
  accent: project.accent ?? "",
});

const parseTech = (value: string) =>
  value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
    }));

const parseFeatures = (value: string) =>
  value
    .split("\n")
    .map((content) => content.trim())
    .filter(Boolean)
    .map((content) => ({
      content,
    }));

function ProjectsTab({
  projects,
  refetchProjects,
}: {
  projects: ProjectWithRelationsDTO[];
  refetchProjects: () => Promise<ProjectWithRelationsDTO[]>;
}) {
  const {
    loading: createLoading,
    error: createError,
    createProject,
  } = useCreateProject();

  const {
    loading: updateLoading,
    error: updateError,
    updateProject,
  } = useUpdateProject();

  const {
    loading: deleteLoading,
    error: deleteError,
    deleteProject,
  } = useDeleteProject();

  const loading = createLoading || updateLoading || deleteLoading;
  const error = createError ?? updateError ?? deleteError;

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] =
    useState<ProjectWithRelationsDTO | null>(null);

  const [form, setForm] = useState<ProjectFormState>(createEmptyProject());

  const isEditing = Boolean(editingProject);

  const updateField = <K extends keyof ProjectFormState>(
    field: K,
    value: ProjectFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(createEmptyProject());
    setEditingProject(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingProject(null);
    setForm(createEmptyProject());
    setShowForm(true);
  };

  const openEditForm = (project: ProjectWithRelationsDTO) => {
    setEditingProject(project);
    setForm(projectToForm(project));
    setShowForm(true);

    // Makes the form visible after clicking Edit on long pages.
    requestAnimationFrame(() => {
      document.getElementById("project-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const projectData: ProjectInput = useMemo(
    () => ({
      title: form.title.trim(),
      description: form.description.trim(),
      thumbnail: form.thumbnail.trim(),
      year: form.year.trim(),
      tech: parseTech(form.tech),
      features: parseFeatures(form.features),
      liveUrl: form.liveUrl.trim(),
      sourceCodeUrl: form.sourceCodeUrl.trim(),
      accent: form.accent.trim(),
    }),
    [form],
  );

  const isValid =
    projectData.title.length > 0 &&
    projectData.description.length > 0 &&
    projectData.year.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || loading) return;

    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }

      await refetchProjects();
      resetForm();
    } catch {
      // Hook exposes the error state.
    }
  };

  const handleDelete = async (project: ProjectWithRelationsDTO) => {
    if (loading) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteProject(project.id);
      await refetchProjects();
    } catch {
      // Hook exposes the error state.
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
            Portfolio work
          </p>

          <div className="mt-2 flex items-center gap-3">
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Projects
            </h2>

            <span className="rounded-full bg-[#b7f23d] px-3 py-1 text-xs font-bold">
              {projects.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Manage the projects displayed in your portfolio.
          </p>
        </div>

        {!showForm && (
          <Button
            type="button"
            onClick={openCreateForm}
            startIcon={<Plus size={16} />}
          >
            New project
          </Button>
        )}
      </header>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          <div className="min-w-0">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <section
          id="project-form"
          className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
        >
          {/* Form header */}
          <div className="flex items-start justify-between gap-4 border-b border-black/10 bg-[#fafaf7] p-6 md:p-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
                  {isEditing ? <Edit2 size={14} /> : <Plus size={16} />}
                </span>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                  {isEditing ? "Edit project" : "New project"}
                </p>
              </div>

              <h3 className="mt-3 text-2xl font-bold tracking-tight">
                {isEditing ? "Update your project" : "Add a new project"}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                {isEditing
                  ? "Update the information shown on your portfolio."
                  : "Add the details for a new piece of portfolio work."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              aria-label="Close form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-500 transition hover:border-black/20 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-7">
            <div className="space-y-7">
              {/* Basic information */}
              <div>
                <div className="mb-4">
                  <p className="text-sm font-bold">Basic information</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    The main information visitors will see about the project.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                  <Field
                    label="Project title"
                    value={form.title}
                    onChange={(value) => updateField("title", value.toString())}
                    placeholder="Portfolio Website"
                    required
                  />

                  <Field
                    label="Year"
                    type="number"
                    value={form.year}
                    onChange={(value) => updateField("year", value.toString())}
                    placeholder="2026"
                    required
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="project-description"
                    className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-neutral-500"
                  >
                    Description
                  </label>

                  <textarea
                    id="project-description"
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe what you built, the problem it solved, and what makes it interesting..."
                    rows={5}
                    required
                    className="w-full resize-y rounded-2xl border border-black/10 bg-[#f8f8f5] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:bg-white"
                  />

                  <p className="mt-2 text-xs text-neutral-400">
                    {form.description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Tech + features */}
              <div className="border-t border-black/10 pt-7">
                <div className="mb-4">
                  <p className="text-sm font-bold">Project details</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Add technologies and key features.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Field
                      label="Technologies"
                      value={form.tech}
                      onChange={(value) =>
                        updateField("tech", value.toString())
                      }
                      placeholder="Next.js, TypeScript, Tailwind CSS"
                    />

                    <p className="mt-2 text-xs text-neutral-400">
                      Separate technologies with commas.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="project-features"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-neutral-500"
                    >
                      Key features
                    </label>

                    <textarea
                      id="project-features"
                      value={form.features}
                      onChange={(event) =>
                        updateField("features", event.target.value)
                      }
                      placeholder={
                        "Responsive design\nDark mode\nAuthentication"
                      }
                      rows={4}
                      className="w-full resize-y rounded-2xl border border-black/10 bg-[#f8f8f5] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:bg-white"
                    />

                    <p className="mt-2 text-xs text-neutral-400">
                      One feature per line.
                    </p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="border-t border-black/10 pt-7">
                <div className="mb-4">
                  <p className="text-sm font-bold">Links & media</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Add links visitors can use to explore the project.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Live URL"
                    type="url"
                    value={form.liveUrl}
                    onChange={(value) =>
                      updateField("liveUrl", value.toString())
                    }
                    placeholder="https://example.com"
                  />

                  <Field
                    label="Source code URL"
                    type="url"
                    value={form.sourceCodeUrl}
                    onChange={(value) =>
                      updateField("sourceCodeUrl", value.toString())
                    }
                    placeholder="https://github.com/..."
                  />

                  <div className="md:col-span-2">
                    <ImageUploader
                      uploadUrl={"api/projects/thumbnail"}
                      currentImage={form.thumbnail}
                      onUploaded={(url) => updateField("thumbnail", url)}
                      aspectRatio="aspect-video"
                    />
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="border-t border-black/10 pt-7">
                <div className="mb-4">
                  <p className="text-sm font-bold">Appearance</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Optional accent color used by your portfolio.
                  </p>
                </div>

                <div className="max-w-md">
                  <Field
                    label="Accent"
                    value={form.accent}
                    onChange={(value) =>
                      updateField("accent", value.toString())
                    }
                    placeholder="#B7F23D"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={loading}
                  loadingText={isEditing ? "Updating…" : "Creating…"}
                  disabled={!isValid}
                  startIcon={<Save size={16} />}
                >
                  {isEditing ? "Update project" : "Create project"}
                </Button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* Projects list */}
      <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-black/10 p-6 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
            Your work
          </p>

          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold tracking-tight">
              Portfolio projects
            </h3>

            {projects.length > 0 && !showForm && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={openCreateForm}
                startIcon={<Plus size={14} />}
              >
                Add project
              </Button>
            )}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center md:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f4f0]">
              <BriefcaseBusiness size={26} className="text-neutral-500" />
            </div>

            <h3 className="mt-5 text-lg font-bold">No projects yet</h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              Add your first project to start building your portfolio.
            </p>

            <Button
              type="button"
              onClick={openCreateForm}
              className="mt-6"
              startIcon={<Plus size={16} />}
            >
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-black/10">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group p-5 transition-colors hover:bg-[#fafaf7] md:p-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Project info */}
                  <div className="flex min-w-0 gap-4">
                    {/* Thumbnail */}
                    <div className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#f4f4f0] sm:block">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="truncate text-lg font-bold">
                          {project.title}
                        </h4>

                        <span className="rounded-full bg-[#f4f4f0] px-3 py-1 text-xs font-bold text-neutral-700">
                          {project.year}
                        </span>
                      </div>

                      {project.description && (
                        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-neutral-500">
                          {project.description}
                        </p>
                      )}

                      {project.tech?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tech.map((technology) => (
                            <span
                              key={technology.id}
                              className="rounded-full bg-[#b7f23d] px-3 py-1 text-xs font-bold text-black"
                            >
                              {technology.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.features?.length > 0 && (
                        <p className="mt-3 text-xs text-neutral-400">
                          {project.features.length}{" "}
                          {project.features.length === 1
                            ? "feature"
                            : "features"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-black hover:bg-black hover:text-white"
                      >
                        <ExternalLink size={14} />
                        Live
                      </a>
                    )}

                    {project.sourceCodeUrl && (
                      <a
                        href={project.sourceCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-black hover:bg-black hover:text-white"
                      >
                        <Link2 size={14} />
                        Code
                      </a>
                    )}

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openEditForm(project)}
                      disabled={loading}
                      startIcon={<Edit2 size={14} />}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project)}
                      disabled={loading}
                      startIcon={<Trash2 size={14} />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AccountMenu({
  name,
  image,
}: {
  name: string | undefined;
  image: string | undefined;
}) {
  const displayName = name?.trim() || "Account";
  const initials = getInitials(displayName);

  return (
    <Dropdown
      trigger={({ open, toggle }) => (
        <>
          {/* Desktop trigger */}
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={toggle}
            className={cn(
              "hidden w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition md:flex",
              open
                ? "border-black/10 bg-black text-white"
                : "border-black/5 bg-white hover:border-black/10 hover:bg-[#f4f4f0]",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold",
                open ? "bg-[#b7f23d] text-black" : "bg-[#f4f4f0]",
              )}
            >
              {initials}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">
                {displayName}
              </span>

              <span
                className={cn(
                  "mt-0.5 block text-[11px]",
                  open ? "text-white/60" : "text-neutral-400",
                )}
              >
                Administrator
              </span>
            </span>

            <ChevronDown
              size={16}
              className={cn(
                "shrink-0 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>

          {/* Mobile trigger */}
          <button
            type="button"
            aria-label="Open account menu"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={toggle}
            className={cn(
              "group relative rounded-full p-0.5 md:hidden",
              "transition-all duration-200",
              "focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-black/20",
              "focus-visible:ring-offset-2",
              open ? "bg-black" : "hover:bg-black/10",
            )}
          >
            <Avatar
              src={image ?? undefined}
              name={displayName}
              alt={displayName}
              size="sm"
              className={cn(
                "h-9 w-9 border border-black/10 transition-transform duration-200",
                "group-hover:scale-[1.03]",
                open && "border-white",
              )}
            />

            <span
              aria-hidden="true"
              className={cn(
                "absolute -bottom-0.5 -right-0.5",
                "flex h-4 w-4 items-center justify-center",
                "rounded-full border-2 border-white",
                "bg-black text-white transition-transform duration-200",
                open && "rotate-180",
              )}
            >
              <ChevronDown className="h-2.5 w-2.5" strokeWidth={2.5} />
            </span>
          </button>
        </>
      )}
    >
      <DropdownHeader
        title={displayName}
        description="Portfolio administrator"
      />

      <DropdownDivider />

      <DropdownItem href="/" icon={<ExternalLink size={16} />}>
        View public profile
      </DropdownItem>

      <DropdownItem
        icon={<LogOut size={16} />}
        danger
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Log out
      </DropdownItem>
    </Dropdown>
  );
}
