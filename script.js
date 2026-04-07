// ======================================================
// MAGYARORSZÁG ELLÁTÁSILÁNC-SÉRÜLÉKENYSÉGI MONITOR
// script.js
// Teljes, egyben használható verzió
// ======================================================

// ===== SEGÉDFÜGGVÉNYEK =====
function normalizeName(name) {
  if (!name || typeof name !== "string") {
    return "";
  }

  return name
    .toLowerCase()
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ö/g, "o")
    .replace(/ő/g, "o")
    .replace(/ú/g, "u")
    .replace(/ü/g, "u")
    .replace(/ű/g, "u")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeSetText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

// Több lehetséges GeoJSON property-ből próbáljuk meg kinyerni a megye nevét
function extractCountyName(feature) {
  if (!feature || !feature.properties) {
    return "";
  }

  const props = feature.properties;

  return (
    props.name ||
    props.NAME ||
    props.NAME_1 ||
    props.county ||
    props.admin ||
    props.nom ||
    props.shapeName ||
    props.megye ||
    ""
  );
}

// Név egységesítés a riskMap kulcsaihoz
function canonicalCountyName(rawName) {
  const n = normalizeName(rawName);

  const aliases = {
    "budapest": "budapest",
    "pest": "pest",
    "gyor moson sopron": "gyor moson sopron",
    "komarom esztergom": "komarom esztergom",
    "fejer": "fejer",
    "bacs kiskun": "bacs kiskun",
    "csongrad": "csongrad csanad",
    "csongrad csanad": "csongrad csanad",
    "hajdu bihar": "hajdu bihar",
    "szabolcs szatmar bereg": "szabolcs szatmar bereg",
    "borsod abauj zemplen": "borsod abauj zemplen",
    "heves": "heves",
    "jasz nagykun szolnok": "jasz nagykun szolnok",
    "veszprem": "veszprem",
    "vas": "vas",
    "zala": "zala",
    "somogy": "somogy",
    "tolna": "tolna",
    "baranya": "baranya",
    "nograd": "nograd",
    "bekes": "bekes"
  };

  return aliases[n] || n;
}

// ===== KOCKÁZATI ADATOK =====
const countyRiskMap = {
  "budapest": {
    risk: 78,
    label: "magas",
    description:
      "Fővárosi elosztási központ, jelentős logisztikai koncentrációval és országos ellátási csomóponti szereppel."
  },
  "pest": {
    risk: 74,
    label: "magas",
    description:
      "Erős agglomerációs és elosztási kitettség, a fővárosi gazdasági térhez szorosan kapcsolódó ellátási szerkezet."
  },
  "gyor moson sopron": {
    risk: 76,
    label: "magas",
    description:
      "Autóipari és exportorientált megye, erős nyugat-európai integrációval és beszállítói függőséggel."
  },
  "komarom esztergom": {
    risk: 73,
    label: "magas",
    description:
      "Ipari és feldolgozóipari kitettségű térség, nemzetközi termelési láncokhoz kapcsolódó sérülékenységgel."
  },
  "fejer": {
    risk: 70,
    label: "magas",
    description:
      "Jelentős ipari és logisztikai kapacitásokkal rendelkező megye, közlekedési csomóponti szereppel."
  },
  "bacs kiskun": {
    risk: 64,
    label: "közepes",
    description:
      "Járműipari és mezőgazdasági szerkezetű megye, közepes ellátási és exportkitettséggel."
  },
  "csongrad csanad": {
    risk: 62,
    label: "közepes",
    description:
      "Dél-alföldi ipari és élelmiszer-gazdasági szerep, mérsékelt beszállítói és logisztikai sérülékenységgel."
  },
  "hajdu bihar": {
    risk: 67,
    label: "közepes",
    description:
      "Gyorsan növekvő ipari bázis, különösen Debrecen térségében erősödő nemzetközi termelési kapcsolatokkal."
  },
  "szabolcs szatmar bereg": {
    risk: 66,
    label: "közepes",
    description:
      "Keleti határ menti fekvés, tranzit- és kapcsolódási funkciók, ugyanakkor strukturális sérülékenységek."
  },
  "borsod abauj zemplen": {
    risk: 68,
    label: "magas",
    description:
      "Ipari örökségű megye, energia- és feldolgozóipari érzékenységgel, több szektorális kitettséggel."
  },
  "heves": {
    risk: 60,
    label: "közepes",
    description:
      "Közepes ipari és logisztikai sérülékenységű térség, országos ellátási láncokhoz mérsékelt kapcsolódással."
  },
  "jasz nagykun szolnok": {
    risk: 61,
    label: "közepes",
    description:
      "Közlekedési és logisztikai áthaladási szerepű megye, mérsékelt ellátási kitettséggel."
  },
  "veszprem": {
    risk: 58,
    label: "mérsékelt",
    description:
      "Vegyes gazdasági szerkezetű megye, alacsonyabb, de nem elhanyagolható ipari és logisztikai függőségekkel."
  },
  "vas": {
    risk: 59,
    label: "mérsékelt",
    description:
      "Nyugati fekvésű megye, határ menti gazdasági kapcsolódásokkal és közepes külső függéssel."
  },
  "zala": {
    risk: 57,
    label: "mérsékelt",
    description:
      "Közepesnél alacsonyabb ellátási sérülékenység, regionális logisztikai szereppel."
  },
  "somogy": {
    risk: 55,
    label: "mérsékelt",
    description:
      "Kevésbé koncentrált ipari kitettség, alacsonyabb ellátási lánc sérülékenységi szinttel."
  },
  "tolna": {
    risk: 54,
    label: "mérsékelt",
    description:
      "Mérsékelt gazdasági függőségű megye, kisebb nemzetközi ipari beágyazottsággal."
  },
  "baranya": {
    risk: 56,
    label: "mérsékelt",
    description:
      "Regionális gazdasági kapcsolódásokkal bíró megye, közepesnél valamivel alacsonyabb sérülékenységgel."
  },
  "nograd": {
    risk: 52,
    label: "alacsonyabb",
    description:
      "Korlátozottabb ipari és logisztikai koncentráció, viszonylag alacsonyabb ellátási kitettséggel."
  },
  "bekes": {
    risk: 53,
    label: "alacsonyabb",
    description:
      "Erősebb agrárprofil, mérsékeltebb ipari beszállítói függőség és alacsonyabb ellátási kockázat."
  }
};

function getCountyRiskData(rawName) {
  const key = canonicalCountyName(rawName);

  return (
    countyRiskMap[key] || {
      risk: 58,
      label: "mérsékelt",
      description:
        "Ehhez a megyéhez még nincs külön részletes leírás, ezért alapértelmezett demonstrációs érték jelenik meg."
    }
  );
}

function getRiskColor(risk) {
  if (risk >= 75) return "#b91c1c";
  if (risk >= 68) return "#ea580c";
  if (risk >= 60) return "#f59e0b";
  return "#16a34a";
}

// ===== STRESSZTESZT ADATOK =====
const scenarios = {
  nemet_visszaeses: {
    title: "Német ipari visszaesés",
    impact: "Exportcsökkenés és beszállítói láncok gyengülése",
    affected: "Autóipar, nyugat-magyarországi ipari térségek"
  },
  energia_sokk: {
    title: "Energiaár-sokk",
    impact: "Termelési költségek emelkedése és inflációs nyomás",
    affected: "Energiaintenzív iparágak, feldolgozóipar, háztartási ellátási költségek"
  },
  szallitasi_zavar: {
    title: "Szállítási útvonal zavar",
    impact: "Késések, készlethiányok és alternatív útvonalak miatti költségnövekedés",
    affected: "Logisztika, FMCG, élelmiszeripar, importfüggő termelés"
  }
};

// ===== DOM BETÖLTÉS UTÁN =====
document.addEventListener("DOMContentLoaded", function () {
  initializeMetricColors();
  initializeSmoothScroll();
  initializeStressTest();
  initializeMap();
});

// ===== METRIKÁK SZÍNEZÉSE =====
function initializeMetricColors() {
  const metrics = document.querySelectorAll(".metric-value");

  metrics.forEach((metric) => {
    const value = parseInt(metric.textContent, 10);

    if (Number.isNaN(value)) {
      return;
    }

    if (value >= 75) {
      metric.style.color = "#ef4444";
    } else if (value >= 60) {
      metric.style.color = "#f59e0b";
    } else {
      metric.style.color = "#22c55e";
    }
  });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
  const anchors = document.querySelectorAll(".main-nav a");

  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return;
      }

      e.preventDefault();

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth"
      });
    });
  });
}

// ===== STRESSZTESZT =====
function initializeStressTest() {
  const stressBoxes = document.querySelectorAll(".stress-box");
  const stressParagraphs = document.querySelectorAll(".stress-box p");

  if (stressBoxes.length < 3 || stressParagraphs.length < 3) {
    return;
  }

  function updateStressTest(scenarioKey) {
    const scenario = scenarios[scenarioKey];

    if (!scenario) {
      return;
    }

    stressParagraphs[0].textContent = scenario.title;
    stressParagraphs[1].textContent = scenario.impact;
    stressParagraphs[2].textContent = scenario.affected;
  }

  stressBoxes.forEach((box, index) => {
    box.style.cursor = "pointer";

    box.addEventListener("click", function () {
      if (index === 0) {
        updateStressTest("nemet_visszaeses");
      } else if (index === 1) {
        updateStressTest("energia_sokk");
      } else if (index === 2) {
        updateStressTest("szallitasi_zavar");
      }
    });
  });
}

// ===== TÉRKÉP =====
function initializeMap() {
  const mapElement = document.getElementById("hungary-map");

  if (!mapElement || typeof L === "undefined") {
    return;
  }

  const infoNameElement = document.getElementById("location-name");
  const infoDescriptionElement = document.getElementById("location-description");

  function updateInfoPanel(title, text) {
    safeSetText(infoNameElement, title);
    safeSetText(infoDescriptionElement, text);
  }

  const map = L.map("hungary-map", {
    zoomControl: true
  }).setView([47.1625, 19.5033], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const logisticsLocations = [
    {
      name: "Budapest",
      coords: [47.4979, 19.0402],
      description: "Országos logisztikai és elosztási központ, kiemelt raktározási és közlekedési szereppel."
    },
    {
      name: "Győr",
      coords: [47.6875, 17.6504],
      description: "Autóipari központ és nyugati kapcsolat, erős exportorientált beszállítói háttérrel."
    },
    {
      name: "Debrecen",
      coords: [47.5316, 21.6273],
      description: "Növekvő ipari és beszállítói bázis, stratégiai kelet-magyarországi szerepkörrel."
    },
    {
      name: "Kecskemét",
      coords: [46.8964, 19.6897],
      description: "Járműipari integráció és beszállítói kitettség szempontjából fontos térségi központ."
    },
    {
      name: "Záhony",
      coords: [48.4047, 22.1767],
      description: "Keleti logisztikai kapu, tranzit- és határmenti áruforgalmi szereppel."
    }
  ];

  let countyLayer = null;

  function countyStyle(feature) {
    const rawName = extractCountyName(feature);
    const countyData = getCountyRiskData(rawName);

    return {
      fillColor: getRiskColor(countyData.risk),
      weight: 1.5,
      opacity: 1,
      color: "#e2e8f0",
      fillOpacity: 0.72
    };
  }

  function highlightCounty(event) {
    const layer = event.target;

    layer.setStyle({
      weight: 3,
      color: "#ffffff",
      fillOpacity: 0.88
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function resetCountyHighlight(event) {
    if (countyLayer) {
      countyLayer.resetStyle(event.target);
    }
  }

  function onEachCounty(feature, layer) {
    const rawName = extractCountyName(feature);
    const displayName = rawName || "Ismeretlen megye";
    const countyData = getCountyRiskData(rawName);

    const popupHtml = `
      <strong>${displayName}</strong><br>
      Ellátási lánc sérülékenységi index: ${countyData.risk}<br>
      Kockázati szint: ${countyData.label}
    `;

    layer.bindPopup(popupHtml);

    layer.on({
      mouseover: highlightCounty,
      mouseout: resetCountyHighlight,
      click: function () {
        updateInfoPanel(
          displayName,
          `Ellátási lánc sérülékenységi index: ${countyData.risk}. ${countyData.description}`
        );
      }
    });
  }

  const geoJsonUrl =
    "https://raw.githubusercontent.com/wuerdo/geoHungary/master/counties.geojson";

  fetch(geoJsonUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Nem sikerült letölteni a megyehatárokat.");
      }
      return response.json();
    })
    .then((data) => {
      countyLayer = L.geoJSON(data, {
        style: countyStyle,
        onEachFeature: onEachCounty
      }).addTo(map);

      map.fitBounds(countyLayer.getBounds(), {
        padding: [20, 20]
      });

      logisticsLocations.forEach((location) => {
        const marker = L.marker(location.coords).addTo(map);

        marker.bindPopup(
          `<strong>${location.name}</strong><br>${location.description}`
        );

        marker.on("click", function () {
          updateInfoPanel(location.name, location.description);
        });
      });
    })
    .catch((error) => {
      console.error("Térképbetöltési hiba:", error);

      updateInfoPanel(
        "Térképhiba",
        "A megyehatárok nem töltődtek be. Ellenőrizd a kapcsolatot, majd frissítsd az oldalt."
      );

      logisticsLocations.forEach((location) => {
        const marker = L.marker(location.coords).addTo(map);

        marker.bindPopup(
          `<strong>${location.name}</strong><br>${location.description}`
        );

        marker.on("click", function () {
          updateInfoPanel(location.name, location.description);
        });
      });
    });
}
