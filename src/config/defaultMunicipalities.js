/**
 * NAGARSETU AI - ICHALKARANJI MUNICIPAL CORPORATION
 * 
 * Exclusive Municipality: Ichalkaranji Municipal Corporation (इचलकरंजी महानगरपालिका - IMC)
 * Total Area: 49.84 sq km | 65 Wards organized across 16 Election Prabhags (प्रभाग १ ते १६)
 * Headquarters: Station Road, beside Guru Talkies, Vikas Nagar, Ichalkaranji - 416115
 * Coordinates: [16.6992, 74.4578]
 */

export const DEFAULT_MUNICIPALITIES = [
  {
    id: 'muni-ichalkaranji-demo',
    name: 'Ichalkaranji Municipal Corporation',
    marathiName: 'इचलकरंजी महानगरपालिका',
    code: 'IMC',
    state: 'Maharashtra',
    district: 'Ichalkaranji Division',
    taluka: 'Hatkanangale',
    country: 'India',
    isPrimary: true,
    isDemo: false,
    tagline: 'Textile City Civic Command & Operations Hub',
    marathiTagline: 'वस्त्रनगरी नागरी नियंत्रण व स्मार्ट प्रशासन कक्ष',
    centerCoordinates: [16.6992, 74.4578],
    zoomLevel: 13,
    officeAddress: 'Station Road, beside Guru Talkies, Vikas Nagar, Ichalkaranji, Maharashtra – 416115',
    totalAreaSqKm: 49.84,
    totalWardsCount: 65,
    totalPrabhagsCount: 16,
    adminStructureType: 'PRABHAG_WARD_HIERARCHY',
    adminUnits: [
      { id: 'imc-zone-central', name: 'Central Commercial Zone', marathiName: 'मध्यवर्ती व्यापारी विभाग' },
      { id: 'imc-zone-industrial', name: 'Powerloom Industrial Zone', marathiName: 'यंत्रमाग औद्योगिक विभाग' },
      { id: 'imc-zone-riverfront', name: 'Panchganga Riverfront Zone', marathiName: 'पंचगंगा नदीकाठ विभाग' },
      { id: 'imc-zone-residential', name: 'North & East Residential Zone', marathiName: 'उत्तर-पूर्व रहिवासी विभाग' },
    ],
    wards: [
      { id: 'w-imc-01', number: 1, name: 'Prabhag 1: Rajwada & Kapad Market', marathiName: 'प्रभाग १: राजवाडा व कापड बाजार', zone: 'imc-zone-central', officer: 'Prabhag Adhikari 1', population: 28500, coords: [16.6985, 74.4620] },
      { id: 'w-imc-02', number: 2, name: 'Prabhag 2: Janata Chowk & D.K.T.E. Campus', marathiName: 'प्रभाग २: जनता चौक व डी.के.टी.ई. परिसर', zone: 'imc-zone-central', officer: 'Prabhag Adhikari 2', population: 31000, coords: [16.7020, 74.4650] },
      { id: 'w-imc-03', number: 3, name: 'Prabhag 3: Shahapur Main Corridor', marathiName: 'प्रभाग ३: शहापूर मुख्य रस्ता', zone: 'imc-zone-residential', officer: 'Prabhag Adhikari 3', population: 29500, coords: [16.6940, 74.4520] },
      { id: 'w-imc-04', number: 4, name: 'Prabhag 4: Station Road & Vikas Nagar (HQ)', marathiName: 'प्रभाग ४: स्टेशन रोड व विकास नगर (मनपा मुख्यालय)', zone: 'imc-zone-central', officer: 'Prabhag Adhikari 4', population: 26000, coords: [16.6992, 74.4578] },
      { id: 'w-imc-05', number: 5, name: 'Prabhag 5: Powerloom Weaving Estate', marathiName: 'प्रभाग ५: यंत्रमाग औद्योगिक वसाहत', zone: 'imc-zone-industrial', officer: 'Prabhag Adhikari 5', population: 33000, coords: [16.7110, 74.4710] },
      { id: 'w-imc-06', number: 6, name: 'Prabhag 6: Panchganga River Intake Well', marathiName: 'प्रभाग ६: पंचगंगा नदीकाठ व उपसा जलकेंद्र', zone: 'imc-zone-riverfront', officer: 'Prabhag Adhikari 6', population: 24000, coords: [16.6850, 74.4480] },
      { id: 'w-imc-07', number: 7, name: 'Prabhag 7: Kabnur Link & Korochi Naka', marathiName: 'प्रभाग ७: कबनूर रोड व कोरोची नाका', zone: 'imc-zone-industrial', officer: 'Prabhag Adhikari 7', population: 35000, coords: [16.7180, 74.4550] },
      { id: 'w-imc-08', number: 8, name: 'Prabhag 8: IGM Hospital & Subhash Nagar', marathiName: 'प्रभाग ८: आय.जी.एम. रुग्णालय व सुभाष नगर', zone: 'imc-zone-central', officer: 'Prabhag Adhikari 8', population: 30500, coords: [16.7050, 74.4590] },
      { id: 'w-imc-09', number: 9, name: 'Prabhag 9: Awade Nagar & Jawahar Nagar', marathiName: 'प्रभाग ९: आवाडे नगर व जवाहर नगर', zone: 'imc-zone-residential', officer: 'Prabhag Adhikari 9', population: 28000, coords: [16.6920, 74.4690] },
      { id: 'w-imc-10', number: 10, name: 'Prabhag 10: Vikram Nagar & Thorat Chowk', marathiName: 'प्रभाग १०: विक्रम नगर व थोरात चौक', zone: 'imc-zone-residential', officer: 'Prabhag Adhikari 10', population: 29000, coords: [16.7080, 74.4630] },
      { id: 'w-imc-11', number: 11, name: 'Prabhag 11: Ring Road Industrial Sector', marathiName: 'प्रभाग ११: रिंग रोड व गणेश नगर', zone: 'imc-zone-industrial', officer: 'Prabhag Adhikari 11', population: 32000, coords: [16.7140, 74.4680] },
      { id: 'w-imc-12', number: 12, name: 'Prabhag 12: Chandur Road & Shahu Putala', marathiName: 'प्रभाग १२: चांदूर रोड व शाहू पुतळा परिसर', zone: 'imc-zone-riverfront', officer: 'Prabhag Adhikari 12', population: 27500, coords: [16.6890, 74.4610] },
    ],
    departments: [
      { id: 'dept-road', name: 'Road Maintenance & Infrastructure', marathiName: 'रस्ते व बांधकाम विभाग', code: 'ROAD', head: 'City Engineer (Civil)' },
      { id: 'dept-water', name: 'Water Supply & Panchganga Pipeline', marathiName: 'पाणी पुरवठा व जलनिस्सारण विभाग', code: 'WATER', head: 'Executive Engineer (Water Works)' },
      { id: 'dept-waste', name: 'Solid Waste Management & Sanitation', marathiName: 'घनकचरा व्यवस्थापन व स्वच्छता विभाग', code: 'WASTE', head: 'Chief Sanitary Inspector' },
      { id: 'dept-elec', name: 'Electrical & Streetlighting', marathiName: 'विद्युत व पथदिवे विभाग', code: 'ELEC', head: 'Assistant Engineer (Electrical)' },
      { id: 'dept-health', name: 'Public Health & Drainage', marathiName: 'आरोग्य व मलनिस्सारण विभाग', code: 'HEALTH', head: 'Medical Officer of Health' },
      { id: 'dept-fire', name: 'Fire & Emergency Disaster Cell', marathiName: 'अग्निशामक विभाग', code: 'FIRE', head: 'Station Fire Officer' },
    ],
    slaDefaultsHours: {
      CRITICAL: 4,
      HIGH: 24,
      MEDIUM: 48,
      LOW: 72,
    },
    activeComplaintsCount: 94,
    criticalCount: 5,
    slaRiskCount: 8,
    resolutionRate: '95.4%',
  },
];

export const CATEGORIES = [
  { id: 'cat-water', name: 'Water Supply & Contamination', marathiName: 'पाणी पुरवठा व जल प्रदूषण', icon: 'Activity', defaultSlaHours: 6, priority: 'CRITICAL' },
  { id: 'cat-pothole', name: 'Road Damage & Potholes', marathiName: 'रस्ता खराब व खड्डे दुरुस्ती', icon: 'AlertTriangle', defaultSlaHours: 24, priority: 'HIGH' },
  { id: 'cat-drainage', name: 'Drainage Overflow & Silt', marathiName: 'गटार तुंबणे व सांडपाणी निचरा', icon: 'Droplets', defaultSlaHours: 12, priority: 'HIGH' },
  { id: 'cat-textile', name: 'Powerloom Cluster Industrial Waste', marathiName: 'यंत्रमाग कचरा व सुताचा टाकाऊ माल', icon: 'Layers', defaultSlaHours: 24, priority: 'HIGH' },
  { id: 'cat-garbage', name: 'Garbage & Solid Waste Pileup', marathiName: 'कचरा साचणे व स्वच्छता', icon: 'Trash2', defaultSlaHours: 24, priority: 'MEDIUM' },
  { id: 'cat-light', name: 'Streetlight Outage & Cabling', marathiName: 'पथदिवे बंद व वीज केबल दोष', icon: 'Zap', defaultSlaHours: 24, priority: 'HIGH' },
  { id: 'cat-footpath', name: 'Footpath & Public Encroachment', marathiName: 'पादचारी रस्ता व अतिक्रमण', icon: 'Footprints', defaultSlaHours: 48, priority: 'MEDIUM' },
  { id: 'cat-tree', name: 'Fallen Tree / Dangerous Branch', marathiName: 'झाड पडणे किंवा धोकादायक फांद्या', icon: 'TreePine', defaultSlaHours: 12, priority: 'HIGH' },
  { id: 'cat-safety', name: 'Public Safety & Emergency Grievance', marathiName: 'सार्वजनिक सुरक्षा व आपत्कालीन मदत', icon: 'Siren', defaultSlaHours: 2, priority: 'CRITICAL' },
];
