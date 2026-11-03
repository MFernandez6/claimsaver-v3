import type { ArticleKey } from "./keys";

export type ArticleFaq = { question: string; answer: string };

const EN: Record<ArticleKey, readonly ArticleFaq[]> = {
  pipSteps: [
    {
      question: "What is a typical Florida PIP filing workflow?",
      answer:
        "Many people start with policy documents, a notice of the crash if required, a PIP application or equivalent intake, and records that support medical or wage benefits. Requirements vary by carrier and policy. This is general education, not a filing instruction for your case.",
    },
    {
      question: "Does ClaimSaver+ send my PIP package to the insurer?",
      answer:
        "No. ClaimSaver+ is self-help software. You remain the filer and you send materials to your insurer. Saving a worksheet stores a draft in your account only.",
    },
    {
      question: "Is this article legal advice?",
      answer:
        "No. It is general information about how Florida no-fault claims often work. It does not replace your policy, Florida law as applied to your facts, or advice from a licensed Florida attorney.",
    },
  ],
  fourteenDay: [
    {
      question: "What is the 14-day rule in Florida PIP?",
      answer:
        "Florida’s PIP statute includes timing requirements for certain initial medical services after a motor-vehicle accident. Many people hear this described as a 14-day window. The exact language, exceptions, and application belong to the statute, carriers, courts, and licensed attorneys.",
    },
    {
      question: "Does missing the window end every possible benefit?",
      answer:
        "Not necessarily in every scenario. Fact patterns differ and Florida law evolves. Do not treat this overview as a determination about your benefits. Compare any denial letter to authoritative sources or professional guidance.",
    },
    {
      question: "Does this page tell me which provider visit qualifies?",
      answer:
        "No. Not every visit to any practitioner counts. If you are unsure whether a particular clinic qualifies, ask the office or seek legal counsel. ClaimSaver+ does not analyze a provider’s credentialing.",
    },
  ],
  needLawyer: [
    {
      question: "Do you need an attorney for every Florida PIP claim?",
      answer:
        "Not every PIP claim requires hiring a lawyer. Straightforward files with clear coverage and timely paperwork may be organized without litigation. Whether that describes your situation is not something ClaimSaver+ determines.",
    },
    {
      question: "When do people often consider a licensed attorney?",
      answer:
        "Common signals include an outright denial, allegations of fraud, overlap with bodily injury or UM/UIM, examinations under oath, or other complexity beyond form-filling. Educational software cannot file a lawsuit or analyze those facts for you.",
    },
    {
      question: "Does ClaimSaver+ refer me to a lawyer?",
      answer:
        "No. ClaimSaver+ does not operate a lawyer referral service and does not pay or receive a fee for introducing you to an attorney. Educational pages are general information only.",
    },
  ],
  documents: [
    {
      question: "What documents are often used in a PIP file?",
      answer:
        "Many files include policy documents, crash reports, medical bills and notes, wage proofs when relevant, authorizations, and correspondence. Requirements vary by company and endorsement. Nothing here promises a carrier will accept every page.",
    },
    {
      question: "Does uploading files to ClaimSaver+ send them to my insurer?",
      answer:
        "No. Uploads stay in your document vault until you send them yourself. Saving or uploading is not a filing.",
    },
    {
      question: "Is this a required checklist for every claim?",
      answer:
        "No. It is an organizational overview. Carriers and policies differ. This article does not determine what you must submit.",
    },
  ],
  mistakes: [
    {
      question: "What delays commonly complicate PIP claims?",
      answer:
        "Common issues include postponing the first medical visit, delayed notice to the carrier, incomplete applications, and gaps in medical records. Early organization does not guarantee payment.",
    },
    {
      question: "Should I treat the adjuster as a neutral helper?",
      answer:
        "You can be courteous and still recognize that the adjuster works for the insurer. Misstatements in recorded calls can constrain later positions. This is practical guidance, not a comment on any specific case.",
    },
    {
      question: "Can software replace diligence or legal advice?",
      answer:
        "No. Tools and checklists reduce mechanical errors but cannot replace your review of letters, dates, and policy language. When a mistake feels consequential, consult a licensed Florida attorney rather than guessing.",
    },
  ],
};

const ES: Record<ArticleKey, readonly ArticleFaq[]> = {
  pipSteps: [
    {
      question: "¿Cómo suele ser un trámite PIP en Florida?",
      answer:
        "Muchas personas empiezan con la póliza, un aviso del accidente si aplica, una solicitud PIP o equivalente, y documentos que respalden beneficios médicos o salariales. Los requisitos varían. Esto es educación general, no una instrucción para su caso.",
    },
    {
      question: "¿ClaimSaver+ envía el paquete a mi aseguradora?",
      answer:
        "No. ClaimSaver+ es software de autoayuda. Usted sigue siendo quien presenta el reclamo y quien envía los materiales. Guardar la hoja solo almacena un borrador en su cuenta.",
    },
    {
      question: "¿Este artículo es asesoría legal?",
      answer:
        "No. Es información general sobre cómo suelen funcionar los reclamos sin culpa en Florida. No sustituye su póliza, la ley aplicada a sus hechos, ni el consejo de un abogado con licencia en Florida.",
    },
  ],
  fourteenDay: [
    {
      question: "¿Qué es la regla de 14 días en el PIP de Florida?",
      answer:
        "El estatuto de PIP incluye plazos para ciertos servicios médicos iniciales después de un accidente. Muchas personas lo describen como una ventana de 14 días. El texto exacto, las excepciones y su aplicación corresponden al estatuto, las aseguradoras, los tribunales y los abogados con licencia.",
    },
    {
      question: "¿Perder esa ventana termina todos los beneficios?",
      answer:
        "No necesariamente en todos los escenarios. Los hechos varían. No trate este resumen como una determinación sobre sus beneficios.",
    },
    {
      question: "¿Esta página dice qué visita califica?",
      answer:
        "No. No toda visita cuenta. Si no está seguro, pregunte al consultorio o busque consejo legal. ClaimSaver+ no analiza las credenciales de un proveedor.",
    },
  ],
  needLawyer: [
    {
      question: "¿Se necesita un abogado para cada reclamo PIP?",
      answer:
        "No. Algunos expedientes sencillos se organizan sin litigio. ClaimSaver+ no determina si esa es su situación.",
    },
    {
      question: "¿Cuándo suele considerarse un abogado con licencia?",
      answer:
        "Señales frecuentes: una denegación, alegaciones de fraude, traslape con lesiones corporales o UM/UIM, declaraciones bajo juramento, u otra complejidad más allá de llenar formularios.",
    },
    {
      question: "¿ClaimSaver+ me remite a un abogado?",
      answer:
        "No. ClaimSaver+ no opera un servicio de referidos ni paga o recibe honorarios por presentarle a un abogado. Las páginas educativas son información general.",
    },
  ],
  documents: [
    {
      question: "¿Qué documentos suelen usarse en un expediente PIP?",
      answer:
        "Con frecuencia: póliza, informe del accidente, facturas y notas médicas, pruebas de salarios si aplican, autorizaciones y correspondencia. Los requisitos varían. Nada aquí promete que la aseguradora acepte cada página.",
    },
    {
      question: "¿Subir archivos a ClaimSaver+ los envía a mi aseguradora?",
      answer:
        "No. Permanecen en su bóveda hasta que usted los envíe. Guardar o subir no es presentar el reclamo.",
    },
    {
      question: "¿Esta es una lista obligatoria para cada reclamo?",
      answer:
        "No. Es una guía de organización. Las aseguradoras y las pólizas difieren.",
    },
  ],
  mistakes: [
    {
      question: "¿Qué demoras suelen complicar un reclamo PIP?",
      answer:
        "Posponer la primera visita médica, avisar tarde a la aseguradora, solicitudes incompletas y huecos en el expediente. Organizarse temprano no garantiza el pago.",
    },
    {
      question: "¿Debo tratar al ajustador como un ayudante neutral?",
      answer:
        "Puede ser cortés y reconocer que el ajustador trabaja para la aseguradora. Esto es orientación práctica, no un comentario sobre un caso concreto.",
    },
    {
      question: "¿El software sustituye la diligencia o el consejo legal?",
      answer:
        "No. Las herramientas reducen errores mecánicos. Cuando un error parece grave, consulte a un abogado con licencia en Florida.",
    },
  ],
};

const FR: Record<ArticleKey, readonly ArticleFaq[]> = {
  pipSteps: [
    {
      question: "À quoi ressemble un dossier PIP typique en Floride ?",
      answer:
        "Beaucoup commencent par la police, un avis d’accident si requis, une demande PIP ou équivalent, et des pièces pour les prestations médicales ou salariales. Les exigences varient. Ceci est une information générale, pas une instruction pour votre dossier.",
    },
    {
      question: "ClaimSaver+ envoie-t-il mon dossier à l’assureur ?",
      answer:
        "Non. ClaimSaver+ est un logiciel d’auto-assistance. Vous restez le déposant et vous envoyez les documents. Enregistrer la feuille ne stocke qu’un brouillon dans votre compte.",
    },
    {
      question: "Cet article est-il un conseil juridique ?",
      answer:
        "Non. C’est une information générale. Il ne remplace ni votre police, ni la loi appliquée à vos faits, ni l’avis d’un avocat agréé en Floride.",
    },
  ],
  fourteenDay: [
    {
      question: "Qu’est-ce que la règle des 14 jours en PIP floridien ?",
      answer:
        "La loi PIP prévoit des délais pour certains soins initiaux après un accident. Beaucoup parlent d’une fenêtre de 14 jours. Le texte exact, les exceptions et l’application appartiennent à la loi, aux assureurs, aux tribunaux et aux avocats agréés.",
    },
    {
      question: "Manquer cette fenêtre met-il fin à toutes les prestations ?",
      answer:
        "Pas nécessairement dans tous les cas. Les faits diffèrent. Ne traitez pas cet aperçu comme une décision sur vos prestations.",
    },
    {
      question: "Cette page dit-elle quelle visite compte ?",
      answer:
        "Non. Toute visite ne compte pas. En cas de doute, demandez au cabinet ou consultez un avocat. ClaimSaver+ n’analyse pas les qualifications d’un prestataire.",
    },
  ],
  needLawyer: [
    {
      question: "Faut-il un avocat pour chaque dossier PIP ?",
      answer:
        "Non. Certains dossiers simples peuvent être organisés sans litige. ClaimSaver+ ne détermine pas si c’est votre situation.",
    },
    {
      question: "Quand envisage-t-on souvent un avocat agréé ?",
      answer:
        "Signaux fréquents : un refus, des allégations de fraude, un chevauchement avec des blessures corporelles ou UM/UIM, une déposition sous serment, ou une complexité au-delà des formulaires.",
    },
    {
      question: "ClaimSaver+ m’oriente-t-il vers un avocat ?",
      answer:
        "Non. ClaimSaver+ n’exploite pas un service de recommandation et ne paie ni ne reçoit d’honoraires pour vous présenter un avocat. Les pages éducatives sont une information générale.",
    },
  ],
  documents: [
    {
      question: "Quels documents sont souvent utilisés dans un dossier PIP ?",
      answer:
        "Souvent : police, rapport d’accident, factures et notes médicales, preuves de salaire le cas échéant, autorisations et correspondance. Les exigences varient. Rien ici ne promet qu’un assureur acceptera chaque page.",
    },
    {
      question: "Téléverser des fichiers vers ClaimSaver+ les envoie-t-il à l’assureur ?",
      answer:
        "Non. Ils restent dans votre coffre jusqu’à ce que vous les envoyiez. Enregistrer ou téléverser n’est pas un dépôt.",
    },
    {
      question: "S’agit-il d’une liste obligatoire pour chaque dossier ?",
      answer:
        "Non. C’est un aperçu d’organisation. Les assureurs et les polices diffèrent.",
    },
  ],
  mistakes: [
    {
      question: "Quels retards compliquent souvent un dossier PIP ?",
      answer:
        "Reporter la première visite médicale, aviser tard l’assureur, des demandes incomplètes et des lacunes dans le dossier. S’organiser tôt ne garantit pas le paiement.",
    },
    {
      question: "Dois-je traiter l’expert comme un aide neutre ?",
      answer:
        "Vous pouvez être courtois et reconnaître que l’expert travaille pour l’assureur. Ceci est une orientation pratique, pas un commentaire sur un dossier précis.",
    },
    {
      question: "Un logiciel remplace-t-il la diligence ou un conseil juridique ?",
      answer:
        "Non. Les outils réduisent les erreurs mécaniques. Si une erreur paraît importante, consultez un avocat agréé en Floride.",
    },
  ],
};

export function getLearningArticleFaqs(lang: string | undefined, key: ArticleKey): readonly ArticleFaq[] {
  const code = lang?.split("-")[0]?.toLowerCase();
  if (code === "es") return ES[key];
  if (code === "fr") return FR[key];
  return EN[key];
}

export const EN_ARTICLE_FAQS = EN;
