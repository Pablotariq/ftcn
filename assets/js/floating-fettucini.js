const fettuciniImages = [
  "images-99.jpeg",
  "images-102.jpeg",
  "images-106.jpeg",
  "images-107.jpeg",
  "images-108.jpeg",
  "images-109.jpeg",
  "images-110.jpeg",
  "images-111.jpeg",
  "images-112.jpeg",
  "images-113.jpeg",
];


const floatingImage = document.createElement("img");
let currentImage = Math.floor(Math.random() * fettuciniImages.length);

floatingImage.className = "floating-fettucini";
floatingImage.alt = "Fettucini image";
floatingImage.src = `assets/images/fettucini%20pics/${fettuciniImages[currentImage]}`;

const moveFloatingImage = () => {
  const imageWidth = floatingImage.offsetWidth;
  const imageHeight = floatingImage.offsetHeight;
  const maxX = Math.max(0, window.innerWidth - imageWidth);
  const maxY = Math.max(0, window.innerHeight - imageHeight);

  floatingImage.style.left = `${Math.random() * maxX}px`;
  floatingImage.style.top = `${Math.random() * maxY}px`;
  window.dispatchEvent(new Event("fettucini-positioned"));
};

floatingImage.addEventListener("click", () => {
  currentImage = (currentImage + 1) % fettuciniImages.length;
  floatingImage.src = `assets/images/fettucini%20pics/${fettuciniImages[currentImage]}`;
  moveFloatingImage();
});

floatingImage.addEventListener("load", moveFloatingImage, { once: true });
document.body.append(floatingImage);

if (floatingImage.complete) {
  moveFloatingImage();
}
