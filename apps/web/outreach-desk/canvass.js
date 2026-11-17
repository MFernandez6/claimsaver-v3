export const batches = [
  {name:'Kendall · 33183', description:'Start here. Clinics in this neighborhood are listed by ZIP. This group is 33183, along SW 117th and SW 137th Avenues.'},
  {name:'East Kendall · 33176', description:'Dadeland and East Kendall. ZIP 33176, listed after the Kendall 33183 stops.'},
  {name:'West Kendall & The Hammocks · 33186', description:'SW 88th, SW 120th and SW 136th Streets. Clinics sort by ZIP: 33186, then 33196.'},
  {name:'Westchester & Bird Road · 33155', description:'Bird Road and Coral Way. Clinics sort by ZIP: 33155, 33165, then 33175.'},
  {name:'South Miami · 33143', description:'South Miami. ZIP 33143.'},
  {name:'Pinecrest · 33156', description:'Pinecrest. ZIP 33156. Confirm PIP before you add the stop to a route.'},
  {name:'Cutler Bay · 33157', description:'South of Kendall. ZIPs 33157 and 33189. This area has fewer separate offices than Kendall.'},
  {name:'Homestead · 33030', description:'Homestead. Clinics sort by ZIP: 33030, then 33033.'},
  {name:'Doral · 33178', description:'Doral, west of the airport. Clinics sort by ZIP: 33172, then 33178.'},
  {name:'Little Havana · 33125', description:'Calle Ocho and the surrounding blocks. Clinics sort by ZIP: 33125, then 33135.'},
  {name:'Brickell · 33131', description:'Brickell and the south edge of downtown. Clinics sort by ZIP: 33129, 33130, then 33131.'},
  {name:'Wynwood · 33127', description:'Wynwood. ZIP 33127 has one published chiropractic office. Confirm it before the visit.'},
  {name:'Midtown · 33137', description:'Midtown, the Design District and Edgewater. ZIP 33137.'}
];

const publicPip = 'PIP listed publicly';
const publicAuto = 'Auto injury listed publicly';
const confirmPip = 'Needs confirmation';
const registryNote = 'Address and phone are from the public chiropractic NPI registry. Call first to confirm the office is open and whether they handle auto injury and PIP.';

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
  },
  {
    id:'clinic-miami-pain-rehab', group:0, title:'Miami Pain & Rehab', zip:'33183',
    address:'8501 SW 124th Ave, Suite 101, Miami, FL 33183', phone:'305-273-0381', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33183',
    notes:registryNote + ' The registry lists Iris Maria Garcia, DC at this suite.'
  },
  {
    id:'clinic-grusky', group:1, title:'Grusky Chiropractic Center', zip:'33176',
    address:'11400 N Kendall Dr, Miami, FL 33176', phone:'305-598-2005', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176', notes:registryNote
  },
  {
    id:'clinic-bailey', group:1, title:'Bailey Chiropractic Life Center', zip:'33176',
    address:'14867 S Dixie Hwy, Miami, FL 33176', phone:'305-971-0302', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176', notes:registryNote
  },
  {
    id:'clinic-ballent', group:1, title:'Ballent Rehabilitation', zip:'33176',
    address:'14437 S Dixie Hwy, Miami, FL 33176', phone:'305-256-6020', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176', notes:registryNote
  },
  {
    id:'clinic-duran', group:1, title:'Alejandro Duran, DC', zip:'33176',
    address:'9350 SW 147th St, Miami, FL 33176', phone:'305-606-1292', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176', notes:registryNote
  },
  {
    id:'clinic-frontier-spine', group:1, title:'Frontier Spine and Health Care', zip:'33176',
    address:'10661 SW 88th St, Miami, FL 33176', phone:'786-353-0740', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176',
    notes:registryNote + ' David Alejandro Hernandez, DC is registered at this address.'
  },
  {
    id:'clinic-arrandt', group:1, title:'Dr. Arrandt Wellness Center', zip:'33176',
    address:'10651 N Kendall Dr, Miami, FL 33176', phone:'305-279-0850', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176', notes:registryNote
  },
  {
    id:'clinic-vida-care', group:1, title:'Vida Care Spine and Injury Center', zip:'33176',
    address:'11160 SW 88th St, Suite 102, Miami, FL 33176', phone:'305-209-2777', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176', notes:registryNote
  },
  {
    id:'clinic-yoham-kendall', group:1, title:'Yoham Kendall Area Chiropractic Center', zip:'33176',
    address:'11440 N Kendall Dr, Miami, FL 33176', phone:'305-598-1900', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33176', notes:registryNote
  },
  {
    id:'clinic-azur', group:2, title:'Azur Family Chiropractic and Wellness', zip:'33186',
    address:'12821 N Kendall Dr, Miami, FL 33186', phone:'786-443-1369', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33186', notes:registryNote
  },
  {
    id:'clinic-chiromedic-family', group:2, title:'Chiromedic Family Practice of Kendall', zip:'33186',
    address:'12060 SW 129th Ct, Suite 102, Miami, FL 33186', phone:'786-429-1937', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33186', notes:registryNote
  },
  {
    id:'clinic-movement-studio', group:2, title:'Chiropractic and Movement Studio', zip:'33186',
    address:'13429 SW 131st St, Miami, FL 33186', phone:'786-453-4226', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33186', notes:registryNote
  },
  {
    id:'clinic-elite-spine-kendall', group:2, title:'Elite Spine Miami', zip:'33186',
    address:'12001 SW 128th Ct, Suite 201, Miami, FL 33186', phone:'305-710-0395', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33186', notes:registryNote
  },
  {
    id:'clinic-trujillo', group:2, title:'Trujillo Chiropractic Center', zip:'33186',
    address:'9550 SW 137th Ave, Miami, FL 33186', phone:'305-408-0303', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33186', notes:registryNote
  },
  {
    id:'clinic-reyna', group:2, title:'Reyna Chiropractic Center', zip:'33196',
    address:'10201 Hammocks Blvd, Suite 152, Miami, FL 33196', phone:'305-388-5348', pip:confirmPip,
    website:'https://www.hammockschiropractic.com/', source:'https://www.healthgrades.com/providers/jose-reyna-x83nv',
    notes:'The Hammocks office. Confirm PIP handling before you add it to a route.'
  },
  {
    id:'clinic-besson', group:3, title:'Besson Chiropractic', zip:'33155',
    address:'6463 Bird Rd, Miami, FL 33155', phone:'786-536-7644', pip:confirmPip,
    hours:'Public hours: Mon–Thu 9 AM–6:30 PM, Fri 9 AM–2 PM, Sat 8 AM–noon.',
    website:'https://www.bessonchiro.com/contact-us/', source:'https://www.bessonchiro.com/contact-us/',
    notes:'The practice page lists this Bird Road address. Confirm PIP with the office.'
  },
  {
    id:'clinic-red-bird', group:3, title:'Red Bird Chiropractic', zip:'33155',
    address:'5761 Bird Rd, Miami, FL 33155', phone:'305-763-8880', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33155', notes:registryNote
  },
  {
    id:'clinic-reynolds', group:3, title:'Dr. Henry Reynolds, DC', zip:'33155',
    address:'5801 Bird Rd, Miami, FL 33155', phone:'305-662-2071', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33155', notes:registryNote
  },
  {
    id:'clinic-coffman', group:3, title:'Coffman Chiropractic', zip:'33155',
    address:'7110 SW 40th St, Miami, FL 33155', phone:'305-661-4775', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33155', notes:registryNote
  },
  {
    id:'clinic-dade-rehab', group:3, title:'Dade Rehabilitation Center', zip:'33155',
    address:'7951 SW 40th St, Miami, FL 33155', phone:'305-265-1192', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33155', notes:registryNote
  },
  {
    id:'clinic-kogut', group:3, title:'Kogut Chiropractic Clinic', zip:'33165',
    address:'9230 Bird Rd, Miami, FL 33165', phone:'305-227-3127', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33165', notes:registryNote
  },
  {
    id:'clinic-brain-to-body', group:3, title:'Brain to Body Chiropractic', zip:'33165',
    address:'9522 Bird Rd, Miami, FL 33165', phone:'305-667-1188', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33165', notes:registryNote
  },
  {
    id:'clinic-affiliated-south-miami', group:4, title:'Affiliated Healthcare Centers — South Miami', zip:'33143',
    address:'8000 SW 67th Ave, Miami, FL 33143', phone:'305-666-8883', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33143', notes:registryNote
  },
  {
    id:'clinic-mind-body', group:4, title:'Mind and Body Health Solutions', zip:'33143',
    address:'8603 S Dixie Hwy, Miami, FL 33143', phone:'305-595-4681', pip:publicAuto,
    source:'https://npi-1538212808.doxator.com/',
    notes:'A provider profile for Dr. Bilge Fisher at this address lists car-accident injuries and whiplash. Confirm PIP with the office. The same street address is sometimes listed as Pinecrest 33156.'
  },
  {
    id:'clinic-chiromedic-south-miami', group:4, title:'Chiromedic Healthcare Associates', zip:'33143',
    address:'6075 SW 72nd St, Miami, FL 33143', phone:'305-971-0302', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33143',
    notes:registryNote + ' This phone is also used by Bailey Chiropractic in East Kendall. Confirm which office you are visiting.'
  },
  {
    id:'clinic-eugene-su', group:4, title:'Eugene Ming Su, DC', zip:'33143',
    address:'5901 SW 74th St, Miami, FL 33143', phone:'855-692-9362', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33143', notes:registryNote
  },
  {
    id:'clinic-gentile', group:4, title:'John J. Gentile, DC', zip:'33143',
    address:'8056 SW 81st Dr, Miami, FL 33143', phone:'305-271-1652', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33143', notes:registryNote
  },
  {
    id:'clinic-page', group:4, title:'Page Chiropractic Life Center', zip:'33143',
    address:'6705 Red Road, Suite 702, Miami, FL 33143', phone:'305-662-6433', pip:confirmPip,
    website:'https://www.pagechiropractic.com/', source:'https://www.pagechiropractic.com/',
    notes:'Family chiropractic office. Confirm auto injury and PIP handling by phone.'
  },
  {
    id:'clinic-mobile-chiro', group:4, title:'Mobile Chiropractic', zip:'33143',
    address:'6543 SW 78th Terrace, South Miami, FL 33143', phone:'305-252-9090', pip:publicAuto,
    website:'https://www.mobilechiropractic.com/auto-injury', source:'https://www.mobilechiropractic.com/about-me',
    notes:'The office is in South Miami, and the practice also sends doctors to a patient’s home or workplace. Confirm whether a canvassing visit should be at this address.'
  },
  {
    id:'clinic-all-gentle', group:5, title:'All Gentle Chiropractic', zip:'33156',
    address:'10531 S Dixie Hwy, Miami, FL 33156', phone:'305-668-3525', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33156', notes:registryNote
  },
  {
    id:'clinic-nadel', group:5, title:'Bruce Nadel, DC', zip:'33156',
    address:'8380 SW 124th St, Miami, FL 33156', phone:'305-238-4800', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33156', notes:registryNote
  },
  {
    id:'clinic-quintana', group:5, title:'Glenn V. Quintana, DC', zip:'33156',
    address:'9406 S Dixie Hwy, Miami, FL 33156', phone:'305-670-9313', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33156', notes:registryNote
  },
  {
    id:'clinic-petrillo', group:5, title:'Linda S. Petrillo, DC', zip:'33156',
    address:'12673 S Dixie Hwy, Miami, FL 33156', phone:'786-242-6460', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33156', notes:registryNote
  },
  {
    id:'clinic-miami-hollisic', group:5, title:'Miami Hollisic Chiropractors', zip:'33156',
    address:'9719 S Dixie Hwy, Suite 7, Miami, FL 33156', phone:'786-408-4889', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33156',
    notes:registryNote + ' The registry spells the practice name Hollisic.'
  },
  {
    id:'clinic-frisbee', group:5, title:'Patrece Frisbee, DC', zip:'33156',
    address:'9420 SW 77th Ave, Miami, FL 33156', phone:'305-666-1402', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33156', notes:registryNote
  },
  {
    id:'clinic-canali', group:5, title:'Paul J. Canali, DC', zip:'33156',
    address:'7700 N Kendall Dr, Miami, FL 33156', phone:'305-667-8174', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33156', notes:registryNote
  },
  {
    id:'clinic-cutler-ridge-family', group:6, title:'Cutler Ridge Family Chiropractic Center', zip:'33189',
    address:'10700 Caribbean Blvd, Suite 206, Cutler Bay, FL 33189', phone:'305-255-3005', pip:confirmPip,
    website:'https://www.misterspine.com/', source:'https://www.misterspine.com/',
    notes:'Public listing for this Caribbean Boulevard suite. Confirm auto injury and PIP handling by phone.'
  },
  {
    id:'clinic-rubinstein', group:6, title:'Rubinstein Family Chiropractic', zip:'33189',
    address:'20341 Old Cutler Rd, Cutler Bay, FL 33189', phone:'305-336-1803', pip:confirmPip,
    website:'https://www.rubinsteinfamilychiropractic.com/', source:'https://www.rubinsteinfamilychiropractic.com/',
    notes:'Family chiropractic office. Confirm auto injury and PIP handling by phone.'
  },
  {
    id:'clinic-goldberg', group:6, title:'Chiropractic Fitness & Injury Rehab', zip:'33189',
    address:'20505 S Dixie Hwy, Cutler Bay, FL 33189', phone:'305-971-8484', pip:publicAuto,
    hours:'Public hours: Mon–Fri 9 AM–1 PM and 3–7 PM, Sat 9 AM–1 PM.',
    source:'https://www.americanchiropractors.org/details.php?id=55707',
    notes:'The public listing is an accident-injury rehab office. Confirm PIP with the office.'
  },
  {
    id:'clinic-cora-cutler', group:6, title:'CORA Physical Therapy — Cutler Bay', zip:'33157',
    address:'18465 S Dixie Hwy, Cutler Bay, FL 33157', phone:'786-293-6800', pip:confirmPip,
    website:'https://www.coraphysicaltherapy.com/', source:'https://www.coraphysicaltherapy.com/location/cutler-bay-florida/',
    notes:'Physical therapy clinic. Confirm whether they take auto-injury and PIP patients before the visit.'
  },
  {
    id:'clinic-chs-cutler', group:6, title:'CHS Physical Therapy', zip:'33189',
    address:'20250 S Dixie Hwy, Unit 206, Cutler Bay, FL 33189', phone:'786-333-1122', pip:confirmPip,
    email:'casalhealthservices@gmail.com', website:'https://casalhealthservices.com/', source:'https://casalhealthservices.com/',
    notes:'Physical therapy clinic. The site mentions injury recovery and workers’ compensation. Confirm PIP before the visit.'
  },
  {
    id:'clinic-affiliated-homestead', group:7, title:'Affiliated Healthcare Centers — Homestead', zip:'33030',
    address:'143 N Flagler Ave, Homestead, FL 33030', phone:'305-248-5200', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead', notes:registryNote
  },
  {
    id:'clinic-florida-wellness-homestead', group:7, title:'Florida Wellness & Rehabilitation Center of Homestead', zip:'33030',
    address:'207 N Krome Ave, Homestead, FL 33030', phone:'305-246-0056', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead', notes:registryNote
  },
  {
    id:'clinic-celebrity-rehab', group:7, title:'Celebrity Rehab', zip:'33030',
    address:'50 NW 15th St, Homestead, FL 33030', phone:'786-515-9771', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead', notes:registryNote
  },
  {
    id:'clinic-witherell', group:7, title:'Witherell Chiropractic Health Center', zip:'33030',
    address:'974 Old Dixie Hwy, Homestead, FL 33030', phone:'305-247-7300', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead', notes:registryNote
  },
  {
    id:'clinic-pain-relief-homestead', group:7, title:'Pain Relief Center of Homestead', zip:'33030',
    address:'46 N Homestead Blvd, Homestead, FL 33030', phone:'305-248-2250', pip:publicAuto,
    website:'https://www.drbresslerpainrelief.com/services-1', source:'https://www.drbresslerpainrelief.com/services-1',
    notes:'The practice page says this office treats car-accident injuries. Confirm PIP with the front desk.'
  },
  {
    id:'clinic-homestead-chiro', group:7, title:'Homestead Chiropractic Clinic', zip:'33030',
    address:'125 NE 8th St, Homestead, FL 33030', phone:'305-247-2804', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead', notes:registryNote
  },
  {
    id:'clinic-martinez-health', group:7, title:'Martinez Health', zip:'33030',
    address:'930 N Krome Ave, Homestead, FL 33030', phone:'305-248-2553', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead', notes:registryNote
  },
  {
    id:'clinic-ruszkowski', group:7, title:'Raymond Ruszkowski, DC', zip:'33030',
    address:'692 N Homestead Blvd, Suite 104, Homestead, FL 33030', phone:'305-242-6665', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead', notes:registryNote
  },
  {
    id:'clinic-cor-homestead', group:7, title:'COR Injury Centers of Homestead', zip:'33033',
    address:'15600 SW 288th St, Homestead, FL 33033', phone:'305-247-6110', pip:publicAuto,
    source:'https://npiscan.com/chiropractor/fl/homestead',
    notes:registryNote + ' The registered name is an injury center.'
  },
  {
    id:'clinic-pros-homestead', group:7, title:'PROS Miami Homestead', zip:'33033',
    address:'28836 S Dixie Hwy, Homestead, FL 33033', phone:'305-248-3880', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/homestead',
    notes:registryNote + ' Luis E. Orozco, DC is registered nearby at 28848 S Dixie Hwy with the same phone. Confirm the door before you go.'
  },
  {
    id:'clinic-doral-medical', group:8, title:'Doral Medical Center', zip:'33172',
    address:'1500 NW 89th Ct, Suite 207, Doral, FL 33172', phone:'786-464-1397', pip:publicAuto,
    email:'info@doralmedicalcenter.com', website:'https://doralmedicalcenter.com/', source:'https://doralmedicalcenter.com/',
    notes:'The site describes this as an accident clinic and mentions Florida’s 14-day treatment window. Confirm PIP with the office.'
  },
  {
    id:'clinic-doral-chiro', group:8, title:'Doral Chiropractic Center', zip:'33172',
    address:'2406 NW 87th Pl, Doral, FL 33172', phone:'305-463-9697', pip:publicAuto,
    website:'https://doralchiropracticcenter.com/', source:'https://doralchiropracticcenter.com/',
    notes:'The practice page says they can help after an auto accident. Confirm the visit address and PIP before you go.'
  },
  {
    id:'clinic-doral-med-rehab', group:8, title:'Doral Med and Rehab', zip:'33172',
    address:'1460 NW 107th Ave, Suite 27-A, Sweetwater, FL 33172', phone:'305-293-8111', pip:publicAuto,
    website:'https://doralmedandrehab.com/', source:'https://doralmedandrehab.com/',
    notes:'The site says the office treats auto-accident patients and lists chiropractic care. Confirm PIP with the office.'
  },
  {
    id:'clinic-jkr-rehab', group:8, title:'JKR Rehab and Wellness', zip:'33172',
    address:'9300 NW 25th St, Doral, FL 33172', phone:'305-436-1443', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/doral', notes:registryNote
  },
  {
    id:'clinic-carril', group:8, title:'Manuel Carril, DC', zip:'33172',
    address:'8726 NW 26th St, Doral, FL 33172', phone:'305-477-7976', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/doral', notes:registryNote
  },
  {
    id:'clinic-optimum-spine', group:8, title:'Optimum Spine Chiropractic Center', zip:'33178',
    address:'7500 NW 104th Ave, Suite B200, Doral, FL 33178', phone:'305-204-2243', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/doral', notes:registryNote
  },
  {
    id:'clinic-alvarez-doral', group:8, title:'Alejandro Alvarez, DC', zip:'33178',
    address:'4055 NW 97th Ave, Suite 104B, Doral, FL 33178', phone:'786-600-0192', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/doral', notes:registryNote
  },
  {
    id:'clinic-chiro-network-doral', group:8, title:'Chiropractic Network Solutions', zip:'33178',
    address:'3750 NW 87th Ave, Suite 500, Doral, FL 33178', phone:'305-284-7484', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/doral', notes:registryNote
  },
  {
    id:'clinic-codinach', group:8, title:'Rafael A. Codinach, DC', zip:'33178',
    address:'9831 NW 58th St, Unit 148, Doral, FL 33178', phone:'305-343-8448', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/doral', notes:registryNote
  },
  {
    id:'clinic-yoham-doral', group:8, title:'Center for Chiropractic Health Rehabilitation', zip:'33178',
    address:'11402 NW 41st St, Suite 207, Doral, FL 33178', phone:'305-994-2112', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/doral',
    notes:registryNote + ' Jeffrey S. Yoham, DC is registered at this suite.'
  },
  {
    id:'clinic-lopez-havana', group:9, title:'Armando E. Lopez, DC', zip:'33125',
    address:'3095 NW 7th St, Miami, FL 33125', phone:'305-541-4033', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33125', notes:registryNote
  },
  {
    id:'clinic-coral-gables-chiro', group:9, title:'Coral Gables Chiropractic', zip:'33125',
    address:'3383 NW 7th St, Suite 103, Miami, FL 33125', phone:'305-441-8547', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33125',
    notes:registryNote + ' Chiropractic Clinics of South Florida also lists this suite. Treat it as one stop.'
  },
  {
    id:'clinic-jacobs', group:9, title:'Judy Ann Jacobs, DC', zip:'33125',
    address:'3061 NW 7th St, Miami, FL 33125', phone:'305-541-5581', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33125', notes:registryNote
  },
  {
    id:'clinic-spinex', group:9, title:'Spinex Centers', zip:'33125',
    address:'2244 NW 7th St, Miami, FL 33125', phone:'786-325-5741', pip:confirmPip,
    website:'http://www.spinexcenters.com/', source:'http://www.spinexcenters.com/',
    notes:'Little Havana chiropractic office. Confirm PIP handling before the visit.'
  },
  {
    id:'clinic-yosvany-diaz', group:9, title:'Yosvany Diaz, DC', zip:'33125',
    address:'42 NW 27th Ave, Suite 301, Miami, FL 33125', phone:'305-644-2270', pip:confirmPip,
    source:'https://local.yobi.com/chiro/dr-yosvany-diaz-ma-miami-fl/',
    notes:'Address and phone are from a public provider listing. Call first to confirm the office is open and whether they handle auto injury and PIP.'
  },
  {
    id:'clinic-advance-therapy', group:9, title:'Advance Therapy Center', zip:'33135',
    address:'330 SW 27th Ave, Miami, FL 33135', phone:'305-642-4664', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33135', notes:registryNote
  },
  {
    id:'clinic-jacqueline-gonzalez', group:10, title:'Jacqueline Gonzalez, DC', zip:'33129',
    address:'1801 SW 3rd Ave, Miami, FL 33129', phone:'305-854-4604', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33129', notes:registryNote
  },
  {
    id:'clinic-cc-laser', group:10, title:'C&C Chiropractic and Laser Center', zip:'33129',
    address:'2250 SW 3rd Ave, Suite 205, Miami, FL 33129', phone:'786-517-6551', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33129', notes:registryNote
  },
  {
    id:'clinic-facuseh', group:10, title:'Edgar Facuseh, DC', zip:'33130',
    address:'28 W Flagler St, Suite 601, Miami, FL 33130', phone:'305-667-4567', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33130', notes:registryNote
  },
  {
    id:'clinic-vislobokova', group:10, title:'Erica Vislobokova, DC', zip:'33130',
    address:'175 SW 7th St, Suite 2010, Miami, FL 33130', phone:'786-548-2985', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33130', notes:registryNote
  },
  {
    id:'clinic-worrall', group:10, title:'Jason A. Worrall, DC', zip:'33130',
    address:'175 SW 7th St, Suite 2305, Miami, FL 33130', phone:'305-419-0313', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33130',
    notes:registryNote + ' A second chiropractor is registered in another suite of this building. Confirm you have the right door.'
  },
  {
    id:'clinic-ramnanan', group:10, title:'Marie Ramnanan, DC', zip:'33130',
    address:'434 SW 12th Ave, Miami, FL 33130', phone:'305-984-1424', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33130', notes:registryNote
  },
  {
    id:'clinic-geiger', group:10, title:'Geiger & Associates', zip:'33131',
    address:'1390 Brickell Ave, Suite 310, Miami, FL 33131', phone:'305-371-3339', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33131',
    notes:registryNote + ' Dr. Jayson Milner, LLC is registered at 1390 Brickell Avenue with the same phone.'
  },
  {
    id:'clinic-cohen', group:10, title:'Holistic Health & Wellness — Dr. David Cohen', zip:'33131',
    address:'1100 Brickell Bay Dr, Suite 1600, Miami, FL 33131', phone:'786-795-8315', pip:confirmPip,
    website:'https://drcholistichealth.com/', source:'https://drcholistichealth.com/',
    notes:'The practice says it is private pay and does not accept insurance. Confirm before you spend a visit here.'
  },
  {
    id:'clinic-thompson', group:11, title:'Thompson Chiropractic', zip:'33127',
    address:'4800 NW 7th Ave, Miami, FL 33127', phone:'305-758-2622', pip:publicAuto,
    website:'https://www.mymiamichiro.com/', source:'https://www.mymiamichiro.com/',
    notes:'The practice site lists auto and work injury. Miami Spine Clinic is also registered at this address. Treat it as one stop and confirm the current office name.'
  },
  {
    id:'clinic-wynwellness', group:12, title:'WynWellness', zip:'33137',
    address:'4770 Biscayne Blvd, Suite 610, Miami, FL 33137', phone:'786-899-0595', pip:publicAuto,
    email:'Frontdesk@wynwellness.com', website:'https://wynwellness.com/', source:'https://wynwellness.com/injury-clinic-miami-chiropractic-rehab-sports-performance-at-wynwellness/',
    hours:'Public hours vary by day. Call before you go.',
    notes:'The practice describes this office as Wynwood and says it sees patients after car accidents. The published address is ZIP 33137, so it is grouped with Midtown.'
  },
  {
    id:'clinic-dhw', group:12, title:'DHW, Inc.', zip:'33137',
    address:'2800 Biscayne Blvd, Suite 777, Miami, FL 33137', phone:'305-458-7434', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33137', notes:registryNote
  },
  {
    id:'clinic-health-fit', group:12, title:'Health-Fit Miami', zip:'33137',
    address:'162 NE 25th St, Suite 103, Miami, FL 33137', phone:'305-770-6393', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33137', notes:registryNote
  },
  {
    id:'clinic-lowe', group:12, title:'Jessica Lauren Lowe, DC', zip:'33137',
    address:'2125 Biscayne Blvd, Suite 204, Miami, FL 33137', phone:'706-892-4618', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33137',
    notes:registryNote + ' The registered phone is not a Miami area code. Confirm it still rings the office.'
  },
  {
    id:'clinic-adorno', group:12, title:'Oscar Adorno-Bruno, DC', zip:'33137',
    address:'3601 Federal Hwy, Miami, FL 33137', phone:'305-576-6611', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33137', notes:registryNote
  },
  {
    id:'clinic-anselmo', group:12, title:'Peter Andrew Anselmo, DC', zip:'33137',
    address:'30 NE 23rd St, Suite 105, Miami, FL 33137', phone:'413-244-3603', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33137',
    notes:registryNote + ' The registered phone is not a Miami area code. Confirm it still rings the office.'
  },
  {
    id:'clinic-shin', group:12, title:'Shin Wellness', zip:'33137',
    address:'4500 Biscayne Blvd, Suite 202, Miami, FL 33137', phone:'305-571-9090', pip:publicAuto,
    email:'info@shinwellness.com', website:'https://www.shinwellness.com/', source:'https://www.shinwellness.com/chiropractic-care-in-little-havana/',
    notes:'The practice page lists auto-accident injuries. The office is in ZIP 33137.'
  },
  {
    id:'clinic-khinda', group:12, title:'Sunjot Khinda, DC', zip:'33137',
    address:'3050 Biscayne Blvd, Suite 401, Miami, FL 33137', phone:'888-810-2455', pip:confirmPip,
    source:'https://npiscan.com/chiropractor/fl/miami/zip/33137', notes:registryNote
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
