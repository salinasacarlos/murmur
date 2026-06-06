"use client"

import { SingleSelectList } from "@/components/ui/single-select-list"
import { PROJECT_STAGE_OPTIONS } from "@/lib/project-stage"
import type { ProjectStage } from "@/lib/types"

const OPTIONS = PROJECT_STAGE_OPTIONS.map((opt) => ({
  value: opt.slug,
  title: opt.title,
  description: opt.description,
}))

interface ProjectStageSelectProps {
  value: ProjectStage | ""
  onChange: (value: ProjectStage | "") => void
  className?: string
}

export function ProjectStageSelect({
  value,
  onChange,
  className,
}: ProjectStageSelectProps) {
  return (
    <SingleSelectList
      value={value}
      onChange={onChange}
      options={OPTIONS}
      className={className}
    />
  )
}
