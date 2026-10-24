/* Interactive layer: hover, press and scroll effects built on Motion (assets/js/vendor/motion.js).
   Everything here is decoration; the page works the same without it, and it all switches off
   for visitors who prefer reduced motion. Load after layout.js and the page's own script. */
(function fx(){
  const M = window.Motion;
  if (!M || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { animate, hover, press, scroll, stagger, inView } = M;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const spring = { type: "spring", stiffness: 260, damping: 20 };

  /* Reading progress: a thin gold bar under the nav. */
  const bar = document.createElement("div");
  bar.className = "read-bar";
  document.querySelector(".nav")?.append(bar);
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: "linear" }));

  /* Hero headline: words rise in one after another. */
  document.querySelectorAll("[data-split]").forEach(h => {
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = words.map(w => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(" ");
    animate(h.querySelectorAll(".w > span"), { y: ["110%", "0%"], opacity: [0, 1] }, { delay: stagger(0.07, { startDelay: 0.15 }), duration: 0.8, ease: [0.2, 0.8, 0.2, 1] });
  });

  /* "How it works": the root line grows down the steps as they scroll through the screen. */
  const steps = document.getElementById("steps");
  if (steps) scroll(p => steps.style.setProperty("--grow", Math.min(1, p * 1.15).toFixed(3)), { target: steps, offset: ["start 85%", "end 55%"] });

  /* Press feedback on every control (works for touch too). */
  press(".btn, .opt, .sit, .chip, .track-row, .mf-btn", el => {
    animate(el, { scale: 0.95 }, { type: "spring", stiffness: 600, damping: 30 });
    return () => animate(el, { scale: 1 }, spring);
  });

  if (!fine) return;   // the pointer-follow effects below need a mouse

  /* Magnetic buttons: lean toward the pointer, spring back on leave. */
  document.querySelectorAll(".hero .btn-primary, .cta-panel .btn-primary").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      animate(btn, { x: (e.clientX - r.left - r.width / 2) * 0.12, y: (e.clientY - r.top - r.height / 2) * 0.2 }, { duration: 0.25 });
    });
    btn.addEventListener("pointerleave", () => animate(btn, { x: 0, y: 0 }, spring));
  });

  /* Tilt + shine on cards. Works on cards added later (filters, re-renders) through delegation. */
  const TILT = ".card, .mentor, .track-insight";
  let tilted = null;
  document.addEventListener("pointermove", e => {
    const el = e.target.closest(TILT);
    if (tilted && tilted !== el){ animate(tilted, { rotateX: 0, rotateY: 0 }, spring); tilted = null; }
    if (!el || el.classList.contains("rv")) return;
    tilted = el;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    animate(el, { rotateX: (0.5 - py) * 4, rotateY: (px - 0.5) * 5, transformPerspective: 1000 }, { duration: 0.35 });
  }, { passive: true });
  document.addEventListener("pointerleave", () => { if (tilted){ animate(tilted, { rotateX: 0, rotateY: 0 }, spring); tilted = null; } });

  /* Hero laptop leans gently toward the pointer. */
  const hv = document.getElementById("heroVisual"), lap = document.getElementById("laptop");
  if (hv && lap){
    hv.addEventListener("pointermove", e => {
      const r = hv.getBoundingClientRect();
      animate(lap, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 8, rotateX: (0.5 - (e.clientY - r.top) / r.height) * 6, transformPerspective: 1400 }, { duration: 0.5 });
    });
    hv.addEventListener("pointerleave", () => animate(lap, { rotateX: 0, rotateY: 0 }, spring));
  }

  /* Count-up for numbers that scroll into view, e.g. "6 ways we help". */
  inView("[data-count]", el => {
    const end = Number(el.dataset.count), suffix = el.dataset.suffix || "";
    animate(0, end, { duration: 1.2, ease: [0.2, 0.8, 0.2, 1], onUpdate: v => { el.textContent = Math.round(v) + suffix; } });
  });
})();
