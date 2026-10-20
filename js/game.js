
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


/* =====================================
   NOVELA VISUAL — MAGGIE Y LIO
===================================== */

const NovelaVisual = {

    escenas: [],
    posicion: 0,
    alTerminar: null,

    temporizador: null,
    escribiendo: false,
    textoCompleto: "",
    caracteres: 0,

    iniciar(escenas, alTerminar) {
        this.detenerTexto();

        this.escenas = escenas;
        this.posicion = 0;
        this.alTerminar = alTerminar;

        this.mostrar();
    },

    mostrar() {
        this.detenerTexto();

        if (this.posicion >= this.escenas.length) {
            const continuar = this.alTerminar;
            this.alTerminar = null;

            if (typeof continuar === "function") {
                continuar();
            }

            return;
        }

        const escena = this.escenas[this.posicion];

        const hablaMaggie = escena.personaje === "Maggie";
        const hablaLio = escena.personaje === "Lio";

        Juego.mostrar(`
            <div class="novela-visual">

                <div class="novela-capitulo">
                    ✦ UN RECUERDO NUESTRO ✦
                </div>

                <div class="novela-escenario novela-escenario-doble">

                    <div class="novela-figura
                        ${hablaMaggie ? "novela-activo" : "novela-inactivo"}">

                        <img
                            src="img/personajes/maggie.png"
                            alt="Maggie"
                        >

                        <span>Maggie</span>
                    </div>

                    <div class="novela-corazon-centro">
                        ♡
                    </div>

                    <div class="novela-figura
                        ${hablaLio ? "novela-activo" : "novela-inactivo"}">

                        <img
                            src="img/personajes/rulings.png"
                            alt="Lio"
                        >

                        <span>Lio</span>
                    </div>

                </div>

                <div class="novela-dialogo">

                    <div class="novela-nombre">
                        ${escena.personaje}
                    </div>

                    <p id="novela-texto"></p>

                    <div class="novela-indicador">
                        ▼
                    </div>

                </div>

                <button
                    id="novela-boton"
                    onclick="NovelaVisual.avanzar()"
                >
                    Continuar ♡
                </button>

                <div class="novela-progreso">
                    ${this.posicion + 1} / ${this.escenas.length}
                </div>

            </div>
        `);

        this.escribir(escena.texto);
    },

    escribir(texto) {
        this.detenerTexto();

        this.textoCompleto = texto;
        this.caracteres = 0;
        this.escribiendo = true;

        const elemento = document.getElementById("novela-texto");
        const boton = document.getElementById("novela-boton");

        if (!elemento || !boton) return;

        boton.textContent = "Mostrar todo ↓";

        this.temporizador = setInterval(() => {

            const textoElemento =
                document.getElementById("novela-texto");

            if (!textoElemento) {
                this.detenerTexto();
                return;
            }

            this.caracteres++;

            textoElemento.textContent =
                this.textoCompleto.slice(0, this.caracteres);

            if (this.caracteres >= this.textoCompleto.length) {
                this.detenerTexto();

                const botonActual =
                    document.getElementById("novela-boton");

                if (botonActual) {
                    botonActual.textContent =
                        this.posicion === this.escenas.length - 1
                            ? "Terminar escena ♡"
                            : "Siguiente →";
                }
            }

        }, 32);
    },

    detenerTexto() {
        if (this.temporizador !== null) {
            clearInterval(this.temporizador);
            this.temporizador = null;
        }

        this.escribiendo = false;
    },

    completarTexto() {
        this.detenerTexto();

        const elemento = document.getElementById("novela-texto");
        const boton = document.getElementById("novela-boton");

        if (elemento) {
            elemento.textContent = this.textoCompleto;
        }

        if (boton) {
            boton.textContent =
                this.posicion === this.escenas.length - 1
                    ? "Terminar escena ♡"
                    : "Siguiente →";
        }
    },

    avanzar() {
        if (this.escribiendo) {
            this.completarTexto();
            return;
        }

        this.posicion++;
        this.mostrar();
    },

    siguiente() {
        this.avanzar();
    }
};
