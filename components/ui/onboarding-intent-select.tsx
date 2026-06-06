"use client"

import { SingleSelectList } from "@/components/ui/single-select-list"
import { ONBOARDING_INTENT_LABELS, type OnboardingIntent } from "@/lib/types"

const OPTIONS = (
  Object.keys(ONBOARDING_INTENT_LABELS) as OnboardingIntent[]
).map((id) => ({
  value: id,
  title: ONBOARDING_INTENT_LABELS[id],
}))

interface OnboardingIntentSelectProps {
  value: OnboardingIntent | ""
  onChange: (value: OnboardingIntent | "") => void
  className?: string
}

export function OnboardingIntentSelect({
  value,
  onChange,
  className,
}: OnboardingIntentSelectProps) {
  return (
    <SingleSelectList
      value={value}
      onChange={onChange}
      options={OPTIONS}
      className={className}
    />
  )
}
