document.addEventListener("click", (event) => {
  if (event.target.closest("a, button, input, textarea, select, summary, [role='button']")) {
    return;
  }

  const logo = document.createElement("img");

  logo.className = "stamped-logo";
  logo.src = "assets/images/ftcnlogo.png";
  logo.alt = "";
  logo.setAttribute("aria-hidden", "true");
  logo.style.left = `${event.clientX}px`;
  logo.style.top = `${event.clientY}px`;
  logo.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;

  document.body.appendChild(logo);
});
