/**
 * Seed two production demo accounts for walking Sergio through ClaimSaver+.
 *
 *   node scripts/seed-sergio-demo.mjs
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from apps/web/.env.local.
 * Credentials are printed and written to scripts/.demo-credentials.local (gitignored).
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(join(root, "apps/web/.env.local"));
loadEnv(join(root, ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CREDENTIALS_PATH = join(root, "scripts/.demo-credentials.local");

function passwordFor(email, fallback) {
  if (existsSync(CREDENTIALS_PATH)) {
    try {
      const saved = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf8"));
      const match = saved.accounts?.find((row) => row.email === email);
      if (match?.password) return match.password;
    } catch {
      /* generate a new one */
    }
  }
  return process.env.DEMO_PASSWORD || fallback || `Demo-${randomBytes(6).toString("base64url")}!a1`;
}

function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function claimNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `CS${y}${m}-${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

function dummyPdf(title, body) {
  const text = `${title}\n\n${body}\n\nDEMO DOCUMENT — fictional data for a ClaimSaver+ walkthrough. Not a real claim.`;
  const stream = `BT /F1 14 Tf 72 720 Td (${title.replace(/[()\\]/g, " ")}) Tj 0 -24 Td /F1 11 Tf (${text.replace(/[()\\]/g, " ").slice(0, 400)}) Tj ET`;
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
    "2 0 obj<< /Type /Pages /Count 1 /Kids[3 0 R] >>endobj",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox[0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj",
    `4 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream endobj`,
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj",
  ];
  const header = "%PDF-1.4\n";
  let bodyOut = "";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(header.length + bodyOut.length);
    bodyOut += `${obj}\n`;
  }
  const xrefPos = header.length + bodyOut.length;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  const trailer = `trailer<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(header + bodyOut + xref + trailer);
}

const PIP = [
  { id: 1, offset: 0, label: "Accident date", critical: true, description: "Date of the motor vehicle accident" },
  {
    id: 2,
    offset: 14,
    label: "14-day treatment window",
    critical: true,
    description:
      "Initial medical treatment often must begin within 14 days for full PIP eligibility—confirm timing with your policy and a licensed professional if unsure.",
  },
  {
    id: 3,
    offset: 30,
    label: "PIP application / notice",
    critical: true,
    description: "Written notice of claim to your insurer—timing varies; track your carrier’s requirements.",
  },
  {
    id: 4,
    offset: 35,
    label: "Insurer acknowledgement (illustrative)",
    critical: false,
    description: "Many carriers acknowledge within days of notice—your adjuster’s timeline may differ.",
  },
  {
    id: 5,
    offset: 60,
    label: "Medical bills & records",
    critical: true,
    description: "Gather and submit bills and related records as treatment progresses.",
  },
  {
    id: 6,
    offset: 90,
    label: "Payment / denial (illustrative)",
    critical: true,
    description: "Insurer processing timelines vary after bills are received—follow up on outstanding items.",
  },
  {
    id: 7,
    offset: 365,
    label: "Suit limitation (verify)",
    critical: false,
    description: "Statutes of limitation are fact-specific—consult a licensed attorney about any suit deadline.",
  },
];

const EDUCATION = "General information, not legal advice.";

function worksheetFor({
  firstName,
  lastName,
  email,
  phone,
  address,
  dob,
  vehicle,
  plate,
  accidentDate,
  accidentTime,
  place,
  description,
  insurer,
  policyNumber,
  fileNumber,
  employer,
}) {
  const fullName = `${firstName} ${lastName}`;
  const accidentDateTime = `${accidentDate}T${accidentTime}`;
  const signed = addDays(accidentDate, 8);
  return {
    completionMethod: "digital_worksheet",
    signatureDate: signed,
    policyHolder: fullName,
    dateOfAccident: accidentDate,
    accidentDate,
    fileNumber,
    insuranceCompany: insurer,
    policyNumber,
    adjusterName: "Chris Nguyen",
    adjusterPhone: "305-555-0199",
    claimantName: fullName,
    claimantEmail: email,
    claimantPhone: phone,
    claimantPhoneHome: phone,
    claimantPhoneBusiness: "",
    claimantAddress: address,
    claimantDOB: dob,
    claimantSSN: "",
    floridaResidencyDuration: "11 years",
    permanentAddress: address,
    vehicleYear: vehicle.year,
    vehicleMake: vehicle.make,
    vehicleModel: vehicle.model,
    licensePlate: plate,
    accidentDateTime,
    accidentPlace: place,
    accidentLocation: place,
    accidentDescription: description,
    yourVehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}, plate ${plate}`,
    familyVehicle: "No — this was my vehicle, titled in my name.",
    injured: true,
    injuryResponse: "yes",
    injuryDescription:
      "Neck and lower-back strain, headache, and soreness in the right shoulder. Pain is worse in the morning and after sitting. Follow-up with PT twice a week.",
    treatedByDoctor: true,
    doctorName: "Dr. Elena Vasquez, Kendall Spine & Rehab",
    doctorAddress: "9200 SW 72nd St, Miami, FL 33173",
    hospitalInpatient: false,
    hospitalOutpatient: true,
    hospitalName: "Jackson Memorial Hospital — ER (outpatient)",
    hospitalAddress: "1611 NW 12th Ave, Miami, FL 33136",
    medicalBillsToDate: "2180.00",
    moreMedicalExpense: true,
    inCourseOfEmployment: false,
    lostWages: true,
    wageLossResponse: "yes",
    wageLossToDate: "1280.00",
    averageWeeklyWage: "960.00",
    employersList: employer,
    disabilityStart: addDays(accidentDate, 1),
    disabilityEnd: addDays(accidentDate, 5),
    workersComp: false,
    workersCompAmount: "",
    otherExpenses: "Uber to the ER the night of the crash: $38. Parking at PT: $24.",
    medicalInsurance: "Florida Blue (group through employer)",
    medicalMemberId: "FB-DEMO-4418",
    insuranceAuthInsuredName: fullName,
    insuranceAuthPolicyNumber: policyNumber,
    insuranceAuthInsuranceCompany: insurer,
    insuranceAuthDisclosureType: "claim_file",
    insuranceAuthRecipientName: "Claimant (self) — for PIP filing",
    insuranceAuthRecipientAddress: address,
    insuranceAuthReasonForDisclosure: "To prepare and submit my Florida no-fault (PIP) claim.",
    insuranceAuthStartDate: signed,
    insuranceAuthEndDate: addDays(signed, 365),
    insuranceAuthSignature: fullName,
    insuranceAuthSignatureDate: signed,
    hipaaPatientName: fullName,
    hipaaHealthcareProvider: "Jackson Memorial Hospital; Kendall Spine & Rehab",
    hipaaDisclosureType: "treatment_records",
    hipaaRecipientName: insurer,
    hipaaRecipientAddress: "PIP claims, Miami FL",
    hipaaReasonForDisclosure: "PIP medical-benefits review",
    hipaaStartDate: signed,
    hipaaEndDate: addDays(signed, 365),
    hipaaSignature: fullName,
    hipaaSignatureDate: signed,
    pipPatientName: fullName,
    pipPatientSignature: fullName,
    pipPatientDate: signed,
    pipProviderName: "Dr. Elena Vasquez",
    pipProviderSignature: "",
    pipProviderDate: "",
    signature: fullName,
    estimatedValue: 8500,
  };
}

const ACCOUNTS = [
  {
    key: "worksheet",
    email: "test1@claimsaverplus.com",
    firstName: "Alex",
    lastName: "Rivera",
    phone: "305-555-0142",
    role: "Walk the 10-page worksheet. Every page is prefilled — start at step 1 and click Next.",
    worksheetStep: 1,
    status: "in_progress",
    seedCalendar: true,
    seedDocs: false,
    seedExtras: false,
    person: {
      address: "1840 SW 8th St, Apt 4, Miami, FL 33135",
      dob: "1988-04-12",
      vehicle: { year: "2019", make: "Honda", model: "Accord" },
      plate: "DEMO-AR1",
      accidentDate: "2026-08-12",
      accidentTime: "17:42",
      place: "Palmetto Expressway (SR 826) southbound near NW 74th St, Miami, FL",
      description:
        "I was stopped in traffic on the Palmetto when a sedan struck the rear of my Honda. Airbags did not deploy. Police responded. I drove to Jackson Memorial ER the same evening with neck and back pain.",
      insurer: "Sunset Casualty of Florida (demo)",
      policyNumber: "FL-PIP-88421",
      fileNumber: "CLM-2026-4418",
      employer: "Palmetto Logistics LLC, 7300 NW 27th Ave, Miami, FL",
    },
  },
  {
    key: "workspace",
    email: "test2@claimsaverplus.com",
    firstName: "Jordan",
    lastName: "Morales",
    phone: "305-555-0177",
    role: "Log in to the dashboard: filled claim, PIP calendar, documents, and expenses.",
    worksheetStep: 10,
    status: "in_progress",
    seedCalendar: true,
    seedDocs: true,
    seedExtras: true,
    person: {
      address: "2550 NW 7th St, Miami, FL 33125",
      dob: "1991-11-03",
      vehicle: { year: "2021", make: "Toyota", model: "RAV4" },
      plate: "DEMO-JM2",
      accidentDate: "2026-08-10",
      accidentTime: "08:18",
      place: "I-95 southbound near NW 8th St, Miami, FL",
      description:
        "Morning commute. I braked for slowing traffic and was rear-ended by a pickup. Exchange of information on scene. ER the same morning; PT started within the 14-day window.",
      insurer: "Atlantic No-Fault (demo)",
      policyNumber: "ANF-PIP-22019",
      fileNumber: "CLM-2026-5521",
      employer: "Biscayne Clinic Front Desk, 1800 NE 2nd Ave, Miami, FL",
    },
  },
];

async function findUser(email) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function ensureUser({ email, password, firstName, lastName }) {
  const existing = await findUser(email);
  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName },
    });
    if (error) throw error;
    return existing.id;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });
  if (error) throw error;
  return data.user.id;
}

async function waitForProfile(userId) {
  for (let i = 0; i < 10; i += 1) {
    const { data } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (data) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Profile row was not created for ${userId}`);
}

async function clearUserData(userId) {
  const { data: docs } = await admin.from("claim_documents").select("id, storage_path").eq("user_id", userId);
  for (const doc of docs ?? []) {
    if (doc.storage_path) {
      await admin.storage.from("claim-documents").remove([doc.storage_path]);
    }
  }
  await admin.from("claim_documents").delete().eq("user_id", userId);
  await admin.from("calendar_events").delete().eq("user_id", userId);
  await admin.from("expenses").delete().eq("user_id", userId);
  await admin.from("claims").delete().eq("user_id", userId);
}

async function seedPipCalendar(userId, claimId, accidentDate, { completeThroughId = 0 } = {}) {
  for (const milestone of PIP) {
    const date = addDays(accidentDate, milestone.offset);
    const { error } = await admin.from("calendar_events").insert({
      user_id: userId,
      claim_id: claimId,
      title: milestone.label,
      date,
      time: "",
      type: "deadline",
      description: `[pip:${milestone.id}] ${milestone.description} ${EDUCATION}`,
      priority: milestone.critical ? "high" : "medium",
      completed: milestone.id <= completeThroughId,
      source: "pip",
      template_id: milestone.id,
    });
    if (error) throw error;
  }
}

async function seedWorkspaceExtras(userId, claimId, accidentDate) {
  const extras = [
    {
      title: "PT — Kendall Spine & Rehab",
      date: addDays(accidentDate, 25),
      time: "10:00",
      type: "appointment",
      description: "Follow-up physical therapy (demo).",
      priority: "medium",
      completed: false,
    },
    {
      title: "Call adjuster (Chris Nguyen)",
      date: addDays(accidentDate, 26),
      time: "14:30",
      type: "follow-up",
      description: "Confirm PIP application received (demo).",
      priority: "high",
      completed: false,
    },
    {
      title: "Drop wage statement in the vault",
      date: addDays(accidentDate, 18),
      time: "",
      type: "custom",
      description: "Employer letter for lost wages (demo).",
      priority: "medium",
      completed: true,
    },
  ];
  const { error: calErr } = await admin.from("calendar_events").insert(
    extras.map((row) => ({
      user_id: userId,
      claim_id: claimId,
      ...row,
      source: "custom",
    })),
  );
  if (calErr) throw calErr;

  const expenses = [
    { category: "medical", amount_cents: 15000, description: "ER copay — Jackson Memorial", incurred_on: accidentDate },
    {
      category: "medical",
      amount_cents: 8500,
      description: "PT session — Kendall Spine & Rehab",
      incurred_on: addDays(accidentDate, 12),
    },
    {
      category: "wage",
      amount_cents: 128000,
      description: "Four missed shifts after the crash",
      incurred_on: addDays(accidentDate, 5),
    },
    {
      category: "mileage",
      amount_cents: 4200,
      description: "Clinic trips (demo mileage log)",
      incurred_on: addDays(accidentDate, 14),
    },
    {
      category: "other",
      amount_cents: 3800,
      description: "Uber to the ER the night of the crash",
      incurred_on: accidentDate,
    },
  ];
  const { error: expErr } = await admin.from("expenses").insert(
    expenses.map((row) => ({ user_id: userId, claim_id: claimId, ...row })),
  );
  if (expErr) throw expErr;
}

async function seedDocs(userId, claimId, person) {
  const files = [
    {
      name: "Police crash report (demo).pdf",
      type: "evidence",
      title: "Police crash report — DEMO",
      body: `${person.place}. Fictional report for a ClaimSaver+ walkthrough.`,
    },
    {
      name: "ER visit summary (demo).pdf",
      type: "medical",
      title: "ER visit summary — DEMO",
      body: "Jackson Memorial Hospital. Neck/back strain. Not a real medical record.",
    },
    {
      name: "PIP application copy (demo).pdf",
      type: "insurance",
      title: "PIP application — DEMO",
      body: `Policy ${person.policyNumber}. Fictional filing copy.`,
    },
    {
      name: "Wage statement (demo).pdf",
      type: "legal",
      title: "Wage statement — DEMO",
      body: `${person.employer}. Four missed shifts. Fictional employer letter.`,
    },
  ];
  for (const file of files) {
    const buf = dummyPdf(file.title, file.body);
    const path = `${userId}/${randomUUID()}.pdf`;
    const { error: upErr } = await admin.storage.from("claim-documents").upload(path, buf, {
      contentType: "application/pdf",
      upsert: false,
    });
    if (upErr) throw upErr;
    const { error } = await admin.from("claim_documents").insert({
      user_id: userId,
      claim_id: claimId,
      name: file.name,
      type: file.type,
      mime_type: "application/pdf",
      size_bytes: buf.length,
      storage_path: path,
    });
    if (error) throw error;
  }
}

async function seedAccount(account) {
  const password = passwordFor(account.email, `SergioDemo-${account.key}-2026!`);
  const userId = await ensureUser({
    email: account.email,
    password,
    firstName: account.firstName,
    lastName: account.lastName,
  });
  await waitForProfile(userId);

  const { error: profileErr } = await admin
    .from("profiles")
    .update({
      email: account.email,
      first_name: account.firstName,
      last_name: account.lastName,
      phone: account.phone,
      has_platform_access: true,
      is_active: true,
      role: "user",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (profileErr) throw profileErr;

  await admin.from("purchases").upsert(
    {
      user_id: userId,
      stripe_session_id: `demo-seed:platform:${userId}`,
      product_code: "platform",
      amount_cents: 50000,
      status: "paid",
    },
    { onConflict: "stripe_session_id" },
  );

  await clearUserData(userId);

  const worksheet = worksheetFor({
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    phone: account.phone,
    ...account.person,
  });

  const { data: claim, error: claimErr } = await admin
    .from("claims")
    .insert({
      user_id: userId,
      claim_number: claimNumber(),
      status: account.status,
      priority: "medium",
      worksheet_step: account.worksheetStep,
      worksheet,
    })
    .select("id, claim_number")
    .single();
  if (claimErr) throw claimErr;

  if (account.seedCalendar) {
    await seedPipCalendar(userId, claim.id, account.person.accidentDate, {
      completeThroughId: account.seedExtras ? 2 : 0,
    });
  }
  if (account.seedExtras) {
    await seedWorkspaceExtras(userId, claim.id, account.person.accidentDate);
  }
  if (account.seedDocs) {
    await seedDocs(userId, claim.id, account.person);
  }

  return {
    email: account.email,
    password,
    name: `${account.firstName} ${account.lastName}`,
    role: account.role,
    claimNumber: claim.claim_number,
    startAt: account.worksheetStep === 1 ? "https://www.claimsaverplus.com/claim-form" : "https://www.claimsaverplus.com/dashboard",
  };
}

const RETIRED_EMAILS = [
  "demo.worksheet@claimsaverplus.com",
  "demo.workspace@claimsaverplus.com",
];

async function retireEmail(email) {
  const user = await findUser(email);
  if (!user) return;
  await clearUserData(user.id);
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;
  console.log(`Removed old demo user ${email}`);
}

const results = [];
for (const account of ACCOUNTS) {
  results.push(await seedAccount(account));
}
for (const email of RETIRED_EMAILS) {
  await retireEmail(email);
}

mkdirSync(dirname(CREDENTIALS_PATH), { recursive: true });
writeFileSync(
  CREDENTIALS_PATH,
  `${JSON.stringify({ createdAt: new Date().toISOString(), accounts: results }, null, 2)}\n`,
);

console.log("\nSergio demo accounts are ready on production.\n");
for (const row of results) {
  console.log(`• ${row.name}`);
  console.log(`  ${row.role}`);
  console.log(`  Email:    ${row.email}`);
  console.log(`  Password: ${row.password}`);
  console.log(`  Claim:    ${row.claimNumber}`);
  console.log(`  Open:     ${row.startAt}\n`);
}
console.log(`Credentials also saved to ${CREDENTIALS_PATH} (gitignored).\n`);
