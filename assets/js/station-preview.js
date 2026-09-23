(() => {
  const triggers = [...document.querySelectorAll(".station-work-trigger")];
  if (!triggers.length) return;
  const image = document.getElementById("station-preview-image");
  const kicker = document.getElementById("station-preview-kicker");
  const title = document.getElementById("station-preview-title");
  const read = document.getElementById("station-preview-read");
  const video = document.getElementById("station-preview-video");
  const videoSeparator = video?.previousElementSibling;
  const log = document.getElementById("station-preview-log");
  const logSeparator = document.getElementById("station-preview-log-separator");
  const repository = document.getElementById("station-preview-repository");
  const repositorySeparator = document.getElementById("station-preview-repository-separator");
  const select = (trigger) => {
    triggers.forEach((item) => {
      const selected = item === trigger;
      item.setAttribute("aria-pressed", String(selected));
      item.closest(".station-work-card")?.classList.toggle("is-active", selected);
    });
    image.src = trigger.dataset.image;
    image.alt = `${trigger.dataset.title} サムネイル`;
    kicker.textContent = trigger.dataset.kicker;
    title.textContent = trigger.dataset.title;
    read.href = trigger.dataset.story;
    const videoHref = trigger.dataset.video;
    video.hidden = !videoHref;
    if (videoSeparator) videoSeparator.hidden = !videoHref;
    if (videoHref) video.href = videoHref;
    const logHref = trigger.dataset.log;
    log.hidden = !logHref;
    logSeparator.hidden = !logHref;
    if (logHref) log.href = logHref;
    const repositoryHref = trigger.dataset.repository;
    repository.hidden = !repositoryHref;
    repositorySeparator.hidden = !repositoryHref;
    if (repositoryHref) repository.href = repositoryHref;
  };
  triggers.forEach((trigger) => trigger.addEventListener("click", () => select(trigger)));
})();

(() => {
  const tabs = [...document.querySelectorAll("[data-station-tab]")];
  if (!tabs.length) return;
  const panels = {
    series: document.getElementById("station-panel-series"),
    shorts: document.getElementById("station-panel-shorts")
  };
  if (!panels.series || !panels.shorts) return;

  document.body.classList.add("station-tabs-enabled");

  const activate = (name, focus = false) => {
    if (!panels[name]) return;
    tabs.forEach((tab) => {
      const selected = tab.dataset.stationTab === name;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    Object.entries(panels).forEach(([key, panel]) => {
      panel.hidden = key !== name;
    });
  };

  const tabForHash = () => {
    if (window.location.hash === "#shorts") return "shorts";
    return "series";
  };

  activate(tabForHash());

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab.dataset.stationTab));
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      activate(tabs[next].dataset.stationTab, true);
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    if (link.hash === "#shorts") activate("shorts");
    if (link.hash === "#himadesu-series" || link.hash === "#tonari-series" || link.hash === "#station-work-preview") activate("series");
  });

  window.addEventListener("hashchange", () => activate(tabForHash()));
})();
