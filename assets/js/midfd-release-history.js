(() => {
  const API = "https://api.github.com/repos/tk999jp/MidFD/releases?per_page=100";
  const list = document.querySelector("[data-midfd-history-list]");
  const status = document.querySelector("[data-midfd-history-status]");
  if (!list || !status) return;
  function releaseUrl(value) {
    try { const url = new URL(value); return url.origin === "https://github.com" && url.pathname.startsWith("/tk999jp/MidFD/releases/tag/") ? url.href : ""; }
    catch { return ""; }
  }
  function assetUrl(value) {
    try { const url = new URL(value); return url.origin === "https://github.com" && url.pathname.startsWith("/tk999jp/MidFD/releases/download/") ? url.href : ""; }
    catch { return ""; }
  }
  function renderNotes(container, body) {
    const text = typeof body === "string" ? body.trim() : "";
    if (!text) return;
    const notes = document.createElement("pre");
    notes.className = "midfd-release-history-notes";
    notes.textContent = text;
    container.appendChild(notes);
  }
  function renderRelease(release) {
    const url = releaseUrl(release.html_url);
    if (!url) return null;
    const item = document.createElement("li");
    const card = document.createElement("article");
    card.className = "midfd-release-history-card";
    const heading = document.createElement("h2");
    const link = document.createElement("a");
    link.href = url; link.rel = "noopener noreferrer"; link.target = "_blank";
    link.textContent = release.name || release.tag_name || "公開Release";
    heading.appendChild(link); card.appendChild(heading);
    const meta = document.createElement("p");
    meta.className = "midfd-release-history-meta";
    const date = release.published_at ? new Date(release.published_at) : null;
    const dateText = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeZone: "Asia/Tokyo" }).format(date) : "";
    meta.textContent = (release.tag_name || "") + (dateText ? " · " + dateText : "");
    card.appendChild(meta); renderNotes(card, release.body);
    const assets = Array.isArray(release.assets) ? release.assets : [];
    const links = document.createElement("div"); links.className = "midfd-release-history-assets";
    for (const expected of ["MidFD-win-x64.zip", "MidFD-win-x64.zip.sha256"]) {
      const asset = assets.find(entry => entry && entry.name === expected);
      const href = asset ? assetUrl(asset.browser_download_url) : "";
      if (!href) continue;
      const anchor = document.createElement("a"); anchor.href = href; anchor.rel = "noopener noreferrer"; anchor.textContent = expected; links.appendChild(anchor);
    }
    if (links.childElementCount) card.appendChild(links);
    item.appendChild(card); return item;
  }
  async function load() {
    try {
      const response = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error("GitHub API " + response.status);
      const releases = await response.json();
      if (!Array.isArray(releases)) throw new Error("Unexpected releases response");
      const published = releases.filter(item => item && item.draft !== true && item.prerelease !== true && item.published_at);
      const fragment = document.createDocumentFragment(); let count = 0;
      for (const release of published) { const item = renderRelease(release); if (item) { fragment.appendChild(item); count += 1; } }
      list.replaceChildren(fragment);
      status.textContent = count ? count + "件の公開済みReleaseを表示しています。" : "公開済みReleaseはありません。";
    } catch { status.textContent = "GitHubから取得できませんでした。配布元ページで公開履歴を確認してください。"; }
  }
  document.addEventListener("DOMContentLoaded", load, { once: true });
})();