
/* MINIJUEGO 01 — MEMORIAS DE NOSOTROS */

const MemoriaNosotros = {
    cartas: [],
    seleccionadas: [],
    encontradas: 0,
    movimientos: 0,
    bloqueado: false,
    espera: null,

    iniciar() {
        this.limpiar();

        const simbolos = ["🌙", "🍔", "💗", "🎮", "🌿", "⭐"];

        this.cartas = [...simbolos, ...simbolos];

        for (let i = this.cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[j]] =
                [this.cartas[j], this.cartas[i]];
        }

        this.seleccionadas = [];
        this.encontradas = 0;
        this.movimientos = 0;
        this.bloqueado = false;

        Juego.mostrar(`
            <div class="corazon">🎴</div>
            <h1>Memorias de nosotros</h1>

            <div class="subtitulo">
                Cada recuerdo tiene su pareja.
                <br>
                ¿Podés encontrarlas todas?
            </div>

            <div class="memoria-estado" id="memoria-estado">
                Parejas: 0/6 · Movimientos: 0
            </div>

            <div class="memoria-tablero">
                ${this.cartas.map((_, i) => `
                    <button
                        class="memoria-carta"
                        id="memoria-${i}"
                        onclick="MemoriaNosotros.voltear(${i})"
                        aria-label="Carta ${i + 1}, boca abajo"
                    >♡</button>
                `).join("")}
            </div>

            <button onclick="MemoriaNosotros.iniciar()">
                Mezclar de nuevo ♡
            </button>

            <button onclick="MemoriaNosotros.salir()">
                Volver al menú
            </button>
        `);
    },

    voltear(indice) {
        if (this.bloqueado) return;

        const carta = document.getElementById("memoria-" + indice);
        if (!carta || carta.disabled ||
            this.seleccionadas.includes(indice)) return;

        carta.textContent = this.cartas[indice];
        carta.classList.add("abierta");
        carta.setAttribute("aria-label",
            "Carta " + (indice + 1) + ": " + this.cartas[indice]);

        this.seleccionadas.push(indice);

        if (this.seleccionadas.length !== 2) return;

        this.movimientos++;
        this.bloqueado = true;

        const [a, b] = this.seleccionadas;

        if (this.cartas[a] === this.cartas[b]) {
            document.getElementById("memoria-" + a)
                .classList.add("encontrada");
            document.getElementById("memoria-" + b)
                .classList.add("encontrada");

            document.getElementById("memoria-" + a).disabled = true;
            document.getElementById("memoria-" + b).disabled = true;

            this.encontradas++;
            this.seleccionadas = [];
            this.bloqueado = false;

            this.actualizarEstado();

            if (this.encontradas === 6) {
                this.ganar();
            }
        } else {
            this.actualizarEstado();

            this.espera = setTimeout(() => {
                [a, b].forEach(i => {
                    const elemento =
                        document.getElementById("memoria-" + i);

                    if (elemento) {
                        elemento.textContent = "♡";
                        elemento.classList.remove("abierta");
                        elemento.setAttribute(
                            "aria-label",
                            "Carta " + (i + 1) + ", boca abajo"
                        );
                    }
                });

                this.seleccionadas = [];
                this.bloqueado = false;
                this.espera = null;
            }, 850);
        }
    },

    actualizarEstado() {
        const estado = document.getElementById("memoria-estado");

        if (estado) {
            estado.textContent =
                `Parejas: ${this.encontradas}/6 · ` +
                `Movimientos: ${this.movimientos}`;
        }
    },

    limpiar() {
        if (this.espera !== null) {
            clearTimeout(this.espera);
            this.espera = null;
        }
    },

    salir() {
        this.limpiar();
        menuNiveles();
    },

    ganar() {
        this.limpiar();
        Juego.celebrar();

        Juego.mostrar(`
            <div class="corazon">🏆</div>
            <h1>¡Memoria perfecta!</h1>

            <div class="subtitulo">
                Encontraste nuestros seis recuerdos.
                <br><br>
                Terminaste en ${this.movimientos} movimientos.
                <br><br>
                Parece que alguien sí tiene
                buena memoria por acá...
                <br><br>
                No como cierta persona
                que se olvidó de mi nombre.
                JAJAJA. ♡
            </div>

            <button onclick="finalPregunta()">
                Reclamar recompensa ♡
            </button>
        `);
    }
};


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


/* MINIJUEGO 03 — EL CAMINO HACIA VOS */

const LaberintoAmor = {
    mapa: [
        "#########",
        "#S..#...#",
        "#.#.#.#.#",
        "#.#...#.#",
        "#.###.#.#",
        "#...#...#",
        "###.#.###",
        "#.....E.#",
        "#########"
    ],

    x: 1,
    y: 1,
    pasos: 0,
    completado: false,

    iniciar() {
        this.x = 1;
        this.y = 1;
        this.pasos = 0;
        this.completado = false;

        Juego.mostrar(`
            <div class="corazon">🌿</div>
            <h1>El camino hacia vos</h1>

            <div class="subtitulo">
                Hay recuerdos que vale la pena encontrar.
                <br><br>
                Guiá a Rulings por el laberinto
                hasta llegar al corazón.
            </div>

            <div class="laberinto">
                <div class="laberinto-tablero"
                     id="laberinto-tablero"></div>

                <div class="laberinto-estado"
                     id="laberinto-estado">
                    Pasos: 0
                </div>

                <div class="laberinto-controles">
                    <button onclick="LaberintoAmor.mover(0,-1)"
                            aria-label="Arriba">↑</button>

                    <div class="laberinto-fila">
                        <button onclick="LaberintoAmor.mover(-1,0)"
                                aria-label="Izquierda">←</button>
                        <button onclick="LaberintoAmor.mover(0,1)"
                                aria-label="Abajo">↓</button>
                        <button onclick="LaberintoAmor.mover(1,0)"
                                aria-label="Derecha">→</button>
                    </div>
                </div>
            </div>

            <button onclick="LaberintoAmor.iniciar()">
                Reiniciar laberinto
            </button>

            <button onclick="menuNiveles()">
                Volver al menú
            </button>
        `);

        this.dibujar();
    },

    dibujar() {
        const tablero =
            document.getElementById("laberinto-tablero");

        if (!tablero) return;

        tablero.innerHTML = this.mapa.map((fila, y) =>
            [...fila].map((celda, x) => {
                let clase = "laberinto-celda";
                let contenido = "";

                if (celda === "#") {
                    clase += " laberinto-pared";
                    contenido = "🌿";
                }

                if (celda === "E") {
                    clase += " laberinto-meta";
                    contenido = "💗";
                }

                if (this.x === x && this.y === y) {
                    clase += " laberinto-jugador";
                    contenido = "🧑🏻‍🦱";
                }

                return `<div class="${clase}">${contenido}</div>`;
            }).join("")
        ).join("");

        const estado =
            document.getElementById("laberinto-estado");

        if (estado) {
            estado.textContent = `Pasos: ${this.pasos}`;
        }
    },

    mover(dx, dy) {
        if (this.completado) return;

        const nuevoX = this.x + dx;
        const nuevoY = this.y + dy;

        const fila = this.mapa[nuevoY];

        if (!fila || !fila[nuevoX] ||
            fila[nuevoX] === "#") return;

        this.x = nuevoX;
        this.y = nuevoY;
        this.pasos++;

        if (fila[nuevoX] === "E") {
            this.completado = true;
            this.ganar();
            return;
        }

        this.dibujar();
    },

    ganar() {
        Juego.celebrar();

        Juego.mostrar(`
            <div class="corazon">💗</div>
            <h1>¡Encontraste el camino!</h1>

            <div class="subtitulo">
                Después de ${this.pasos} pasos,
                llegaste al corazón.
                <br><br>
                Como aquella vez en la
                Reserva Ecológica de Palermo.
                <br><br>
                Hay momentos que no necesitan
                repetirse para ser inolvidables.
                ♡
            </div>

            <button onclick="final03()">
                Desbloquear el siguiente recuerdo ♡
            </button>
        `);
    }
};


/* MINIJUEGO 04 — ESCRITO EN LAS ESTRELLAS */

const ConstelacionAmor = {
    secuencia: [],
    respuesta: 0,
    ronda: 0,
    maxRondas: 8,
    mostrando: false,
    activo: false,
    temporizadores: [],
    generacion: 0,

    
posiciones: [
    [50, 22],
    [39, 11],
    [28, 12],
    [18, 23],
    [16, 39],
    [22, 54],
    [33, 68],
    [50, 87],
    [67, 68],
    [78, 54],
    [84, 39],
    [82, 23],
    [72, 12],
    [61, 11]
],

    iniciar() {
        this.limpiar();

        this.secuencia = [];
        this.respuesta = 0;
        this.ronda = 0;
        this.activo = true;

        Juego.mostrar(`
            <div class="corazon">✨</div>
            <h1>Nuestra constelación</h1>

            <div class="subtitulo">
                Hay miles de estrellas en el cielo...
                <br><br>
                Pero algunas coincidencias
                parecen escritas para nosotros.
                <br><br>
                Observá las estrellas que se iluminan
                y repetí su secuencia.
            </div>

            <div class="constelacion">
                <div class="constelacion-progreso"
                     id="constelacion-progreso"></div>

                <div class="constelacion-cielo"
                     id="constelacion-cielo">

                    ${this.posiciones.map((pos, i) => `
                        <button
                            class="constelacion-estrella"
                            id="estrella-${i}"
                            style="left:${pos[0]}%;top:${pos[1]}%"
                            onclick="ConstelacionAmor.tocar(${i})"
                            aria-label="Estrella ${i + 1}"
                            disabled
                        >✦</button>
                    `).join("")}

                </div>

                <div class="constelacion-estado"
                     id="constelacion-estado">
                    Preparando las estrellas...
                </div>

                <button id="constelacion-accion"
                        onclick="ConstelacionAmor.siguienteRonda()">
                    Comenzar desafío ♡
                </button>

                <button onclick="ConstelacionAmor.salir()">
                    Volver al menú
                </button>
            </div>
        `);

        this.actualizarProgreso();
    },

    programar(funcion, retraso) {
        const version = this.generacion;

        const id = setTimeout(() => {
            if (version !== this.generacion || !this.activo) {
                return;
            }

            funcion();
        }, retraso);

        this.temporizadores.push(id);
    },

    limpiar() {
        this.generacion++;

        this.temporizadores.forEach(id => clearTimeout(id));
        this.temporizadores = [];

        this.activo = false;
        this.mostrando = false;
    },

    mensaje(texto) {
        const elemento =
            document.getElementById("constelacion-estado");

        if (elemento) elemento.textContent = texto;
    },

    boton(texto, visible, funcion) {
        const boton =
            document.getElementById("constelacion-accion");

        if (!boton) return;

        boton.textContent = texto;
        boton.style.display = visible ? "block" : "none";

        if (funcion) {
            boton.onclick = funcion;
        }
    },

    habilitarEstrellas(habilitar) {
        this.posiciones.forEach((_, i) => {
            const estrella =
                document.getElementById("estrella-" + i);

            if (estrella) estrella.disabled = !habilitar;
        });
    },

    iluminar(indice, duracion = 500) {
        const estrella =
            document.getElementById("estrella-" + indice);

        if (!estrella) return;

        estrella.classList.add("iluminada");

        this.programar(() => {
            estrella.classList.remove("iluminada");
        }, duracion);
    },

    actualizarProgreso() {
        const progreso =
            document.getElementById("constelacion-progreso");

        if (!progreso) return;

        progreso.innerHTML = Array.from(
            { length: this.maxRondas },
            (_, i) => `
                <span class="constelacion-punto
                    ${i < this.ronda - 1 ? "completo" : ""}">
                </span>
            `
        ).join("");
    },

    siguienteRonda() {
        if (!this.activo || this.mostrando) return;
        if (this.ronda >= this.maxRondas) return;

        this.ronda++;
        this.respuesta = 0;

        const nuevaEstrella =
            Math.floor(Math.random() * this.posiciones.length);

        this.secuencia.push(nuevaEstrella);

        this.actualizarProgreso();
        this.mostrarSecuencia();
    },

    mostrarSecuencia() {
        if (!this.activo) return;

        this.mostrando = true;
        this.respuesta = 0;

        this.habilitarEstrellas(false);
        this.boton("", false);

        this.mensaje(
            "Ronda " + this.ronda + "/" + this.maxRondas +
            " · ¡Memorizá las estrellas!"
        );

        const intervalo = 850;

        this.secuencia.forEach((indice, i) => {
            this.programar(() => {
                this.iluminar(indice, 500);
            }, 700 + i * intervalo);
        });

        this.programar(() => {
            this.mostrando = false;
            this.habilitarEstrellas(true);
            this.mensaje("¡Tu turno! Repetí la secuencia ♡");
        }, 700 + this.secuencia.length * intervalo);
    },

    tocar(indice) {
        if (!this.activo || this.mostrando) return;

        this.iluminar(indice, 250);

        if (indice !== this.secuencia[this.respuesta]) {
            this.error();
            return;
        }

        this.respuesta++;

        if (this.respuesta === this.secuencia.length) {
            this.acierto();
        } else {
            this.mensaje(
                "¡Bien! " + this.respuesta + "/" +
                this.secuencia.length + " estrellas ♡"
            );
        }
    },

    error() {
        this.mostrando = true;
        this.habilitarEstrellas(false);

        this.mensaje(
            "¡Ups! Una estrella se escapó. " +
            "Podés intentar esta ronda otra vez ♡"
        );

        this.boton("Volver a observar ✨", true, () => {
            this.mostrarSecuencia();
        });
    },

    acierto() {
        this.mostrando = true;
        this.habilitarEstrellas(false);

        if (this.ronda >= this.maxRondas) {
            this.ganar();
            return;
        }

        this.mostrando = false;

        this.mensaje(
            "¡Perfecto! Completaste la ronda " +
            this.ronda + " ♡"
        );

        this.boton("Siguiente constelación ✦", true, () => {
            this.siguienteRonda();
        });
    },

    ganar() {
        this.limpiar();
        Juego.celebrar();

        Juego.mostrar(`
            <div class="corazon">💗</div>
            <h1>Escrito en las estrellas</h1>

            <div class="subtitulo">
                ¡Completaste nuestra constelación!
                <br><br>
                Entre millones de personas,
                caminos y casualidades...
                <br><br>
                Qué suerte que nuestros caminos
                se hayan cruzado.
                <br><br>
                Y si pudiera elegir otra vez,
                me gustaría volver a encontrarte.
                ♡
                <br><br>
                Hay un último regalo
                esperando por vos.
            </div>

            <button onclick="abrirCarta04()">
                💌 Abrir mi carta para vos
            </button>
        `);
    },

    salir() {
        this.limpiar();
        menuNiveles();
    }
};
