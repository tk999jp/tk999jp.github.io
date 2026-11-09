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
  function markdownLinkUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
    } catch { return ""; }
  }
  function appendInlineMarkdown(parent, text) {
    const source = String(text ?? "");
    const tokenPattern = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
    let offset = 0;
    let match;
    while ((match = tokenPattern.exec(source)) !== null) {
      if (match.index > offset) parent.appendChild(document.createTextNode(source.slice(offset, match.index)));
      const token = match[0];
      const escaped = match.index > 0 && source[match.index - 1] === "\\";
      const imageSyntax = !match[1] && !match[2] && match.index > 0 && source[match.index - 1] === "!";
      if (escaped || imageSyntax) {
        parent.appendChild(document.createTextNode(token));
      } else if (match[1] !== undefined) {
        const strong = document.createElement("strong");
        appendInlineMarkdown(strong, match[1]);
        parent.appendChild(strong);
      } else if (match[2] !== undefined) {
        const code = document.createElement("code");
        code.textContent = match[2];
        parent.appendChild(code);
      } else {
        const href = markdownLinkUrl(match[4]);
        if (!href) {
          parent.appendChild(document.createTextNode(token));
        } else {
          const link = document.createElement("a");
          link.href = href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          appendInlineMarkdown(link, match[3]);
          parent.appendChild(link);
        }
      }
      offset = match.index + token.length;
    }
    if (offset < source.length) parent.appendChild(document.createTextNode(source.slice(offset)));
  }
  function splitTableCells(line) {
    let source = String(line ?? "").trim();
    if (source.startsWith("|")) source = source.slice(1);
    if (source.endsWith("|") && !source.endsWith("\\|")) source = source.slice(0, -1);
    const cells = [];
    let cell = "";
    let inCode = false;
    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (character === "`" && (index === 0 || source[index - 1] !== "\\")) inCode = !inCode;
      if (character === "|" && !inCode && (index === 0 || source[index - 1] !== "\\")) {
        cells.push(cell.trim().replace(/\\\|/g, "|"));
        cell = "";
      } else {
        cell += character;
      }
    }
    cells.push(cell.trim().replace(/\\\|/g, "|"));
    return cells;
  }
  function isTableDelimiter(line) {
    const cells = splitTableCells(line);
    return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  }
  function getListItem(line) {
    const unordered = /^\s*[-*]\s+(.+)$/.exec(line);
    if (unordered) return { type: "ul", text: unordered[1] };
    const ordered = /^\s*(\d+)\.\s+(.+)$/.exec(line);
    return ordered ? { type: "ol", text: ordered[2], start: Number(ordered[1]) } : null;
  }
  function renderTable(container, lines, startIndex) {
    const headers = splitTableCells(lines[startIndex]);
    const table = document.createElement("table");
    table.className = "midfd-release-history-table";
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headers.forEach((headerText) => {
      const cell = document.createElement("th");
      cell.scope = "col";
      appendInlineMarkdown(cell, headerText);
      headerRow.appendChild(cell);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    let index = startIndex + 2;
    while (index < lines.length && lines[index].trim() !== "" && lines[index].includes("|")) {
      const cells = splitTableCells(lines[index]);
      if (isTableDelimiter(lines[index])) break;
      const normalized = cells.length > headers.length
        ? [...cells.slice(0, Math.max(0, headers.length - 1)), cells.slice(Math.max(0, headers.length - 1)).join(" | ")]
        : [...cells, ...Array(Math.max(0, headers.length - cells.length)).fill("")];
      const row = document.createElement("tr");
      normalized.slice(0, headers.length).forEach((cellText) => {
        const cell = document.createElement("td");
        appendInlineMarkdown(cell, cellText);
        row.appendChild(cell);
      });
      tbody.appendChild(row);
      index += 1;
    }
    table.appendChild(tbody);
    const wrapper = document.createElement("div");
    wrapper.className = "midfd-release-history-table-wrap";
    wrapper.appendChild(table);
    container.appendChild(wrapper);
    return index;
  }
  function renderMarkdown(container, body) {
    const lines = String(body ?? "").replace(/\r\n?/g, "\n").split("\n");
    let paragraph = [];
    const flushParagraph = () => {
      if (paragraph.length === 0) return;
      const element = document.createElement("p");
      appendInlineMarkdown(element, paragraph.join(" "));
      container.appendChild(element);
      paragraph = [];
    };
    let index = 0;
    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();
      if (!trimmed) {
        flushParagraph();
        index += 1;
        continue;
      }
      if (line.includes("|") && index + 1 < lines.length && isTableDelimiter(lines[index + 1])) {
        flushParagraph();
        index = renderTable(container, lines, index);
        continue;
      }
      const heading = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(trimmed);
      if (heading) {
        flushParagraph();
        const level = Math.min(6, heading[1].length + 2);
        const element = document.createElement(`h${level}`);
        appendInlineMarkdown(element, heading[2]);
        container.appendChild(element);
        index += 1;
        continue;
      }
      const item = getListItem(line);
      if (item) {
        flushParagraph();
        const list = document.createElement(item.type);
        if (item.type === "ol" && item.start !== 1) list.start = item.start;
        while (index < lines.length) {
          const current = getListItem(lines[index]);
          if (!current || current.type !== item.type) break;
          const listItem = document.createElement("li");
          appendInlineMarkdown(listItem, current.text);
          list.appendChild(listItem);
          index += 1;
        }
        container.appendChild(list);
        continue;
      }
      paragraph.push(trimmed);
      index += 1;
    }
    flushParagraph();
  }
  function renderNotes(container, body) {
    const text = typeof body === "string" ? body.trim() : "";
    if (!text) return;
    const notes = document.createElement("div");
    notes.className = "midfd-release-history-notes";
    renderMarkdown(notes, text);
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
