
/* MINIJUEGO 02 — LA DEUDA DE RULINGS */

const ArcadeRulings = {
    activo: false,
    puntos: 0,
    vidas: 3,
    tiempo: 45,
    objetivo: 100,
    jugadorX: 0,
    objetos: [],
    ultimoFrame: 0,
    ultimoObjeto: 0,
    ultimoSegundo: 0,
    animacion: null,
    campo: null,
    jugador: null,

    iniciar() {
        this.detener();

        this.puntos = 0;
        this.vidas = 3;
        this.tiempo = 45;
        this.objetos = [];
        this.ultimoFrame = 0;
        this.ultimoObjeto = 0;
        this.ultimoSegundo = 0;

        Juego.mostrar(`
            <div class="corazon">🍔</div>
            <h1>La deuda de Rulings</h1>

            <div class="subtitulo">
                ¡Tenés 45 segundos para conseguir
                el almuerzo de Maggie!
                <br>
                Atrapá comida y esquivá los
                corazones rotos.
            </div>

            <div class="arcade">
                <div class="arcade-hud">
                    <div class="arcade-dato">
                        <small>PUNTOS</small>
                        <strong id="arcade-puntos">0/100</strong>
                    </div>
                    <div class="arcade-dato">
                        <small>TIEMPO</small>
                        <strong id="arcade-tiempo">45 s</strong>
                    </div>
                    <div class="arcade-dato">
                        <small>VIDAS</small>
                        <strong id="arcade-vidas">♥♥♥</strong>
                    </div>
                </div>

                <div class="arcade-campo" id="arcade-campo">
                    <div class="arcade-jugador" id="arcade-jugador">
                        <div class="arcade-avatar">🧑🏻‍🦱</div>
                        <div class="arcade-canasta">🧺</div>
                    </div>
                </div>

                <div class="arcade-mensaje" id="arcade-mensaje">
                    ¡Atrapá las hamburguesas!
                </div>

                <div class="arcade-ayuda">
                    Deslizá el dedo para mover a Rulings ♡
                </div>

                <button onclick="ArcadeRulings.detener(); prueba02()">
                    Salir del minijuego
                </button>
            </div>
        `);

        this.campo = document.getElementById("arcade-campo");
        this.jugador = document.getElementById("arcade-jugador");

        this.jugadorX = this.campo.clientWidth / 2;
        this.moverJugador(this.jugadorX);

        this.campo.addEventListener("pointerdown", e => {
            this.moverDesdeEvento(e);
        });

        this.campo.addEventListener("pointermove", e => {
            if (e.pointerType === "mouse" && e.buttons === 0) return;
            this.moverDesdeEvento(e);
        });

        this.activo = true;
        this.animacion = requestAnimationFrame(t => this.actualizar(t));
    },

    moverDesdeEvento(evento) {
        if (!this.activo) return;

        const rect = this.campo.getBoundingClientRect();
        this.moverJugador(evento.clientX - rect.left);
    },

    moverJugador(x) {
        const ancho = this.campo.clientWidth;
        this.jugadorX = Math.max(34, Math.min(ancho - 34, x));
        this.jugador.style.left = this.jugadorX + "px";
    },

    crearObjeto() {
        const azar = Math.random();
        let tipo, emoji, puntos;

        if (azar < 0.48) {
            tipo = "hamburguesa";
            emoji = "🍔";
            puntos = 10;
        } else if (azar < 0.78) {
            tipo = "papas";
            emoji = "🍟";
            puntos = 5;
        } else if (azar < 0.94) {
            tipo = "peligro";
            emoji = "💔";
            puntos = 0;
        } else {
            tipo = "vida";
            emoji = "💗";
            puntos = 0;
        }

        const elemento = document.createElement("div");
        elemento.className = "arcade-objeto";
        elemento.textContent = emoji;

        const ancho = this.campo.clientWidth;
        const x = 20 + Math.random() * Math.max(0, ancho - 40);

        const objeto = {
            tipo,
            puntos,
            x,
            y: -40,
            velocidad: 110 + Math.random() * 75,
            elemento
        };

        this.objetos.push(objeto);
        this.campo.appendChild(elemento);
    },

    actualizar(tiempoActual) {
        if (!this.activo) return;

        if (!this.ultimoFrame) {
            this.ultimoFrame = tiempoActual;
            this.ultimoObjeto = tiempoActual;
            this.ultimoSegundo = tiempoActual;
        }

        const delta = Math.min(
            (tiempoActual - this.ultimoFrame) / 1000,
            0.05
        );

        this.ultimoFrame = tiempoActual;

        if (tiempoActual - this.ultimoObjeto >= 650) {
            this.crearObjeto();
            this.ultimoObjeto = tiempoActual;
        }

        if (tiempoActual - this.ultimoSegundo >= 1000) {
            const segundos = Math.floor(
                (tiempoActual - this.ultimoSegundo) / 1000
            );

            this.tiempo -= segundos;
            this.ultimoSegundo += segundos * 1000;

            if (this.tiempo <= 0) {
                this.tiempo = 0;
                this.terminar(false);
                return;
            }
        }

        const altura = this.campo.clientHeight;
        const zonaJugador = altura - 65;

        for (const objeto of [...this.objetos]) {
            objeto.y += objeto.velocidad * delta;

            objeto.elemento.style.transform =
                `translate(${objeto.x - 20}px, ${objeto.y}px)`;

            const distancia = Math.abs(objeto.x - this.jugadorX);

            if (
                objeto.y + 40 >= zonaJugador &&
                objeto.y <= zonaJugador + 40 &&
                distancia < 42
            ) {
                this.recoger(objeto);

                if (!this.activo) return;
            } else if (objeto.y > altura + 40) {
                this.eliminarObjeto(objeto);
            }
        }

        this.animacion = requestAnimationFrame(t => this.actualizar(t));
    },

    recoger(objeto) {
        if (objeto.tipo === "peligro") {
            this.vidas--;
            this.mensaje("¡Cuidado! Perdiste una vida 💔");
        } else if (objeto.tipo === "vida") {
            this.vidas = Math.min(3, this.vidas + 1);
            this.mensaje("¡Recuperaste un corazón! 💗");
        } else {
            this.puntos += objeto.puntos;
            this.mensaje("¡Bien! +" + objeto.puntos + " puntos ♡");
        }

        this.eliminarObjeto(objeto);
        this.actualizarHUD();

        if (this.vidas <= 0) {
            this.terminar(false);
        } else if (this.puntos >= this.objetivo) {
            this.terminar(true);
        }
    },

    eliminarObjeto(objeto) {
        objeto.elemento.remove();
        this.objetos = this.objetos.filter(o => o !== objeto);
    },

    mensaje(texto) {
        const elemento = document.getElementById("arcade-mensaje");
        if (elemento) elemento.textContent = texto;
    },

    actualizarHUD() {
        document.getElementById("arcade-puntos").textContent =
            this.puntos + "/" + this.objetivo;

        document.getElementById("arcade-tiempo").textContent =
            this.tiempo + " s";

        document.getElementById("arcade-vidas").textContent =
            "♥".repeat(Math.max(0, this.vidas));
    },

    detener() {
        this.activo = false;

        if (this.animacion !== null) {
            cancelAnimationFrame(this.animacion);
            this.animacion = null;
        }

        this.objetos.forEach(o => o.elemento.remove());
        this.objetos = [];
    },

    terminar(victoria) {
        this.detener();

        if (victoria) {
            Juego.celebrar();

            Juego.mostrar(`
                <div class="corazon">🏆</div>
                <h1>¡Deuda saldada!</h1>

                <div class="subtitulo">
                    ¡Conseguiste el almuerzo!
                    <br><br>
                    Parece que tu memoria falló,
                    pero tus reflejos no. JAJAJA.
                    <br><br>
                    Maggie consiguió su McDonald's. ♡
                </div>

                <button onclick="final02()">
                    Reclamar recompensa ♡
                </button>
            `);
        } else {
            Juego.mostrar(`
                <div class="corazon">😭</div>
                <h1>¡Otra vez, Rulings!</h1>

                <div class="subtitulo">
                    Conseguir el almuerzo
                    resultó más difícil de lo esperado.
                    <br><br>
                    Pero todavía podés intentarlo.
                    ♡
                </div>

                <button onclick="ArcadeRulings.iniciar()">
                    Reintentar misión 🍔
                </button>

                <button onclick="menuNiveles()">
                    Volver al menú
                </button>
            `);
        }
    }
};
