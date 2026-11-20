import { clinicTargets, batches, documents } from './canvass.js';
const assetBase = new URL('./', import.meta.url);
const $ = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const paths = {
  canvass:'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15 M15 6v15',
  documents:'M3 7h7l2 3h9v10H3z',
  overview:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  pipeline:'M4 6h16 M4 12h12 M4 18h8',
  calendar:'M4 5h16v15H4z M4 10h16 M8 3v4 M16 3v4',
  readiness:'M5 4h14v17H5z M8 12l3 3 5-6',
  messaging:'M4 4h16v12H9l-5 4z M8 8h8 M8 12h5',
  notes:'M5 3h10l4 4v14H5z M9 12h6 M9 16h6',
  clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 6v6l4 2',
  clinic:'M4 21V7h16v14 M2 21h20 M10 11h4 M12 9v4 M10 21v-5h4v5',
  client:'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M4 21v-2a8 5 0 0 1 16 0v2',
  info:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 11v6 M12 7v1'
};
const icon = name => '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="' + paths[name] + '"/></svg>';
const nav = {overview:'Overview',canvass:'Clinic canvassing',pipeline:'Outreach pipeline',calendar:'Visits & follow-ups',readiness:'Launch readiness',messaging:'Messaging',documents:'Documents',notes:'Campaign notes'};
const stages = [
  ['lead','Lead'],
  ['contacted','Contacted'],
  ['visit_scheduled','Visit scheduled'],
  ['visited','Visited'],
  ['demo_completed','Demo completed'],
  ['follow_up','Follow-up'],
  ['negotiating','Negotiating'],
  ['converted','Converted'],
  ['lost','Lost']
];
const legacyStage = {
  'New target':'lead', Contacted:'contacted', Responded:'contacted', 'Visit scheduled':'visit_scheduled',
  Visited:'visited', 'In discussion':'negotiating', 'Partnered / onboarded':'converted', 'On hold':'follow_up', Closed:'lost'
};
const pipelineStage = r => stages.some(([id]) => id === r.stage) ? r.stage : (legacyStage[r.status] || ((r.kind === 'clinic' || r.kind === 'client') ? 'lead' : ''));
const stageLabel = id => (stages.find(([key]) => key === id) || [id, id])[1];
const kindNames = {clinic:'Clinic',client:'Potential client',task:'Readiness item',script:'Script',note:'Campaign note',document:'Document link'};
const starterRecords = [
  ['packet-one','task','Review and print the clinic packet','Packet','To do','Proof the one-page overview, contact details, pricing language and QR link. Pack copies and business cards.'],
  ['packet-two','task','Prepare a simple packet drop-off','Packet','To do','Confirm who handles partnerships, bring a clean leave-behind and note the preferred follow-up channel.'],
  ['demo-one','task','Rehearse the demo with sample data','Demo','To do','Practice a short walkthrough of organizing claim documents. Test the path you plan to show and keep screenshots as a fallback.'],
  ['fix-one','task','Retest invalid estimate totals','Launch issue','In progress','Verify incomplete or invalid inputs produce a clear message and never display a NaN total. Check this before showing estimates.'],
  ['fix-two','task','Verify inquiry and onboarding handoff','Launch issue','To do','Test the inquiry form and confirm a team member can follow up. Track any portion still being fixed.'],
  ['script-intro','script','Clinic front-desk introduction','Clinic visit','','Hi, I’m [name] with ClaimSaver+. We’re a small, family-run team here in Miami. We built a tool to help people keep their claim paperwork together. Who’s the best person to leave a short overview with?'],
  ['script-clinic','script','Clinic follow-up','Clinic follow-up','','Hi [name], thanks for taking a minute to speak with me. We’re talking with Florida clinics about where patients get stuck with claim paperwork. If it’d be useful, I can stop by for 10 minutes and show how the tool organizes documents using a sample claim. Is there a day that works for you?'],
  ['script-client','script','Potential client inquiry','Client inquiry','','Thanks for reaching out to ClaimSaver+. We help people organize their claim documents and keep track of next steps. There’s no contingency fee. I can walk you through the current options and pricing so you can decide if it fits. What would you like help getting organized?'],
  ['script-demo','script','Demo readiness and limits','Demo','','The core product is built, and we’re actively fixing some launch issues. I’ll show you what’s working today with sample information and explain what’s still being tested. We don’t promise claim approval, payment amounts or timelines.']
].map(([id,kind,title,category,status,notes]) => ({id,kind,title,category,status,notes}));
const suggestions = [...clinicTargets, ...documents, ...starterRecords];
const fields = {
  batch:['Canvassing batch','text'], zip:['ZIP code','text'], website:['Clinic website','url'], source:['Research source','url'],
  pip:['PIP / auto injury status',['Needs confirmation','PIP listed publicly','PIP confirmed by clinic','Auto injury listed publicly','Clinic does not handle PIP']],
  hours:['Office hours / best time to stop by','text'], outreachResult:['Last visit outcome','text'],
  url:['Document URL','url'],
  title:['Name','text'], contact:['Contact name','text'], role:['Role','text'], city:['City / area','text'], address:['Visit address','text'],
  email:['Email','email'], phone:['Phone','tel'], channel:['Preferred channel',['','Email','Phone','In person','Text','Other']],
  stage:['Pipeline stage',stages],
  consentAt:['Outreach consent date','date'],
  consentSource:['Consent source',['','Verbal','Email','Signed form','Other']],
  status:['Status',[]], last:['Last outreach','date'], reply:['Response received','date'],
  visit:['Scheduled visit / call (ET)','datetime-local'], due:['Follow-up date','date'], next:['Next step / visit purpose','text'], notes:['Notes','textarea']
};
const outreach = ['title','contact','role','city','address','email','phone','channel','stage','last','reply','visit','due','next','consentAt','consentSource','notes'];
const configs = {
  clinic:[...outreach.slice(0,-1),'batch','zip','website','pip','hours','source','outreachResult','notes'], client:outreach,
  task:['title','category','status','due','notes'],
  script:['title','category','notes'],
  note:['title','category','due','notes'],
  document:['title','category','url','notes']
};
let saved = [], suppressed = new Set(), edit, failure = '', storageWarning = '', toastTimer, busy = false;
let batchFilter = 'Kendall · 33183', clinicSearch = '', filter = '', typeFilter = '', stageFilter = '', timeFilter = 'all';
const day = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const todayLabel = () => new Intl.DateTimeFormat('en-US',{dateStyle:'full',timeZone:'America/New_York'}).format(new Date());
const date = value => value ? new Date(value.slice(0,10) + 'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
const visit = value => date(value) + ' · ' + new Date(value).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}) + ' ET';
const page = () => Object.hasOwn(nav,location.hash.slice(1)) ? location.hash.slice(1) : 'overview';
const records = () => [...saved.filter(r => r.hidden !== 'yes'), ...suggestions.filter(r => !suppressed.has(r.id) && !saved.some(item => item.id === r.id))];
const outreachRecords = () => records().filter(r => r.kind === 'clinic' || r.kind === 'client');
const open = r => !['converted','lost'].includes(pipelineStage(r));
const upcoming = () => outreachRecords().filter(r => open(r) && r.visit?.slice(0,10) >= day()).sort((a,b) => a.visit.localeCompare(b.visit));
const followups = () => outreachRecords().filter(r => open(r) && r.due).sort((a,b) => a.due.localeCompare(b.due));
const tag = (text,style='') => '<span class="tag ' + style + '">' + escape(text) + '</span>';
function safeUrl(value) {
  try {
    const url = new URL(value, assetBase);
    return /^https?:$/.test(url.protocol) ? url.href : '';
  } catch { return ''; }
}
const anchor = (label,value) => value && safeUrl(value) ? '<a class="text-button" target="_blank" rel="noopener noreferrer" href="' + escape(safeUrl(value)) + '">' + label + '</a>' : '';
const empty = content => '<div class="empty">' + content + '</div>';
const button = (label, action, id='', style='secondary') => '<button class="' + style + '" data-action="' + action + '" data-id="' + escape(id) + '">' + label + '</button>';
const row = (record, symbol, subtitle, badge='') => '<div class="line-row"><span class="row-icon">' + icon(symbol) + '</span><div class="row-content"><strong>' + escape(record.title) + '</strong><small>' + escape(subtitle) + '</small></div>' + (badge ? tag(badge,'issue') : '') + button('Open','edit',record.id,'text-button') + '</div>';
const guidance = () => '<div class="panel guidance"><span class="icon-wrap">' + icon('info') + '</span><div><strong>Keep it plain-spoken</strong><p class="sub">We help people organize claim paperwork. Say “no contingency fee.” Share current pricing separately, demo with sample data, and speak only to features you’ve verified. Leave claim and medical details out of outreach notes.</p></div></div>';
function metrics() {
  const leads = outreachRecords();
  const data = [
    ['Outreach logged',leads.filter(r => r.last).length,'Contacts with an outreach date','pipeline','pipeline'],
    ['Responses',leads.filter(r => r.reply).length,'Contacts with a reply date','messaging','pipeline'],
    ['Scheduled visits',upcoming().length,'Upcoming visits and calls','calendar','calendar'],
    ['Follow-ups due',followups().filter(r => r.due <= day()).length,'Due today or overdue','clock','calendar'],
    ['Open launch issues',records().filter(r => r.kind === 'task' && r.category === 'Launch issue' && r.status !== 'Done').length,'Issues still to resolve','readiness','readiness']
  ];
  return data.map(([label,value,help,symbol,target]) => '<a class="metric" href="#' + target + '"><span class="icon-wrap">' + icon(symbol) + '</span><strong>' + value + '</strong><b>' + label + '</b><small>' + help + '</small></a>').join('');
}
function overview() {
  const due = followups().slice(0,4);
  const visits = upcoming().slice(0,4);
  return '<section class="hero"><span class="hero-art"></span><p class="eyebrow">CLAIMSAVER+ / FLORIDA LAUNCH</p><h1>Outreach Desk</h1><p>Keep track of the clinics and people you reach out to, what you promised to follow up on, and what still needs work before the next demo.</p>' + tag('Active outreach · Launch fixes underway') + '<a class="hero-link" href="#canvass">Open clinic canvassing →</a></section>' +
    '<div class="section-title"><h2>Outreach at a glance</h2><span class="date">' + todayLabel() + '</span></div><div class="metrics">' + metrics() + '</div>' +
    '<div class="panels"><section class="panel"><div class="panel-head"><h2>Next follow-ups</h2><a class="text-button" href="#calendar">View planner →</a></div>' +
    (due.map(r => row(r,'clock',date(r.due) + (r.next ? ' · ' + r.next : ''),r.due < day() ? 'Overdue' : r.due === day() ? 'Today' : '')).join('') || empty('Add a follow-up date to a clinic or client record to see it here.')) +
    '</section><section class="panel"><div class="panel-head"><h2>Upcoming visits</h2><a class="text-button" href="#calendar">View planner →</a></div>' +
    (visits.map(r => row(r,'calendar',visit(r.visit) + (r.address ? ' · ' + r.address : ''))).join('') || empty('Schedule a clinic visit or client call from an outreach record.')) +
    '</section></div>' + guidance();
}
const subheads = {
  canvass:'Pick a neighborhood, then work the clinics in ZIP order. Kendall 33183 is the starting group. Call ahead to confirm PIP handling, office hours, and the best contact.',
  documents:'Open the clinic pitch deck and preparation materials. Add links to current versions as your packet evolves.',
  pipeline:'Track Florida clinics and potential clients from first contact through the next step.',
  calendar:'See upcoming visits and follow-ups. Update dates directly from any record.',
  readiness:'Keep packet prep, demo checks, and launch fixes ready for your next conversation.',
  messaging:'Keep reusable introductions and follow-ups you can copy, personalize, and send.',
  notes:'Capture what you’re hearing, what you’re testing, and what to change next.'
};
const primaryKind = {canvass:'clinic',documents:'document',pipeline:'clinic',calendar:'clinic',readiness:'task',messaging:'script',notes:'note',overview:'clinic'};
function heading(p) {
  return '<div class="heading"><div><p class="eyebrow">WORKSPACE</p><h1>' + nav[p] + '</h1><p class="sub">' + subheads[p] + '</p></div>' +
    button('＋ ' + (p === 'calendar' ? 'Plan a visit' : 'Add ' + kindNames[primaryKind[p]].toLowerCase()),'add',primaryKind[p],'primary') + '</div>';
}
function recordCard(r) {
  const isLead = ['client','clinic'].includes(r.kind);
  const details = isLead ? [kindNames[r.kind],r.contact,r.role,r.city,r.address,r.email,r.phone,r.channel].filter(Boolean).join(' · ') : r.category;
  return '<article class="record"><span class="row-icon">' + icon(isLead ? r.kind : {task:'readiness',script:'messaging',note:'notes',document:'documents'}[r.kind]) +
    '</span><div class="content"><h3>' + escape(r.title) + '</h3><p class="sub">' + escape(details) + '</p><div class="meta">' +
    (isLead ? tag(stageLabel(pipelineStage(r)), pipelineStage(r) === 'lost' ? 'issue' : '') : (r.status ? tag(r.status,r.category === 'Launch issue' && r.status !== 'Done' ? 'issue' : '') : '')) +
    (r.batch ? tag(r.batch,'neutral') : '') + (r.pip ? tag(r.pip,'neutral') : '') + (r.last ? tag('Reached out ' + date(r.last),'neutral') : '') + (r.reply ? tag('Replied ' + date(r.reply)) : '') +
    (r.visit ? tag(visit(r.visit),'neutral') : '') + (r.due ? tag((isLead ? 'Follow-up ' : 'Due ') + date(r.due),r.due < day() && r.status !== 'Done' ? 'issue' : 'neutral') : '') +
    '</div>' + (r.next ? '<p class="text"><b>Next step</b> · ' + escape(r.next) + '</p>' : '') +
    (r.hours ? '<p class="sub">Best time · ' + escape(r.hours) + '</p>' : '') +
    (r.outreachResult ? '<p class="sub">Visit outcome · ' + escape(r.outreachResult) + '</p>' : '') +
    (r.notes ? '<p class="text">' + escape(r.notes) + '</p>' : '') +
    '<div class="record-links">' + anchor('Website',r.website) + anchor('Research source',r.source) +
    (r.kind === 'clinic' && r.address ? anchor('Map','https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(r.address)) : '') +
    '</div></div><div class="actions">' + (r.kind === 'document' ? anchor('Open document ↗',r.url) : '') +
    (r.kind === 'script' ? button('Copy','copy',r.id) : '') +
    (r.kind === 'task' ? button(r.status === 'Done' ? 'Reopen' : 'Mark done','toggle',r.id) : '') + button('Edit','edit',r.id) + '</div></article>';
}
const options = (values,selected) => values.map(value => {
  const [key,label] = Array.isArray(value) ? value : [value,value];
  return '<option value="' + escape(key) + '"' + (key === selected ? ' selected' : '') + '>' + escape(label) + '</option>';
}).join('');
function pipeline() {
  const items = outreachRecords().filter(r => (!typeFilter || r.kind === typeFilter) &&
    (!stageFilter || pipelineStage(r) === stageFilter) && [r.title,r.contact,r.city,r.notes,r.email].some(v => (v || '').toLowerCase().includes(filter.toLowerCase())));
  return items.map(recordCard).join('') || empty('No matching outreach records. Add a clinic or potential client to get started.');
}
function planner() {
  const all = outreachRecords().filter(r => r.visit).sort((a,b) => a.visit.localeCompare(b.visit));
  const visits = timeFilter === 'past' ? all.filter(r => r.visit.slice(0,10) < day()) : upcoming();
  const due = followups().filter(r => timeFilter === 'due' ? r.due <= day() : timeFilter === 'past' ? r.due < day() : true);
  return '<div class="filters"><select id="time-filter" aria-label="Planner date filter">' +
    options([['all','Upcoming visits and all open follow-ups'],['due','Upcoming visits and due follow-ups'],['past','Past visits and overdue follow-ups']],timeFilter) + '</select></div>' +
    '<div class="panels"><section class="panel"><div class="panel-head"><h2>' + (timeFilter === 'past' ? 'Past visits' : 'Upcoming visits') + '</h2></div>' +
    (visits.map(r => row(r,'calendar',visit(r.visit) + [r.address,r.contact,r.next].filter(Boolean).map(v => ' · ' + v).join(''))).join('') || empty('No visits in this view.')) +
    '</section><section class="panel"><div class="panel-head"><h2>Follow-ups</h2></div>' +
    (due.map(r => row(r,'clock',date(r.due) + (r.next ? ' · ' + r.next : ''),r.due < day() ? 'Overdue' : r.due === day() ? 'Today' : '')).join('') || empty('No follow-ups in this view.')) +
    '</section></div>';
}
const byZip = (a, b) => String(a.zip || '99999').localeCompare(String(b.zip || '99999')) || String(a.title || '').localeCompare(String(b.title || ''));
function batchNames() {
  const extras = outreachRecords().filter(r => r.kind === 'clinic').map(r => r.batch || 'Unassigned').filter(name => !batches.some(batch => batch.name === name));
  return [...batches.map(batch => batch.name), ...new Set(extras)];
}
function clinicRows() {
  const query = clinicSearch.toLowerCase();
  const clinics = outreachRecords().filter(r => r.kind === 'clinic')
    .filter(r => batchFilter === '*' || (r.batch || 'Unassigned') === batchFilter)
    .filter(r => [r.title,r.address,r.zip,r.contact,r.pip,r.batch].some(v => (v || '').toLowerCase().includes(query)));
  const names = batchFilter === '*' ? batchNames() : [batchFilter];
  return names.flatMap(name => clinics.filter(r => (r.batch || 'Unassigned') === name).sort(byZip));
}
function clinicSections() {
  const rows = clinicRows();
  const names = batchFilter === '*' ? batchNames() : [batchFilter];
  return names.map(name => ({name, batch: batches.find(batch => batch.name === name), rows: rows.filter(r => (r.batch || 'Unassigned') === name)}))
    .filter(section => batchFilter !== '*' || !clinicSearch || section.rows.length);
}
function canvass() {
  const clinics = outreachRecords().filter(r => r.kind === 'clinic');
  const names = batchNames();
  const description = batches.find(b => b.name === batchFilter)?.description;
  return '<div class="batch-grid" aria-label="Neighborhood batches">' + names.map(name => {
    const count = clinics.filter(r => (r.batch || 'Unassigned') === name).length;
    return '<button class="batch" data-action="batch" data-id="' + escape(name) + '" aria-pressed="' + (batchFilter === name) + '"><strong>' +
      escape(name) + '</strong><small>' + count + ' ' + (count === 1 ? 'clinic' : 'clinics') + '</small></button>';
  }).join('') + '</div><div class="section-title"><div><h2>' + escape(batchFilter === '*' ? 'All clinics' : batchFilter) + '</h2>' +
    (description ? '<p class="sub">' + escape(description) + '</p>' : '') + '</div>' + button('Print list','print') + '</div>' +
    '<div class="filters"><input id="clinic-search" type="search" aria-label="Search this clinic list" placeholder="Find a clinic, ZIP, or contact" value="' +
    escape(clinicSearch) + '">' + button(batchFilter === '*' ? 'Back to Kendall' : 'All clinics','batch',batchFilter === '*' ? batches[0].name : '*') + '</div>' +
    '<div class="record-grid" id="clinic-results">' + clinicCards() + '</div>';
}
function clinicCards() {
  const sections = clinicSections();
  if (batchFilter !== '*') return sections[0]?.rows.map(recordCard).join('') || empty('No clinics in this neighborhood yet. Add one after you confirm the ZIP and PIP handling.');
  return sections.filter(section => section.rows.length).map(section => '<section class="neighborhood"><div class="section-title"><h2>' + escape(section.name) + '</h2><span class="date">' + section.rows.length + ' ' + (section.rows.length === 1 ? 'clinic' : 'clinics') + '</span></div>' +
    section.rows.map(recordCard).join('') + '</section>').join('') || empty('No clinics match this search.');
}
function printClinics() {
  const sections = clinicSections().filter(section => section.rows.length);
  const total = sections.reduce((sum, section) => sum + section.rows.length, 0);
  if (!total) { notify('There are no clinics to print in this view.'); return; }
  let stop = 0;
  $('print-sheet').innerHTML = '<h1>ClaimSaver+ clinic canvassing</h1><p>' + escape(batchFilter === '*' ? 'All neighborhoods' : batchFilter) +
    ' · ' + total + ' stops · ' + todayLabel() + '</p><p>Sorted by ZIP inside each neighborhood. Start in Kendall 33183. Confirm PIP handling and visit hours before leaving.</p>' +
    sections.map(section => '<h2>' + escape(section.name) + '</h2>' + section.rows.map(r => '<section><h2>' + (++stop) + '. ' + escape(r.title) + '</h2><p>' + escape([r.zip && 'ZIP ' + r.zip, r.address, r.phone, r.website].filter(Boolean).join(' · ')) +
      '</p><p>' + escape([r.pip, r.status, r.contact, r.hours, r.due && 'Follow-up ' + date(r.due)].filter(Boolean).join(' · ')) + '</p>' +
      (r.next ? '<p>Next step: ' + escape(r.next) + '</p>' : '') + (r.notes ? '<p class="print-note">' + escape(r.notes) + '</p>' : '') +
      '<p class="write-line">Visit notes / next step:</p><p class="write-line"></p></section>').join('')).join('');
  window.print();
}
function render() {
  const p = page();
  $('breadcrumb').textContent = 'Workspace / ' + nav[p];
  $('nav').innerHTML = '<span class="nav-label">WORKSPACE</span>' + Object.entries(nav).map(([key,label]) =>
    '<a class="nav-link" href="#' + key + '"' + (key === p ? ' aria-current="page"' : '') + '>' + icon(key) + label + '</a>').join('');
  const banner = storageWarning ? '<div class="panel guidance"><span class="icon-wrap">' + icon('info') + '</span><div><strong>Saved records are unavailable</strong><p class="sub">' + escape(storageWarning) + '</p></div></div>' : '';
  if (failure) {
    $('view').innerHTML = banner + empty(escape(failure) + ' ' + button('Retry','retry'));
    return;
  }
  if (p === 'overview') { $('view').innerHTML = banner + overview(); return; }
  let body;
  if (p === 'canvass') body = canvass();
  else if (p === 'pipeline') {
    body = '<div class="filters"><input type="search" aria-label="Search outreach" placeholder="Search name, contact or area" id="search" value="' + escape(filter) + '"><select id="type-filter" aria-label="Filter by record type">' +
      options([['','All contacts'],['clinic','Clinics'],['client','Potential clients']],typeFilter) + '</select><select id="stage-filter" aria-label="Filter by stage">' +
      options([['','All stages'],...stages],stageFilter) + '</select>' + button('＋ Add potential client','add','client') +
      '</div><div id="results" class="record-grid">' + pipeline() + '</div>';
  } else if (p === 'calendar') body = planner();
  else if (p === 'readiness') {
    const tasks = records().filter(r => r.kind === 'task');
    body = ['Packet','Demo','Launch issue'].map(category => {
      const group = tasks.filter(r => r.category === category);
      const done = group.filter(r => r.status === 'Done').length;
      return '<div class="section-title"><h2>' + (category === 'Launch issue' ? 'Launch issues' : category + ' checklist') + '</h2><span class="date">' + done + ' / ' + group.length + ' done</span></div><div class="record-grid">' +
        (group.map(recordCard).join('') || empty('No items yet.')) + '</div>';
    }).join('');
  } else {
    const items = records().filter(r => r.kind === primaryKind[p]);
    body = '<div class="record-grid">' + (items.map(recordCard).join('') || empty('No entries yet.')) + '</div>' + (p === 'messaging' ? guidance() : '');
  }
  $('view').innerHTML = banner + heading(p) + body;
}
async function request(method = 'GET', record) {
  const response = await fetch(new URL('api/records', assetBase), {
    method,
    ...(record && { headers:{'Content-Type':'application/json','X-Outreach-Request':'1'}, body:JSON.stringify(record) })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'This change could not be saved.');
  return result;
}
async function load() {
  try { saved = await request(); failure = ''; storageWarning = ''; }
  catch (error) {
    saved = [];
    failure = '';
    storageWarning = error.message || 'The starter list is still here. Try a save again in a moment.';
  }
  suppressed = new Set(saved.filter(r => r.hidden === 'yes').map(r => r.id));
  render();
}
function notify(message) {
  $('toast').textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 3500);
}
function fieldInfo(key, kind) {
  if (key === 'title') return [kind === 'clinic' ? 'Clinic name' : kind === 'client' ? 'Potential client name' : 'Title','text'];
  if (key === 'batch') return [fields.batch[0],'batch'];
  if (key === 'category') return kind === 'task' ? ['Checklist',['Packet','Demo','Launch issue']] : ['Topic','text'];
  if (key === 'status' && kind === 'task') return ['Status',['To do','In progress','Done']];
  if (key === 'notes' && kind === 'script') return ['Script text','textarea'];
  return fields[key];
}
function editorFields(kind, data) {
  return configs[kind].map(key => {
    const [label,type] = fieldInfo(key,kind);
    const value = data[key] || '';
    const wide = ['title','notes','next','address'].includes(key) ? ' class="wide"' : '';
    const input = type === 'batch' ? '<input name="batch" list="batch-options" value="' + escape(value) + '" maxlength="120"><datalist id="batch-options">' +
      options([...new Set([...batches.map(b => b.name), ...outreachRecords().map(r => r.batch).filter(Boolean)])],value) + '</datalist>' : Array.isArray(type) ? '<select name="' + key + '">' + options(type,value) + '</select>' :
      type === 'textarea' ? '<textarea name="' + key + '" maxlength="5000">' + escape(value) + '</textarea>' :
      '<input name="' + key + '" type="' + type + '" value="' + escape(value) + '"' + (['title','url'].includes(key) ? ' required' : '') + ' maxlength="' + (type === 'url' ? '2000' : '240') + '">';
    return '<label' + wide + '>' + label + input + '</label>';
  }).join('');
}
const gpsTiles = new Map();
let gpsWatch = 0, gpsFix = null, gpsZoom = 17, gpsDraw = 0;
const mercator = (lat, lon, zoom) => {
  const scale = 2 ** zoom;
  const sine = Math.sin(lat * Math.PI / 180);
  return {
    x: (lon + 180) / 360 * scale,
    y: (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * scale
  };
};
const feet = meters => {
  const total = Math.round(meters * 3.28084);
  return total < 1000 ? total + ' ft' : (total / 5280).toFixed(1) + ' mi';
};
const zoomFor = accuracy => accuracy > 250 ? 15 : accuracy > 80 ? 16 : 17;
function gpsStatus(text) { $('gps-status').textContent = text; }
function loadTile(zoom, x, y) {
  const span = 2 ** zoom;
  if (y < 0 || y >= span) return Promise.resolve(null);
  const wrapped = ((x % span) + span) % span;
  const key = zoom + '/' + wrapped + '/' + y;
  if (gpsTiles.has(key)) return gpsTiles.get(key);
  const pending = fetch('https://tile.openstreetmap.org/' + key + '.png').then(response => {
    if (!response.ok) throw new Error('Map tile unavailable');
    return response.blob();
  }).then(blob => createImageBitmap(blob)).catch(() => null);
  gpsTiles.set(key, pending);
  if (gpsTiles.size > 80) gpsTiles.delete(gpsTiles.keys().next().value);
  return pending;
}
async function drawGps() {
  const canvas = $('gps-map');
  if (!canvas || !gpsFix || $('gps-pip').hidden) return;
  const ticket = ++gpsDraw;
  if (!canvas.clientWidth) {
    requestAnimationFrame(() => { if (ticket === gpsDraw) drawGps(); });
    return;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const zoom = gpsZoom;
  const center = mercator(gpsFix.latitude, gpsFix.longitude, zoom);
  const tileSize = 256 * dpr;
  const originX = width / 2 - center.x * tileSize;
  const originY = height / 2 - center.y * tileSize;
  const xStart = Math.floor(-originX / tileSize);
  const yStart = Math.floor(-originY / tileSize);
  const xEnd = Math.floor((width - originX) / tileSize);
  const yEnd = Math.floor((height - originY) / tileSize);
  const jobs = [];
  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) jobs.push(loadTile(zoom, x, y).then(bitmap => ({bitmap, x, y})));
  }
  const tiles = await Promise.all(jobs);
  if (ticket !== gpsDraw || !gpsFix || $('gps-pip').hidden) return;
  const latest = mercator(gpsFix.latitude, gpsFix.longitude, gpsZoom);
  if (gpsZoom !== zoom || latest.x !== center.x || latest.y !== center.y) { drawGps(); return; }
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#d5e6dc';
  context.fillRect(0, 0, width, height);
  for (const {bitmap, x, y} of tiles) {
    if (bitmap) context.drawImage(bitmap, originX + x * tileSize, originY + y * tileSize, tileSize, tileSize);
  }
  const metersPerPixel = 156543.03392 * Math.cos(gpsFix.latitude * Math.PI / 180) / (2 ** zoom) / dpr;
  context.beginPath();
  context.arc(width / 2, height / 2, Math.min(width, Math.max(8 * dpr, (gpsFix.accuracy || 0) / metersPerPixel)), 0, Math.PI * 2);
  context.fillStyle = 'rgba(0,100,80,.18)';
  context.fill();
  context.lineWidth = 1.5 * dpr;
  context.strokeStyle = 'rgba(0,100,80,.55)';
  context.stroke();
  if (Number.isFinite(gpsFix.heading) && (gpsFix.speed || 0) > 0.4) {
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate((gpsFix.heading - 90) * Math.PI / 180);
    context.beginPath();
    context.moveTo(14 * dpr, 0);
    context.lineTo(-7 * dpr, 6 * dpr);
    context.lineTo(-7 * dpr, -6 * dpr);
    context.closePath();
    context.fillStyle = '#006450';
    context.fill();
    context.restore();
  }
}
function onGps(position) {
  const coords = position.coords;
  gpsFix = {latitude:coords.latitude, longitude:coords.longitude, accuracy:coords.accuracy, heading:coords.heading, speed:coords.speed};
  const nextZoom = zoomFor(coords.accuracy || 30);
  if (nextZoom !== gpsZoom) gpsZoom = nextZoom;
  $('gps-pip').classList.remove('waiting');
  gpsStatus('Live' + (Number.isFinite(coords.accuracy) ? ' · about ' + feet(coords.accuracy) : ''));
  drawGps();
}
function onGpsError(error) {
  gpsFix = null;
  $('gps-pip').classList.add('waiting');
  gpsStatus(error && error.code === 1 ? 'Allow location to see the live map.' : 'Location is unavailable right now.');
}
function startGps() {
  $('gps-pip').hidden = false;
  if (gpsWatch) return;
  if (!navigator.geolocation) {
    $('gps-pip').classList.add('waiting');
    gpsStatus('This browser cannot read your location.');
    return;
  }
  $('gps-pip').classList.add('waiting');
  gpsStatus('Finding your location…');
  gpsWatch = navigator.geolocation.watchPosition(onGps, onGpsError, {enableHighAccuracy:true, maximumAge:1000, timeout:12000});
}
function stopGps() {
  if (gpsWatch && navigator.geolocation) navigator.geolocation.clearWatch(gpsWatch);
  gpsWatch = 0;
  gpsFix = null;
  gpsDraw++;
  $('gps-pip').hidden = true;
  $('gps-pip').classList.add('waiting');
}
const syncGps = kind => kind === 'clinic' ? startGps() : stopGps();
function showEditor(kind, record) {
  if (busy) return;
  edit = {kind,record};
  $('editor-title').textContent = record ? 'Edit ' + kindNames[kind].toLowerCase() : 'New record';
  const kindInput = record ? '' : '<label>Record type<select id="kind" name="kind">' + options(Object.entries(kindNames),kind) + '</select></label>';
  const blank = {stage:'lead'};
  const seeded = kind === 'clinic' && page() === 'canvass' && batchFilter !== '*' && batchFilter !== 'Unassigned'
    ? {stage:'lead',batch:batchFilter,zip:/^\d{5}$/.test(batchFilter.split(' · ')[1] || '') ? batchFilter.split(' · ')[1] : '',next:'Confirm office manager, PIP handling, and best time to drop by.'}
    : blank;
  $('fields').innerHTML = kindInput + '<div id="record-fields">' + editorFields(kind,record ? {...record,stage:pipelineStage(record), ...(record.url?.startsWith('/') && {url:location.origin + record.url})} : seeded) + '</div>';
  $('form-error').textContent = '';
  $('delete').hidden = !record;
  if (!$('editor').open) $('editor').showModal();
  syncGps(kind);
}
$('edit-form').addEventListener('change', event => {
  if (event.target.id !== 'kind') return;
  edit.kind = event.target.value;
  const draft = Object.fromEntries(new FormData($('edit-form')));
  delete draft.status;
  delete draft.category;
  $('record-fields').innerHTML = editorFields(edit.kind,draft);
  syncGps(edit.kind);
});
function setBusy(value) {
  busy = value;
  for (const id of ['save','delete','close','cancel']) $(id).disabled = value;
}
$('edit-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const data = Object.fromEntries(new FormData(event.currentTarget));
  data.id = edit.record?.id || crypto.randomUUID();
  data.kind = edit.kind;
  data.title = data.title.trim();
  if (data.batch) data.batch = data.batch.trim();
  if (data.kind === 'document' && !/^https?:\/\//i.test(data.url)) { $('form-error').textContent = 'Enter a web link starting with https:// or http://.'; return; }
  setBusy(true);
  try {
    await request('PUT',data);
    $('editor').close();
    await load();
    notify('Record saved');
  } catch (error) { $('form-error').textContent = error.message; }
  finally { setBusy(false); }
});
$('delete').addEventListener('click', async () => {
  if (busy || !edit.record || !window.confirm('Delete this record?')) return;
  setBusy(true);
  const {id,kind,title} = edit.record;
  try {
    if (suggestions.some(record => record.id === id)) await request('PUT',{id,kind,title,hidden:'yes'});
    else await request('DELETE',{id});
    $('editor').close();
    await load();
    notify('Record deleted');
  } catch (error) { $('form-error').textContent = error.message; }
  finally { setBusy(false); }
});
for (const id of ['close','cancel']) $(id).addEventListener('click',() => $('editor').close());
$('editor').addEventListener('cancel',event => { if (busy) event.preventDefault(); });
$('editor').addEventListener('close', stopGps);
$('new').addEventListener('click',() => showEditor(primaryKind[page()]));
$('view').addEventListener('click', async event => {
  const target = event.target.closest('[data-action]');
  if (!target || busy) return;
  const {action,id} = target.dataset;
  const record = records().find(r => r.id === id);
  if (action === 'batch') { batchFilter = id; clinicSearch = ''; render(); return; }
  if (action === 'print') { printClinics(); return; }
  if (action === 'retry') { await load(); return; }
  if (action === 'add') { showEditor(id); return; }
  if (!record) return;
  if (action === 'edit') showEditor(record.kind,record);
  if (action === 'copy') {
    try { await navigator.clipboard.writeText(record.notes || ''); notify('Script copied'); }
    catch { notify('Clipboard unavailable. Open Edit to select the script text.'); }
  }
  if (action === 'toggle') {
    setBusy(true);
    target.disabled = true;
    const {updated,...data} = record;
    try {
      await request('PUT',{...data,status:record.status === 'Done' ? 'To do' : 'Done'});
      await load();
      notify('Checklist updated');
    } catch (error) { notify(error.message); }
    finally { setBusy(false); target.disabled = false; }
  }
});
$('view').addEventListener('input',event => {
  if (event.target.id === 'clinic-search') { clinicSearch = event.target.value; $('clinic-results').innerHTML = clinicCards(); }
  if (event.target.id === 'search') {
    filter = event.target.value;
    $('results').innerHTML = pipeline();
  }
});
$('view').addEventListener('change',event => {
  if (event.target.id === 'time-filter') { timeFilter = event.target.value; render(); }
  if (event.target.id === 'type-filter') typeFilter = event.target.value;
  if (event.target.id === 'stage-filter') stageFilter = event.target.value;
  if (['type-filter','stage-filter'].includes(event.target.id)) $('results').innerHTML = pipeline();
});
window.addEventListener('afterprint',() => { $('print-sheet').innerHTML = ''; });
window.addEventListener('hashchange',() => { render(); $('view').focus(); window.scrollTo(0,0); });
await load();
