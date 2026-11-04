export type SubmitLeadState = {
  error: string | null;
  fields?: Record<string, string>;
  ok?: boolean;
  pdfPath?: string;
  thanksPath?: string;
} | null;
