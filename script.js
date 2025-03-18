// Variáveis de estado
let velocidade = 0;
let altitude = 0;
let combustivel = 100;
let direcao = 0;
let flaps = 0;
let tremDePouso = true;

// Elementos do DOM
const velocidadeElement = document.getElementById('velocidade');
const altitudeElement = document.getElementById('altitude');
const combustivelElement = document.getElementById('combustivel');
const direcaoElement = document.getElementById('direcao');
const flapsElement = document.getElementById('flaps');
const tremDePousoElement = document.getElementById('trem-de-pouso');

const acelerarButton = document.getElementById('acelerar');
const reduzirButton = document.getElementById('reduzir');
const subirButton = document.getElementById('subir');
const descerButton = document.getElementById('descer');
const aumentarFlapsButton = document.getElementById('aumentar-flaps');
const diminuirFlapsButton = document.getElementById('diminuir-flaps');
const girarEsquerdaButton = document.getElementById('girar-esquerda');
const girarDireitaButton = document.getElementById('girar-direita');
const alternarTremButton = document.getElementById('alternar-trem');

const paisOrigemSelect = document.getElementById('pais-origem');
const paisDestinoSelect = document.getElementById('pais-destino');
const calcularRotaButton = document.getElementById('calcular-rota');
const distanciaElement = document.getElementById('distancia');
const tempoVooElement = document.getElementById('tempo-voo');

// Mapa
const mapa = L.map('mapa').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// Funções de atualização
function atualizarVelocidade() {
    velocidadeElement.textContent = `Velocidade: ${velocidade} km/h`;
}

function atualizarAltitude() {
    altitudeElement.textContent = `Altitude: ${altitude} m`;
}

function atualizarCombustivel() {
    combustivelElement.textContent = `Combustível: ${combustivel}%`;
}

function atualizarDirecao() {
    direcaoElement.textContent = `Direção: ${direcao}°`;
}

function atualizarFlaps() {
    flapsElement.textContent = `Flaps: ${flaps}%`;
}

function atualizarTremDePouso() {
    tremDePousoElement.textContent = `Trem de Pouso: ${tremDePouso ? 'Baixado' : 'Recolhido'}`;
}

// Event Listeners
acelerarButton.addEventListener('click', () => {
    
if (paisOrigemSelect.value === paisDestinoSelect.value) {
    alert("O país de origem não pode ser igual ao país de destino. Velocidade permanecerá em 0.");
    velocidade = 0;
    atualizarVelocidade();
    return;
}

     if (combustivel > 0) {
        velocidade += 10;
        combustivel -= 1;
        if (combustivel < 25) {
            alert("Combustível baixo! Abasteça o avião.");
        }
        if (velocidade === 200) {
            altitude += 200;
        }

        
        
        atualizarAltitude();
        atualizarVelocidade();
        atualizarCombustivel();
    }
});

reduzirButton.addEventListener('click', () => {
    if (velocidade > 0) {
        velocidade -= 10;
        atualizarVelocidade();
    }
});

subirButton.addEventListener('click', () => {
    if (velocidade >= 200) {
        altitude += 100;
        atualizarAltitude();
    }
    
});

descerButton.addEventListener('click', () => {
    if (altitude > 0) {
        altitude -= 100;
        atualizarAltitude();
    }
});

aumentarFlapsButton.addEventListener('click', () => {
    if (flaps < 40) {
        flaps += 10;
        atualizarFlaps();
    }
});

diminuirFlapsButton.addEventListener('click', () => {
    if (flaps > 0) {
        flaps -= 10;
        atualizarFlaps();
    }
});

girarEsquerdaButton.addEventListener('click', () => {
    direcao -= 10;
    if (direcao < 0) direcao += 360;
    atualizarDirecao();
});

girarDireitaButton.addEventListener('click', () => {
    direcao += 10;
    if (direcao >= 360) direcao -= 360;
    atualizarDirecao();
});

alternarTremButton.addEventListener('click', () => {
    tremDePouso = !tremDePouso;
    atualizarTremDePouso();
});

// Cálculo de distância e tempo de voo
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

calcularRotaButton.addEventListener('click', () => {
    const paisOrigem = paisOrigemSelect.value;
    const paisDestino = paisDestinoSelect.value;
    
    

    // Coordenadas dos países (exemplo)
    const coordenadas = {
        BR: { lat: -14.2350, lon: -51.9253 }, // Brasil
        US: { lat: 37.0902, lon: -95.7129 },  // Estados Unidos
        FR: { lat: 46.2276, lon: 2.2137 },   // França
        JP: { lat: 36.2048, lon: 138.2529 }, // Japão
        CA: { lat: 56.1304, lon: -106.3468 }, // Canadá
        AU: { lat: -25.2744, lon: 133.7751 }, // Austrália
        DE: { lat: 51.1657, lon: 10.4515 },   // Alemanha
        CN: { lat: 35.8617, lon: 104.1954 }, // China
        IN: { lat: 20.5937, lon: 78.9629 },   // Índia
        RU: { lat: 61.5240, lon: 105.3188 }, // Rússia
        MX: { lat: 23.6345, lon: -102.5528 }, // México
        AR: { lat: -38.4161, lon: -63.6167 }, // Argentina
        ZA: { lat: -30.5595, lon: 22.9375 },  // África do Sul
        EG: { lat: 26.8206, lon: 30.8025 },   // Egito
        NZ: { lat: -40.9006, lon: 174.8860 }  // Nova Zelândia
    };

    const origem = coordenadas[paisOrigem];
    const destino = coordenadas[paisDestino];

    const distancia = calcularDistancia(origem.lat, origem.lon, destino.lat, destino.lon);
    const tempoVoo = distancia / velocidade;

    distanciaElement.textContent = `Distância: ${distancia.toFixed(2)} km`;
    tempoVooElement.textContent = `Tempo de Voo: ${tempoVoo.toFixed(2)} h`;



    // Desenhar rota no mapa
    const rota = L.polyline([origem, destino], { color: 'blue' }).addTo(mapa);
    mapa.fitBounds(rota.getBounds());
});

const mensagem = [
    "Atenção: Turbulência à frente! Ajuste a altitude.",
    "Informação: Próximo a uma zona de tempestade. Mantenha a altitude atual.",
    "Aviso: Ventos fortes detectados. Ajuste a direção.",
    "Notificação: Passageiros, apertem os cintos por segurança.",
    "Alerta: Sistema de navegação atualizado. Verifique a rota.",
];

function exibirAlertaAleatorio() {
    const titulo = "Alerta de Voo";
    const mensagemAleatoria = mensagem[Math.floor(Math.random() * mensagem.length)];
    alert(`${titulo}\n\n${mensagemAleatoria}`);
}
setInterval(exibirAlertaAleatorio, 60000); // 10000 ms = 10 segundos

paisDestinoSelect.addEventListener('change', () => {
    const paisSelecionado = paisDestinoSelect.options[paisDestinoSelect.selectedIndex].text;
    alert(`País destino: ${paisSelecionado}`);
});


document.addEventListener('keydown', function(event) {
    const airplane = document.getElementById('airplane');
    const container = document.getElementById('containeraviao');
    const speed = 10;

    const containerRect = container.getBoundingClientRect();
    const airplaneRect = airplane.getBoundingClientRect();

    let top = parseInt(window.getComputedStyle(airplane).top, 10);
    let left = parseInt(window.getComputedStyle(airplane).left, 10);
    
    

    switch(event.key) {
        case 'w':
            if (airplaneRect.top > containerRect.top) {
                airplane.style.top = `${top - speed}px`;
            }
            break;
        case 's':
            if (airplaneRect.bottom < containerRect.bottom) {
                airplane.style.top = `${top + speed}px`;
            }
            break;
        case 'a':
            if (airplaneRect.left > containerRect.left) {
                airplane.style.left = `${left - speed}px`;
            }
            break;
        case 'd':
            if (airplaneRect.right < containerRect.right) {
                airplane.style.left = `${left + speed}px`;
            }
            break;
    }

});
girarDireitaButton.addEventListener('click', () => {
    airplane.style.transform = `rotate(${direcao}deg)`;
   
});

girarEsquerdaButton.addEventListener('click', () => {
    airplane.style.transform = `rotate(${direcao}deg)`;
    
});
