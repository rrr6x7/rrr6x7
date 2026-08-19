const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const planner = document.getElementById("planner");
const dialog = document.getElementById("escapeDialog");
const dialogClose = document.getElementById("dialogClose");
const dialogCopy = document.getElementById("dialogCopy");
const enquiryForm = document.getElementById("enquiryForm");
const newsletterForm = document.getElementById("newsletterForm");
const toast = document.getElementById("toast");
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
};

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 60);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenu.classList.remove("open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  mobileMenu.setAttribute("aria-hidden", String(!willOpen));
  mobileMenu.inert = !willOpen;
  mobileMenu.classList.toggle("open", willOpen);
  header.classList.toggle("menu-active", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${(index % 3) * 60}ms`;
  revealObserver.observe(element);
});

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".stay-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    cards.forEach((card) => {
      card.classList.toggle("filtered-out", filter !== "all" && card.dataset.region !== filter);
    });
  });
});

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = !button.classList.contains("saved");
    button.classList.toggle("saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));
    const stayName = button.getAttribute("aria-label").replace("Save ", "");
    showToast(isSaved ? `${stayName} added to your places` : `${stayName} removed from your places`);
  });
});

const openDialog = (copy) => {
  if (copy) dialogCopy.textContent = copy;
  if (typeof dialog.showModal === "function") dialog.showModal();
};

planner.addEventListener("submit", (event) => {
  event.preventDefault();
  const destination = document.getElementById("destination").value;
  const travellers = document.getElementById("travellers").value;
  const dateValue = document.getElementById("travelDate").value;
  const date = dateValue
    ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(`${dateValue}T12:00:00`),
      )
    : "whenever the moment feels right";
  openDialog(`A journey for ${travellers.toLowerCase()}, exploring ${destination.toLowerCase()} from ${date}. We’ll curate a soulful shortlist and send it within 24 hours.`);
});

document.querySelectorAll(".card-link").forEach((button) => {
  button.addEventListener("click", () => {
    openDialog(`${button.dataset.stay} is a special one. Share your email and we’ll send availability, thoughtful details, and a few local secrets.`);
  });
});

dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside =
    event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("enquiryEmail").value.trim();
  dialog.close();
  enquiryForm.reset();
  showToast(`Beautiful possibilities are heading to ${email}`);
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("email");
  const note = document.getElementById("formNote");
  note.textContent = `You're on the list. Our next field note will find you at ${input.value.trim()}.`;
  note.classList.add("success");
  input.value = "";
});

const minimumDate = new Date();
minimumDate.setDate(minimumDate.getDate() + 1);
document.getElementById("travelDate").min = minimumDate.toISOString().split("T")[0];
