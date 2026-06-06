"use client"

import { SingleSelectList } from "@/components/ui/single-select-list"
import { INVESTOR_ACTIVITY_OPTIONS } from "@/lib/investor-activity"
import type { InvestorActivity } from "@/lib/types"

const OPTIONS = INVESTOR_ACTIVITY_OPTIONS.map((opt) => ({
  value: opt.slug,
  title: opt.title,
  description: opt.description,
}))

interface InvestorActivitySelectProps {
  value: InvestorActivity | ""
  onChange: (value: InvestorActivity | "") => void
  className?: string
}

export function InvestorActivitySelect({
  value,
  onChange,
  className,
}: InvestorActivitySelectProps) {
  return (
    <SingleSelectList
      value={value}
      onChange={onChange}
      options={OPTIONS}
      className={className}
    />
  )
}
