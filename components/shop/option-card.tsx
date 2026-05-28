import { ReactNode } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface OptionCardProps {
  title: string
  description?: string
  selected?: boolean
  disabled?: boolean
  badge?: string
  footer?: ReactNode
  onClick?: () => void
  className?: string
  children?: ReactNode
}

export default function OptionCard({
  title,
  description,
  selected = false,
  disabled = false,
  badge,
  footer,
  onClick,
  className,
  children,
}: OptionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-3xl border bg-white p-5 text-left transition-all",
        selected ? "border-zinc-950 shadow-lg shadow-zinc-200" : "border-zinc-200 hover:border-zinc-300",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          {badge ? (
            <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">{badge}</span>
          ) : null}
          <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>
          {description ? <p className="text-sm leading-6 text-zinc-600">{description}</p> : null}
        </div>
        <span
          className={cn(
            "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white text-transparent"
          )}
        >
          <Check className="h-4 w-4" />
        </span>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </button>
  )
}
