/* Progressive enhancement. Reading, links, email and FAQ work without JavaScript. */
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const mobile = window.matchMedia("(max-width: 960px)");
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
  const copyButton = document.querySelector("[data-copy-email]");
  const copyStatus = document.getElementById("copy-status");
  if (copyButton && copyStatus && navigator.clipboard?.writeText) {
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
      copyButton.disabled = true;
      copyButton.textContent = "Copying…";
      copyStatus.textContent = "";
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
        copyButton.textContent = "Copy again";
        copyStatus.textContent = "Email address copied.";
      } catch {
        copyButton.textContent = "Copy address";
        copyStatus.textContent =
          "Could not copy. Select the email address above.";
      } finally {
        copyButton.disabled = false;
      }
    });
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("motion-ready");
  const pending = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          entry.target.classList.add("reveal-pending");
          pending.add(entry.target);
          continue;
        }
        entry.target.classList.add("is-visible");
        pending.delete(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08 },
  );
  // Let the browser report visibility after layout. No synchronous geometry reads.
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
  document.addEventListener("focusin", (event) => {
    const element = event.target.closest(".reveal-pending");
    if (element) {
      element.classList.add("is-visible");
      pending.delete(element);
      observer.unobserve(element);
    }
  });
  const wordObserver = new IntersectionObserver(
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
  const prepareStatement = (statement) => {
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
    words.forEach((word) => wordObserver.observe(word));
  };
  // Prepare long typographic passages only when they approach the viewport.
  const statementObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        prepareStatement(entry.target);
        statementObserver.unobserve(entry.target);
      }
    },
    { rootMargin: "240px 0px" },
  );
  document
    .querySelectorAll("[data-word-reveal]")
    .forEach((statement) => statementObserver.observe(statement));
  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    wordObserver.disconnect();
    statementObserver.disconnect();
    pending.forEach((element) => element.classList.add("is-visible"));
    pending.clear();
    document
      .querySelectorAll(".word")
      .forEach((word) => word.classList.add("lit"));
  });
})();
