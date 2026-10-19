
/* Nuestro universo — Maggie × Rulings */

const Juego = {
    pantalla: null,

    iniciar() {
        this.pantalla = document.querySelector(".contenedor");
    },

    mostrar(contenido) {
        if (!this.pantalla) this.iniciar();
        if (!this.pantalla) return;

        this.pantalla.classList.remove("escena-visible");

this.pantalla.innerHTML = contenido;

void this.pantalla.offsetWidth;

this.pantalla.classList.add("escena-visible");
    },

    celebrar() {
        const contenedor = document.createElement("div");
        contenedor.className = "celebracion";
        contenedor.setAttribute("aria-hidden", "true");

        for (let i = 0; i < 18; i++) {
            const corazon = document.createElement("span");
            corazon.textContent = ["♡", "✦", "♥"][i % 3];
            corazon.style.left = Math.random() * 100 + "%";
            corazon.style.animationDelay = Math.random() * 1.2 + "s";
            corazon.style.fontSize = (14 + Math.random() * 18) + "px";
            contenedor.appendChild(corazon);
        }

        document.body.appendChild(contenedor);

        setTimeout(() => contenedor.remove(), 4000);
    }
};

document.addEventListener("DOMContentLoaded", () => Juego.iniciar());
