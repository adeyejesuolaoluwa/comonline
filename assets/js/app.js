/* Progressive enhancement. Reading, links, email and FAQ work without JavaScript. */
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motion = {
    ease: "cubic-bezier(0.32, 0.72, 0, 1)",
    duration: 720,
    stagger: 70,
  };
  const activeAnimations = new Set();
  const play = (element, frames, options = {}) => {
    if (reducedMotion.matches || !element.animate) return;
    const animation = element.animate(frames, {
      duration: motion.duration,
      easing: motion.ease,
      fill: "backwards",
      ...options,
    });
    activeAnimations.add(animation);
    animation.finished.then(
      () => activeAnimations.delete(animation),
      () => activeAnimations.delete(animation),
    );
    return animation;
  };
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches)
      activeAnimations.forEach((animation) => animation.cancel());
  });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const mobile = window.matchMedia("(max-width: 960px)");
  if (toggle && nav) {
    let menuAnimations = [];
    document.documentElement.classList.add("nav-enhanced");
    const setOpen = (open, restoreFocus = false) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
      menuAnimations.forEach((animation) => animation?.cancel());
      menuAnimations = [];
      if (open && mobile.matches) {
        menuAnimations = [...nav.children].map((link, index) =>
          play(
            link,
            [
              { opacity: 0.8, transform: "translateY(4px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 360, delay: index * 30 },
          ),
        );
      }
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
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("motion-ready");
  // A shared timeline is justified here: title, then invitation, in one cadence.
  // Local, pinned vendor files keep the site independent of runtime CDNs.
  let hasFinaleTimeline = false;
  const setupFinale = () => {
    if (reducedMotion.matches) return;
    const title = document.querySelector(".finale-title");
    // Do not replay a heading that has already entered through the fallback.
    if (!title || title.getBoundingClientRect().top < innerHeight * 0.88)
      return;
    hasFinaleTimeline = true;
    typeObserver.unobserve(title);
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const title = document.querySelector(".finale-title");
      if (!title) return;
      gsap
        .timeline({
          defaults: { ease: "power3.out", duration: 0.9 },
          scrollTrigger: { trigger: title, start: "top 88%", once: true },
        })
        .fromTo(
          title,
          { y: 12, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            immediateRender: false,
            clearProps: "transform,clipPath",
          },
        )
        .fromTo(
          ".finale-copy > p",
          { y: 10 },
          { y: 0, immediateRender: false, clearProps: "transform" },
          0.24,
        );
    });
  };
  const loadScript = (path) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(path, document.baseURI).href;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  const finaleLoader = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      finaleLoader.disconnect();
      loadScript("assets/js/vendor/gsap.min.js")
        .then(() => loadScript("assets/js/vendor/ScrollTrigger.min.js"))
        .then(setupFinale)
        .catch(() => {
          /* Native typography reveal remains available. */
        });
    },
    { rootMargin: "1000px 0px" },
  );
  const finale = document.querySelector(".story-finale");
  if (finale) finaleLoader.observe(finale);
  // Observe each chapter separately: long biographies must never move as a layer.
  const chapterLinks = [...document.querySelectorAll(".biography-index a")];
  const visibleChapters = new Map();
  const chapterObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting)
          visibleChapters.set(entry.target.id, entry.intersectionRect.height);
        else visibleChapters.delete(entry.target.id);
      }
      const current = [...visibleChapters].sort((a, b) => b[1] - a[1])[0]?.[0];
      chapterLinks.forEach((link) => {
        if (link.hash === `#${current}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
  );
  document
    .querySelectorAll(".bio-chapter")
    .forEach((chapter) => chapterObserver.observe(chapter));
  const typeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        typeObserver.unobserve(entry.target);
        play(
          entry.target,
          [
            { clipPath: "inset(0 0 100% 0)", transform: "translateY(12px)" },
            { clipPath: "inset(0 0 0% 0)", transform: "translateY(0)" },
          ],
          { duration: 900 },
        );
      });
    },
    { threshold: 0.25 },
  );
  document
    .querySelectorAll(
      hasFinaleTimeline ? ".bio-chapter h3" : ".bio-chapter h3, .finale-title",
    )
    .forEach((heading) => typeObserver.observe(heading));
  // Observe the visible subject, not its whole section: on phones the book
  // and invitation can be several screens apart within the same composition.
  const sceneObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || reducedMotion.matches) return;
        sceneObserver.unobserve(entry.target);
        const step = entry.target;
        if (step.matches(".finale-title")) return;
        if (hasFinaleTimeline && step.matches(".finale-copy > p")) return;
        play(
          step,
          [
            { opacity: 0.86, transform: "translateY(10px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { delay: step.matches(".eyebrow") ? 0 : 70 },
        );
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll("[data-motion-step]")
    .forEach((step) => sceneObserver.observe(step));
  const bookObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || reducedMotion.matches) return;
        bookObserver.unobserve(entry.target);
        const book = entry.target.querySelector(".book-object");
        if (!book) return;
        const finale = entry.target.matches(".finale-art");
        const simple = window.matchMedia(
          "(max-width: 760px), (pointer: coarse)",
        ).matches;
        const rest = finale
          ? "perspective(1200px) rotate(5deg) rotateY(-12deg)"
          : "rotate(-6deg) rotateY(-10deg)";
        play(
          book,
          [
            {
              transform: simple
                ? `${rest} translateY(8px)`
                : `perspective(1200px) translateY(16px) rotate(${finale ? 8 : -9}deg) rotateY(-18deg)`,
            },
            { transform: rest },
          ],
          { duration: simple ? 680 : 960, delay: 60 },
        );
      });
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll("[data-book-reveal]")
    .forEach((book) => bookObserver.observe(book));
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
  const preparedStatements = new WeakSet();
  const prepareStatement = (statement) => {
    if (preparedStatements.has(statement)) return;
    preparedStatements.add(statement);
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
    sceneObserver.disconnect();
    bookObserver.disconnect();
    typeObserver.disconnect();
    finaleLoader.disconnect();
    chapterObserver.disconnect();
    chapterLinks.forEach((link) => link.removeAttribute("aria-current"));
    pending.forEach((element) => element.classList.add("is-visible"));
    pending.clear();
    document
      .querySelectorAll(".word")
      .forEach((word) => word.classList.add("lit"));
  });
})();
