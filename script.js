const focusSections = document.querySelectorAll(".focus-section");
const siteHeader = document.querySelector(".site-header");
const brandImage = document.querySelector(".brand-mark img");
const heroSection = document.querySelector(".hero-section");
const heroVideo = document.querySelector(".hero-video");
let previousHeroTime = 0;

window.addEventListener("scroll", updatePageState, { passive: true });
window.addEventListener("resize", updatePageState);
updatePageState();

triggerHeroFade();

heroVideo?.addEventListener("play", triggerHeroFade);
heroVideo?.addEventListener("timeupdate", () => {
  if (heroVideo.currentTime < previousHeroTime || (heroVideo.currentTime < 0.22 && previousHeroTime > 1)) {
    triggerHeroFade();
  }

  previousHeroTime = heroVideo.currentTime;
});

function triggerHeroFade() {
  if (!heroSection) return;

  heroSection.classList.remove("is-loop-fading");
  window.requestAnimationFrame(() => {
    heroSection.classList.add("is-loop-fading");
  });
}

function updatePageState() {
  updateFocusState();
  updateHeaderTheme();
}

function updateFocusState() {
  const probe = document.elementFromPoint(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2));
  const activeSection = probe?.closest?.(".focus-section") || focusSections[0];

  focusSections.forEach((section) => {
    section.classList.toggle("is-focused", section === activeSection);
  });
}

function updateHeaderTheme() {
  const probe = document.elementFromPoint(Math.floor(window.innerWidth / 2), 92);
  const section = probe?.closest?.(".focus-section");
  const theme = section?.dataset.theme || "dark";

  siteHeader?.classList.toggle("theme-light", theme === "light");
  siteHeader?.classList.toggle("theme-dark", theme !== "light");

  if (brandImage) {
    brandImage.src = theme === "light" ? "assets/origin-logo-transparent.png" : "assets/origin-logo-white.png";
  }
}

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scrollTarget);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const waterGraphic = document.querySelector(".water-graphic");
const waterItems = document.querySelectorAll(".water-scale-item");
const waterLab = document.querySelector("[data-water-lab]");
const waterValue = document.querySelector("[data-water-value]");
const waterLabel = document.querySelector("[data-water-label]");
const waterOrb = document.querySelector("[data-water-orb]");
const waterOrbOptions = waterLab ? [...waterLab.querySelectorAll("[data-water-option]")] : [];
const waterStates = {
  world: {
    value: 100,
    label: "Total water on Earth",
    color: "#8aafdd",
    angle: 360,
  },
  fresh: {
    value: 2.5,
    label: "Freshwater amount",
    color: "#2e4896",
    angle: 9,
  },
  human: {
    value: 0.3,
    label: "Human-accessible water",
    color: "#d1e62c",
    angle: 2.5,
  },
};
let displayedWaterValue = 100;
let waterNumberFrame;

waterItems.forEach((item) => {
  item.addEventListener("pointerenter", () => setWaterFocus(item));
  item.addEventListener("focus", () => setWaterFocus(item));
  item.addEventListener("click", () => setWaterFocus(item));
});

waterOrbOptions.forEach((item) => {
  item.addEventListener("pointerenter", () => setWaterFocus(item));
  item.addEventListener("focus", () => setWaterFocus(item));
  item.addEventListener("click", () => setWaterFocus(item));
});

function setWaterFocus(item, { animate = true } = {}) {
  if (!waterGraphic) return;

  const focus = item.dataset.focus || "world";
  waterGraphic.dataset.focus = focus;
  waterGraphic.classList.add("is-focusing");
  waterItems.forEach((entry) => entry.classList.toggle("is-active", entry.dataset.focus === focus));
  updateWaterOrb(focus, { animate });
}

function updateWaterOrb(focus, { animate = true } = {}) {
  const state = waterStates[focus] || waterStates.world;
  if (!waterLab || !waterOrb || !waterValue) return;

  waterLab.dataset.waterActive = focus;
  waterLab.style.setProperty("--active-color", state.color);
  waterOrb.style.setProperty("--active-color", state.color);
  waterOrb.style.setProperty("--active-angle", `${state.angle}deg`);
  waterOrb.classList.remove("is-updating");
  window.requestAnimationFrame(() => waterOrb.classList.add("is-updating"));

  waterOrbOptions.forEach((entry) => entry.classList.toggle("is-active", entry.dataset.focus === focus));
  if (waterLabel) waterLabel.textContent = state.label;

  if (animate) {
    animateWaterValue(state.value);
  } else {
    displayedWaterValue = state.value;
    waterValue.textContent = formatWaterValue(state.value);
  }

  window.setTimeout(() => waterOrb.classList.remove("is-updating"), 280);
}

function formatWaterValue(value) {
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)}%`;
}

function animateWaterValue(target) {
  if (!waterValue) return;
  cancelAnimationFrame(waterNumberFrame);

  const start = displayedWaterValue;
  const duration = 520;
  const startTime = performance.now();

  const frame = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = start + (target - start) * eased;
    waterValue.textContent = formatWaterValue(value);

    if (progress < 1) {
      waterNumberFrame = requestAnimationFrame(frame);
    } else {
      displayedWaterValue = target;
      waterValue.textContent = formatWaterValue(target);
    }
  };

  waterNumberFrame = requestAnimationFrame(frame);
}

const initialWaterItem = document.querySelector(".water-scale-item.is-active") || waterItems[0];
if (initialWaterItem) setWaterFocus(initialWaterItem, { animate: false });

const fiberChart = document.querySelector(".fiber-chart");

if (fiberChart && "IntersectionObserver" in window) {
  const fiberObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        fiberChart.classList.add("is-visible");
        fiberObserver.unobserve(fiberChart);
      });
    },
    { threshold: 0.28 },
  );

  fiberObserver.observe(fiberChart);
} else {
  fiberChart?.classList.add("is-visible");
}

const materialPreview = document.querySelector(".material-preview");
const materialImage = materialPreview?.querySelector("img");
const materialCases = document.querySelectorAll(".material-case");

materialCases.forEach((item) => {
  item.addEventListener("pointerenter", () => setMaterial(item));
  item.addEventListener("focus", () => setMaterial(item));
  item.addEventListener("click", () => setMaterial(item));
});

function setMaterial(item) {
  const nextImage = item.dataset.image;
  if (!materialImage || !nextImage || materialImage.getAttribute("src") === nextImage) return;

  materialCases.forEach((entry) => entry.classList.toggle("is-active", entry === item));
  materialPreview?.classList.add("is-switching");

  window.setTimeout(() => {
    materialImage.src = nextImage;
    materialPreview?.classList.remove("is-switching");
  }, 140);
}
