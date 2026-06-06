/**
 * Defaults de plataforma: ventanas de carga, tiempos de UI y topes de expresión.
 * Valores compartidos entre feed, conexiones, onboarding y realtime.
 */

/** Perfiles visibles por pasada en Descubrir (grid 3×11). */
export const DISCOVER_FEED_PROFILE_LIMIT = 33

/** Radio de radar por defecto al registrar ubicación (km). */
export const DEFAULT_SEARCH_RADIUS_KM = 33

/** Máximo de caracteres en el dato curioso del perfil. */
export const FUN_FACT_MAX_LENGTH = 333

/** Debounce al validar código de invitación en signup (ms). */
export const INVITE_PREVIEW_DEBOUNCE_MS = 330

/** Animación del radar antes de hidratar el feed (ms). */
export const RADAR_ACTIVATION_MS = 3300

/** IDs máximos por lote en filtros Realtime in.() (tope Supabase: 100). */
export const REALTIME_IN_FILTER_MAX = 99

/** Boost de score por coincidencia de ciudad en match (puntos 0–100). */
export const MATCH_CITY_SCORE_BOOST = 9
