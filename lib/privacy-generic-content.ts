/**
 * Aviso de privacidad genérico (informativo). No sustituye asesoría legal ni un Aviso integral.
 * Última actualización del texto: ver PRIVACY_LAST_UPDATED.
 */

export const PRIVACY_LAST_UPDATED = "2026-05-10"

export interface PrivacySection {
  id: string
  title: string
  paragraphs: readonly string[]
}

export const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    paragraphs: [
      "El responsable del tratamiento de los datos personales que nos proporciones al usar Murmur («la Plataforma») es quien opera el sitio y los servicios asociados a Murmur, conforme a lo publicado en el sitio web y en este aviso.",
    ],
  },
  {
    id: "datos",
    title: "2. Datos personales que podemos recabar",
    paragraphs: [
      "Según cómo uses la Plataforma, podemos tratar, entre otros: datos de registro e identificación (nombre, correo electrónico, credenciales); datos de perfil profesional que elijas compartir (por ejemplo, biografía, ciudad, objetivos, habilidades, enlaces); datos de uso e interacción (conexiones, búsquedas, preferencias, registros técnicos como dirección IP, tipo de dispositivo y eventos de seguridad); y, si contratas un plan de pago, datos de facturación o identificadores que procesa la pasarela de pagos de terceros (por ejemplo Stripe), no conservando nosotros en la medida posible el número completo de tarjeta.",
    ],
  },
  {
    id: "finalidades",
    title: "3. Finalidades del tratamiento",
    paragraphs: [
      "Tratamos datos personales para: crear y administrar tu cuenta; mostrarte perfiles y facilitar conexiones alineadas con tu intención; operar, mantener y mejorar la Plataforma; comunicaciones relacionadas con el servicio (por ejemplo, verificación, soporte, avisos importantes); seguridad, prevención de fraude y cumplimiento de obligaciones legales; y, cuando corresponda, gestionar suscripciones y pagos a través de proveedores autorizados.",
    ],
  },
  {
    id: "base",
    title: "4. Base jurídica y consentimiento",
    paragraphs: [
      "Cuando la ley aplicable lo exija, el tratamiento se fundará en tu consentimiento, en la relación contractual o precontractual contigo, en intereses legítimos compatibles con tus derechos (por ejemplo, seguridad y mejora del servicio) o en obligaciones legales. Podrás revocar el consentimiento en los casos previstos por la ley, lo que podría afectar tu capacidad de usar ciertas funciones.",
    ],
  },
  {
    id: "transferencias",
    title: "5. Encargados y transferencias",
    paragraphs: [
      "Podemos compartir datos con proveedores que nos prestan servicios necesarios para operar la Plataforma (por ejemplo, alojamiento, autenticación, analítica, soporte, procesamiento de pagos), bajo obligaciones de confidencialidad y tratamiento acorde a este aviso.",
      "Algunos proveedores pueden estar en México o en el extranjero. Cuando exista transferencia internacional, procuramos implementar salvaguardas adecuadas conforme a la normativa aplicable.",
    ],
  },
  {
    id: "conservacion",
    title: "6. Conservación",
    paragraphs: [
      "Conservamos los datos el tiempo necesario para cumplir las finalidades descritas, mientras tu cuenta esté activa o exista una relación jurídica, y después por los plazos que impongan la ley o la defensa de derechos. Cuando ya no sean necesarios, se suprimen o anonimizan según proceda.",
    ],
  },
  {
    id: "derechos",
    title: "7. Derechos de las personas titulares",
    paragraphs: [
      "Si la ley de tu país te otorga derechos respecto de tus datos personales (por ejemplo, acceso, rectificación, cancelación, oposición, limitación del tratamiento, portabilidad o retiro de consentimiento), puedes ejercerlos escribiendo al correo de contacto indicado en el sitio web, indicando tu solicitud y acreditando tu identidad de forma razonable.",
    ],
  },
  {
    id: "cookies",
    title: "8. Cookies y tecnologías similares",
    paragraphs: [
      "Podemos usar cookies u otras tecnologías esenciales para el funcionamiento, seguridad y preferencias de sesión. Si en el futuro incorporamos analítica u otras no esenciales, podemos informarlo y, cuando la ley lo requiera, solicitar tu consentimiento.",
    ],
  },
  {
    id: "menores",
    title: "9. Menores de edad",
    paragraphs: [
      "La Plataforma no está dirigida a menores que no puedan otorgar consentimiento válido según la ley aplicable. Si detectamos cuentas de menores sin la autorización correspondiente, podremos eliminarlas.",
    ],
  },
  {
    id: "cambios",
    title: "10. Cambios a este aviso",
    paragraphs: [
      "Podemos actualizar este aviso para reflejar cambios en el servicio o en la ley. Publicaremos la versión vigente en el sitio con su fecha de actualización. El uso continuado de la Plataforma después de cambios relevantes puede implicar, cuando proceda, tu aceptación del aviso revisado.",
    ],
  },
  {
    id: "contacto",
    title: "11. Contacto",
    paragraphs: [
      "Para preguntas sobre privacidad o para ejercer tus derechos, contacta mediante el correo publicado como contacto del sitio.",
    ],
  },
] as const

export const PRIVACY_DISCLAIMER =
  "Este aviso es de carácter general e informativo. No constituye asesoría legal completa. Para un cumplimiento regulatorio específico (por ejemplo, Aviso de privacidad integral ante el INAI), consulta a un profesional."
