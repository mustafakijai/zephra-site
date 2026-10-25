/* ============================================================
   WAITLIST CONFIG — owner: wire this up before launch.
   Set WAITLIST_ENDPOINT to a form backend that accepts POSTed
   JSON or form data (e.g. https://formspree.io/f/XXXXXXX).
   While it is empty, the form opens a pre-filled email to
   WAITLIST_EMAIL instead (nothing is stored by this site).
   ============================================================ */
const WAITLIST_ENDPOINT = "";
const WAITLIST_EMAIL = "hello@nexoraaero.com"; // TODO(owner): confirm this inbox exists

document.getElementById("yr").textContent = new Date().getFullYear();

// Mobile nav
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

// Card spotlight follows cursor
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// Hero demo: typed voice transcript loop
const you = document.querySelector(".bubble.you");
const zep = document.querySelector(".bubble.zep");
const lines = [
  ["Hey Zephra… next song", "Skipped. Now playing the next track in Music."],
  ["Create project for Client A", "Plan ready: 3 steps. Review, then approve to run."],
  ["Set volume to forty percent", "Music volume is now 40 percent."],
  ["Export InDesign PDF", "Checked links and overset text. Choose a PDF preset."],
];
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let li = 0;
function typeLine() {
  const [said, reply] = lines[li];
  zep.classList.remove("show");
  if (reduce) { you.textContent = said; zep.textContent = reply; zep.classList.add("show"); return; }
  you.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    you.textContent = said.slice(0, ++i);
    if (i >= said.length) {
      clearInterval(t);
      setTimeout(() => { zep.textContent = reply; zep.classList.add("show"); }, 650);
      setTimeout(() => { li = (li + 1) % lines.length; typeLine(); }, 4200);
    }
  }, 55);
}
typeLine();

// Waitlist form
const form = document.getElementById("waitlist-form");
const msg = document.getElementById("form-msg");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const email = form.email.value.trim();
  const plan = form.plan.value;
  msg.classList.remove("err");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Please enter a valid email address."; msg.classList.add("err"); return; }
  if (WAITLIST_ENDPOINT) {
    try {
      const res = await fetch(WAITLIST_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email, plan, source: "zephra-site" }) });
      if (!res.ok) throw new Error(res.status);
      msg.textContent = "You’re on the list! We’ll be in touch soon.";
      form.reset();
    } catch {
      msg.textContent = "Something went wrong — please try again in a moment."; msg.classList.add("err");
    }
  } else {
    const subject = encodeURIComponent(`Zephra beta request (${plan})`);
    const body = encodeURIComponent(`Please add me to the Zephra beta.\n\nEmail: ${email}\nInterested in: ${plan}`);
    window.location.href = `mailto:${WAITLIST_EMAIL}?subject=${subject}&body=${body}`;
    msg.textContent = "Opening your email app to send the request…";
  }
});
