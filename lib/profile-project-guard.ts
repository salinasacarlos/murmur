import type { ProfileRow } from "@/components/providers/current-user-provider"
import type { OnboardingIntent } from "@/lib/types"

export function userHasProjectIntent(
  intent: OnboardingIntent | null | undefined
): boolean {
  return intent === "founder" || intent === "both"
}

export function userIsInvestor(
  intent: OnboardingIntent | null | undefined
): boolean {
  return intent === "investor"
}

export function profileRequiresProjectStage(
  row: Pick<ProfileRow, "onboarding_intent" | "project_stage"> | null
): boolean {
  if (!row) return false
  return userHasProjectIntent(row.onboarding_intent) && !row.project_stage
}

export function profileRequiresInvestorActivity(
  row: Pick<ProfileRow, "onboarding_intent" | "investor_activity"> | null
): boolean {
  if (!row) return false
  return userIsInvestor(row.onboarding_intent) && !row.investor_activity
}

/** Mensaje si no se debe permitir guardar otros campos del perfil. */
export function profileSaveBlockedMessage(
  row: ProfileRow | null
): string | null {
  if (profileRequiresProjectStage(row)) {
    return "Completa la etapa de tu proyecto en «Proyecto y contexto» antes de guardar otros cambios."
  }
  if (profileRequiresInvestorActivity(row)) {
    return "Completa tu situación como inversionista en «Proyecto y contexto» antes de guardar otros cambios."
  }
  return null
}
