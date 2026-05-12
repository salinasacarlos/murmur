import { redirect } from "next/navigation"

/** Paso dejado de usarse: el código de evento se ingresa desde el feed ya dentro de la app. */
export default function OnboardingEventRedirectPage() {
  redirect("/onboarding/role")
}
