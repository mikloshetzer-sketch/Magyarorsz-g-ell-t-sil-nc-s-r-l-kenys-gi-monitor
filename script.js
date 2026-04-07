// ===== ALAP ADATOK =====
const scenarios = {
  nemet_visszaeses: {
    nev: "Német ipari visszaesés",
    hatas: "Exportcsökkenés és beszállítói láncok gyengülése",
    erintett: "Autóipar, nyugat-magyarországi ipari térségek"
  },
  energia_sokk: {
    nev: "Energiaár-sokk",
    hatas: "Termelési költségek növekedése és inflációs nyomás",
    erintett: "Energiaintenzív iparágak, teljes gazdaság"
  },
  szallitasi_zavar: {
    nev: "Szállítási útvonal zavar",
    hatas: "Késések és ellátási hiányok",
    erintett: "Logisztika, FMCG, élelmiszeripar"
  }
};

// ===== STRESSZTESZT =====
const stressBoxes = document.querySelectorAll(".stress-box");

function updateStressTest(scenarioKey) {
  const scenario = scenarios[scenarioKey];

  if (stressBoxes.length >= 3) {
    stressBoxes[0].querySelector("p").textContent = scenario.nev;
    stressBoxes[1].querySelector("p").textContent = scenario.hatas;
    stressBoxes[2].querySelector("p").textContent = scenario.erintett;
  }
}

stressBoxes.forEach((box, index) => {
  box.style.cursor = "pointer";

  box.addEventListener("click", () => {
    if (index === 0) updateStressTest("nemet_visszaeses");
    if (index === 1) updateStressTest("energia_sokk");
    if (index === 2) updateStressTest("szallitasi_zavar");
  });
});

// ===== METRIKÁK SZÍNEZÉSE =====
const metrics = document.querySelectorAll(".metric-value");

metrics.forEach(metric => {
  const value = parseInt(metric.textContent, 10);

  if (value >= 75) {
    metric.style.color = "#ef4444";
  } else if (value >= 60) {
    metric.style.color = "#f59e0b";
  } else {
    metric.style.color = "#22c55e";
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll(".main-nav a").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth"
      });
    }
  });
});

// ===== TÉRKÉP =====
const mapElement = document.getElementById("hungary-map");

if (mapElement) {
  const map = L.map("hungary-map").setView([47.1625, 19.5033], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const nameEl = document.getElementById("location-name");
  const descEl = document.getElementById("location-description");

  function updateInfoPanel(title, text) {
    if (nameEl) nameEl.textContent = title;
    if (descEl) descEl.textContent = text;
  }

  function getRiskByCountyName(countyName) {
    const riskMap = {
      "Budapest": 78,
      "Pest": 74,
      "Győr-Moson-Sopron": 76,
      "Komárom-Esztergom": 73,
      "Fejér": 70,
      "Bács-Kiskun": 64,
      "Csongrád-Csanád": 62,
      "Hajdú-Bihar": 67,
      "Szabolcs-Szatmár-Bereg": 66,
      "Borsod-Abaúj-Zemplén": 68,
      "Heves": 60,
      "Jász-Nagykun-Szolnok": 61,
      "Veszprém": 58,
      "Vas": 59,
      "Zala": 57,
      "Somogy": 55,
      "Tolna": 54,
      "Baranya": 56,
      "Nógrád": 52,
      "Békés": 53
    };

    return riskMap[countyName] ?? 58;
  }

  function getColor(risk) {
    if (risk >= 75) return "#b91c1c";
    if (risk >= 68) return "#ea580c";
    if (risk >= 60) return "#f59e0b";
    return "#16a34a";
  }

  function countyStyle(feature) {
    const countyName =
      feature?.properties?.name ||
      feature?.properties?.NAME_1 ||
      feature?.properties?.county ||
      "Ismeretlen";

    const risk = getRiskByCountyName(countyName);

    return {
      fillColor: getColor(risk),
      weight: 1.5,
      opacity: 1,
      color: "#e2e8f0",
      fillOpacity: 0.7
    };
  }

  function onEachCounty(feature, layer) {
    const countyName =
      feature?.properties?.name ||
      feature?.properties?.NAME_1 ||
      feature?.properties?.county ||
      "Ismeretlen megye";

    const risk = getRiskByCountyName(countyName);

    layer.bindPopup(
      `<strong>${countyName}</strong><br>Ellátási lánc sérülékenységi index: ${risk}`
    );

    layer.on("mouseover", function () {
      this.setStyle({
        weight: 3,
        color: "#ffffff",
        fillOpacity: 0.85
      });
      this.bringToFront();
    });

    layer.on("mouseout", function () {
      countyLayer.resetStyle(this);
    });

    layer.on("click", function () {
      updateInfoPanel(
        countyName,
        `Ellátási lánc sérülékenységi index: ${risk}. A színezés demonstrációs célú megyei kockázati besorolást mutat.`
      );
    });
  }

  let countyLayer;

  // ===== VALÓDI MEGYEHATÁROK BETÖLTÉSE =====
  const geoJsonUrl =
    "https://raw.githubusercontent.com/wuerdo/geoHungary/master/counties.geojson";

  fetch(geoJsonUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a megyehatár-fájlt.");
      }
      return response.json();
    })
    .then(data => {
      countyLayer = L.geoJSON(data, {
        style: countyStyle,
        onEachFeature: onEachCounty
      }).addTo(map);

      map.fitBounds(countyLayer.getBounds(), {
        padding: [20, 20]
      });

      // ===== FŐ LOGISZTIKAI PONTOK =====
      const locations = [
        {
          name: "Budapest",
          coords: [47.4979, 19.0402],
          desc: "Országos logisztikai és elosztási központ"
        },
        {
          name: "Győr",
          coords: [47.6875, 17.6504],
          desc: "Autóipari központ és nyugati kapcsolat"
        },
        {
          name: "Debrecen",
          coords: [47.5316, 21.6273],
          desc: "Új ipari és beszállítói bázis"
        },
        {
          name: "Kecskemét",
          coords: [46.8964, 19.6897],
          desc: "Járműipari integráció"
        },
        {
          name: "Záhony",
          coords: [48.4047, 22.1767],
          desc: "Keleti logisztikai kapu"
        }
      ];

      locations.forEach(loc => {
        const marker = L.marker(loc.coords).addTo(map);

        marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}`);

        marker.on("click", () => {
          updateInfoPanel(loc.name, loc.desc);
        });
      });
    })
    .catch(error => {
      console.error(error);
      updateInfoPanel(
        "Térképhiba",
        "A valódi megyehatárok nem töltődtek be. Ellenőrizd az internetkapcsolatot, majd frissítsd az oldalt."
      );
    });
}
