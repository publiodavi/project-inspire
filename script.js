let frases = [];
let idiomaAtual = 'pt';
let indiceAtual = 0;

const textoFrase = document.getElementById('texto-frase');
const autorFrase = document.getElementById('autor-frase');
const btnTheme = document.getElementById('btn-theme');
const btnNovaFrase = document.getElementById('btn-nova-frase');

// dicionario pra traduzir o botao dinamicamente
const textosBotao = {
    pt: "Me inspire",
    en: "Inspire me",
    es: "Inspírame"
};

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        btnTheme.innerText = '☀️';
    } else {
        btnTheme.innerText = '🌙';
    }
});

async function carregarFrases() {
    try {
        const resposta = await fetch('frases.json');
        frases = await resposta.json();
        
        indiceAtual = Math.floor(Math.random() * frases.length);
        exibirFrase();
        atualizarInterface();
    } catch (erro) {
        console.error("deu ruim ao carregar o json:", erro);
        textoFrase.innerText = "Erro ao buscar a inspiração...";
    }
}

function exibirFrase() {
    textoFrase.style.opacity = 0;
    autorFrase.style.opacity = 0;
    
    setTimeout(() => {
        const frase = frases[indiceAtual];
        textoFrase.innerText = `"${frase[idiomaAtual].texto}"`;
        autorFrase.innerText = `- ${frase[idiomaAtual].autor}`;
        
        textoFrase.style.transition = "opacity 0.6s ease";
        autorFrase.style.transition = "opacity 0.6s ease";
        textoFrase.style.opacity = 1;
        autorFrase.style.opacity = 0.6;
    }, 250); // aumentei um tiquinho o tempo pro fade ficar mais suave
}

// mudo o idioma e ja rodo a atualizacao do botao e das bandeiras
function mudarIdioma(novoIdioma) {
    idiomaAtual = novoIdioma;
    exibirFrase();
    atualizarInterface();
}

// unifiquei a atualizacao da interface (botao + bandeiras) aqui
function atualizarInterface() {
    // atualizando o texto do botao baseado no dicionario
    btnNovaFrase.innerText = textosBotao[idiomaAtual];

    // atualizando as bandeiras ativas
    const botoes = document.querySelectorAll('.flags button');
    botoes.forEach((btn, index) => {
        btn.classList.remove('active');
        
        if (idiomaAtual === 'pt' && index === 0) btn.classList.add('active');
        if (idiomaAtual === 'en' && index === 1) btn.classList.add('active');
        if (idiomaAtual === 'es' && index === 2) btn.classList.add('active');
    });
}

btnNovaFrase.addEventListener('click', () => {
    let novoIndice;
    do {
        novoIndice = Math.floor(Math.random() * frases.length);
    } while (novoIndice === indiceAtual && frases.length > 1);
    
    indiceAtual = novoIndice;
    exibirFrase();
});

carregarFrases();