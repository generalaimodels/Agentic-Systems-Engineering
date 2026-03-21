async function initializeMermaid() {
  const nodes = document.querySelectorAll(".mermaid");

  if (nodes.length === 0) {
    return;
  }

  try {
    const mermaidModule = await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");
    const mermaid = mermaidModule.default;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "dark",
    });

    await mermaid.run({ nodes });
  } catch (error) {
    console.warn("Mermaid initialization failed.", error);
  }
}

function initializeTocHighlighting() {
  const tocLinks = [...document.querySelectorAll(".toc-link[href^='#']")];
  const headings = tocLinks
    .map((link) => {
      const target = document.getElementById(link.getAttribute("href")?.slice(1) ?? "");
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (headings.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

      if (visibleEntries.length === 0) {
        return;
      }

      const activeTarget = visibleEntries[0].target;

      for (const item of headings) {
        item.link.classList.toggle("toc-link-active", item.target === activeTarget);
      }
    },
    {
      rootMargin: "-18% 0px -64% 0px",
      threshold: [0, 0.12, 0.3, 0.55],
    },
  );

  for (const item of headings) {
    observer.observe(item.target);
  }
}

void initializeMermaid();
initializeTocHighlighting();
