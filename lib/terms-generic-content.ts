/**
 * Términos y condiciones genéricos (informativos). No sustituyen asesoría legal.
 * Última actualización del texto: ver TERMS_LAST_UPDATED.
 */

export const TERMS_LAST_UPDATED = "2026-05-10"

export interface TermsSection {
  id: string
  title: string
  paragraphs: readonly string[]
}

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: "aceptacion",
    title: "1. Aceptación",
    paragraphs: [
      "Al registrarte, acceder o usar Murmur («el Servicio»), aceptas estos términos y condiciones. Si no estás de acuerdo, no uses el Servicio.",
    ],
  },
  {
    id: "servicio",
    title: "2. Qué es Murmur",
    paragraphs: [
      "Murmur es una plataforma en línea que facilita que personas se descubran, conecten y comuniquen en un contexto profesional (por ejemplo, co-founders, talento, mentores u oportunidades). Murmur no es una agencia de empleo, no participa en contrataciones ni garantiza resultados comerciales, laborales o de inversión entre usuarios.",
    ],
  },
  {
    id: "cuenta",
    title: "3. Tu cuenta",
    paragraphs: [
      "Debes proporcionar información veraz y mantener la seguridad de tu cuenta y contraseña. Eres responsable de la actividad que ocurra con tu cuenta. Debes tener la edad legal para celebrar contratos en tu jurisdicción o contar con autorización válida.",
    ],
  },
  {
    id: "conducta",
    title: "4. Uso permitido y conducta",
    paragraphs: [
      "Te comprometes a usar el Servicio de forma lícita y respetuosa. Está prohibido, entre otros: acosar, amenazar o discriminar; enviar spam o mensajes masivos no solicitados; suplantar identidades; distribuir malware; vulnerar sistemas; usar el Servicio para actividades ilegales; o interferir con el funcionamiento de la plataforma o de otros usuarios.",
      "Podemos suspender o cancelar cuentas que incumplan estos términos o que consideremos perjudiciales para la comunidad.",
    ],
  },
  {
    id: "contenido",
    title: "5. Contenido que publicas",
    paragraphs: [
      "Conservas los derechos sobre el contenido que subes o publicas (texto, imágenes, datos de perfil, etc.). Nos otorgas una licencia no exclusiva, mundial y gratuita para alojar, mostrar, reproducir y distribuir ese contenido en la medida necesaria para operar, mejorar y promocionar el Servicio.",
      "Declaras que tienes derecho a compartir dicho contenido y que no infringe derechos de terceros.",
    ],
  },
  {
    id: "conexiones",
    title: "6. Interacciones entre usuarios",
    paragraphs: [
      "Las relaciones, acuerdos o conversaciones entre usuarios son responsabilidad exclusiva de dichas partes. Murmur no media obligaciones contractuales entre usuarios ni garantiza la identidad, competencia o intenciones de nadie. Te recomendamos prudencia al compartir datos sensibles o cerrar acuerdos fuera de la plataforma.",
    ],
  },
  {
    id: "pagos",
    title: "7. Planes de pago y suscripciones",
    paragraphs: [
      "Las funciones Premium pueden estar sujetas a pago. Los pagos se procesan a través de proveedores de pago de terceros (por ejemplo, Stripe), sujetos a sus propios términos y políticas.",
      "Los precios, impuestos y renovaciones se muestran antes de contratar cuando corresponda. La cancelación del plan Premium puede estar sujeta a reglas de la pasarela y del momento de facturación en curso.",
    ],
  },
  {
    id: "propiedad",
    title: "8. Propiedad intelectual de Murmur",
    paragraphs: [
      "El nombre, marca, diseño, software y materiales de Murmur están protegidos. No copies, modiques ni explotes dichos elementos sin autorización escrita, salvo lo permitido por la ley.",
    ],
  },
  {
    id: "limitacion",
    title: "9. Exclusión de garantías y límite de responsabilidad",
    paragraphs: [
      "El Servicio se ofrece «tal cual» y «según disponibilidad». En la medida máxima permitida por la ley, Murmur no garantiza disponibilidad ininterrumpida, ausencia de errores ni resultados concretos.",
      "En la medida permitida por la ley aplicable, Murmur y sus equipos no serán responsables por daños indirectos, lucro cesante, pérdida de datos u otros daños emergentes derivados del uso o la imposibilidad de uso del Servicio.",
    ],
  },
  {
    id: "cambios",
    title: "10. Cambios en el Servicio y en estos términos",
    paragraphs: [
      "Podemos modificar o interrumpir funciones del Servicio y actualizar estos términos. Cuando los cambios sean materiales, procuraremos avisar por medios razonables (por ejemplo, en la aplicación o por correo). El uso continuado tras la entrada en vigor implica, cuando la ley lo permita, la aceptación de los cambios.",
    ],
  },
  {
    id: "contacto",
    title: "11. Contacto",
    paragraphs: [
      "Para consultas sobre estos términos puedes escribir al correo de contacto indicado en el sitio web.",
    ],
  },
  {
    id: "legislacion",
    title: "12. Legislación aplicable",
    paragraphs: [
      "Salvo que la ley imperativa disponga lo contrario, estos términos se interpretan conforme a las leyes de los Estados Unidos Mexicanos. Las partes se someten, renunciando a cualquier otro fuero que pudiera corresponderles, a los tribunales competentes en la Ciudad de México, México.",
    ],
  },
] as const

export const TERMS_DISCLAIMER =
  "Este documento es de carácter general e informativo. No constituye asesoría legal. Para obligaciones específicas, consulta a un profesional."
