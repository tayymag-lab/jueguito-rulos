
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


/* ==================================
   NOVELA VISUAL — MAGGIE Y LIO
================================== */

const NovelaVisual = {

    escenas: [],
    posicion: 0,
    alTerminar: null,

    iniciar(escenas, alTerminar) {
        this.escenas = escenas;
        this.posicion = 0;
        this.alTerminar = alTerminar;
        this.mostrar();
    },

    mostrar() {
        if (this.posicion >= this.escenas.length) {
            const continuar = this.alTerminar;
            this.alTerminar = null;

            if (typeof continuar === "function") {
                continuar();
            }
            return;
        }

        const escena = this.escenas[this.posicion];

        const personajes = {
            "Maggie": "img/personajes/maggie.png",
            "Lio": "img/personajes/rulings.png"
        };

        const imagen = personajes[escena.personaje];

        Juego.mostrar(`
            <div class="novela-visual">

                <div class="novela-capitulo">
                    ✦ UN RECUERDO NUESTRO ✦
                </div>

                <div class="novela-escenario">
                    ${imagen ? `
                        <img
                            src="${imagen}"
                            alt="${escena.personaje}"
                            class="novela-personaje"
                        >
                    ` : `<div class="novela-simbolo">♡</div>`}
                </div>

                <div class="novela-dialogo">
                    <div class="novela-nombre">
                        ${escena.personaje}
                    </div>

                    <p>${escena.texto}</p>
                </div>

                <button onclick="NovelaVisual.siguiente()">
                    ${this.posicion === this.escenas.length - 1
                        ? "Continuar ♡"
                        : "Siguiente →"}
                </button>

                <div class="novela-progreso">
                    ${this.posicion + 1} / ${this.escenas.length}
                </div>

            </div>
        `);
    },

    siguiente() {
        this.posicion++;
        this.mostrar();
    }
};
