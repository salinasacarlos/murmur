"use client"

import { OptionCard } from "@/components/ui/option-card"
import { cn } from "@/lib/utils"

export type SingleSelectOption<T extends string = string> = {
  value: T
  title: string
  description?: string
}

interface SingleSelectListProps<T extends string> {
  value: T | ""
  onChange: (value: T | "") => void
  options: readonly SingleSelectOption<T>[]
  className?: string
}

export function SingleSelectList<T extends string>({
  value,
  onChange,
  options,
  className,
}: SingleSelectListProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2", className)} role="radiogroup">
      {options.map((opt) => (
        <OptionCard
          key={opt.value}
          selected={value === opt.value}
          onSelect={() => onChange(opt.value)}
          title={opt.title}
          description={opt.description}
        />
      ))}
    </div>
  )
}
