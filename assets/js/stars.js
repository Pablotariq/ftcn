const updateReleaseTitles = () => {
  document.querySelectorAll(".release-title, .mixes-column a > span:first-child").forEach((title) => {
    const fullText = title.dataset.fullText || title.textContent;
    title.dataset.fullText = fullText;

    const isMixTitle = title.matches(".mixes-column a > span:first-child");
    if (isMixTitle && window.matchMedia("(max-width: 900px)").matches) {
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

const orderDesktopNavigation = () => {
  const heading = document.querySelector("body > h1");
  if (!heading) return;

  const linksByPage = new Map(
    [...heading.querySelectorAll("a")].map((link) => {
      const page = link.href.startsWith("mailto:")
        ? "contact.html"
        : new URL(link.href).pathname.split("/").pop();
      return [page, link];
    }),
  );
  const stars = [...heading.querySelectorAll(".nav-stars")];
  const order = [
    "about.html",
    "releases.html",
    "eventos.html",
    "mixes.html",
    "editorial.html",
    "merch.html",
    "contact.html",
  ];

  if (order.some((page) => !linksByPage.has(page)) || stars.length < order.length - 1) {
    return;
  }

  heading.replaceChildren();
  order.forEach((page, index) => {
    heading.append(linksByPage.get(page));
    if (index < stars.length) {
      heading.append(" / ", stars[index], " / ");
    }
  });
};

const currentPage = window.location.pathname.split("/").pop() || "index.html";

orderDesktopNavigation();

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
updateReleaseTitles();
window.addEventListener("resize", () => {
  updateReleaseTitles();
});
