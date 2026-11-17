export const batches = [
  {name:'Kendall · 33183', description:'Start here. Clinics in this neighborhood are listed by ZIP. This group is 33183, along SW 117th and SW 137th Avenues.'},
  {name:'East Kendall · 33176', description:'Dadeland and East Kendall. ZIP 33176, listed after the Kendall 33183 stops.'},
  {name:'West Kendall & The Hammocks · 33186', description:'SW 88th, SW 120th and SW 136th Streets. Clinics sort by ZIP: 33186, then 33196.'},
  {name:'Westchester & Bird Road · 33155', description:'Bird Road and Coral Way. Clinics sort by ZIP: 33155, 33165, then 33175.'},
  {name:'South Miami · 33143', description:'South Miami. ZIP 33143.'},
  {name:'Pinecrest · 33156', description:'Pinecrest. ZIP 33156. Confirm PIP before you add the stop to a route.'},
  {name:'Cutler Bay · 33157', description:'South of Kendall. Add confirmed clinics in ZIPs 33157, 33189 and 33190.'},
  {name:'Homestead · 33030', description:'Homestead. Add confirmed clinics in ZIPs 33030, 33031, 33033 and 33035.'},
  {name:'Doral · 33178', description:'Doral, west of the airport. Add confirmed clinics in ZIPs 33172 and 33178.'},
  {name:'Little Havana · 33125', description:'Calle Ocho and the surrounding blocks. Add confirmed clinics in ZIPs 33125 and 33135.'},
  {name:'Brickell · 33131', description:'Brickell and the south edge of downtown. Add confirmed clinics in ZIPs 33129, 33130 and 33131.'},
  {name:'Wynwood · 33127', description:'Wynwood. Add confirmed clinics in ZIP 33127.'},
  {name:'Midtown · 33137', description:'Midtown, the Design District and Edgewater. Add confirmed clinics in ZIP 33137.'}
];

const publicPip = 'PIP listed publicly';
const publicAuto = 'Auto injury listed publicly';
const confirmPip = 'Needs confirmation';

export const clinicTargets = [
  {
    id:'clinic-steinberg', group:0, title:'Steinberg Chiropractic Center', zip:'33183',
    address:'13710 SW 84th St, Miami, FL 33183', phone:'305-387-3896', pip:publicAuto,
    website:'https://www.steinbergchiro.com/page/contact.html',
    source:'https://www.yellowpages.com/miami-fl/mip/dr-fred-alan-steinberg-dc-13624294?lid=13624294',
    notes:'The practice website lists the address and phone. A business directory mentions auto-accident care. Confirm PIP with the office.'
  },
  {
    id:'clinic-advanced-physical', group:0, title:'Advanced Physical Medicine & Rehab of Miami', zip:'33183',
    address:'7170 SW 117th Ave, Miami, FL 33183', phone:'305-598-8788', pip:publicAuto,
    website:'https://www.integrativemedicine.care/', source:'https://www.integrativemedicine.care/auto-accident-and-personal-injury/'
  },
  {
    id:'clinic-south-fl-rehab', group:0, title:'South Florida Rehabilitation and Wellness Center', zip:'33183',
    address:'7990 SW 117th Ave, Suite 205, Miami, FL 33183', phone:'305-271-7447', pip:confirmPip,
    website:'https://southfloridachiropracticcenter.com/',
    source:'https://provider.clearhealthalliance.com/docs/gpp/FLFL_MMA_CHA_ProviderDirectory_RegionI.pdf?v=202602022000',
    notes:'Local chiropractic prospect. The provider directory lists the address and phone. Call first to confirm the suite and whether the practice handles auto injury and PIP.'
  },
  {
    id:'clinic-epic-kendall', group:2, title:'Epic Medical Centers — Kendall', zip:'33196',
    address:'15680 SW 88th St, Miami, FL 33196', phone:'305-570-1666', pip:publicAuto,
    hours:'Public hours: Mon–Fri, 9 AM–6 PM. Ask when the office manager is available.',
    website:'https://epicmedicalcenters.com/', source:'https://epicmedicalcenters.com/locations'
  },
  {
    id:'clinic-chiromedix-kendall', group:2, title:'Chiromedix Pain & Injury Centers — Kendall', zip:'33186',
    address:'14335 SW 120th St, Suite 102, Miami, FL 33186', phone:'786-309-2225', pip:publicPip,
    website:'https://chiromedix.com/', source:'https://chiromedix.com/',
    notes:'Chiropractic Clinics of South Florida also lists this suite. Treat it as one stop and confirm the current office name when calling.'
  },
  {
    id:'clinic-martinez', group:2, title:'Martinez Chiropractic and Medical Center', zip:'33186',
    address:'12595 SW 137th Ave, Suite 108, Miami, FL 33186', phone:'305-388-7577', pip:publicAuto,
    hours:'Call first. The office lists a midday closure on Monday, Wednesday and Friday.',
    website:'https://www.martinezchiropracticandmedical.com/contact',
    source:'https://www.martinezchiropracticandmedical.com/services'
  },
  {
    id:'clinic-back-to-mind-kendall', group:2, title:'Accident Clinic Miami / Back To Mind — Kendall', zip:'33186',
    address:'13501 SW 136th St, Suite 207, Miami, FL 33186', phone:'786-796-8707', pip:publicPip,
    website:'https://accidentclinic.miami/', source:'https://accidentclinic.miami/'
  },
  {
    id:'clinic-castellanos', group:3, title:'Chiropractic Injury Physicians', zip:'33175',
    address:'13911 SW 42nd St, Suite 202, Miami, FL 33175', phone:'786-359-4041', pip:publicAuto,
    website:'https://chiropracticinjuryphysicians.com/', source:'https://chiropracticinjuryphysicians.com/',
    notes:'Call first to confirm the current location. The contact page also lists 12905 SW 42nd St, Suite 214, under Tamiami Chiropractic Injury Clinic with the same phone.'
  },
  {
    id:'clinic-sunlife', group:3, title:'Sunlife Rehabilitation Center', zip:'33165',
    address:'2720 SW 97th Ave, Suite C-107, Miami, FL 33165', phone:'305-960-7073', pip:publicAuto,
    website:'https://sunlife-rehabilitation-center.lovable.app/auto-accident-injury',
    source:'https://sunlife-rehabilitation-center.lovable.app/auto-accident-injury'
  },
  {
    id:'clinic-miami-chiro-coral', group:3, title:'Miami Chiropractic — Coral Way', zip:'33155',
    address:'6850 Coral Way, Suite 300, Miami, FL 33155', phone:'305-588-7646', pip:publicAuto,
    website:'https://miamichiropracticdesigndistrict.com/auto-accident',
    source:'https://miamichiropracticdesigndistrict.com/auto-accident',
    notes:'Use the Coral Way address on the practice page when planning this stop.'
  },
  {
    id:'clinic-fernandez', group:1, title:'Fernandez Family Chiropractic Center', zip:'33176',
    address:'9950 SW 107th Ave, Suite 202, Miami, FL 33176', phone:'305-270-8800',
    email:'info@miamifloridachiropractor.com', pip:publicPip, website:'https://www.miamifloridachiropractor.com/',
    source:'https://www.miamifloridachiropractor.com/about-fernandez-family-chiropractic/'
  },
  {
    id:'clinic-levitt', group:1, title:'Levitt / Dadeland Chiropractic Center', zip:'33176',
    address:'8955 SW 87th Ct, Suite 101, Miami, FL 33176', phone:'305-233-5700', pip:publicAuto,
    website:'https://www.levittchiropractic.com/contact-us/', source:'https://www.levittchiropractic.com/auto-injury'
  },
  {
    id:'clinic-pinecrest-chiro', group:5, title:'Pinecrest Chiropractic', zip:'33156',
    address:'8239 SW 124th St, Pinecrest, FL 33156', phone:'305-234-4725', pip:confirmPip,
    website:'https://www.pinecrestchiro.com/contact-us', source:'https://www.pinecrestchiro.com/contact-us',
    notes:'Local chiropractic prospect. Confirm auto injury and PIP handling by phone before adding this stop to your route.'
  },
  {
    id:'clinic-advanced-medical', group:4, title:'Advanced Medical Treatment Center — South Miami', zip:'33143',
    address:'7000 SW 62nd Ave, Suite 100, Miami, FL 33143', phone:'786-452-9230',
    email:'info@advmedhelp.com', pip:publicAuto, website:'https://advmedhelp.com/contact',
    source:'https://advmedhelp.com/contact'
  }
].map(({group,...clinic}) => ({
  ...clinic,
  kind:'clinic',
  city:batches[group].name.split(' · ')[0],
  batch:batches[group].name,
  status:'New target',
  notes:clinic.notes || '',
  next:'Call for the office manager, confirm PIP handling, and ask about a short introduction.'
}));

const libraryLink = id => 'https://chatgpt.com/library?file_id=' + id + '&account_id=personal';
export const documents = [
  ['doc-clinic-deck','Clinic pitch deck','Current outreach','clinic-pitch.html','Five short slides for an office-manager conversation. Open on your phone, or use Print to save a PDF.'],
  ['doc-visit-one-page','Clinic leave-behind','Current outreach','clinic-one-page.html','A one-page introduction for clinics. Plain-language positioning, no contingency fee, and a short demo invitation.'],
  ['doc-packet-review','Clinic drop-off packet — review PDF','Existing collateral',libraryLink('libfile_c0e8b2f3b3c08191a75dc855ecfe6180'),'Review wording and feature claims against current launch readiness before distributing.'],
  ['doc-packet-zip','Clinic drop-off packet — production files','Existing collateral',libraryLink('libfile_45193016bc0081918c58d3f5f8ae34c4'),'Original collection of clinic packet files.'],
  ['doc-order-sheet','Clinic packet print order sheet','Print reference',libraryLink('libfile_087a7ea715848191a60a7d064d99fb1e'),'Existing print quantities, trim sizes, and stock specifications.'],
  ['doc-prelaunch','Prelaunch clinic packet','Archive',libraryLink('libfile_ec78c3861e1881919502404fa321c9b0'),'Historical reference. Its prelaunch wording and placeholder contact details should be updated before reuse.']
].map(([id,title,category,url,notes]) => ({id,title,category,url,notes,kind:'document'}));
