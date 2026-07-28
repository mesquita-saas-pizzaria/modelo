// ==========================================
// MESQUITA COMMERCE
// Arquivo: app.js
// Versão: 0.8
// ==========================================

window.dadosSite = null;

async function iniciarSistema() {
    try {
        const resposta = await fetch("data/site.json");
        const dados = await resposta.json();
        
        // Define tanto a variável local quanto a global para acesso imediato
        window.dadosSite = dados;
        
        renderHeader(dados);
        renderHero(dados);
        renderProdutos(dados);

    } catch (erro) {
        console.error("Erro ao carregar os dados do site:", erro);
    }
}

// Inicializa assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    iniciarSistema();
});

/* ==========================================
   CONTROLE DO MODAL DE PEDIDO
========================================== */
function abrirModalPorId(idPizza) {
    if (!window.dadosSite || !window.dadosSite.cardapio) {
        console.error("Os dados do cardápio ainda não foram carregados.");
        return;
    }
    
    const pizza = window.dadosSite.cardapio.find(item => item.id == idPizza);
    if (pizza) {
        abrirModalMontagem(pizza, window.dadosSite.opcoesPedido, window.dadosSite.empresa.whatsapp);
    } else {
        console.error("Pizza não encontrada com o ID:", idPizza);
    }
}