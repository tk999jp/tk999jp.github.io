(() => {
  const hashAliases = {
    download:    [{ sectionId: "download" }],
    features:    [{ sectionId: "features" }],
    "operation-reference": [{ sectionId: "operation-reference" }],
    "install-guide": [{ sectionId: "install-guide" }],
    startup:     [{ sectionId: "install-guide" }],
    "external-tools": [{ sectionId: "external-tools" }],
    verify:      [{ sectionId: "verify" }],
    report:      [{ sectionId: "report" }],
  };

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ block: "start" });
      });
    }
  }

  function updatePreview(root, button) {
    const image = root.querySelector("[data-midfd-preview-image]");
    const title = root.querySelector("[data-midfd-preview-title]");
    const caption = root.querySelector("[data-midfd-preview-caption]");

    if (!image || !button) {
      return;
    }

    const src = button.getAttribute("data-preview-src") || "";
    const alt = button.getAttribute("data-preview-alt") || "";
    const nextTitle = button.getAttribute("data-preview-title") || "";
    const nextCaption = button.getAttribute("data-preview-caption") || "";

    if (src) {
      image.setAttribute("src", src);
    }
    if (alt) {
      image.setAttribute("alt", alt);
    }
    if (title && nextTitle) {
      title.textContent = nextTitle;
    }
    if (caption && nextCaption) {
      caption.textContent = nextCaption;
    }

    root.querySelectorAll("[data-midfd-preview-trigger]").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  }

  function syncHash() {
    const key = window.location.hash.replace(/^#/, "");
    if (!key) {
      return;
    }
    if (hashAliases[key]) {
      const sectionId = hashAliases[key][0]?.sectionId;
      if (sectionId) {
        scrollToSection(sectionId);
      }
      return;
    }
    scrollToSection(key);
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", syncHash);
    syncHash();

    // コピーボタン（secure context のみ有効）
    document.querySelectorAll("[data-copy-value]").forEach((button) => {
      if (!window.isSecureContext || !navigator.clipboard) {
        button.hidden = true;
        return;
      }
      button.addEventListener("click", async () => {
        const value = button.getAttribute("data-copy-value") || "";
        if (!value) {
          return;
        }
        try {
          await navigator.clipboard.writeText(value);
          button.textContent = "コピー済み";
        } catch {
          button.textContent = "コピー不可";
        }
        window.setTimeout(() => {
          button.textContent = "コピー";
        }, 1800);
      });
    });

    // スクリーンショット切替
    document.querySelectorAll("[data-midfd-preview-trigger]").forEach((button) => {
      const root = button.closest(".midfd-product-stage");
      if (!root) {
        return;
      }
      button.addEventListener("click", () => updatePreview(root, button));
    });

    document.querySelectorAll(".midfd-product-stage").forEach((root) => {
      const activeButton =
        root.querySelector("[data-midfd-preview-trigger].is-active") ||
        root.querySelector("[data-midfd-preview-trigger]");
      if (activeButton) {
        updatePreview(root, activeButton);
      }
    });
  });
})();
