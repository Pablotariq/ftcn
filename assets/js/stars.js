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
  document.querySelectorAll(".release-title, .mixes-column a > span:first-child").forEach((title) => {
    const fullText = title.dataset.fullText || title.textContent;
    title.dataset.fullText = fullText;

    const isMixTitle = title.matches(".mixes-column a > span:first-child");
    if (isMixTitle && window.matchMedia("(max-width: 700px)").matches) {
      title.textContent = fullText;
      return;
    }

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

document.querySelectorAll(".mobile-navigation-logo").forEach((logo) => {
  logo.parentElement.href = "index.html";
});

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

/*
const setupMobileNavigation = () => {
  const navigation = document.querySelector(".mobile-navigation");

  if (!navigation) {
    return;
  }

  const toggle = document.createElement("button");
  toggle.className = "mobile-navigation-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mobile-navigation-menu");

  const logo = document.createElement("img");
  logo.src = "assets/images/ftcnlogo.png";
  logo.alt = "Open navigation";
  toggle.append(logo);
  navigation.id = "mobile-navigation-menu";
  navigation.parentElement.insertBefore(toggle, navigation);

  const activeLogo = navigation.querySelector(".mobile-navigation-logo");
  if (activeLogo) {
    const activeLink = activeLogo.parentElement;
    activeLink.textContent = activeLogo.alt;
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });
};

setupMobileNavigation();
*/
updateStars();
updateReleaseTitles();
window.addEventListener("resize", () => {
  updateStars();
  updateReleaseTitles();
});
