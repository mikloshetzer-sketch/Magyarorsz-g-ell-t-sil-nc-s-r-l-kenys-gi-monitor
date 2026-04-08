// ======================================================
// MAGYARORSZÁG – MEGYEI ELLÁTÁSI ADATOK
// data.js
// ======================================================

// ===== MEGYEI ADATOK =====
// 0–100 skála (minél nagyobb → nagyobb kockázat)

const countyData = {
  "budapest": { importDependency: 85, industryExposure: 78, logisticsRisk: 82 },
  "pest": { importDependency: 75, industryExposure: 70, logisticsRisk: 72 },
  "gyor moson sopron": { importDependency: 88, industryExposure: 90, logisticsRisk: 84 },
  "komarom esztergom": { importDependency: 82, industryExposure: 85, logisticsRisk: 80 },
  "fejer": { importDependency: 78, industryExposure: 82, logisticsRisk: 76 },

  "bacs kiskun": { importDependency: 62, industryExposure: 66, logisticsRisk: 64 },
  "csongrad csanad": { importDependency: 60, industryExposure: 64, logisticsRisk: 61 },
  "hajdu bihar": { importDependency: 70, industryExposure: 72, logisticsRisk: 69 },
  "szabolcs szatmar bereg": { importDependency: 66, industryExposure: 62, logisticsRisk: 67 },
  "borsod abauj zemplen": { importDependency: 72, industryExposure: 74, logisticsRisk: 71 },

  "heves": { importDependency: 60, industryExposure: 61, logisticsRisk: 60 },
  "jasz nagykun szolnok": { importDependency: 61, industryExposure: 62, logisticsRisk: 61 },
  "veszprem": { importDependency: 58, industryExposure: 60, logisticsRisk: 59 },
  "vas": { importDependency: 59, industryExposure: 61, logisticsRisk: 60 },
  "zala": { importDependency: 57, industryExposure: 58, logisticsRisk: 58 },

  "somogy": { importDependency: 55, industryExposure: 56, logisticsRisk: 56 },
  "tolna": { importDependency: 54, industryExposure: 55, logisticsRisk: 55 },
  "baranya": { importDependency: 56, industryExposure: 57, logisticsRisk: 56 },
  "nograd": { importDependency: 52, industryExposure: 53, logisticsRisk: 53 },
  "bekes": { importDependency: 53, industryExposure: 54, logisticsRisk: 54 }
};

// ===== INDEX SZÁMÍTÁS =====
// súlyozott modell (szakdolgozat-kompatibilis)

function calculateRiskIndex(data) {
  return Math.round(
    data.importDependency * 0.4 +
    data.industryExposure * 0.35 +
    data.logisticsRisk * 0.25
  );
}

// ===== API (script.js használja) =====

function getCountyRealData(key) {
  return countyData[key] || null;
}

function getCalculatedRisk(key) {
  const data = countyData[key];
  if (!data) return null;
  return calculateRiskIndex(data);
}
