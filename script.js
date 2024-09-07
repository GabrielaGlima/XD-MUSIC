// Mapeamento de intros e músicas usando os nomes reais
const tracks = {
    'Ariana Grande - imperfect for you': {
        intro: 'intros/intro_Ariana Grande - imperfect for you.mp3',
        music: 'musicas/Ariana Grande - imperfect for you.mp3'
    },
    'Lady Gaga, Bruno Mars - Die With A Smile': {
        intro: 'intros/intro_Lady Gaga, Bruno Mars - Die With A Smile.mp3',
        music: 'musicas/Lady Gaga, Bruno Mars - Die With A Smile.mp3'
    },
    
};

// Adicione os áudios específicos
const specificAudios = {
    'audio1': 'audios/Iniciando a XD.fm.mp3',
    'audio2': 'audios/Vinheta da XD.fm.mp3'
};

// Variáveis globais para controle do áudio
let currentIntro = null;
let currentMusic = null;
let isIntroPlaying = false;
let isMusicPlaying = false;
let isPaused = false; // Estado de pausa
let isPausedAfterCurrent = false; // Pausar após a música atual
let currentTrack = null;
let nextTrack = null; // Próxima música

// Botão para tocar música aleatória
document.getElementById('playRandomButton').addEventListener('click', function() {
    const trackNames = Object.keys(tracks);
    const randomIndex = Math.floor(Math.random() * trackNames.length);
    const randomTrack = trackNames[randomIndex];

    // Escolher e exibir a próxima música
    nextTrack = getRandomTrack(randomTrack);
    document.getElementById('nextTrack').textContent = '${nextTrack}';

    // Tocar a música
    playTrack(randomTrack);
});

// Botão de pausa e despausa
document.getElementById('pauseButton').addEventListener('click', function() {
    if (isPaused) {
        // Se pausado, despausar e tocar a próxima música
        isPaused = false;
        if (!isIntroPlaying && !isMusicPlaying) {
            playTrack(nextTrack); // Tocar a próxima música
        }
    } else {
        // Se não pausado, marcar para pausar após a música terminar
        isPausedAfterCurrent = true;
    }
});

// **Novo**: Botão de próxima música
document.getElementById('nextButton').addEventListener('click', function() {
    if (isIntroPlaying || isMusicPlaying) {
        // Se uma música está tocando, parar tudo antes de pular
        if (currentIntro) currentIntro.pause();
        if (currentMusic) currentMusic.pause();
    }
    
    // Atualizar o índice da próxima música e tocar
    currentTrack = nextTrack;
    playTrack(currentTrack);
});

function playTrack(trackKey) {
    if (!tracks[trackKey]) {
        console.error('Música não encontrada!');
        return;
    }

    // Parar qualquer áudio tocando
    if (currentIntro) {
        currentIntro.pause();
        currentIntro.currentTime = 0;
    }
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    // Tocar nova intro e música
    const { intro, music } = tracks[trackKey];
    currentIntro = new Audio(intro);
    currentMusic = new Audio(music);

    isIntroPlaying = true;
    isMusicPlaying = false;
    currentTrack = trackKey; // Música atual

    // Atualizar a próxima música
    nextTrack = getRandomTrack(currentTrack);
    document.getElementById('nextTrack').textContent = `${nextTrack}`;

    const pauseButton = document.getElementById('pauseButton');
    pauseButton.disabled = false;
    

    // Tocar a intro
    currentIntro.play().then(() => {
        currentIntro.onended = function() {
            isIntroPlaying = false;
            isMusicPlaying = true;
            currentMusic.play();

            // Checar o estado de pausa ao final da música
            currentMusic.onended = function() {
                isMusicPlaying = false;
                if (isPausedAfterCurrent) {
                    // Marcar como pausado após a música acabar
                    isPaused = true;
                    isPausedAfterCurrent = false;
                    console.log("A música acabou e o sistema está pausado.");
                } else {
                    // Tocar a próxima música automaticamente se não estiver pausado
                    playTrack(nextTrack);
                }
            };
        };
    }).catch(error => {
        console.error('Erro ao tocar a intro:', error);
    });
}

// Função para obter uma música aleatória diferente da atual
function getRandomTrack(excludeTrack) {
    const trackNames = Object.keys(tracks);
    const newTrackNames = trackNames.filter(name => name !== excludeTrack);
    const randomIndex = Math.floor(Math.random() * newTrackNames.length);
    return newTrackNames[randomIndex];
}

// Adicione as referências para os novos botões
document.getElementById('button1').addEventListener('click', function() {
    playSpecificAudio('audio1'); // Chama a função para tocar o áudio 1
});

document.getElementById('button2').addEventListener('click', function() {
    playSpecificAudio('audio2'); // Chama a função para tocar o áudio 2
});

function playSpecificAudio(audioKey) {
    const audioSrc = specificAudios[audioKey];
    if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play().catch(error => {
            console.error('Erro ao tocar o áudio específico:', error);
        });
    } else {
        console.error('Áudio específico não encontrado!');
    }
}

// Mapeamento de imagens para troca
const imagePaths = {
    play: 'imagens/Play-Pause.png',
    pause: 'imagens/Shuffle.png' // Exemplo: Imagem alternativa para quando clicado
};

// Referência para o botão e a imagem dentro do botão
const pauseButton = document.getElementById('pauseButton');
const playRandomImage = pauseButton.querySelector('img');

// Adiciona o evento de clique ao botão
pauseButton.addEventListener('click', function() {
    // Troca a imagem atual
    if (playRandomImage.src.includes(imagePaths.play)) {
        playRandomImage.src = imagePaths.pause;
    } else {
        playRandomImage.src = imagePaths.play;
    }

    // Adicione aqui a lógica para tocar a música aleatória
});