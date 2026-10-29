/**
 * NAGARSETU AI - ICHALKARANJI MUNICIPAL CORPORATION WORK ORDERS
 * 
 * Authentic municipal work orders localized for Ichalkaranji Municipal Corporation (IMC).
 * Coordinates: [16.6992, 74.4578]
 */

export const CITY_WORK_ORDERS = {
  'muni-ichalkaranji-demo': [
    {
      id: 'WO-IMC-2026-000015',
      complaintId: 'NGS-IMC-2026-000045',
      title: 'Powerloom Cluster Drainage Desilting & Silt Removal',
      area: 'Powerloom Estate Ward 3, Industrial Estate Ring Road Link',
      ward: 'Prabhag 5: Powerloom Weaving Estate',
      department: 'Road Maintenance & Infrastructure',
      deptCode: 'ROAD',
      priority: 'P1',
      worker: 'Ganesh Naik',
      supervisor: 'Er. Prakash Kamble',
      team: 'IMC Textile Zone Civil Squad',
      status: 'IN_PROGRESS',
      due: 'In 3 hours',
      instructions: 'Clear textile lint and sludge clogging main arterial storm culvert, unblock drainage grates.',
      evidence: {
        before: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        after: null,
      },
      createdAt: 'Today, 08:00 AM',
    },
    {
      id: 'WO-IMC-2026-000014',
      complaintId: 'NGS-IMC-2026-000042',
      title: 'Panchaganga Intake Well Pumping Line Weld Repair',
      area: 'Panchaganga Riverbank Ward 17, Municipal Pumping Station',
      ward: 'Prabhag 6: Panchganga River Intake Well',
      department: 'Water Supply & Panchganga Pipeline',
      deptCode: 'WATER',
      priority: 'P1',
      worker: 'Rohan Kurane',
      supervisor: 'Er. Swati Gurav',
      team: 'IMC River Intake Maintenance Team',
      status: 'WORK_COMPLETED',
      due: 'Pumping Restored',
      instructions: 'Repair high-pressure flange fracture, re-seal raw water manifold, and restore city pumping.',
      evidence: {
        before: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80',
        after: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      },
      createdAt: 'Yesterday, 04:45 PM',
    },
    {
      id: 'WO-IMC-2026-000013',
      complaintId: 'NGS-IMC-2026-000038',
      title: 'Textile Market Commercial Streetlight Feeder Repair',
      area: 'Shahupuri Sector 11, Near Rajwada Cloth Market Chowk',
      ward: 'Prabhag 1: Rajwada & Kapad Market',
      department: 'Electrical & Streetlighting',
      deptCode: 'ELEC',
      priority: 'P3',
      worker: 'Vijay Powar',
      supervisor: 'Lata Kulkarni',
      team: 'IMC Market Sector Electricals',
      status: 'VERIFICATION_PENDING',
      due: 'Awaiting Citizen Verification',
      instructions: 'Replace water-damaged feeder distribution box, test all 24 market streetlights.',
      evidence: {
        before: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?w=600&auto=format&fit=crop&q=80',
        after: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&auto=format&fit=crop&q=80',
      },
      createdAt: 'Yesterday, 01:10 PM',
    },
    {
      id: 'WO-IMC-2026-000012',
      complaintId: 'NGS-IMC-2026-000035',
      title: 'Industrial Fiber Waste Clearance & Open Drain Scraping',
      area: 'Kabnur Road Link, Ward 7 Industrial Corridor',
      ward: 'Prabhag 7: Kabnur Link & Korochi Naka',
      department: 'Solid Waste Management & Sanitation',
      deptCode: 'WASTE',
      priority: 'P2',
      worker: 'Mohan Powar',
      supervisor: 'Dr. Mohan Powar',
      team: 'IMC Heavy Sanitation Crew',
      status: 'IN_PROGRESS',
      due: 'In 6 hours',
      instructions: 'Clear piled textile yarn discards, clear open storm channels, and transport to waste depot.',
      evidence: {
        before: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
        after: null,
      },
      createdAt: 'Today, 09:45 AM',
    },
    {
      id: 'WO-IMC-2026-000011',
      complaintId: 'NGS-IMC-2026-000031',
      title: 'Station Road Asphalt Surface Restoration & Patching',
      area: 'Station Road near Guru Talkies & Vikas Nagar Junction',
      ward: 'Prabhag 4: Station Road & Vikas Nagar (HQ)',
      department: 'Road Maintenance & Infrastructure',
      deptCode: 'ROAD',
      priority: 'P2',
      worker: 'Santosh Pawar',
      supervisor: 'Er. Prakash Kamble',
      team: 'IMC Central Road Squad',
      status: 'WORK_COMPLETED',
      due: 'Road Restored',
      instructions: 'Hot-mix asphalt cavity patching and steam roller compaction on station approach.',
      evidence: {
        before: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        after: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      },
      createdAt: '2 days ago',
    },
  ],
};

export function getWorkOrdersForMunicipality(muniIdOrCode) {
  return CITY_WORK_ORDERS['muni-ichalkaranji-demo'];
}
