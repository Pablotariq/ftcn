const updateStars = () => {
  const isTwoThirdsWidth = window.innerWidth <= window.screen.availWidth * (2 / 3);
  const heading = document.querySelector("h1");
  const groups = [...document.querySelectorAll(".nav-stars")];

  if (!heading || groups.length === 0) {
    return;
  }

  document.body.classList.remove("is-two-thirds-width");

  const stars = groups.map((group) => [...group.querySelectorAll("span")]);

  stars.flat().forEach((star) => {
    star.classList.remove("is-hidden");
  });

  const viewportRatio = window.innerWidth / window.screen.availWidth;
  let visibleStars = 1;

  if (viewportRatio > 0.95) {
    visibleStars = 5;
  } else if (viewportRatio > 0.90) {
    visibleStars = 4;
  } else if (viewportRatio > 0.85) {
    visibleStars = 3;
  } else if (viewportRatio > 0.65) {
    visibleStars = 2;
  }

  stars.forEach((group) => {
    group
      .slice(visibleStars)
      .forEach((star) => star.classList.add("is-hidden"));
  });

  document.body.classList.toggle("is-two-thirds-width", isTwoThirdsWidth);
};

const updateReleaseTitles = () => {
  document.querySelectorAll(".release-title").forEach((title) => {
    const fullText = title.dataset.fullText || title.textContent;
    title.dataset.fullText = fullText;

    const availableWidth = title.getBoundingClientRect().width;
    const measure = title.cloneNode();
    measure.textContent = fullText;
    measure.style.cssText = `
      position: absolute;
      width: max-content;
      visibility: hidden;
      white-space: nowrap;
    `;
    document.body.append(measure);

    if (measure.getBoundingClientRect().width <= availableWidth) {
      title.textContent = fullText;
      measure.remove();
      return;
    }

    const characters = [...fullText];
    let low = 0;
    let high = characters.length;

    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      measure.textContent = `${characters.slice(0, middle).join("")}...`;

      if (measure.getBoundingClientRect().width <= availableWidth) {
        low = middle;
      } else {
        high = middle - 1;
      }
    }

    title.textContent = `${characters.slice(0, low).join("")}...`;
    measure.remove();
  });
};

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("h1 a").forEach((link) => {
  const linkPage = link.href.startsWith("mailto:")
    ? "contact.html"
    : new URL(link.href).pathname.split("/").pop();

  if (linkPage === currentPage) {
    const logo = document.createElement("img");
    logo.className = "nav-logo";
    logo.src = "assets/images/ftcnlogo.png";
    logo.alt = link.textContent.trim();
    link.classList.add("logo-link");
    link.href = "index.html";
    link.replaceChildren(logo);
  }
});

document.querySelectorAll("h1 a:not(.logo-link)").forEach((link) => {
  const label = link.textContent;
  const letters = [...label].map((character) => {
    const letter = document.createElement("span");
    letter.className = "header-scrambled-letter";
    letter.textContent = character;
    return letter;
  });

  link.replaceChildren(...letters);
});

const createMobileHeader = () => {
  const header = document.createElement("header");
  header.className = "mobile-header";

  const toggle = document.createElement("button");
  toggle.className = "mobile-header-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mobile-navigation");

  const logo = document.createElement("img");
  logo.src = "assets/images/ftcnlogo.png";
  logo.alt = "Open navigation";
  toggle.append(logo);

  const navigation = document.createElement("nav");
  navigation.id = "mobile-navigation";
  navigation.className = "mobile-navigation";
  navigation.setAttribute("aria-label", "Main navigation");

  const links = [...document.querySelectorAll("h1 a")];
  const pageLinks = links
    .filter((link) => !link.classList.contains("logo-link"))
    .map((link) => ({
      href: link.href,
      label: link.textContent.trim(),
    }));

  if (currentPage !== "index.html") {
    pageLinks.push({
      href: `${currentPage}`,
      label: currentPage.replace(".html", ""),
    });
  }

  pageLinks.forEach(({ href, label }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    navigation.append(link);
  });

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });

  header.append(toggle, navigation);
  document.body.prepend(header);
};

createMobileHeader();
updateStars();
updateReleaseTitles();
window.addEventListener("resize", () => {
  updateStars();
  updateReleaseTitles();
});
