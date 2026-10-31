
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Theme picker: save selection between visits
const themeSelect = $("#themeSelect");
const availableThemes = ["lavender", "mint", "peach", "sky", "dark"];

function applyTheme(theme) {
  const safeTheme = availableThemes.includes(theme) ? theme : "lavender";

  if (safeTheme === "lavender") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.dataset.theme = safeTheme;
  }

  themeSelect.value = safeTheme;

  try {
    localStorage.setItem("lumora-theme", safeTheme);
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }
}

let savedTheme = "lavender";
try {
  savedTheme = localStorage.getItem("lumora-theme") || "lavender";
} catch (error) {
  // Continue with the default theme.
}

applyTheme(savedTheme);

themeSelect.addEventListener("change", (event) => {
  applyTheme(event.target.value);
});

// Typing animation
const typingText = $("#typingText");
const roles = ["Frontend Developer", "UI Designer", "Creative Developer"];
let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = true;

function typeRole() {
  const currentRole = roles[roleIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingText.textContent = currentRole.slice(0, charIndex);

  let delay = deleting ? 48 : 85;

  if (!deleting && charIndex >= currentRole.length) {
    deleting = true;
    delay = 1500;
  } else if (deleting && charIndex <= 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  }

  window.setTimeout(typeRole, delay);
}

window.setTimeout(typeRole, 1500);

// Scroll reveal animation
const revealElements = $$(".reveal");
const skillFills = $$(".skill-fill");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      entry.target.querySelectorAll(".skill-fill").forEach((fill) => {
        fill.style.width = `${fill.dataset.level}%`;
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
  skillFills.forEach((fill) => {
    fill.style.width = `${fill.dataset.level}%`;
  });
}

// Project category filters
const filterButtons = $$(".filter-button");
const projectCards = $$(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });

  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
});

// Subtle 3D tilt on the profile card (desktop pointer only)
const profileCard = $(".profile-card");
const finePointer = window.matchMedia("(pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (profileCard && finePointer.matches && !reducedMotion.matches) {
  profileCard.addEventListener("pointermove", (event) => {
    const rect = profileCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    profileCard.style.animation = "none";
    profileCard.style.transform =
      `rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });

  profileCard.addEventListener("pointerleave", () => {
    profileCard.style.transform = "";
    profileCard.style.animation = "";
  });
}

// Custom cursor glow
const cursorGlow = $(".cursor-glow");

if (cursorGlow && finePointer.matches && !reducedMotion.matches) {
  document.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

// Contact form: prepare a message in the user's email application
$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#contactName").value.trim();
  const email = $("#contactEmail").value.trim();
  const message = $("#contactMessage").value.trim();

  if (!name || !email || !message) {
    alert("Please complete all fields.");
    return;
  }

  // Replace this placeholder with your own public contact email.
  const recipient = "dhairyakumar401@gmail.com";


  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

// Back-to-top button
const backToTop = $("#backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reducedMotion.matches ? "auto" : "smooth"
  });
});

// Footer year
$("#year").textContent = new Date().getFullYear();

console.log("LUMORA Portfolio ready!");
