const galleryImages = [
  "assets/images/gallery/gallery1.jpg",
  "assets/images/gallery/gallery2.jpg",
  "assets/images/gallery/gallery3.jpg",
  "assets/images/gallery/gallery4.jpg",
  "assets/images/gallery/gallery5.jpg",
  "assets/images/gallery/gallery6.jpg",
  "assets/images/gallery/gallery7.jpg",
  "assets/images/gallery/gallery8.jpg",
  "assets/images/gallery/gallery9.jpg",
  "assets/images/gallery/gallery10.jpg",
  "assets/images/gallery/gallery11.jpg",
  "assets/images/gallery/gallery12.jpg",
  "assets/images/gallery/gallery13.jpg",
  "assets/images/gallery/gallery14.jpg",
  "assets/images/gallery/gallery15.jpg",
  "assets/images/gallery/gallery16.jpg",
  "assets/images/gallery/gallery17.jpg",
  "assets/images/gallery/gallery18.jpg",
  "assets/images/gallery/gallery19.jpg",
  "assets/images/gallery/gallery20.jpg",
  "assets/images/gallery/gallery21.jpg",
  "assets/images/gallery/gallery22.jpg",
  "assets/images/gallery/gallery23.jpg",
  "assets/images/gallery/gallery24.jpg",
  "assets/images/gallery/gallery25.jpg",
  "assets/images/gallery/gallery26.jpg",
  "assets/images/gallery/gallery27.jpg",
  "assets/images/gallery/gallery28.jpg",
  "assets/images/gallery/gallery29.jpg",
  "assets/images/gallery/gallery30.jpg",
  "assets/images/gallery/gallery31.jpg",
  "assets/images/gallery/gallery32.jpg",
  "assets/images/gallery/gallery33.jpg",
  "assets/images/gallery/gallery34.jpg",
  "assets/images/gallery/gallery35.jpg",
  "assets/images/gallery/gallery36.jpg",
  "assets/images/gallery/gallery37.jpg",
  "assets/images/gallery/gallery38.jpg",
  "assets/images/gallery/gallery39.jpg",
  "assets/images/gallery/gallery40.jpg",
  "assets/images/gallery/gallery41.jpg",
  "assets/images/gallery/gallery42.jpg",
  "assets/images/gallery/gallery43.jpg",
  "assets/images/gallery/gallery44.jpg",
  "assets/images/gallery/gallery45.jpg",
  "assets/images/gallery/gallery46.jpg",
  "assets/images/gallery/gallery47.jpg",
  "assets/images/gallery/gallery48.jpg",
  "assets/images/gallery/gallery49.jpg",
];

const galleryImage = document.createElement("img");
const gap = 20;
let currentGalleryImage = -1;
let hasPositionedGalleryImage = false;
let galleryCenter = null;
let dragState = null;
let suppressNextClick = false;
let galleryAutoCycle = true;

galleryImage.className = "homepage-gallery-image";
galleryImage.alt = "FTCN gallery";
galleryImage.draggable = false;
document.body.append(galleryImage);

const overlaps = (first, second) =>
  first.left < second.right + gap &&
  first.right + gap > second.left &&
  first.top < second.bottom + gap &&
  first.bottom + gap > second.top;

const getRandomImageIndex = () => {
  let index = currentGalleryImage;
  while (galleryImages.length > 1 && index === currentGalleryImage) {
    index = Math.floor(Math.random() * galleryImages.length);
  }
  return index;
};

const positionGalleryImage = () => {
  const imageWidth = galleryImage.offsetWidth;
  const imageHeight = galleryImage.offsetHeight;
  const avoid = [
    document.querySelector("body > h1"),
    document.querySelector(".mobile-navigation"),
    document.querySelector(".homepage-photo"),
  ]
    .filter(Boolean)
    .map((element) => element.getBoundingClientRect());

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const left = Math.random() * Math.max(0, window.innerWidth - imageWidth);
    const top = Math.random() * Math.max(0, window.innerHeight - imageHeight);
    const imageRect = {
      left,
      right: left + imageWidth,
      top,
      bottom: top + imageHeight,
    };

    if (!avoid.some((rect) => overlaps(imageRect, rect))) {
      galleryImage.style.left = `${left}px`;
      galleryImage.style.top = `${top}px`;
      galleryCenter = {
        x: left + imageWidth / 2,
        y: top + imageHeight / 2,
      };
      return;
    }
  }

  galleryImage.style.left = `${gap}px`;
  galleryImage.style.top = `${gap}px`;
  galleryCenter = {
    x: gap + imageWidth / 2,
    y: gap + imageHeight / 2,
  };
};

const keepGalleryImageCentered = () => {
  if (!galleryCenter) return;
  galleryImage.style.left = `${galleryCenter.x - galleryImage.offsetWidth / 2}px`;
  galleryImage.style.top = `${galleryCenter.y - galleryImage.offsetHeight / 2}px`;
};

const updateGalleryPosition = (left, top) => {
  const maxLeft = Math.max(0, window.innerWidth - galleryImage.offsetWidth);
  const maxTop = Math.max(0, window.innerHeight - galleryImage.offsetHeight);
  const nextLeft = Math.min(Math.max(0, left), maxLeft);
  const nextTop = Math.min(Math.max(0, top), maxTop);

  galleryImage.style.left = `${nextLeft}px`;
  galleryImage.style.top = `${nextTop}px`;
  galleryCenter = {
    x: nextLeft + galleryImage.offsetWidth / 2,
    y: nextTop + galleryImage.offsetHeight / 2,
  };
};

const showRandomGalleryImage = () => {
  currentGalleryImage = getRandomImageIndex();
  galleryImage.src = galleryImages[currentGalleryImage];
};

galleryImage.addEventListener("load", () => {
  if (!hasPositionedGalleryImage) {
    positionGalleryImage();
    hasPositionedGalleryImage = true;
  } else {
    keepGalleryImageCentered();
  }
});
galleryImage.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary) return;

  const rect = galleryImage.getBoundingClientRect();
  dragState = {
    startX: event.clientX,
    startY: event.clientY,
    startLeft: rect.left,
    startTop: rect.top,
    hasMoved: false,
  };
  galleryImage.classList.add("is-dragging");
  galleryImage.setPointerCapture(event.pointerId);
  event.stopPropagation();
});
galleryImage.addEventListener("pointermove", (event) => {
  if (!dragState || !event.isPrimary) return;

  const distanceX = event.clientX - dragState.startX;
  const distanceY = event.clientY - dragState.startY;
  if (Math.hypot(distanceX, distanceY) > 3) {
    dragState.hasMoved = true;
  }
  if (dragState.hasMoved) {
    updateGalleryPosition(
      dragState.startLeft + distanceX,
      dragState.startTop + distanceY,
    );
    event.preventDefault();
  }
});
const finishGalleryDrag = (event) => {
  if (!dragState || !event.isPrimary) return;

  suppressNextClick = dragState.hasMoved;
  dragState = null;
  galleryImage.classList.remove("is-dragging");
  if (galleryImage.hasPointerCapture(event.pointerId)) {
    galleryImage.releasePointerCapture(event.pointerId);
  }
};
galleryImage.addEventListener("pointerup", finishGalleryDrag);
galleryImage.addEventListener("pointercancel", finishGalleryDrag);
galleryImage.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (suppressNextClick) {
    suppressNextClick = false;
    return;
  }
  galleryAutoCycle = false;
  showRandomGalleryImage();
});
window.setInterval(() => {
  if (galleryAutoCycle && !dragState) {
    showRandomGalleryImage();
  }
}, 5000);
window.addEventListener("resize", () => {
  if (hasPositionedGalleryImage) {
    keepGalleryImageCentered();
  } else {
    positionGalleryImage();
  }
});
showRandomGalleryImage();
