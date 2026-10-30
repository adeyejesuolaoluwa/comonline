/* Progressive enhancement. Reading, links, email and FAQ work without JavaScript. */
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const mobile = window.matchMedia("(max-width: 760px)");
  if (toggle && nav) {
    document.documentElement.classList.add("nav-enhanced");
    const setOpen = (open, restoreFocus = false) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
      if (restoreFocus) toggle.focus();
    };
    const sync = () => {
      toggle.hidden = !mobile.matches;
      setOpen(false);
    };
    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true"),
    );
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      )
        setOpen(false, true);
    });
    document.addEventListener("click", (event) => {
      if (mobile.matches && !event.target.closest(".site-header"))
        setOpen(false);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a") && mobile.matches) setOpen(false);
    });
    mobile.addEventListener("change", sync);
    sync();
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  const pending = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        pending.delete(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08 },
  );
  // Batch layout reads before class writes to avoid repeated forced reflow.
  const offscreen = [...document.querySelectorAll(".reveal")].filter(
    (element) => element.getBoundingClientRect().top >= window.innerHeight,
  );
  offscreen.forEach((element) => {
    element.classList.add("reveal-pending");
    pending.add(element);
    observer.observe(element);
  });
  document.addEventListener("focusin", (event) => {
    const element = event.target.closest(".reveal-pending");
    if (element) {
      element.classList.add("is-visible");
      pending.delete(element);
      observer.unobserve(element);
    }
  });
  let wordObserver;
  document.querySelectorAll("[data-word-reveal]").forEach((statement) => {
    const walker = document.createTreeWalker(statement, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    const words = [];
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part.trim()) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = part;
        span.style.transitionDelay = `${index++ * 45}ms`;
        words.push(span);
        fragment.append(span);
      });
      node.replaceWith(fragment);
    });
    statement.classList.add("word-reveal");
    wordObserver ||= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("lit");
            wordObserver.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 1 },
    );
    words.forEach((word) => wordObserver.observe(word));
  });
  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    wordObserver?.disconnect();
    pending.forEach((element) => element.classList.add("is-visible"));
    pending.clear();
    document
      .querySelectorAll(".word")
      .forEach((word) => word.classList.add("lit"));
  });
})();
