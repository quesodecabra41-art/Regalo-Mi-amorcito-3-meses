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
    // Decoración temática
    if(pageId === 'inicio') crearDecoracion(['💚', '✨', '🍃'], true); 
    if(pageId === 'historia') crearDecoracion(['🌸', '💌', '💖']);
    if(pageId === 'tiempo') crearDecoracion(['⏳', '💜', '🌙']);
    if(pageId === 'juntos') crearDecoracion(['🖤', '🧩', '✨']); 
    if(pageId === 'felicidades') crearDecoracion(['🎉', '🎂', '💝']);
    if(pageId === 'recuerdos') crearDecoracion(['💭', '🎵', '🥰']);
}

let decorInterval;
// Nueva función mejorada para objetos flotantes
function crearDecoracion(symbols, mixColors=false) {
    decorInterval = setInterval(() => {
        const el = document.createElement('div');
        el.classList.add('floating-element');
        
        // Elegir símbolo aleatorio
        let content = symbols[Math.floor(Math.random() * symbols.length)];
        if(mixColors && Math.random() > 0.7) content = '❤️';
        
        el.textContent = content;
        el.style.left = Math.random() * 95 + 'vw'; 
        el.style.fontSize = (Math.random() * 30 + 15) + 'px';
        
        // Movimiento lateral aleatorio
        const moveX = (Math.random() * 200 - 100) + 'px';
        el.style.setProperty('--moveX', moveX);
        
        el.style.animationDuration = (Math.random() * 10 + 10) + 's'; 
        document.body.appendChild(el);
        setTimeout(() => { el.remove(); }, 20000);
    }, 500); 
}

function limpiarDecoracion() {
    clearInterval(decorInterval);
    document.querySelectorAll('.floating-element').forEach(el => el.remove());
}

// Iniciar decoración por defecto
crearDecoracion(['💚', '✨', '🍃'], true); 

function abrirRegaloInicio() {
    // Ocultar el Hero con animación
    const hero = document.getElementById('hero-block');
    hero.style.opacity = '0';
    setTimeout(() => {
        hero.style.display = 'none';
        // Mostrar el contenido
        const contenido = document.getElementById('contenido-inicio');
        contenido.style.display = 'flex';
        contenido.animate([
            { opacity: 0, transform: 'translateY(50px)' }, 
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 1000, fill: 'forwards' });
    }, 800);
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
                renderPuzzle(); 
                checkWin();
            }
        };
        container.appendChild(div);
    });
}

function checkWin() {
    if (currentPieces.every((v, i) => v === i)) {
        setTimeout(() => {
            document.getElementById('puzzle-reward').style.display = 'flex';
        }, 300);
    }
}

function cerrarRecompensa() {
    document.getElementById('puzzle-reward').style.display = 'none';
    currentPieces = [...pieces].sort(() => Math.random() - 0.5); 
    while(currentPieces.every((v, i) => v === i)) {
         currentPieces = [...pieces].sort(() => Math.random() - 0.5);
    }
    renderPuzzle();
}

window.onload = function() {
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
