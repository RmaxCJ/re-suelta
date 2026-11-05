document.addEventListener("DOMContentLoaded", () => {
  // ── 1. LIGHTBOX (Visor de imágenes) ──
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const triggers = document.querySelectorAll(".lightbox-trigger");

  // Abrir la imagen en grande al hacer clic
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      lightboxImg.src = this.src;
      lightboxImg.classList.add("lightbox-content");
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden"; // Bloquea el scroll del fondo
    });
  });

  // Función para cerrar el visor
  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto"; // Restaura el scroll
    setTimeout(() => {
      lightboxImg.src = "";
    }, 300);
  };

  // Cerrar al hacer clic en la "X"
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

  // Cerrar al hacer clic en el fondo difuminado
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Cerrar presionando la tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("active")) {
      closeLightbox();
    }
  });

  // ── 2. BRILLITOS DEL LISTÓN (Animación) ──
  const ribbon = document.querySelector(".hero-ribbon");
  const sparkleBox = document.querySelector(".ribbon-sparkles");

  if (
    ribbon &&
    sparkleBox &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const css = getComputedStyle(sparkleBox);
    const DELAY = parseFloat(css.getPropertyValue("--ribbon-delay")) || 0;
    const CYCLE = parseFloat(css.getPropertyValue("--ribbon-cycle")) || 10;
    const ENTRY = CYCLE * 0.4; // la cinta tarda el 40% del ciclo en entrar
    const COUNT = 46; // cantidad de brillitos por vuelta
    const COLORS = [
      "#F2C14E",
      "#F4B27C",
      "#E8873F",
      "#F7C5B5",
      "#9DB87A",
      "#FFE08A",
    ];

    const spawnSparkles = (startDelay) => {
      sparkleBox.replaceChildren(); // limpia los de la vuelta anterior

      for (let i = 0; i < COUNT; i++) {
        const x = Math.random(); // 0 = izquierda, 1 = derecha
        const y = 50 + (Math.random() + Math.random() - 1) * 38; // concentrados al centro
        // La cinta entra de derecha a izquierda: cada brillo aparece cuando ella pasa
        const t =
          startDelay +
          ENTRY * (1 - Math.pow(x, 1 / 2.2)) +
          Math.random() * 0.15;
        const size = 2 + Math.random() * 5;

        const s = document.createElement("i");
        if (Math.random() < 0.3) s.className = "star";
        s.style.cssText = `
          left:${x * 100}%; top:${y}%;
          width:${size}px; height:${size}px;
          background:${COLORS[(Math.random() * COLORS.length) | 0]};
          --dx:${(Math.random() - 0.5) * 24}px;
          --dy:${6 + Math.random() * 22}px;
          animation-delay:${t}s;
          animation-duration:${1.2 + Math.random() * 0.9}s;`;
        sparkleBox.appendChild(s);
      }
    };

    spawnSparkles(DELAY); // primera vuelta (con la espera inicial)

    // Al empezar cada nueva vuelta del listón, brillitos nuevos (sin espera)
    ribbon.addEventListener("animationiteration", (e) => {
      if (e.target === ribbon && e.animationName === "ribbon-enter") {
        spawnSparkles(0);
      }
    });
  }

  // ── 3. ENVÍO DE FORMULARIO A VERCEL CON SWEETALERT2 ──
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    // Estilo común de las alertas de re:suelta
    const swalBase = { background: "#faf8f4", color: "#3d3830" };
    const VERDE = "#5a6e3a";
    const MELOCOTON = "#e8a87c";

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita que la página se recargue

      const btnEnviar = document.getElementById("btnEnviar");
      const textoOriginal = btnEnviar.innerHTML;

      btnEnviar.textContent = "Enviando... 💛";
      btnEnviar.disabled = true;

      // Extraer datos y convertirlos a formato JSON
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Apuntar a la función Serverless de Vercel
      fetch("/api/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json().then((json) => {
            return { status: response.status, data: json };
          });
        })
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              ...swalBase,
              title: "¡Enviado!",
              text:
                res.data.message ||
                "Mensaje enviado con éxito. Nos pondremos en contacto pronto.",
              icon: "success",
              confirmButtonColor: VERDE,
            });
            contactForm.reset(); // Limpia los campos
          } else {
            Swal.fire({
              ...swalBase,
              title: "¡Error!",
              text: res.data.error || "Hubo un problema al enviar el mensaje.",
              icon: "error",
              confirmButtonColor: MELOCOTON,
            });
          }
        })
        .catch(() => {
          Swal.fire({
            ...swalBase,
            title: "¡Error de conexión!",
            text: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
            icon: "error",
            confirmButtonColor: MELOCOTON,
          });
        })
        .finally(() => {
          // Se ejecuta siempre al final para restaurar el botón
          btnEnviar.innerHTML = textoOriginal;
          btnEnviar.disabled = false;
        });
    });
  }
});
