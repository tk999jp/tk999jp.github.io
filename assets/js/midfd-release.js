(() => {
  const RELEASE_API_URL = "https://api.github.com/repos/tk999jp/MidFD/releases/latest";
  const RELEASES_PAGE_URL = "https://github.com/tk999jp/MidFD/releases";
  const ASSET_NAME = "MidFD-win-x64.zip";

  function setText(field, value) {
    document.querySelectorAll(`[data-midfd-release-field="${field}"]`).forEach((element) => {
      element.textContent = value;
    });
  }

  function setStatus(message) {
    document.querySelectorAll("[data-midfd-release-status]").forEach((element) => {
      element.textContent = message;
    });
  }

  function toggleRow(field, isVisible) {
    document.querySelectorAll(`[data-midfd-release-row="${field}"]`).forEach((element) => {
      element.hidden = !isVisible;
      element.classList.toggle("is-hidden", !isVisible);
      element.setAttribute("aria-hidden", String(!isVisible));
    });
  }

  function setCopyField(field, value) {
    document.querySelectorAll(`[data-midfd-copy-field="${field}"]`).forEach((button) => {
      if (!value) {
        button.hidden = true;
        button.removeAttribute("data-copy-value");
        return;
      }
      button.hidden = false;
      button.setAttribute("data-copy-value", value);
    });
  }

  function extractProductVersion(release) {
    const sources = [release.body, release.name].filter(Boolean);
    for (const source of sources) {
      const matched = source.match(/ProductVersion\s*[:=]\s*([^\r\n`]+)/i);
      if (matched) {
        return matched[1].trim();
      }
    }
    return "";
  }

  function normalizeDigest(digest) {
    if (!digest || typeof digest !== "string") {
      return "";
    }
    return digest.replace(/^sha256:/i, "").trim().toUpperCase();
  }

  function formatPublishedAt(value) {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} UTC`;
  }

  async function loadReleaseInfo() {
    const statusNodes = document.querySelectorAll("[data-midfd-release-status]");
    if (statusNodes.length === 0) {
      return;
    }

    if (window.location.protocol === "file:") {
      setText("tag", "GitHub Releasesで確認");
      toggleRow("published-at", false);
      toggleRow("product-version", false);
      toggleRow("sha256", false);
      setCopyField("sha256", "");
      setStatus("ローカルファイル表示では確認情報を取得しません。GitHub Releasesで確認してください。");
      return;
    }

    try {
      const response = await fetch(RELEASE_API_URL, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }

      const release = await response.json();
      const asset = Array.isArray(release.assets)
        ? release.assets.find((item) => item && item.name === ASSET_NAME)
        : null;

      setText("tag", release.tag_name || "GitHub Releasesで確認");
      setText("asset-name", asset?.name || ASSET_NAME);

      const publishedAt = formatPublishedAt(release.published_at);
      if (publishedAt) {
        setText("published-at", publishedAt);
        toggleRow("published-at", true);
      } else {
        toggleRow("published-at", false);
      }

      const productVersion = extractProductVersion(release);
      if (productVersion) {
        setText("product-version", productVersion);
        toggleRow("product-version", true);
      } else {
        toggleRow("product-version", false);
      }

      const sha256 = normalizeDigest(asset?.digest);
      if (sha256) {
        setText("sha256", sha256);
        toggleRow("sha256", true);
        if (window.isSecureContext && navigator.clipboard) {
          setCopyField("sha256", sha256);
        } else {
          setCopyField("sha256", "");
        }
      } else {
        toggleRow("sha256", false);
        setCopyField("sha256", "");
      }

      setStatus("GitHub Releases の asset digest から確認情報を表示しています。");
    } catch {
      setText("tag", "GitHub Releasesで確認");
      toggleRow("published-at", false);
      toggleRow("product-version", false);
      toggleRow("sha256", false);
      setCopyField("sha256", "");
      setStatus("取得できませんでした。GitHub Releasesで確認してください。");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadReleaseInfo();
  });
})();
