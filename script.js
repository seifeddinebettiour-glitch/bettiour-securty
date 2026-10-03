const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const answer = item.querySelector(".faq-answer");
    const isActive = item.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach(other => {
      other.classList.remove("active");
      const otherAnswer = other.querySelector(".faq-answer");
      if (otherAnswer) otherAnswer.style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Invio reale del modulo tramite Formspree, senza lasciare la pagina */
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm && formSuccess) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = contactForm.querySelector(".submit-btn");
    const originalText = button.innerHTML;

    button.disabled = true;
    button.innerHTML = "Invio in corso…";
    formSuccess.className = "form-success";
    formSuccess.textContent = "";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Invio non riuscito");
      }

      formSuccess.className = "form-success success";
      formSuccess.textContent = "Richiesta inviata con successo ✓";
      contactForm.reset();
    } catch (error) {
      formSuccess.className = "form-success error";
      formSuccess.textContent = "Non è stato possibile inviare la richiesta. Riprova oppure contattaci su WhatsApp.";
    } finally {
      button.disabled = false;
      button.innerHTML = originalText;

      setTimeout(() => {
        formSuccess.className = "form-success";
        formSuccess.textContent = "";
      }, 7000);
    }
  });
}
