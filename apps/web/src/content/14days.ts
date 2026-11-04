/**
 * Copy for the /14days campaign. Edit here — do not scatter strings in components.
 *
 * LEGAL REVIEW (before publishing): checklist items, hero subline, cards, and
 * disclaimers against the UPL spec. This file is not a legal opinion.
 * Counsel should review all checklist and legal copy before ads go live.
 */

export type DaysLocale = "en" | "es";

export const DAYS_PATH = {
  en: "/14days",
  es: "/es/14dias",
} as const;

export const DAYS_THANKS_PATH = {
  en: "/14days/thanks",
  es: "/es/14dias/gracias",
} as const;

export const DAYS_PDF_PATH = {
  en: "/downloads/14-day-pip-checklist-en.pdf",
  es: "/downloads/14-day-pip-checklist-es.pdf",
} as const;

export const ATTR_COOKIE = "cs_14days_attr";
export const ADS_CONSENT_COOKIE = "cs_14days_ads";
export const ATTR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Exact TCPA copy shown next to the optional SMS checkbox. Store this string with the lead. */
export const SMS_CONSENT_TEXT = {
  en: "I agree to receive text messages from ClaimSaver+ about my checklist and PIP deadlines. Msg & data rates may apply. Reply STOP to opt out. Consent is not a condition of purchase.",
  es: "Acepto recibir mensajes de texto de ClaimSaver+ sobre mi lista y los plazos de PIP. Pueden aplicar tarifas de mensajes y datos. Responde STOP para cancelar. El consentimiento no es una condición de compra.",
} as const;

export const SELF_HELP_ACK = {
  en: "I understand ClaimSaver+ provides self-help tools, not legal advice or claim representation.",
  es: "Entiendo que ClaimSaver+ ofrece herramientas de autoayuda, no asesoría legal ni representación en un reclamo.",
} as const;

export const PAGE_DISCLAIMER = {
  en: "ClaimSaver+ is self-help software. It is not a law firm, insurer, or public adjuster and does not provide legal advice or represent you. Information is general and may not apply to your situation. For legal advice, consult a Florida attorney.",
  es: "ClaimSaver+ es software de autoayuda. No es un bufete, una aseguradora ni un ajustador público, y no ofrece asesoría legal ni te representa. La información es general y puede no aplicar a tu situación. Para asesoría legal, consulta a un abogado de Florida.",
} as const;

/**
 * Checklist body. Use exactly this English. Flagged for legal review.
 * Spanish is a natural tú translation, flagged for native-speaker review.
 */
export const CHECKLIST_ITEMS = {
  en: [
    "Get medical care within 14 days of the crash. Initial treatment must come from a qualifying provider (for example, a medical doctor, osteopathic physician, chiropractor, dentist, hospital/ER, or emergency medical services) to be eligible for PIP benefits.",
    "Tell your own auto insurer about the crash as soon as possible. In Florida, your own PIP coverage is usually the first source of medical and lost-wage benefits, even if you weren't at fault.",
    "Write down your claim number, adjuster's name, and contact info.",
    "Get your crash report number from the responding law enforcement agency.",
    "Keep every document: medical bills, receipts, letters, emails, and texts from your insurer. Photos of the vehicles and scene help too.",
    "Watch for EUO and IME requests. Your insurer may ask you to give an Examination Under Oath or attend an Independent Medical Exam. Put the dates on your calendar. Missing them without a good reason can put your benefits at risk.",
    "If you missed work, collect proof of lost income (pay stubs, an employer letter, or tax records). PIP generally covers 60% of lost income, up to your policy limits.",
    "Know what PIP generally pays: 80% of reasonable medical expenses, up to $10,000 in total benefits. Coverage may be limited to $2,500 unless a qualifying provider determines you had an emergency medical condition. You may owe the remaining 20%.",
    "If a bill or claim is denied, ask for the reason in writing and keep a copy. You may want to speak with a Florida attorney about your options.",
  ],
  es: [
    "Recibe atención médica dentro de 14 días del accidente. El tratamiento inicial debe venir de un proveedor que califique (por ejemplo, un médico, osteópata, quiropráctico, dentista, hospital/sala de emergencias o servicios médicos de emergencia) para ser elegible a beneficios de PIP.",
    "Avisa a tu propia aseguradora de auto sobre el accidente lo antes posible. En Florida, tu propia cobertura PIP suele ser la primera fuente de beneficios médicos y de salarios perdidos, aunque no hayas tenido la culpa.",
    "Anota tu número de reclamo, el nombre del ajustador y sus datos de contacto.",
    "Obtén el número del reporte del accidente de la agencia policial que respondió.",
    "Guarda cada documento: facturas médicas, recibos, cartas, correos y mensajes de tu aseguradora. Las fotos de los vehículos y de la escena también ayudan.",
    "Estate atento a solicitudes de EUO e IME. Tu aseguradora puede pedirte una declaración bajo juramento (Examination Under Oath) o un examen médico independiente (IME). Anota las fechas en tu calendario. Faltar sin una razón válida puede poner en riesgo tus beneficios.",
    "Si perdiste días de trabajo, reúne prueba de ingresos perdidos (talones de pago, una carta del empleador o registros de impuestos). El PIP generalmente cubre el 60% de los salarios perdidos, hasta los límites de tu póliza.",
    "Conoce lo que el PIP generalmente paga: el 80% de los gastos médicos razonables, hasta $10,000 en beneficios totales. La cobertura puede limitarse a $2,500 a menos que un proveedor que califique determine que tuviste una condición médica de emergencia. Es posible que debas el 20% restante.",
    "Si una factura o un reclamo es denegado, pide la razón por escrito y guarda una copia. Tal vez quieras hablar con un abogado de Florida sobre tus opciones.",
  ],
} as const;

const FAQ = {
  en: [
    {
      question: "How long do I have to get medical care for Florida PIP?",
      answer:
        "Florida PIP generally requires initial treatment within 14 days of the crash, from a qualifying provider, to be eligible for PIP benefits.",
    },
    {
      question: "What does Florida PIP generally pay?",
      answer:
        "PIP generally pays 80% of reasonable medical expenses and 60% of lost income, up to policy limits. Total benefits are often up to $10,000, and coverage may be limited to $2,500 unless a qualifying provider determines you had an emergency medical condition. You may owe the remaining 20% of medical bills.",
    },
    {
      question: "What if my insurer asks for an EUO or IME?",
      answer:
        "Your insurer may ask you to give an Examination Under Oath or attend an Independent Medical Exam. Put the dates on your calendar. Missing them without a good reason can put your benefits at risk.",
    },
  ],
  es: [
    {
      question: "¿Cuánto tiempo tengo para recibir atención médica para el PIP de Florida?",
      answer:
        "El PIP de Florida generalmente exige tratamiento inicial dentro de 14 días del accidente, de un proveedor que califique, para ser elegible a beneficios de PIP.",
    },
    {
      question: "¿Qué paga generalmente el PIP de Florida?",
      answer:
        "El PIP generalmente paga el 80% de los gastos médicos razonables y el 60% de los salarios perdidos, hasta los límites de la póliza. Los beneficios totales suelen ser de hasta $10,000, y la cobertura puede limitarse a $2,500 a menos que un proveedor que califique determine que tuviste una condición médica de emergencia. Es posible que debas el 20% restante de las facturas médicas.",
    },
    {
      question: "¿Qué pasa si mi aseguradora pide un EUO o un IME?",
      answer:
        "Tu aseguradora puede pedirte una declaración bajo juramento (EUO) o un examen médico independiente (IME). Anota las fechas en tu calendario. Faltar sin una razón válida puede poner en riesgo tus beneficios.",
    },
  ],
} as const;

export const daysCopy = {
  en: {
    htmlLang: "en" as const,
    path: DAYS_PATH.en,
    otherPath: DAYS_PATH.es,
    thanksPath: DAYS_THANKS_PATH.en,
    pdfPath: DAYS_PDF_PATH.en,
    pdfHrefLang: "en" as const,
    metaTitle: "14 Days. Florida PIP Checklist | ClaimSaver+",
    metaDescription:
      "Hurt in a Florida car crash? You have 14 days to get medical care for PIP. Get the free step-by-step checklist in English or Spanish.",
    ogAlt: "14 DAYS. Florida PIP checklist from ClaimSaver+",
    langToggleCurrent: "EN",
    langToggleOther: "ES",
    langToggleLabel: "Language",
    heroKicker: "Florida no-fault (PIP)",
    heroTitle: "14 DAYS.",
    heroSubline:
      "Hurt in a crash in Florida? That's how long you have to get medical care, or you could lose your PIP benefits.",
    heroCta: "Get the free checklist",
    heroTrust: "Built by a licensed Florida adjuster. Free. English & Spanish.",
    cardsHeading: "What most people don't know",
    cards: [
      {
        title: "14 days to get treated",
        body: "Florida PIP requires initial care within 14 days of the crash.",
      },
      {
        title: "Your insurer may require exams",
        body: "Missing an Examination Under Oath (EUO) or a medical exam (IME) can put benefits at risk.",
      },
      {
        title: "PIP doesn't cover everything",
        body: "PIP generally pays 80% of reasonable medical bills and 60% of lost income, up to policy limits.",
      },
    ],
    formId: "get-checklist",
    formHeading: "Get the free Florida 14-Day PIP Checklist",
    formIntro:
      "Enter your email and we’ll send the PDF. We do not ask for crash details, medical information, or your policy number on this form.",
    firstName: "First name",
    email: "Email",
    phone: "Mobile phone (optional)",
    language: "Preferred language",
    languageEn: "English",
    languageEs: "Spanish",
    ackLabel: SELF_HELP_ACK.en,
    smsLabel: SMS_CONSENT_TEXT.en,
    submit: "Send me the checklist",
    submitting: "Sending…",
    honeypot: "Company website",
    errorGeneric: "We couldn’t send the checklist. Try again in a few minutes.",
    errorRateLimit: "Too many tries from this network. Wait an hour and try again.",
    errorFirstName: "Enter your first name.",
    errorEmail: "Enter a valid email address.",
    errorPhone: "Enter a valid U.S. mobile number, or leave it blank.",
    errorAck: "Confirm that you understand ClaimSaver+ is self-help software, not legal advice.",
    errorSms: "To share a mobile number, check the box that you agree to text messages — or leave the number blank.",
    founder:
      "Miguel Fernandez, M.Sc. · Licensed Florida all-lines adjuster · Former litigation paralegal · Built in Miami, Cohort 4",
    clinicsHeading: "Run a PIP clinic? Your patients have 14 days. Do they know?",
    clinicsCta: "Book a 15-minute demo",
    clinicsMailtoSubject: "Clinic demo",
    disclaimer: PAGE_DISCLAIMER.en,
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    thanksTitle: "Your checklist is ready",
    thanksBody:
      "Download the Florida 14-Day PIP Checklist. We also emailed the same link. You stay the filer — this is a self-help list, not legal advice.",
    thanksDownload: "Download the checklist (PDF)",
    thanksHome: "Back to ClaimSaver+",
    cookieTitle: "Cookies on this page",
    cookieBody:
      "We use a first-party cookie to remember how you found this checklist (for 30 days). Optional: Google Ads and Meta pixels on this campaign only — they never receive your name, email, or phone.",
    cookieAccept: "Accept optional pixels",
    cookieDecline: "Essential only",
    faq: FAQ.en,
    emailSubject: "Your Florida 14-Day PIP Checklist",
    emailPreview: "Download your free ClaimSaver+ checklist.",
    emailHeading: "Your Florida 14-Day PIP Checklist",
    emailBody:
      "Thanks for requesting the checklist. Use the button below to download the PDF. ClaimSaver+ is self-help software — you remain the filer.",
    emailCta: "Download the checklist",
    emailFoot: PAGE_DISCLAIMER.en,
  },
  es: {
    htmlLang: "es" as const,
    path: DAYS_PATH.es,
    otherPath: DAYS_PATH.en,
    thanksPath: DAYS_THANKS_PATH.es,
    pdfPath: DAYS_PDF_PATH.es,
    pdfHrefLang: "es" as const,
    metaTitle: "14 Días. Lista de PIP en Florida | ClaimSaver+",
    metaDescription:
      "¿Tuviste un accidente de auto en Florida? Tienes 14 días para recibir atención médica para el PIP. Descarga la lista paso a paso, gratis, en inglés o español.",
    ogAlt: "14 DÍAS. Lista de PIP en Florida de ClaimSaver+",
    langToggleCurrent: "ES",
    langToggleOther: "EN",
    langToggleLabel: "Idioma",
    heroKicker: "Sin culpa (PIP) en Florida",
    heroTitle: "14 DÍAS.",
    heroSubline:
      "¿Tuviste un accidente en Florida? Ese es el plazo para recibir atención médica, o podrías perder tus beneficios de PIP.",
    heroCta: "Descarga la lista gratis",
    heroTrust: "Creado por un ajustador con licencia en Florida. Gratis. Inglés y español.",
    cardsHeading: "Lo que la mayoría no sabe",
    cards: [
      {
        title: "14 días para recibir tratamiento",
        body: "El PIP de Florida exige atención inicial dentro de 14 días del accidente.",
      },
      {
        title: "Tu aseguradora puede exigir exámenes",
        body: "Faltar a una declaración bajo juramento (EUO) o a un examen médico (IME) puede poner en riesgo tus beneficios.",
      },
      {
        title: "El PIP no cubre todo",
        body: "El PIP generalmente paga el 80% de las facturas médicas razonables y el 60% de los salarios perdidos, hasta los límites de la póliza.",
      },
    ],
    formId: "get-checklist",
    formHeading: "Descarga la lista gratis de PIP de 14 días en Florida",
    formIntro:
      "Escribe tu correo y te enviamos el PDF. En este formulario no pedimos detalles del accidente, información médica ni el número de póliza.",
    firstName: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono móvil (opcional)",
    language: "Idioma preferido",
    languageEn: "Inglés",
    languageEs: "Español",
    ackLabel: SELF_HELP_ACK.es,
    smsLabel: SMS_CONSENT_TEXT.es,
    submit: "Envíame la lista",
    submitting: "Enviando…",
    honeypot: "Sitio web de la empresa",
    errorGeneric: "No pudimos enviar la lista. Inténtalo de nuevo en unos minutos.",
    errorRateLimit: "Demasiados intentos desde esta red. Espera una hora e inténtalo de nuevo.",
    errorFirstName: "Escribe tu nombre.",
    errorEmail: "Escribe un correo electrónico válido.",
    errorPhone: "Escribe un número móvil de EE. UU. válido, o déjalo en blanco.",
    errorAck: "Confirma que entiendes que ClaimSaver+ es software de autoayuda, no asesoría legal.",
    errorSms:
      "Para compartir un número móvil, marca que aceptas mensajes de texto — o deja el número en blanco.",
    founder:
      "Miguel Fernandez, M.Sc. · Ajustador de líneas generales con licencia en Florida · Exparalegal de litigios · Built in Miami, Cohort 4",
    clinicsHeading: "¿Tienes una clínica de PIP? Tus pacientes tienen 14 días. ¿Lo saben?",
    clinicsCta: "Agenda una demo de 15 minutos",
    clinicsMailtoSubject: "Clinic demo",
    disclaimer: PAGE_DISCLAIMER.es,
    terms: "Términos del servicio",
    privacy: "Política de privacidad",
    thanksTitle: "Tu lista está lista",
    thanksBody:
      "Descarga la lista de PIP de 14 días en Florida. También te enviamos el mismo enlace por correo. Tú sigues siendo quien presenta el reclamo: esto es una lista de autoayuda, no asesoría legal.",
    thanksDownload: "Descargar la lista (PDF)",
    thanksHome: "Volver a ClaimSaver+",
    cookieTitle: "Cookies en esta página",
    cookieBody:
      "Usamos una cookie propia para recordar cómo llegaste a esta lista (30 días). Opcional: píxeles de Google Ads y Meta solo en esta campaña — nunca reciben tu nombre, correo ni teléfono.",
    cookieAccept: "Aceptar píxeles opcionales",
    cookieDecline: "Solo esenciales",
    faq: FAQ.es,
    emailSubject: "Tu lista de PIP de 14 días en Florida",
    emailPreview: "Descarga tu lista gratis de ClaimSaver+.",
    emailHeading: "Tu lista de PIP de 14 días en Florida",
    emailBody:
      "Gracias por pedir la lista. Usa el botón para descargar el PDF. ClaimSaver+ es software de autoayuda: tú sigues siendo quien presenta el reclamo.",
    emailCta: "Descargar la lista",
    emailFoot: PAGE_DISCLAIMER.es,
  },
} as const;

export type DaysCopy = (typeof daysCopy)[DaysLocale];

export function getDaysCopy(locale: DaysLocale): DaysCopy {
  return daysCopy[locale];
}
