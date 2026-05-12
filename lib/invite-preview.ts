export type InvitePreviewResponse = {
  ok: boolean
  master?: boolean
  inviter?: {
    name: string
    photoUrl: string | null
    role: string
  } | null
  error?: string
}
