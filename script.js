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

// Pegando os novos botões do HTML
const btnCopy = document.getElementById('btn-copy');
const btnShare = document.getElementById('btn-share');
const shareMenu = document.getElementById('share-menu'); // Referência ao novo menu adicionada aqui

// Salvo o ícone original de cópia para poder restaurar depois do feedback visual
const iconeCopyOriginal = btnCopy.innerHTML;

// Lógica de COPIAR
btnCopy.addEventListener('click', async () => {
    // Monto o texto que vai pra área de transferência
    const fraseObj = frases[indiceAtual][idiomaAtual];
    const textoParaCopiar = `"${fraseObj.texto}" - ${fraseObj.autor}`;

    try {
        // Uso a Clipboard API nativa do navegador
        await navigator.clipboard.writeText(textoParaCopiar);
        
        // Feedback visual: troco o SVG por um "check" verde
        btnCopy.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        
        // Volto pro ícone original depois de 2 segundos
        setTimeout(() => {
            btnCopy.innerHTML = iconeCopyOriginal;
        }, 2000);
    } catch (err) {
        console.error("Falha ao copiar a frase:", err);
    }
});

// Lógica de COMPARTILHAR (Corrigida e unificada)
btnShare.addEventListener('click', async () => {
    const fraseObj = frases[indiceAtual][idiomaAtual];
    const texto = `"${fraseObj.texto}" - ${fraseObj.autor}`;
    const url = window.location.href;

    if (navigator.share) {
        // Se for telemóvel/mobile, usa a gaveta nativa de partilha
        try {
            await navigator.share({ title: 'Inspire', text: texto, url: url });
        } catch (err) { 
            console.log("Partilha cancelada ou falhou"); 
        }
    } else {
        // Se for Desktop/PC, mostra ou esconde o nosso menu customizado
        shareMenu.classList.toggle('hidden');
    }
});

// Função para abrir os links das redes sociais a partir do menu do PC
// Função para abrir os links das redes sociais no PC
function shareSocial(plataforma) {
    const fraseObj = frases[indiceAtual][idiomaAtual];
    const mensagem = encodeURIComponent(`"${fraseObj.texto}" - ${fraseObj.autor}\n\nVeja mais em:\n ${window.location.href}`);
    
    let url = '';
    if (plataforma === 'whatsapp') {
        url = `https://web.whatsapp.com/send?text=${mensagem}`;
    } else if (plataforma === 'twitter') {
        url = `https://twitter.com/intent/tweet?text=${mensagem}`;
    }

    // Abre o WhatsApp Web ou o Twitter num novo separador
    window.open(url, '_blank');
}

// Inicialização da Aplicação
carregarFrases();