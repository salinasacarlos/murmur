import * as React from "react"

export function ProfileViewSection({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h4 className="ds-label-uppercase mb-2">{title}</h4>
      {hint ? (
        <p className="text-[11px] text-[var(--text3)] mb-2 leading-snug">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  )
}

export function ProfileViewRow({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[var(--text)]">
      <span className="text-[var(--text2)]">{icon}</span>
      <span>{children}</span>
    </div>
  )
}
