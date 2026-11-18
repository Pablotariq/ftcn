function resolveImagePath(path, label) {
  if (typeof path !== "string" || !path.trim()) {
    throw new TypeError(`${label} must be an image path.`);
  }

  const url = new URL(path, document.baseURI);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new TypeError(`${label} must use an HTTP or HTTPS URL.`);
  }
  return url.href;
}

fetch("content/site-images.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }
    return response.json();
  })
  .then((siteImages) => {
    const homepageImage = resolveImagePath(siteImages.homepageImage, "Homepage image");
    const aboutImage = resolveImagePath(siteImages.aboutImage, "About image");
    if (!Array.isArray(siteImages.gallery) || siteImages.gallery.length === 0) {
      throw new TypeError("The camera roll must contain at least one image.");
    }
    const galleryImages = siteImages.gallery.map((item, index) =>
      resolveImagePath(item.image, `Camera-roll image ${index + 1}`)
    );

    const homepagePhoto = document.querySelector(".homepage-photo");
    if (homepagePhoto) homepagePhoto.src = homepageImage;

    const aboutPhoto = document.querySelector(".about-image");
    if (aboutPhoto) aboutPhoto.src = aboutImage;

    document.dispatchEvent(
      new CustomEvent("site-images-loaded", { detail: galleryImages })
    );
  })
  .catch((error) => {
    console.error("Unable to load site images.", error);
    const notice = document.createElement("p");
    notice.className = "cms-content-error";
    notice.setAttribute("role", "alert");
    notice.textContent = "Site images could not be loaded.";
    document.body.prepend(notice);
  });
