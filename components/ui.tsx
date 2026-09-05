"use client";

import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  LucideIcon,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const inputStyles = cn(
  "w-full rounded-2xl border border-black/10 bg-[#f8f8f5]",
  "px-3.5 py-3 text-black",
  "outline-none transition-[border-color,background-color,box-shadow]",
  "placeholder:text-neutral-400",
  "focus:bg-white focus-visible:border-black",
  "focus-visible:ring-1 focus-visible:ring-black/10",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

/* -------------------------------------------------------------------------- */
/* Input                                                                       */
/* -------------------------------------------------------------------------- */

type InputProps = ComponentPropsWithoutRef<"input"> & {
  icon?: ReactNode;
};

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative mt-2 flex-1 text-sm font-bold text-black">
      {icon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        >
          {icon}
        </span>
      )}

      <input
        className={cn(inputStyles, icon && "pl-9", className)}
        {...props}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

type FieldProps = ComponentPropsWithoutRef<"input"> & {
  icon?: ReactNode;
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

export function Field({
  icon,
  label,
  value,
  onChange,
  id,
  className,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="mt-2 block text-sm font-bold text-black">
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-1.5 flex items-center gap-1.5 text-neutral-400"
        >
          {icon && <span aria-hidden="true">{icon}</span>}

          <span className="text-[10px] uppercase tracking-[.14em]">
            {label}
          </span>
        </label>
      )}

      <input
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputStyles, className)}
        {...props}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Textarea                                                                   */
/* -------------------------------------------------------------------------- */

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  icon?: ReactNode;
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

export function Textarea({
  icon,
  label,
  value,
  onChange,
  id,
  className,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="mt-2 block text-sm font-bold text-black">
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-1.5 flex items-center gap-1.5 text-neutral-400"
        >
          {icon && <span aria-hidden="true">{icon}</span>}

          <span className="text-[10px] uppercase tracking-[.14em]">
            {label}
          </span>
        </label>
      )}

      <textarea
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputStyles, "resize-none leading-7", className)}
        {...props}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sparkle                                                                    */
/* -------------------------------------------------------------------------- */

export function Sparkle() {
  return (
    <div
      aria-hidden="true"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-[#b7f23d]"
    >
      <span aria-hidden="true">✦</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat                                                                       */
/* -------------------------------------------------------------------------- */

type StatProps = {
  n: ReactNode;
  label: ReactNode;
};

export function Stat({ n, label }: StatProps) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="font-display text-5xl font-bold tabular-nums">{n}</div>

      <div className="mt-3 text-sm font-bold text-neutral-500">{label}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dropdown                                                                    */
/* -------------------------------------------------------------------------- */

type DropdownPosition = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};

type DropdownProps = {
  trigger: (props: {
    open: boolean;
    toggle: () => void;
    close: () => void;
  }) => ReactNode;
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
};

export function Dropdown({
  trigger,
  children,
  className,
  align = "left",
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<DropdownPosition>({
    vertical: "bottom",
    horizontal: align,
  });

  const toggle = () => {
    setOpen((current) => !current);
  };

  const close = () => {
    setOpen(false);
  };

  const updatePosition = () => {
    const container = containerRef.current;
    const menu = menuRef.current;

    if (!container || !menu) return;

    const triggerRect = container.getBoundingClientRect();

    // Temporarily allow the menu to measure its natural size.
    const menuRect = menu.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const GAP = 10;
    const EDGE_GAP = 8;

    // Available space around trigger
    const spaceAbove = triggerRect.top - EDGE_GAP;
    const spaceBelow = viewportHeight - triggerRect.bottom - EDGE_GAP;

    /*
     * Vertical positioning
     *
     * Prefer the requested/default bottom position,
     * but flip to top when there isn't enough room.
     */
    let vertical: DropdownPosition["vertical"];

    if (spaceBelow >= menuRect.height + GAP) {
      vertical = "bottom";
    } else if (spaceAbove >= menuRect.height + GAP) {
      vertical = "top";
    } else {
      // Not enough room either way.
      // Choose whichever side has more space.
      vertical = spaceBelow >= spaceAbove ? "bottom" : "top";
    }

    /*
     * Horizontal positioning
     *
     * Check whether the menu would overflow the viewport.
     */
    let horizontal: DropdownPosition["horizontal"];

    if (align === "right") {
      const rightPosition = triggerRect.right - menuRect.width;

      if (rightPosition >= EDGE_GAP) {
        horizontal = "right";
      } else {
        horizontal = "left";
      }
    } else {
      const leftPosition = triggerRect.left;

      if (leftPosition + menuRect.width <= viewportWidth - EDGE_GAP) {
        horizontal = "left";
      } else {
        horizontal = "right";
      }
    }

    setPosition({
      vertical,
      horizontal,
    });
  };

  /*
   * useLayoutEffect prevents visible flickering:
   * the position is calculated before the browser paints.
   */
  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const handleResize = () => {
      updatePosition();
    };

    const handleScroll = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && !containerRef.current?.contains(target)) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {trigger({
        open,
        toggle,
        close,
      })}

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "absolute z-50",
            "min-w-full overflow-y-auto rounded-2xl",
            "border border-black/10 bg-white p-1.5",
            "shadow-[0_18px_50px_rgba(0,0,0,0.12)]",

            // Vertical positioning
            position.vertical === "top"
              ? "bottom-[calc(100%+10px)]"
              : "top-[calc(100%+10px)]",

            // Horizontal positioning
            position.horizontal === "right" ? "right-0" : "left-0",

            // Keep menu inside viewport vertically
            "max-h-[calc(100vh-16px)]",
          )}
          onClick={close}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dropdown Item                                                              */
/* -------------------------------------------------------------------------- */

type DropdownItemProps = {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
};

const dropdownItemStyles = cn(
  "flex w-full items-center gap-3 rounded-xl",
  "px-3 py-2.5 text-sm font-bold",
  "transition-colors duration-150",
  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-black/10",
);

export function DropdownItem({
  children,
  icon,
  onClick,
  href,
  danger = false,
  disabled = false,
}: DropdownItemProps) {
  const className = cn(
    dropdownItemStyles,
    danger
      ? "text-neutral-700 hover:bg-red-50 hover:text-red-600"
      : "hover:bg-[#f4f4f0]",
    disabled && "pointer-events-none opacity-50",
  );

  const content = (
    <>
      {icon && (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      )}

      <span className="truncate">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        role="menuitem"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={className}
        onClick={disabled ? undefined : onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Dropdown Header                                                            */
/* -------------------------------------------------------------------------- */

type DropdownHeaderProps = {
  title: string;
  description?: string;
};

export function DropdownHeader({ title, description }: DropdownHeaderProps) {
  return (
    <div className="px-3 py-2.5">
      <p className="text-xs font-bold">{title}</p>

      {description && (
        <p className="mt-0.5 text-[11px] text-neutral-400">{description}</p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dropdown Divider                                                           */
/* -------------------------------------------------------------------------- */

export function DropdownDivider() {
  return <div role="separator" className="my-1 border-t border-black/5" />;
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

type AvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) return "?";

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

export function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-[#f0f0ec] font-bold text-neutral-600",
        avatarSizes[size],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          fill
          sizes={size === "sm" ? "32px" : size === "md" ? "40px" : "48px"}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center"
        >
          {initials}
        </span>
      )}
    </div>
  );
}

const buttonVariants = {
  primary: "bg-ink text-white hover:bg-ink/85 focus-visible:ring-ink",

  accent:
    "bg-accent text-accent-ink hover:bg-accent/85 focus-visible:ring-accent",

  secondary: "bg-soft text-ink hover:bg-line focus-visible:ring-ink/40",

  outline:
    "border border-line bg-transparent text-ink hover:bg-soft hover:border-line/80 focus-visible:ring-ink/40",

  ghost:
    "bg-transparent text-muted hover:bg-soft hover:text-ink focus-visible:ring-ink/40",

  destructive:
    "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 focus-visible:ring-red-400",
} as const;

const buttonSizes = {
  sm: "h-[34px] px-3.5 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-sm gap-2.5",
  icon: "h-10 w-10 p-0",
  "icon-sm": "h-[34px] w-[34px] p-0",
  "icon-lg": "h-12 w-12 p-0",
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;

  loading?: boolean;
  success?: boolean;
  error?: boolean;

  loadingText?: ReactNode;
  successText?: ReactNode;
  errorText?: ReactNode;

  startIcon?: ReactNode;
  endIcon?: ReactNode;

  /**
   * Disable the button while loading.
   * Defaults to true.
   */
  loadingDisabled?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",

  loading = false,
  success = false,
  error = false,

  loadingText = "Loading…",
  successText = "Done",
  errorText = "Try again",

  startIcon,
  endIcon,

  loadingDisabled = true,

  children,
  disabled,
  type = "button",
  "aria-label": ariaLabel,

  ...props
}: ButtonProps) {
  const isIconOnly =
    size === "icon" || size === "icon-sm" || size === "icon-lg";
  const isDisabled = disabled || (loading && loadingDisabled);

  const content = loading
    ? loadingText
    : success
      ? successText
      : error
        ? errorText
        : children;

  const icon = loading ? (
    <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin" />
  ) : success ? (
    <Check
      aria-hidden="true"
      className="size-4 shrink-0 animate-in zoom-in-50 duration-150"
      style={{ animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    />
  ) : error ? (
    <X
      aria-hidden="true"
      className="size-4 shrink-0 animate-in zoom-in-50 duration-150"
      style={{ animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    />
  ) : (
    startIcon
  );

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      className={cn(
        // Layout
        "inline-flex items-center justify-center whitespace-nowrap",

        // Shape
        "rounded-xl",

        // Typography
        "font-semibold tracking-[-0.01em]",

        // Interaction
        "select-none outline-none cursor-pointer",
        "transition-all duration-150",
        "active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-40",

        // Accessibility — double box-shadow ring (no bleed on colored surfaces)
        "focus-visible:ring-2 focus-visible:ring-offset-2",

        // Variant
        buttonVariants[variant],

        // Size
        buttonSizes[size],

        // Loading state — muted fill
        loading && "bg-soft text-muted border-0 cursor-wait hover:bg-soft",

        // Error state
        error &&
          "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 focus-visible:ring-red-400",

        // Success state
        success &&
          "bg-accent/20 text-accent-ink border border-accent/50 hover:bg-accent/30 focus-visible:ring-accent",

        // Icon-only
        isIconOnly && "gap-0",

        className,
      )}
      {...props}
    >
      {icon}

      {!isIconOnly && (
        <span
          className={cn(
            "inline-flex items-center justify-center",
            loading && "animate-in fade-in duration-150",
          )}
        >
          {content}
        </span>
      )}

      {!isIconOnly && !loading && !success && !error && endIcon}
    </button>
  );
}

type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type MobileTabNavigationProps<T extends Tab> = {
  tabs: T[];
  defaultTab?: T["id"];
  activeTab?: T["id"];
  onTabChange?: (tabId: T["id"]) => void;
  className?: string;
};

export function MobileTabNavigation<T extends Tab>({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  className = "",
}: MobileTabNavigationProps<T>) {
  const [internalActiveTab, setInternalActiveTab] = useState<T["id"]>(
    defaultTab ?? tabs[0]?.id,
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: T["id"]) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }

    onTabChange?.(tabId);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className={`
        md:hidden
        fixed inset-x-0 bottom-0 z-40
        w-full
        ${className}
      `}
    >
      <div className="flex items-center bg-bg/90 px-2 pt-1 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-surface/85">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => handleTabChange(item.id)}
              className="
                group relative flex min-w-0 flex-1
                items-center justify-center
                outline-none
                touch-manipulation
              "
            >
              {/* Selected surface */}
              <span
                aria-hidden="true"
                className={`
                  absolute inset-x-2 inset-y-1
                  rounded-xl
                  transition-all duration-200 ease-out
                  ${
                    isActive
                      ? "bg-ink/5.5 opacity-100"
                      : "bg-transparent opacity-0 group-hover:bg-ink/[0.035] group-hover:opacity-100"
                  }
                `}
              />

              <span
                className="
                  relative z-10
                  flex min-w-0 flex-col
                  items-center justify-center
                  gap-0.5
                  px-3 py-2
                "
              >
                {/* Icon */}
                <span
                  key={`${item.id}-${isActive}`}
                  className={
                    isActive ? "tab-pop" : "transition-transform duration-200"
                  }
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.1 : 1.7}
                    className={`
                      transition-all duration-200 ease-out
                      ${
                        isActive
                          ? "text-ink"
                          : "text-muted group-hover:text-ink"
                      }
                    `}
                  />
                </span>

                {/* Label */}
                <span
                  className={`
                    max-w-full truncate
                    text-[11px] font-medium
                    leading-4
                    transition-all duration-200 ease-out
                    ${
                      isActive
                        ? "translate-y-0 text-ink"
                        : "text-muted group-hover:text-ink"
                    }
                  `}
                >
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function ImageUploader({
  profileId,
  currentImage,
  onUploaded,
}: {
  profileId: string;
  currentImage: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Keep preview in sync if parent updates
  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4 MB.");
      return;
    }

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
    setUploading(true);
    setSuccess(false);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("profileId", profileId);

      const res = await fetch("/api/profile/image", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }
      const { url } = await res.json();
      setPreview(url);
      onUploaded(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e: any) {
      setError(e.message);
      setPreview(currentImage); // roll back
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {/* Current image + overlay trigger */}
      <div
        className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-black/10 transition hover:border-black/30"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload new profile photo"
      >
        {/* Photo */}
        <img
          src={preview || "/profile.png"}
          alt="Profile"
          className={`h-64 w-full object-cover transition duration-300 ${
            uploading || dragging
              ? "brightness-50"
              : "group-hover:brightness-75"
          }`}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition ${
            dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-white" />
              <span className="text-xs font-bold text-white">Uploading…</span>
            </>
          ) : dragging ? (
            <>
              <Upload size={28} className="text-white" />
              <span className="text-xs font-bold text-white">
                Drop to upload
              </span>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Camera size={22} className="text-white" />
              </div>
              <span className="text-xs font-bold text-white">Change photo</span>
            </>
          )}
        </div>

        {/* Success badge */}
        {success && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-[#b7f23d] px-3 py-1.5 text-xs font-bold text-black shadow">
            <Check size={13} /> Uploaded
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onInputChange}
      />

      {/* Upload button (alternate CTA) */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-[#f4f4f0] py-3 text-sm font-bold transition hover:border-black/20 hover:bg-white disabled:opacity-50"
      >
        <ImagePlus size={16} />
        {uploading ? "Uploading…" : "Choose new photo"}
      </button>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <p className="text-center text-[11px] text-neutral-400">
        JPEG, PNG, WebP or GIF · max 4 MB
        <br />
        Drag and drop or click the photo to replace it
      </p>
    </div>
  );
}
