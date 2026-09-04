/**
 * Initial Demo Seed Data for Smart India Hackathon Demonstration
 * Pre-populates 3 representative maternal risk tiers (Green, Yellow, Red)
 */

export function getDemoData() {
  const now = new Date();
  
  // Helper to get ISO date offsets
  const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();
  const daysAhead = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();
  const lmpFromWeeks = (weeks) => new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const mothers = [
    {
      id: 'm-green-101',
      name: 'Priya Sharma',
      age: 24,
      phone: '+91 98401 12345',
      preferredLanguage: 'en',
      village: 'Vallam Village',
      location: 'Vallam, Chengalpattu District',
      lmpDate: lmpFromWeeks(18),
      eddDate: new Date(now.getTime() + (40 - 18) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      gestationalWeeks: 18,
      trimester: 2,
      pregnancyType: 'Single pregnancy',
      bloodGroup: 'B+',
      healthcareFacility: 'Vallam Primary Health Centre',
      healthcareWorker: 'Lakshmi Devi (ANM)',
      emergencyContact: '+91 98401 99999 (Husband - Ramesh)',
      riskLevel: 'GREEN',
      reminderStatus: 'Active',
      isDemo: true,
      createdAt: daysAgo(45),
      updatedAt: daysAgo(1)
    },
    {
      id: 'm-yellow-102',
      name: 'Kavitha Raman',
      age: 28,
      phone: '+91 94440 23456',
      preferredLanguage: 'ta',
      village: 'Poonamallee North',
      location: 'Poonamallee, Thiruvallur District',
      lmpDate: lmpFromWeeks(28),
      eddDate: new Date(now.getTime() + (40 - 28) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      gestationalWeeks: 28,
      trimester: 3,
      pregnancyType: 'Single pregnancy',
      bloodGroup: 'O+',
      healthcareFacility: 'Poonamallee Community Health Centre',
      healthcareWorker: 'Selvi Meenakshi (ASHA)',
      emergencyContact: '+91 94440 88888 (Mother - Saraswathi)',
      riskLevel: 'YELLOW',
      reminderStatus: 'Follow-up Due',
      isDemo: true,
      createdAt: daysAgo(90),
      updatedAt: daysAgo(2)
    },
    {
      id: 'm-red-103',
      name: 'Ananya Devi',
      age: 26,
      phone: '+91 97890 34567',
      preferredLanguage: 'en',
      village: 'Sriperumbudur Rural',
      location: 'Sriperumbudur, Kanchipuram District',
      lmpDate: lmpFromWeeks(34),
      eddDate: new Date(now.getTime() + (40 - 34) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      gestationalWeeks: 34,
      trimester: 3,
      pregnancyType: 'High risk (History of BP)',
      bloodGroup: 'A+',
      healthcareFacility: 'Sriperumbudur Government Hospital',
      healthcareWorker: 'Lakshmi Devi (ANM)',
      emergencyContact: '+91 97890 77777 (Husband - Vijay)',
      riskLevel: 'RED',
      reminderStatus: 'URGENT ATTENTION',
      isDemo: true,
      createdAt: daysAgo(120),
      updatedAt: daysAgo(0)
    }
  ];

  const healthChecks = [
    {
      id: 'hc-001',
      motherId: 'm-green-101',
      motherName: 'Priya Sharma',
      feelingGeneral: 'well',
      symptoms: [],
      level: 'GREEN',
      alertRequired: false,
      message: 'Routine check-in reassuring. No danger signs.',
      submittedAt: daysAgo(1)
    },
    {
      id: 'hc-002',
      motherId: 'm-yellow-102',
      motherName: 'Kavitha Raman',
      feelingGeneral: 'discomfort',
      symptoms: ['mild_swelling_feet', 'backache_mild'],
      level: 'YELLOW',
      alertRequired: false,
      flagForWorkerReview: true,
      message: 'Reported mild evening ankle swelling and lower backache.',
      submittedAt: daysAgo(2)
    },
    {
      id: 'hc-003',
      motherId: 'm-red-103',
      motherName: 'Ananya Devi',
      feelingGeneral: 'concerning',
      symptoms: ['severe_headache', 'blurred_vision'],
      level: 'RED',
      alertRequired: true,
      dangerSignsTextEn: 'Severe headache, Blurred vision',
      dangerSignsTextTa: 'கடுமையான தலைவலி, மங்கலான பார்வை',
      message: 'Critical pre-eclampsia danger sign warning triggered. Immediate medical escalation advised.',
      submittedAt: daysAgo(0)
    }
  ];

  const alerts = [
    {
      id: 'alt-103-1',
      motherId: 'm-red-103',
      motherName: 'Ananya Devi',
      phone: '+91 97890 34567',
      village: 'Sriperumbudur Rural',
      location: 'Sriperumbudur, Kanchipuram District',
      gestationalWeeks: 34,
      riskLevel: 'RED',
      reportedSymptoms: ['Severe headache (not relieved by rest)', 'Blurred, dim, or double vision'],
      recommendedAction: 'Urgent professional medical assessment recommended immediately.',
      status: 'PENDING_REVIEW', // 'PENDING_REVIEW' | 'ACKNOWLEDGED' | 'RESOLVED'
      createdAt: daysAgo(0),
      assignedWorker: 'Lakshmi Devi (ANM)',
      isDemo: true,
      notes: []
    },
    {
      id: 'alt-102-1',
      motherId: 'm-yellow-102',
      motherName: 'Kavitha Raman',
      phone: '+91 94440 23456',
      village: 'Poonamallee North',
      location: 'Poonamallee, Thiruvallur District',
      gestationalWeeks: 28,
      riskLevel: 'YELLOW',
      reportedSymptoms: ['Mild swelling in feet or ankles', 'Mild lower back pain'],
      recommendedAction: 'Routine follow-up within 24-48 hours. Check BP and urine albumin.',
      status: 'ACKNOWLEDGED',
      createdAt: daysAgo(2),
      assignedWorker: 'Selvi Meenakshi (ASHA)',
      isDemo: true,
      notes: [
        {
          author: 'Selvi Meenakshi (ASHA)',
          text: 'Spoke with Kavitha over phone. Advised leg elevation while resting. Scheduled home visit tomorrow morning for BP check.',
          createdAt: daysAgo(1)
        }
      ]
    }
  ];

  const reminders = [
    {
      id: 'rem-101',
      motherId: 'm-green-101',
      motherName: 'Priya Sharma',
      phone: '+91 98401 12345',
      type: 'ANC_APPOINTMENT',
      title: 'ANC Checkup #3 (20-Week Anomaly Scan)',
      dueDateTime: daysAhead(5),
      status: 'UPCOMING', // 'UPCOMING' | 'COMPLETED' | 'MISSED'
      notes: 'Bring ultrasound prescription and Mother-Child Protection (MCP) card.',
      createdAt: daysAgo(5)
    },
    {
      id: 'rem-102',
      motherId: 'm-yellow-102',
      motherName: 'Kavitha Raman',
      phone: '+91 94440 23456',
      type: 'FOLLOW_UP',
      title: 'Blood Pressure & Urine Albumin Follow-up',
      dueDateTime: daysAhead(1),
      status: 'UPCOMING',
      notes: 'Follow-up regarding reported ankle edema.',
      createdAt: daysAgo(2)
    },
    {
      id: 'rem-103',
      motherId: 'm-red-103',
      motherName: 'Ananya Devi',
      phone: '+91 97890 34567',
      type: 'EMERGENCY_VISIT',
      title: 'Urgent Obstetric Referral - Sriperumbudur GH',
      dueDateTime: daysAgo(0),
      status: 'UPCOMING',
      notes: 'Emergency BP evaluation for pre-eclampsia warning signs.',
      createdAt: daysAgo(0)
    },
    {
      id: 'rem-104',
      motherId: 'm-green-101',
      motherName: 'Priya Sharma',
      phone: '+91 98401 12345',
      type: 'SUPPLEMENT',
      title: 'Daily Iron & Folic Acid (IFA) Tablet',
      dueDateTime: daysAgo(1),
      status: 'COMPLETED',
      notes: 'Take after evening meal with water.',
      createdAt: daysAgo(10)
    },
    {
      id: 'rem-105',
      motherId: 'm-yellow-102',
      motherName: 'Kavitha Raman',
      phone: '+91 94440 23456',
      type: 'ANC_APPOINTMENT',
      title: 'ANC Checkup #2 (Blood Test Review)',
      dueDateTime: daysAgo(3),
      status: 'MISSED',
      notes: 'Mother could not attend due to transport difficulty. Rescheduled.',
      createdAt: daysAgo(7)
    }
  ];

  const users = [
    {
      id: 'u-worker-1',
      username: 'asha_worker',
      password: 'password123',
      name: 'Sister Lakshmi',
      role: 'Healthcare Worker',
      designation: 'Auxiliary Nurse Midwife (ANM)',
      facility: 'Vallam PHC / Chengalpattu District',
      phone: '+91 98765 43210'
    },
    {
      id: 'u-admin-1',
      username: 'admin',
      password: 'adminpassword',
      name: 'Dr. Rajesh Kumar',
      role: 'Admin',
      designation: 'District Reproductive & Child Health Officer (RCHO)',
      facility: 'District Health Administration',
      phone: '+91 98765 00000'
    }
  ];

  return { mothers, healthChecks, alerts, reminders, users };
}
