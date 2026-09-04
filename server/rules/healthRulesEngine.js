/**
 * MOTHER+ Health Screening & Safety Rules Engine
 * 
 * ============================================================================
 * IMPORTANT SAFETY AND CLINICAL GOVERNANCE NOTICE:
 * ============================================================================
 * 1. THIS IS NOT AN AI DOCTOR OR MEDICAL DIAGNOSTIC SYSTEM.
 * 2. This module does NOT diagnose diseases, conditions, or syndromes.
 * 3. This module does NOT prescribe medicines, treatments, or dosages.
 * 4. It provides a deterministic, rule-based screening heuristic to triage
 *    reported maternal symptoms into GREEN, YELLOW, or RED risk categories.
 * 5. When RED danger signs are present, the system immediately advises urgent
 *    in-person emergency clinical care and triggers an escalation alert for the
 *    assigned Healthcare Worker (ASHA/ANM/Medical Officer).
 * 6. ALL MEDICAL RULES, THRESHOLDS, AND PROTOCOLS IN THIS PROTOTYPE MUST BE
 *    VALIDATED AND AUDITED BY QUALIFIED OBSTETRICIANS AND PUBLIC HEALTH
 *    AUTHORITIES PRIOR TO ANY REAL-WORLD CLINICAL OR COMMUNITY DEPLOYMENT.
 * ============================================================================
 */

export const DANGER_SIGNS = [
  {
    id: 'severe_headache',
    en: 'Severe headache (not relieved by rest)',
    ta: 'கடுமையான தலைவலி (ஓய்வெடுத்தும் குறையாதது)',
    riskLevel: 'RED',
    clinicalRationale: 'Potential indicator of pre-eclampsia / hypertensive emergency in pregnancy.'
  },
  {
    id: 'blurred_vision',
    en: 'Blurred, dim, or double vision / seeing spots',
    ta: 'மங்கலான பார்வை அல்லது கண் முன் புள்ளிகள் தெரிவது',
    riskLevel: 'RED',
    clinicalRationale: 'Visual disturbances signal elevated intracranial or vascular pressure (severe pre-eclampsia).'
  },
  {
    id: 'heavy_bleeding',
    en: 'Vaginal bleeding or spotting',
    ta: 'யோனி இரத்தப்போக்கு அல்லது கசிவு',
    riskLevel: 'RED',
    clinicalRationale: 'Signs of placenta praevia, placental abruption, or miscarriage threat requiring emergency obstetric evaluation.'
  },
  {
    id: 'severe_abdominal_pain',
    en: 'Severe, sharp abdominal or epigastric pain',
    ta: 'கடுமையான வயிற்று வலி அல்லது மேல் வயிற்று வலி',
    riskLevel: 'RED',
    clinicalRationale: 'Possible placental abruption, uterine rupture, or hepatic subcapsular hematoma.'
  },
  {
    id: 'difficulty_breathing',
    en: 'Difficulty breathing or sudden shortness of breath',
    ta: 'சுவாசிப்பதில் சிரமம் அல்லது மூச்சுத்திணறல்',
    riskLevel: 'RED',
    clinicalRationale: 'Risk of pulmonary edema, peripartum cardiomyopathy, or severe anemia.'
  },
  {
    id: 'convulsions',
    en: 'Convulsions, seizures, or sudden muscle spasms',
    ta: 'வலிப்பு அல்லது உடலின் தசை இழுப்புகள்',
    riskLevel: 'RED',
    clinicalRationale: 'Critical clinical emergency: indicates eclampsia. Immediate hospitalization required.'
  },
  {
    id: 'loss_of_consciousness',
    en: 'Loss of consciousness, fainting, or severe dizziness',
    ta: 'மயக்கம் அல்லது சுயநினைவு இழப்பு',
    riskLevel: 'RED',
    clinicalRationale: 'Hypovolemic shock, cardiac event, or acute cerebral hypo-perfusion.'
  },
  {
    id: 'fever_high',
    en: 'High fever (over 38°C / 100.4°F) with chills',
    ta: 'குளிருடன் கூடிய அதிக காய்ச்சல்',
    riskLevel: 'RED',
    clinicalRationale: 'Risk of maternal sepsis, chorioamnionitis, or systemic intrauterine infection.'
  },
  {
    id: 'reduced_fetal_movement',
    en: 'Reduced or absent baby movements (after 24 weeks)',
    ta: 'கருவின் அசைவு குறைதல் அல்லது அசைவு இல்லாமல் இருத்தல்',
    riskLevel: 'RED',
    clinicalRationale: 'Potential fetal distress, hypoxia, or compromise requiring immediate NST/ultrasound.'
  },
  {
    id: 'sudden_facial_swelling',
    en: 'Sudden, severe swelling of face, hands, or eyes',
    ta: 'முகம், கைகள் அல்லது கண்களில் திடீர் வீக்கம்',
    riskLevel: 'RED',
    clinicalRationale: 'Rapid non-dependent generalized edema strongly associated with pre-eclampsia.'
  },
  {
    id: 'water_breaking',
    en: 'Sudden gush or continuous leaking of watery fluid',
    ta: 'திடீரென பனிக்குட நீர் உடைந்து வெளியேறுதல்',
    riskLevel: 'RED',
    clinicalRationale: 'Premature rupture of membranes (PROM); high risk of cord prolapse or ascending infection.'
  }
];

export const MILD_DISCOMFORTS = [
  {
    id: 'mild_swelling_feet',
    en: 'Mild swelling in feet or ankles towards evening',
    ta: 'மாலையில் கால்கள் அல்லது கணுக்காலில் லேசான வீக்கம்',
    riskLevel: 'YELLOW',
    clinicalRationale: 'Dependent physiologic edema common in 2nd/3rd trimester; warrants routine BP check.'
  },
  {
    id: 'nausea_mild',
    en: 'Mild nausea or morning sickness (able to keep fluids down)',
    ta: 'லேசான குமட்டல் அல்லது வாந்தி (நீர் குடிக்க முடிகிறது)',
    riskLevel: 'YELLOW',
    clinicalRationale: 'Common in 1st/2nd trimester; monitor hydration and dietary balance.'
  },
  {
    id: 'backache_mild',
    en: 'Mild lower back pain or postural fatigue',
    ta: 'லேசான இடுப்பு அல்லது முதுகு வலி',
    riskLevel: 'YELLOW',
    clinicalRationale: 'Musculoskeletal strain due to shifting center of gravity; postural guidance needed.'
  },
  {
    id: 'burning_urination',
    en: 'Mild burning or increased frequency when urinating',
    ta: 'சிறுநீர் கழிக்கும் போது லேசான எரிச்சல்',
    riskLevel: 'YELLOW',
    clinicalRationale: 'Suspected urinary tract infection (UTI); requires urine routine test and PHC visit.'
  },
  {
    id: 'mild_fatigue',
    en: 'Tiredness and sleepiness',
    ta: 'லேசான உடல் சோர்வு மற்றும் தூக்கமின்மை',
    riskLevel: 'YELLOW',
    clinicalRationale: 'Normal physiological fatigue; ensure iron-folic acid compliance and hemoglobin check.'
  }
];

/**
 * Screen reported symptoms against deterministic safety criteria.
 * 
 * @param {Object} input
 * @param {Array<string>} input.symptoms - List of symptom IDs reported by user
 * @param {number} [input.gestationalWeek] - Current pregnancy week (if available)
 * @param {string} [input.feelingGeneral] - 'well' | 'discomfort' | 'concerning' | 'emergency'
 * @returns {Object} Triage result with risk level, localized guidance, and alert flags
 */
export function evaluateHealthStatus(input = {}) {
  const { symptoms = [], gestationalWeek = null, feelingGeneral = 'well' } = input;
  
  // 1. Direct Emergency selection
  if (feelingGeneral === 'emergency') {
    return {
      level: 'RED',
      alertRequired: true,
      detectedDangerSigns: ['Immediate Emergency Selected'],
      message: 'EMERGENCY ALERT: These symptoms may require urgent medical attention. Please contact your healthcare provider or seek emergency medical care at the nearest hospital immediately.',
      tamilMessage: 'அவசர எச்சரிக்கை: இந்த அறிகுறிகளுக்கு உடனடி மருத்துவ கவனிப்பு தேவைப்படலாம். உடனே உங்கள் சுகாதாரப் பணியாளரைத் தொடர்பு கொள்ளவும் அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லவும்.',
      recommendedAction: 'Immediate transfer to 24x7 Emergency Obstetric Care / Primary Health Centre.',
      tamilAction: 'உடனடியாக 24x7 அவசர மகப்பேறு சிகிச்சை மையம் அல்லது ஆரம்ப சுகாதார நிலையத்திற்கு செல்லவும்.',
      followUpTimeframeHours: 0,
      timestamp: new Date().toISOString()
    };
  }

  // 2. Evaluate for RED Danger Signs
  const redMatches = DANGER_SIGNS.filter(ds => symptoms.includes(ds.id));
  
  // Special clinical nuance: fetal movement concern only applicable after 22-24 weeks
  const activeRedMatches = redMatches.filter(ds => {
    if (ds.id === 'reduced_fetal_movement' && gestationalWeek && gestationalWeek < 24) {
      // Early in pregnancy (before 24w), irregular kick counts are less specific, but still flagged as yellow
      return false;
    }
    return true;
  });

  if (activeRedMatches.length > 0) {
    const dangerLabelsEn = activeRedMatches.map(ds => ds.en).join(', ');
    const dangerLabelsTa = activeRedMatches.map(ds => ds.ta).join(', ');

    return {
      level: 'RED',
      alertRequired: true,
      detectedDangerSigns: activeRedMatches.map(ds => ds.id),
      dangerSignsTextEn: dangerLabelsEn,
      dangerSignsTextTa: dangerLabelsTa,
      message: `CRITICAL SAFETY ALERT: You reported symptoms (${dangerLabelsEn}) that may require urgent medical attention. Please contact your healthcare provider or visit the nearest emergency healthcare facility immediately. Do NOT wait for a scheduled appointment.`,
      tamilMessage: `முக்கிய எச்சரிக்கை: நீங்கள் தெரிவித்த அறிகுறிகள் (${dangerLabelsTa}) உடனடி மருத்துவ அவதானிப்பை கோரக்கூடும். தயவுசெய்து உங்கள் சுகாதாரப் பணியாளரை அல்லது உடனடியாக அருகிலுள்ள அவசர மருத்துவமனையை அணுகவும். அடுத்த பரிசோதனை நாள் வரை காத்திருக்க வேண்டாம்.`,
      recommendedAction: 'Urgent professional medical assessment recommended immediately.',
      tamilAction: 'உடனடி அவசர மருத்துவ பரிசோதனை மற்றும் மருத்துவர் கவனிப்பு பரிந்துரைக்கப்படுகிறது.',
      followUpTimeframeHours: 1,
      timestamp: new Date().toISOString()
    };
  }

  // 3. Evaluate for YELLOW Follow-up Indicators
  const yellowMatches = MILD_DISCOMFORTS.filter(md => symptoms.includes(md.id));
  
  // If user selected reduced movement early in pregnancy or selected general 'concerning'/'discomfort'
  const isEarlyMovementAlert = redMatches.some(ds => ds.id === 'reduced_fetal_movement');
  
  if (yellowMatches.length > 0 || isEarlyMovementAlert || feelingGeneral === 'discomfort' || feelingGeneral === 'concerning') {
    const symptomLabelsEn = yellowMatches.map(m => m.en).join(', ') || 'Mild pregnancy discomfort';
    const symptomLabelsTa = yellowMatches.map(m => m.ta).join(', ') || 'லேசான உடல் அசௌகரியம்';

    return {
      level: 'YELLOW',
      alertRequired: false,
      flagForWorkerReview: true,
      detectedDiscomforts: yellowMatches.map(m => m.id),
      discomfortsTextEn: symptomLabelsEn,
      discomfortsTextTa: symptomLabelsTa,
      message: `FOLLOW-UP RECOMMENDED: You reported discomfort (${symptomLabelsEn}). While these are often manageable, you should rest, stay hydrated, and contact your ASHA/ANM healthcare worker for a routine check-up within 24 to 48 hours. If symptoms worsen, seek immediate medical care.`,
      tamilMessage: `தொடர் கவனிப்பு பரிந்துரைக்கப்படுகிறது: நீங்கள் தெரிவித்த அறிகுறிகள் (${symptomLabelsTa}) பொதுவாக கவனிக்கப்பட வேண்டியவை. போதிய ஓய்வு மற்றும் நீர்ச்சத்து எடுத்துக்கொள்ளவும். அடுத்த 24 முதல் 48 மணி நேரத்திற்குள் உங்கள் சுகாதார பணியாளரை அணுகி ஆலோசனை பெறவும். அறிகுறிகள் அதிகமானால் உடனடியாக மருத்துவமனை செல்லவும்.`,
      recommendedAction: 'Follow-up with healthcare worker recommended within 24-48 hours.',
      tamilAction: '24-48 மணி நேரத்திற்குள் சுகாதாரப் பணியாளர் அல்லது மருத்துவருடன் ஆலோசனை பெறவும்.',
      followUpTimeframeHours: 48,
      timestamp: new Date().toISOString()
    };
  }

  // 4. GREEN - Routine Reassurance
  return {
    level: 'GREEN',
    alertRequired: false,
    message: 'REASSURING UPDATE: No immediate concern identified by the configured screening rules. Keep drinking clean water, eating balanced nutritious meals, taking your prescribed supplements (Iron & Folic Acid / Calcium), and attending your regular antenatal appointments.',
    tamilMessage: 'மகிழ்ச்சியான செய்தி: உங்கள் அறிகுறிகளில் உடனடி ஆபத்து எதுவும் கண்டறியப்படவில்லை. தொடர்ந்து சத்தான உணவு, போதிய நீர்ச்சத்து மற்றும் மருத்துவர் பரிந்துரைத்த மாத்திரைகளை (இரும்புச்சத்து & கால்சியம்) தவறாமல் உட்கொள்ளவும். வழக்கமான பரிசோதனைகளைத் தொடரவும்.',
    recommendedAction: 'Continue routine antenatal care and healthy habits.',
    tamilAction: 'வழக்கமான மகப்பேறு கால பரிசோதனைகள் மற்றும் ஆரோக்கியமான பழக்கங்களை தொடரவும்.',
    followUpTimeframeHours: null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Calculate gestational age and EDD based on Last Menstrual Period (LMP),
 * Expected Due Date (EDD), or current pregnancy week.
 * Using Naegele's Rule: EDD = LMP + 280 days (40 weeks)
 */
export function calculatePregnancyMetrics(input) {
  if (!input) return null;
  
  const today = new Date();
  let lmp = null;
  let edd = null;

  // Handle object input { lmpDate, eddDate, gestationalWeeks }
  if (typeof input === 'object' && !(input instanceof Date)) {
    if (input.lmpDate) {
      lmp = new Date(input.lmpDate);
    } else if (input.eddDate) {
      edd = new Date(input.eddDate);
      if (!isNaN(edd.getTime())) {
        lmp = new Date(edd.getTime() - 280 * 24 * 60 * 60 * 1000);
      }
    } else if (input.gestationalWeeks) {
      const weeks = Number(input.gestationalWeeks) || 12;
      lmp = new Date(today.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
    }
  } else if (typeof input === 'string') {
    // Check if input is a valid date string
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      // If date is in future, treat as EDD; if in past, treat as LMP
      if (parsed > today) {
        edd = parsed;
        lmp = new Date(edd.getTime() - 280 * 24 * 60 * 60 * 1000);
      } else {
        lmp = parsed;
      }
    }
  } else if (typeof input === 'number') {
    lmp = new Date(today.getTime() - input * 7 * 24 * 60 * 60 * 1000);
  }

  if (!lmp || isNaN(lmp.getTime())) return null;

  const diffTime = today.getTime() - lmp.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const gestationalWeeks = Math.max(1, Math.min(42, Math.floor(diffDays / 7)));
  const gestationalDays = Math.max(0, diffDays % 7);

  if (!edd || isNaN(edd.getTime())) {
    edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
  }

  let trimester = 1;
  if (gestationalWeeks > 27) {
    trimester = 3;
  } else if (gestationalWeeks > 13) {
    trimester = 2;
  }

  return {
    lmpDate: lmp.toISOString().split('T')[0],
    eddDate: edd.toISOString().split('T')[0],
    gestationalWeeks,
    gestationalDays,
    trimester,
    displayTextEn: `Week ${gestationalWeeks} (${gestationalWeeks}w ${gestationalDays}d) - Trimester ${trimester}`,
    displayTextTa: `வாரம் ${gestationalWeeks} (${gestationalWeeks}வ ${gestationalDays}நா) - பருவம் ${trimester}`
  };
}
