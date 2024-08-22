const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas para adaptarse al tamaño del dispositivo
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuración del juego
const ANCHO = canvas.width;
const ALTO = canvas.height;
const VELOCIDAD = 5;
const ALTO_OBSTACULO = 30;
const ANCHO_OBSTACULO = 50;
const ESPACIADO_OBSTACULO = 300;
const SALTO = -15;
const GRAVEDAD = 1;
const DINO_ALTO = 50;
const DINO_ANCHO = 50;
const PUNTOS_PARA_MENSAJE = 10;

let dino_x = 50;
let dino_y = ALTO - DINO_ALTO;
let gravedad_actual = 0;
let obstaculos = [];
let puntos = 0;
let mensaje_mostrado = false;

// Función para dibujar texto en el canvas
function dibujarTexto(texto, color, x, y) {
    ctx.font = '55px Arial';
    ctx.fillStyle = color;
    ctx.fillText(texto, x, y);
}

// Función para dibujar la letra 'W'
function dibujarW(x, y) {
    ctx.font = '100px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText('W', x, y);
}

// Función para crear un nuevo obstáculo
function crearObstaculo() {
    const alto = Math.floor(Math.random() * (70 - 20 + 1)) + 20;
    return [ANCHO, ALTO - alto, ANCHO_OBSTACULO, alto];
}

// Función principal del juego
function juego() {
    let corriendo = true;

    // Manejar eventos táctiles
    canvas.addEventListener('touchstart', function(event) {
        event.preventDefault();
        if (dino_y === ALTO - DINO_ALTO) {
            gravedad_actual = SALTO;
        }
    });

    // Manejar eventos de teclado
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && dino_y === ALTO - DINO_ALTO) {
            gravedad_actual = SALTO;
        }
    });

    function loop() {
        if (!corriendo) return;

        // Movimiento de obstáculos
        obstaculos.forEach(obs => obs[0] -= VELOCIDAD);
        if (obstaculos.length === 0 || obstaculos[obstaculos.length - 1][0] < ANCHO - ESPACIADO_OBSTACULO) {
            obstaculos.push(crearObstaculo());
        }
        
        // Eliminar obstáculos fuera de la pantalla
        obstaculos = obstaculos.filter(obs => obs[0] > -ANCHO_OBSTACULO);

        // Actualizar puntos
        if (obstaculos.length > 0 && obstaculos[0][0] < dino_x) {
            puntos += 1;
            obstaculos.shift();
        }

        // Mostrar mensaje "20% free" después de pasar 10 bloques
        if (puntos >= PUNTOS_PARA_MENSAJE && !mensaje_mostrado) {
            ctx.clearRect(0, 0, ANCHO, ALTO);
            dibujarTexto('20% FREE', 'white', ANCHO / 2 - 100, ALTO / 2 - 30);
            setTimeout(() => mensaje_mostrado = true, 2000);
        }

        // Movimiento del dinosaurio
        gravedad_actual += GRAVEDAD;
        dino_y += gravedad_actual;
        if (dino_y > ALTO - DINO_ALTO) {
            dino_y = ALTO - DINO_ALTO;
            gravedad_actual = 0;
        }

        // Comprobar colisiones
        for (const obs of obstaculos) {
            if (dino_x + DINO_ANCHO > obs[0] && dino_x < obs[0] + obs[2]) {
                if (dino_y + DINO_ALTO > obs[1]) {
                    ctx.clearRect(0, 0, ANCHO, ALTO);
                    dibujarTexto('¡PERDISTE!', 'white', ANCHO / 2 - 150, ALTO / 2 - 30);
                    setTimeout(() => location.reload(), 2000);
                    return;
                }
            }
        }

        // Limpiar pantalla
        ctx.clearRect(0, 0, ANCHO, ALTO);

        // Dibujar obstáculos
        ctx.fillStyle = 'gray';
        obstaculos.forEach(obs => ctx.fillRect(obs[0], obs[1], obs[2], obs[3]));

        // Dibujar la letra 'W'
        dibujarW(dino_x, dino_y);

        // Actualizar pantalla
        requestAnimationFrame(loop);
    }

    loop();
}

juego();
