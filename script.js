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

  stressBoxes[0].querySelector("p").textContent = scenario.nev;
  stressBoxes[1].querySelector("p").textContent = scenario.hatas;
  stressBoxes[2].querySelector("p").textContent = scenario.erintett;
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
  const value = parseInt(metric.textContent);

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
  anchor.addEventListener("click", function(e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);

    window.scrollTo({
      top: target.offsetTop - 60,
      behavior: "smooth"
    });
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

  // ===== KOCKÁZATI SZÍNEZÉS =====
  function getColor(risk) {
    if (risk >= 75) return "#ef4444"; // piros
    if (risk >= 65) return "#f59e0b"; // narancs
    return "#22c55e"; // zöld
  }

  // ===== MEGYEI PONTOK (GeoJSON) =====
  if (typeof countiesData !== "undefined") {
    countiesData.features.forEach(feature => {
      const coords = feature.geometry.coordinates;
      const name = feature.properties.name;
      const risk = feature.properties.risk;

      const latlng = [coords[1], coords[0]];

      const circle = L.circleMarker(latlng, {
        radius: 12,
        fillColor: getColor(risk),
        color: "#ffffff",
        weight: 1,
        fillOpacity: 0.8
      }).addTo(map);

      circle.bindPopup(`<b>${name}</b><br>Kockázat: ${risk}`);

      circle.on("click", () => {
        nameEl.textContent = name;
        descEl.textContent = `Ellátási lánc sérülékenységi index: ${risk}`;
      });
    });
  }

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

    marker.bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);

    marker.on("click", () => {
      nameEl.textContent = loc.name;
      descEl.textContent = loc.desc;
    });
  });
}
