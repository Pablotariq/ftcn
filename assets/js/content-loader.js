const collection = document.body.dataset.cmsCollection;
const contentRoot = document.querySelector("[data-cms-content]");

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function safeMediaUrl(path) {
  if (typeof path !== "string" || !path.trim()) return null;

  try {
    const url = new URL(path, document.baseURI);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function safeExternalUrl(href) {
  if (typeof href !== "string" || !href.trim()) return null;

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function appendImage(parent, path, alt, className) {
  const src = safeMediaUrl(path);
  if (!src) return null;

  const image = createElement("img", className);
  image.src = src;
  image.alt = alt || "";
  parent.append(image);
  return image;
}

function showContentError(error) {
  console.error(`Unable to load ${collection} content.`, error);
  const notice = createElement(
    "p",
    "cms-content-error",
    "This section could not be loaded. Please try again later."
  );
  notice.setAttribute("role", "alert");
  contentRoot.before(notice);
}

function renderReleases(items) {
  contentRoot.replaceChildren();

  items.forEach((release) => {
    const link = safeExternalUrl(release.link);
    const item = createElement(link ? "a" : "div", link ? "" : "release-item");
    if (link) {
      item.href = link;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
    }

    appendImage(item, release.artwork, `${release.title || "Release"} artwork`);
    item.append(createElement("span", "release-title", release.title || ""));
    if (release.date) item.append(createElement("span", "release-date", release.date));
    contentRoot.append(item);
  });
}

function renderEvents(items) {
  const poster = document.getElementById("event-poster");
  const captionTitle = document.getElementById("event-caption-title");
  const captionTitleRest = document.getElementById("event-caption-title-rest");
  const captionMeta = document.getElementById("event-caption-meta");
  const eventList = contentRoot;
  const eventItems = [];
  let currentIndex = 0;
  let accumulatedScroll = 0;

  eventList.replaceChildren();

  function setActiveItem(item) {
    eventItems.forEach((entry) => entry.classList.toggle("active", entry === item));
    currentIndex = eventItems.indexOf(item);
    const imageUrl = safeMediaUrl(item.dataset.image);
    if (imageUrl) poster.src = imageUrl;
    poster.alt = item.dataset.title;

    const title = item.dataset.mobileTitle || item.querySelector(".event-name").textContent;
    const meta = item.dataset.mobileMeta || item.dataset.meta;
    const titleParts = title.split(": ");
    captionTitle.textContent = titleParts[0] + (titleParts.length > 1 ? ":" : "");
    captionTitleRest.textContent = titleParts.length > 1 ? titleParts.slice(1).join(": ") : "";
    captionMeta.textContent = meta;
  }

  function movePoster(direction) {
    if (!eventItems.length) return;
    const nextIndex = (currentIndex + direction + eventItems.length) % eventItems.length;
    setActiveItem(eventItems[nextIndex]);
  }

  function onPosterClick(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    movePoster(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1);
  }

  items.forEach((eventData) => {
    const item = createElement("details", "event-item");
    item.dataset.image = eventData.poster || "";
    item.dataset.title = eventData.title || "";
    item.dataset.meta = [eventData.location, eventData.date].filter(Boolean).join(" ");
    item.dataset.mobileTitle = eventData.mobileTitle || "";
    item.dataset.mobileMeta = eventData.mobileMeta || "";

    const summary = createElement("summary");
    summary.append(
      createElement("span", "event-name", eventData.title || ""),
      createElement(
        "span",
        "event-meta",
        `@ ${[eventData.location, eventData.date].filter(Boolean).join(" ")}`
      )
    );
    item.append(summary);
    eventList.append(item);
    eventItems.push(item);

    item.addEventListener("mouseenter", () => setActiveItem(item));
    item.addEventListener("focus", () => setActiveItem(item));
    item.addEventListener("click", () => setActiveItem(item));
  });

  const initialPoster = document.getElementById("event-poster");
  if (initialPoster) {
    initialPoster.addEventListener("click", onPosterClick);
    initialPoster.addEventListener("mousedown", (event) => event.preventDefault());
    initialPoster.addEventListener("selectstart", (event) => event.preventDefault());
    initialPoster.addEventListener("dragstart", (event) => event.preventDefault());
  }

  eventList.addEventListener(
    "wheel",
    (event) => {
      accumulatedScroll += event.deltaY;
      if (Math.abs(accumulatedScroll) < 200) return;
      movePoster(accumulatedScroll > 0 ? 1 : -1);
      accumulatedScroll = 0;
    },
    { passive: true }
  );

  if (eventItems[0]) setActiveItem(eventItems[0]);
}

function renderMerch(items) {
  contentRoot.replaceChildren();
  const urls = [];

  items.forEach((merch) => {
    const item = createElement("div", "merch-item");
    const link = safeExternalUrl(merch.link);
    const hasAlternateImage = Boolean(merch.backImage);
    const imageAlt = merch.alt || merch.title || "Merchandise";

    if (hasAlternateImage) {
      const image = createElement("div", "merch-image merch-double");
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.setAttribute("aria-pressed", "false");
      image.setAttribute("aria-label", `Show alternate image for ${merch.title || "item"}`);
      appendImage(image, merch.image, imageAlt, "merch-face merch-front");
      appendImage(image, merch.backImage, merch.backAlt || imageAlt, "merch-face merch-back");

      const merchIndex = urls.length;
      urls.push(link);
      const isDesktop = () =>
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const activate = () => {
        if (isDesktop() && urls[merchIndex]) {
          window.open(urls[merchIndex], "_blank", "noopener,noreferrer");
          return;
        }
        const isFlipped = image.classList.toggle("is-flipped");
        image.setAttribute("aria-pressed", String(isFlipped));
      };

      image.addEventListener("click", activate);
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
      item.append(image);
    } else {
      const image = createElement("img", "merch-image");
      image.src = safeMediaUrl(merch.image) || "";
      image.alt = imageAlt;
      if (link) {
        const imageLink = createElement("a", "merch-image-link");
        imageLink.href = link;
        imageLink.target = "_blank";
        imageLink.rel = "noopener noreferrer";
        imageLink.append(image);
        item.append(imageLink);
      } else {
        item.append(image);
      }
    }

    if (link) {
      const titleLink = createElement("a", "merch-title", merch.title || "");
      titleLink.href = link;
      titleLink.target = "_blank";
      titleLink.rel = "noopener noreferrer";
      item.append(titleLink);
    } else {
      item.append(createElement("span", "merch-title", merch.title || ""));
    }

    if (merch.soldOut) item.append(createElement("span", "merch-sold-out", "soldout"));
    contentRoot.append(item);
  });
}

function renderMixes(items) {
  contentRoot.replaceChildren();
  const column = createElement("div", "mixes-column");

  items.forEach((mix) => {
    const link = createElement("a");
    const href = safeExternalUrl(mix.link);
    if (href) {
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.append(
      createElement("span", "", mix.title || ""),
      createElement("b", "", "–")
    );

    const meta = createElement("span", "mix-meta");
    meta.append(
      createElement("span", "", mix.source || ""),
      createElement("time", "", mix.date || "")
    );
    link.append(meta);
    column.append(link);
  });

  contentRoot.replaceChildren(column);
}

function renderEditorial(items) {
  contentRoot.replaceChildren();

  items.forEach((entry, entryIndex) => {
    const sequence = createElement("section", "editorial-sequence");
    sequence.setAttribute("aria-label", entry.title || "Editorial scans");
    const pages = Array.isArray(entry.pages) ? entry.pages : [];
    const group = `editorial-${entryIndex}`;
    const ids = pages.map((_, pageIndex) => `${group}-${pageIndex + 1}`);

    pages.forEach((page, pageIndex) => {
      const input = createElement("input");
      input.type = "radio";
      input.name = group;
      input.id = ids[pageIndex];
      input.checked = pageIndex === 0;

      const frame = createElement("div", "editorial-frame");
      const previous = createElement("label", "editorial-prev");
      previous.htmlFor = ids[(pageIndex - 1 + pages.length) % pages.length];
      previous.setAttribute("aria-label", "Previous page");
      const next = createElement("label", "editorial-next");
      next.htmlFor = ids[(pageIndex + 1) % pages.length];
      next.setAttribute("aria-label", "Next page");

      frame.append(previous);
      appendImage(frame, page.image, page.alt || entry.title || "Editorial scan");
      frame.append(next);
      sequence.append(input, frame);
    });

    contentRoot.append(sequence);
  });
}

const renderers = {
  releases: renderReleases,
  events: renderEvents,
  merch: renderMerch,
  mixes: renderMixes,
  editorial: renderEditorial,
};

async function loadCollection() {
  if (!collection || !contentRoot || !renderers[collection]) return;

  try {
    const response = await fetch(`content/${collection}.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

    const data = await response.json();
    if (!data || !Array.isArray(data.items)) {
      throw new Error("The content file must contain an items list.");
    }

    renderers[collection](data.items);
  } catch (error) {
    showContentError(error);
  }
}

loadCollection();