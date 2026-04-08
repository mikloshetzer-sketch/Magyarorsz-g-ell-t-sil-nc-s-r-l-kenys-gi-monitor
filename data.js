// ======================================================
// VALÓS ADATOK – DEMO + KSH LOGIKA ALAP
// ======================================================

// Ezek MOST még becsült értékek,
// de struktúra már KSH-kompatibilis

const countyData = {
  "budapest": {
    importDependency: 85,
    industryExposure: 78,
    logisticsRisk: 80
  },
  "pest": {
    importDependency: 75,
    industryExposure: 70,
    logisticsRisk: 72
  },
  "gyor moson sopron": {
    importDependency: 88,
    industryExposure: 90,
    logisticsRisk: 82
  },
  "komarom esztergom": {
    importDependency: 82,
    industryExposure: 85,
    logisticsRisk: 78
  },
  "fejer": {
    importDependency: 76,
    industryExposure: 80,
    logisticsRisk: 75
  },
  "bacs kiskun": {
    importDependency: 60,
    industryExposure: 65,
    logisticsRisk: 62
  },
  "csongrad csanad": {
    importDependency: 58,
    industryExposure: 63,
    logisticsRisk: 60
  },
  "hajdu bihar": {
    importDependency: 70,
    industryExposure: 72,
    logisticsRisk: 68
  },
  "szabolcs szatmar bereg": {
    importDependency: 65,
    industryExposure: 60,
    logisticsRisk: 66
  },
  "borsod abauj zemplen": {
    importDependency: 72,
    industryExposure: 74,
    logisticsRisk: 70
  }
};

// ===== INDEX SZÁMÍTÁS =====
function calculateRiskIndex(data) {
  return Math.round(
    data.importDependency * 0.4 +
    data.industryExposure * 0.35 +
    data.logisticsRisk * 0.25
  );
}

// ===== EXPORT =====
function getCountyRealData(key) {
  return countyData[key] || null;
}

function getCalculatedRisk(key) {
  const data = countyData[key];
  if (!data) return null;
  return calculateRiskIndex(data);
}
