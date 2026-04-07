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

// ===== DOM ELEMEK =====
const stressBoxes = document.querySelectorAll(".stress-box");

// ===== STRESSZTESZT INTERAKCIÓ =====
function updateStressTest(scenarioKey) {
  const scenario = scenarios[scenarioKey];

  stressBoxes[0].querySelector("p").textContent = scenario.nev;
  stressBoxes[1].querySelector("p").textContent = scenario.hatas;
  stressBoxes[2].querySelector("p").textContent = scenario.erintett;
}

// ===== KATTINTHATÓ STRESSZ BLOKKOK =====
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
    metric.style.color = "#ef4444"; // piros
  } else if (value >= 60) {
    metric.style.color = "#f59e0b"; // narancs
  } else {
    metric.style.color = "#22c55e"; // zöld
  }
});

// ===== SIMA SCROLL NAV =====
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
