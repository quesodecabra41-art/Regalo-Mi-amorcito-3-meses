let puzzleImageSrc = "https://i.imgur.com/o2u5oF8.jpeg"; 

function handleImageUpload(event) {
    const file = event.target.files[0];
    const statusEl = document.getElementById('image-status');
    
    if (file) {
        if (puzzleImageSrc.startsWith('blob:')) {
            URL.revokeObjectURL(puzzleImageSrc); 
        }
        puzzleImageSrc = URL.createObjectURL(file);
        statusEl.textContent = `(Usando: ${file.name})`;
        renderPuzzle(); 
    } else {
        puzzleImageSrc = "https://i.imgur.com/o2u5oF8.jpeg";
        statusEl.textContent = "(Usando foto por defecto)";
        renderPuzzle();
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active-section'));
    document.getElementById('jardin-secreto').style.display = 'none';
    document.getElementById('puzzle-reward').style.display = 'none';
    document.getElementById('tinta-final').style.display = 'none';
    
    document.getElementById(pageId).classList.add('active-section');
    
    const audio = document.getElementById('audio-felicidades');
    if(pageId !== 'felicidades' && pageId !== 'promesa') {
        audio.pause();
        audio.currentTime = 0;
    }

    limpiarDecoracion();
    if(pageId === 'inicio') crearDecoracion('💚', true); 
    if(pageId === 'historia') crearDecoracion('🌸');
    if(pageId === 'tiempo') crearDecoracion('💜', false, true);
    if(pageId === 'juntos') { crearDecoracion('🖤', false, false, true); renderPuzzle(); } 
    if(pageId === 'felicidades') crearDecoracion('🎉', true);
    if(pageId === 'recuerdos') crearDecoracion('💭', false, false, false);
}

let decorInterval;
function crearDecoracion(symbol, mixColors=false, purpleTheme=false, blackTheme=false) {
    decorInterval = setInterval(() => {
        const el = document.createElement('div');
        el.classList.add('floating-element');
        let content = symbol;
        if(mixColors) content = Math.random() > 0.5 ? '❤️' : symbol;
        if(purpleTheme) content = Math.random() > 0.5 ? '💜' : '🦇';
        if(blackTheme) content = Math.random() > 0.5 ? '🖤' : '🥀';
        el.textContent = content;
        el.style.left = Math.random() * 95 + 'vw'; 
        el.style.fontSize = (Math.random() * 30 + 20) + 'px';
        el.style.animationDuration = (Math.random() * 10 + 8) + 's'; 
        document.body.appendChild(el);
        setTimeout(() => { el.remove(); }, 15000);
    }, 600); 
}
function limpiarDecoracion() {
    clearInterval(decorInterval);
    document.querySelectorAll('.floating-element').forEach(el => el.remove());
}

crearDecoracion('💚', true); 

function abrirRegaloInicio() {
    document.getElementById('mensaje-oculto').style.display = 'block';
    const scrap = document.getElementById('inicio-scrapbook');
    scrap.style.display = 'flex';
    scrap.animate([{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 1000 });
}

function abrirJardin() { document.getElementById('jardin-secreto').style.display = 'flex'; }
function cerrarJardin() { document.getElementById('jardin-secreto').style.display = 'none'; }
let petalos = 0;
function quitarPetalo(el, txt) {
    el.style.opacity = '0'; el.style.pointerEvents = 'none';
    document.getElementById('flower-msg').innerText = txt;
    petalos++;
}
function clickCentroFlor() {
    document.getElementById('flower-msg').innerHTML = petalos >= 6 ? "¡TE AMO! ❤️" : "Faltan pétalos...";
}

/* LOGICA DEL ROMPECABEZAS */
const pieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let currentPieces = [...pieces].sort(() => Math.random() - 0.5);
let selectedIndex = -1;

function renderPuzzle() {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';

    // Solo mezclamos si acabamos de entrar y ya estaba resuelto (para que el usuario tenga que jugar)
    if (currentPieces.every((v, i) => v === i)) {
        // Nota: Si está resuelto al iniciar, lo mezclamos.
        // Pero si el usuario lo acaba de resolver, NO lo mezclamos aquí.
    }
    
    currentPieces.forEach((val, index) => {
        const div = document.createElement('div');
        div.classList.add('puzzle-piece');
        const x = (val % 3) * 100; const y = Math.floor(val / 3) * 100;
        
        div.style.backgroundImage = `url('${puzzleImageSrc}')`;
        div.style.backgroundPosition = `-${x}px -${y}px`;
        
        if(index === selectedIndex) div.style.border = "2px solid red";
        div.onclick = () => {
            if (selectedIndex === -1) { selectedIndex = index; renderPuzzle(); } 
            else {
                [currentPieces[index], currentPieces[selectedIndex]] = [currentPieces[selectedIndex], currentPieces[index]];
                selectedIndex = -1; 
                renderPuzzle(); // Renderizamos el movimiento
                
                // Verificamos si ganó DESPUÉS del movimiento
                checkWin();
            }
        };
        container.appendChild(div);
    });
}

function checkWin() {
    if (currentPieces.every((v, i) => v === i)) {
        // Si ganó, esperamos un poquito y mostramos el premio.
        // NO REINICIAMOS las piezas aquí.
        setTimeout(() => {
            document.getElementById('puzzle-reward').style.display = 'flex';
        }, 300);
    }
}

// Función nueva para cerrar el premio y EN ESE MOMENTO reiniciar el juego
function cerrarRecompensa() {
    document.getElementById('puzzle-reward').style.display = 'none';
    
    // Ahora sí mezclamos para la próxima vez
    currentPieces = [...pieces].sort(() => Math.random() - 0.5); 
    while(currentPieces.every((v, i) => v === i)) {
         currentPieces = [...pieces].sort(() => Math.random() - 0.5);
    }
    renderPuzzle();
}

window.onload = function() {
    // Asegurar mezcla inicial
    currentPieces = [...pieces].sort(() => Math.random() - 0.5);
    renderPuzzle();
}

function iniciarSecuenciaTinta() {
    const audio = document.getElementById('audio-felicidades');
    audio.play().catch(e => console.log("Audio autoplay prevent"));
    
    const tintaSection = document.getElementById('tinta-final');
    tintaSection.style.display = 'flex';
    limpiarDecoracion();

    const frases = ["Cada sonrisa tuya...", "Ilumina mi mundo...", "Eres mi presente...", "Y quiero que seas mi futuro...", "Felices 3 meses amor."];
    let i = 0;
    document.getElementById('lyrics-box').innerText = "";
    document.getElementById('final-msg').style.opacity = '0';

    const interval = setInterval(() => {
        if(i >= frases.length) {
            clearInterval(interval);
            document.getElementById('lyrics-box').innerText = "";
            document.getElementById('final-msg').style.opacity = '1';
            return;
        }
        document.getElementById('lyrics-box').innerText = frases[i];
        const petalo = document.createElement('div');
        petalo.classList.add('tulip-petal');
        petalo.style.left = Math.random() * 90 + 5 + 'vw';
        petalo.animate([ { transform: 'translateY(0) rotate(0deg)', opacity: 1 }, { transform: 'translateY(110vh) rotate(360deg)', opacity: 0.5 } ], { duration: 4000, easing: 'ease-in' });
        tintaSection.appendChild(petalo);
        setTimeout(() => petalo.remove(), 4000);
        i++;
    }, 3000);
}

function cerrarTinta() {
    document.getElementById('tinta-final').style.display = 'none';
    showPage('promesa');
}

function iniciarAnimacionFelicidades() {
    const audio = document.getElementById('audio-felicidades');
    audio.play().catch(e => console.log("Audio autoplay prevented.")); 
    
    const textBox = document.getElementById('texto-final-animado');
    const frases = [
        "En estos 3 meses...", "Me has enseñado lo que es amar.",
        "Gracias por cada instante.", "Vamos por más recuerdos juntos...",
        "Te amo con todo mi corazón."
    ];
    let i = 0;
    textBox.style.opacity = 1;
    document.querySelector('.play-btn').style.display = 'none';
    const intervalo = setInterval(() => {
        if(i >= frases.length) { clearInterval(intervalo); return; }
        textBox.innerText = frases[i];
        const heart = document.createElement('div');
        heart.innerHTML = '❤️'; heart.style.position = 'fixed';
        heart.style.left = '50%'; heart.style.top = '50%'; heart.style.fontSize = '50px';
        heart.style.animation = 'floatAround 3s ease-out';
        document.getElementById('felicidades').appendChild(heart);
        setTimeout(()=>heart.remove(), 3000);
        i++;
    }, 3000);
}
