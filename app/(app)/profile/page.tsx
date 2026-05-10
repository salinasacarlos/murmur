"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/ui/city-selector"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Field, Input, Textarea } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"
import { Toggle } from "@/components/ui/toggle"
import { ProfilePhotoPicker } from "@/components/profile/profile-photo-picker"
import { ProfileSection } from "@/components/profile/profile-section"
import { CITIES_CATALOG } from "@/lib/mock-data"
import {
  AREA_LABELS,
  AVAILABILITY_LABELS,
  EXPERIENCE_LABELS,
  RELATION_LABELS,
  WORK_STYLE_LABELS,
  type Availability,
  type CurrentUser,
  type ExperienceRange,
  type FunctionalArea,
  type WorkStyle,
} from "@/lib/types"
import { useVisibility } from "@/components/providers/visibility-provider"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { deriveCurrentUser, initialsFromName } from "@/lib/current-user-mapping"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { IconEdit, IconMapPin } from "@/components/icons"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { user: authUser, profile, refresh } = useCurrentUser()

  const initialUser = React.useMemo<CurrentUser>(
    () =>
      authUser
        ? deriveCurrentUser(authUser, profile)
        : ({} as CurrentUser),
    [authUser, profile]
  )

  const [user, setUser] = React.useState<CurrentUser>(initialUser)
  const lastSyncedAtRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!authUser) return
    const stamp = profile?.updated_at ?? authUser.id
    if (lastSyncedAtRef.current === stamp) return
    lastSyncedAtRef.current = stamp
    setUser(deriveCurrentUser(authUser, profile))
  }, [authUser, profile])

  const [profileEditOpen, setProfileEditOpen] = React.useState(false)
  const [locationEditOpen, setLocationEditOpen] = React.useState(false)
  const [workPrefsEditOpen, setWorkPrefsEditOpen] = React.useState(false)
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [savingLocation, setSavingLocation] = React.useState(false)
  const [savingWorkPrefs, setSavingWorkPrefs] = React.useState(false)
  const [profileDraft, setProfileDraft] = React.useState({
    name: initialUser.name ?? "",
    photoUrl: initialUser.photoUrl,
    role: initialUser.role ?? "",
    bio: initialUser.bio ?? "",
    area: initialUser.area,
    experience: initialUser.experience,
    availability: initialUser.availability,
  })
  const [locationDraft, setLocationDraft] = React.useState({
    city: initialUser.city ?? "",
    cities: initialUser.cities ?? [],
    searchRadiusKm: initialUser.searchRadiusKm ?? 50,
  })
  const [workPrefsDraft, setWorkPrefsDraft] = React.useState<{
    availability: Availability
    workStyle: WorkStyle[]
  }>({
    availability: initialUser.availability,
    workStyle: initialUser.workStyle ?? [],
  })
  const { visible, toggle } = useVisibility()

  if (!authUser) {
    return (
      <div className="px-4 md:px-6 py-10 text-[13px] text-[var(--text2)]">
        Cargando tu perfil...
      </div>
    )
  }

  function openProfileEdit() {
    setProfileDraft({
      name: user.name,
      photoUrl: user.photoUrl,
      role: user.role,
      bio: user.bio,
      area: user.area,
      experience: user.experience,
      availability: user.availability,
    })
    setProfileEditOpen(true)
  }

  async function saveProfileEdit() {
    if (!authUser || savingProfile) return
    setSavingProfile(true)
    const nextInitials = initialsFromName(profileDraft.name) || user.initials
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profileDraft.name.trim(),
        initials: nextInitials,
        role: profileDraft.role.trim(),
        bio: profileDraft.bio,
        area: profileDraft.area,
        experience: profileDraft.experience,
        availability: profileDraft.availability,
        photo_url: profileDraft.photoUrl ?? null,
      })
      .eq("id", authUser.id)
    setSavingProfile(false)
    if (error) {
      console.error("Failed to save profile", error)
      return
    }
    setUser((prev) => ({
      ...prev,
      ...profileDraft,
      initials: nextInitials,
    }))
    setProfileEditOpen(false)
    void refresh()
  }

  function openLocationEdit() {
    setLocationDraft({
      city: user.city,
      cities: user.cities ?? [user.city],
      searchRadiusKm: user.searchRadiusKm ?? 50,
    })
    setLocationEditOpen(true)
  }

  async function saveLocationEdit() {
    if (!authUser || savingLocation) return
    setSavingLocation(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        city: locationDraft.city.trim() || null,
        search_radius_km: locationDraft.searchRadiusKm,
      })
      .eq("id", authUser.id)
    setSavingLocation(false)
    if (error) {
      console.error("Failed to save location", error)
      return
    }
    setUser((prev) => ({
      ...prev,
      city: locationDraft.city,
      cities: locationDraft.cities.includes(locationDraft.city)
        ? locationDraft.cities
        : [locationDraft.city, ...locationDraft.cities],
      searchRadiusKm: locationDraft.searchRadiusKm,
    }))
    setLocationEditOpen(false)
    void refresh()
  }

  function openWorkPrefsEdit() {
    setWorkPrefsDraft({
      availability: user.availability,
      workStyle: user.workStyle,
    })
    setWorkPrefsEditOpen(true)
  }

  function toggleWorkStyle(value: WorkStyle) {
    setWorkPrefsDraft((prev) => ({
      ...prev,
      workStyle: prev.workStyle.includes(value)
        ? prev.workStyle.filter((item) => item !== value)
        : [...prev.workStyle, value],
    }))
  }

  async function saveWorkPrefsEdit() {
    if (!authUser || savingWorkPrefs) return
    setSavingWorkPrefs(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        availability: workPrefsDraft.availability,
      })
      .eq("id", authUser.id)
    setSavingWorkPrefs(false)
    if (error) {
      console.error("Failed to save work preferences", error)
      return
    }
    setUser((prev) => ({
      ...prev,
      availability: workPrefsDraft.availability,
      workStyle: workPrefsDraft.workStyle,
    }))
    setWorkPrefsEditOpen(false)
    void refresh()
  }

  return (
    <div className="px-4 md:px-6 py-5 md:py-6 max-w-[820px] mx-auto w-full flex flex-col gap-4">
      <div className="md:hidden">
        <h2 className="text-[18px] font-extrabold tracking-[-0.4px]">
          Mi perfil
        </h2>
      </div>

      <Card padding="default" className="ds-fade-up flex flex-col md:flex-row md:items-start gap-4">
        <Avatar
          initials={user.initials}
          imageUrl={user.photoUrl}
          alt={`Foto de ${user.name}`}
          size="xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-[-0.4px]">
                {user.name}
              </h2>
              <p className="text-[13px] text-[var(--text2)] mt-0.5">
                {user.role}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={openProfileEdit}>
              <IconEdit size={12} />
              Editar
            </Button>
          </div>
          <p className="text-[13px] text-[var(--text)] leading-relaxed mt-3">
            {user.bio}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <Tag variant="amber">{AREA_LABELS[user.area]}</Tag>
            <Tag variant="neutral">{EXPERIENCE_LABELS[user.experience]}</Tag>
            <Tag variant="success">{AVAILABILITY_LABELS[user.availability]}</Tag>
          </div>
        </div>
      </Card>

      <Drawer
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
        ariaLabel="Editar información principal"
      >
        <DrawerHeader
          title="Editar información principal"
          description="Estos datos son los que aparecen en la card superior de tu perfil."
        />

        <div className="flex flex-col gap-3 mb-4">
          <ProfilePhotoPicker
            value={profileDraft.photoUrl}
            initials={initialsFromName(profileDraft.name)}
            name={profileDraft.name}
            onChange={(photoUrl) =>
              setProfileDraft((prev) => ({ ...prev, photoUrl }))
            }
          />

          <Field label="Nombre">
            <Input
              value={profileDraft.name}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Título o rol actual">
            <Input
              value={profileDraft.role}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Bio corta">
            <Textarea
              rows={4}
              value={profileDraft.bio}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Área funcional">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(AREA_LABELS) as FunctionalArea[]).map((id) => (
                <ProfileEditChip
                  key={id}
                  label={AREA_LABELS[id]}
                  selected={profileDraft.area === id}
                  onClick={() =>
                    setProfileDraft((prev) => ({ ...prev, area: id }))
                  }
                />
              ))}
            </div>
          </Field>

          <Field label="Años de experiencia">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(EXPERIENCE_LABELS) as ExperienceRange[]).map((id) => (
                <ProfileEditChip
                  key={id}
                  label={EXPERIENCE_LABELS[id]}
                  selected={profileDraft.experience === id}
                  onClick={() =>
                    setProfileDraft((prev) => ({ ...prev, experience: id }))
                  }
                />
              ))}
            </div>
          </Field>

          <Field label="Disponibilidad">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(AVAILABILITY_LABELS) as Availability[]).map((id) => (
                <ProfileEditChip
                  key={id}
                  label={AVAILABILITY_LABELS[id]}
                  selected={profileDraft.availability === id}
                  onClick={() =>
                    setProfileDraft((prev) => ({ ...prev, availability: id }))
                  }
                />
              ))}
            </div>
          </Field>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setProfileEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveProfileEdit}
            disabled={savingProfile}
          >
            {savingProfile ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Card padding="default" className="ds-fade-up grid grid-cols-3 gap-4">
        <Stat label="Matches" value={user.stats.matches} />
        <Stat label="Conexiones" value={user.stats.connections} />
        <Stat label="Mensajes" value={user.stats.messages} />
      </Card>

      <Card padding="default" className="ds-fade-up flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold tracking-[-0.2px]">Visibilidad</h3>
          <p className="text-[12px] text-[var(--text2)] mt-0.5">
            {visible
              ? "Apareces en búsquedas de otros builders."
              : "Estás oculto. Nadie te ve en búsquedas."}
          </p>
        </div>
        <Toggle checked={visible} onCheckedChange={() => toggle()} label="Visibilidad" />
      </Card>

      <Card padding="default" className="ds-fade-up">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="ds-label-uppercase">Ubicación y radio</h3>
          <button
            type="button"
            onClick={openLocationEdit}
            className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1"
            aria-label="Editar ubicación y radio"
          >
            <IconEdit size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[13px] text-[var(--text)]">
            <IconMapPin size={14} className="text-[var(--text3)]" />
            <span>{user.city}</span>
            <span className="text-[var(--text3)]">
              · radio de {user.searchRadiusKm ?? 50} km
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(user.cities ?? [user.city]).map((city) => (
              <Tag key={city} variant="neutral">
                {city}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      <Drawer
        open={locationEditOpen}
        onOpenChange={setLocationEditOpen}
        ariaLabel="Editar ubicación y radio"
      >
        <DrawerHeader
          title="Editar ubicación y radio"
          description="Define dónde estás y en qué ciudades quieres aparecer cuando tu búsqueda esté activa."
        />

        <div className="flex flex-col gap-3 mb-4">
          <Field label="Ciudad principal">
            <Input
              list="profile-cities-list"
              value={locationDraft.city}
              onChange={(e) =>
                setLocationDraft((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              placeholder="ej. Ciudad de México"
            />
            <datalist id="profile-cities-list">
              {CITIES_CATALOG.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </Field>

          <Field
            label="Ciudades donde mi búsqueda está activa"
            hint="Puedes seleccionar varias ciudades principales de México, Colombia, EE.UU. y LatAm."
          >
            <CitySelector
              value={locationDraft.cities}
              onChange={(cities) =>
                setLocationDraft((prev) => ({ ...prev, cities }))
              }
            />
          </Field>

          <Field
            label="Radio de búsqueda"
            hint={`${locationDraft.searchRadiusKm} km alrededor de tu ciudad principal`}
          >
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={locationDraft.searchRadiusKm}
              onChange={(e) =>
                setLocationDraft((prev) => ({
                  ...prev,
                  searchRadiusKm: Number(e.target.value),
                }))
              }
              className="w-full accent-[var(--p)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--text3)]">
              <span>5 km</span>
              <span>300 km</span>
            </div>
          </Field>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setLocationEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveLocationEdit}
            disabled={savingLocation}
          >
            {savingLocation ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <ProfileSection
        title="Logro destacado"
        editTitle="Logro destacado"
        editDescription="Una línea sobre tu logro más relevante."
        editContent={
          <Field label="Logro">
            <Input defaultValue={user.achievement} />
          </Field>
        }
      >
        <p className="text-[13px] text-[var(--text)] leading-relaxed">
          {user.achievement}
        </p>
      </ProfileSection>

      <Card padding="default" className="ds-fade-up">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="ds-label-uppercase">Disponibilidad y forma de trabajar</h3>
          <button
            type="button"
            onClick={openWorkPrefsEdit}
            className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1"
            aria-label="Editar disponibilidad y forma de trabajar"
          >
            <IconEdit size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Tag variant="success">{AVAILABILITY_LABELS[user.availability]}</Tag>
          <div className="flex flex-wrap gap-1.5">
            {user.workStyle.map((w) => (
              <Tag key={w} variant="neutral">
                {WORK_STYLE_LABELS[w]}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      <Drawer
        open={workPrefsEditOpen}
        onOpenChange={setWorkPrefsEditOpen}
        ariaLabel="Editar disponibilidad y forma de trabajar"
      >
        <DrawerHeader
          title="Disponibilidad y forma de trabajar"
          description="Elige únicamente opciones estandarizadas para mejorar el matching."
        />

        <div className="flex flex-col gap-3 mb-4">
          <Field label="Disponibilidad">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(AVAILABILITY_LABELS) as Availability[]).map((id) => (
                <ProfileEditChip
                  key={id}
                  label={AVAILABILITY_LABELS[id]}
                  selected={workPrefsDraft.availability === id}
                  onClick={() =>
                    setWorkPrefsDraft((prev) => ({
                      ...prev,
                      availability: id,
                    }))
                  }
                />
              ))}
            </div>
          </Field>

          <Field label="Forma de trabajar">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(WORK_STYLE_LABELS) as WorkStyle[]).map((id) => (
                <ProfileEditChip
                  key={id}
                  label={WORK_STYLE_LABELS[id]}
                  selected={workPrefsDraft.workStyle.includes(id)}
                  onClick={() => toggleWorkStyle(id)}
                />
              ))}
            </div>
          </Field>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setWorkPrefsEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveWorkPrefsEdit}
            disabled={savingWorkPrefs}
          >
            {savingWorkPrefs ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <ProfileSection
        title="Industrias de afinidad"
        editTitle="Industrias de afinidad"
        editContent={
          <Field label="Industrias">
            <Input defaultValue={user.industries.join(", ")} />
          </Field>
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {user.industries.map((i) => (
            <Tag key={i} variant="green">
              {i}
            </Tag>
          ))}
        </div>
      </ProfileSection>

      <ProfileSection
        title="Tipos de relación que busco"
        editTitle="Tipos de relación que busco"
        editContent={
          <p className="text-[12px] text-[var(--text2)]">
            Edita aquí los tipos de relación que estás buscando.
          </p>
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {user.relationsLooking.map((r) => (
            <Tag key={r} variant="brand">
              {RELATION_LABELS[r]}
            </Tag>
          ))}
        </div>
      </ProfileSection>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-[22px] font-extrabold tracking-[-0.4px] text-[var(--text)]">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)] mt-1">
        {label}
      </div>
    </div>
  )
}

function ProfileEditChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-[12px] border transition-colors",
        selected
          ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)]"
          : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]"
      )}
    >
      {label}
    </button>
  )
}

