// ==========================================
// MESQUITA COMMERCE
// Arquivo: render.js
// Versão: 1.7
// ==========================================

/* ==========================================
   HEADER
========================================== */
function renderHeader() {
    const headerElement = document.getElementById('header');
    if (!headerElement) return;

    headerElement.innerHTML = `
        <div class="container header-container" style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 1200px; margin: 0 auto; padding: 10px 15px;">
            
            <a href="#" class="logo" id="logo" style="text-decoration: none; display: flex; align-items: center;">
                <img src="assets/logos/logo.png" alt="La Forneria" class="logo-img">
            </a>

            <!-- Ícones para Mobile (entre a logo e o menu) -->
            <div class="social-mobile" style="display: none; align-items: center; gap: 8px; margin-left: auto; margin-right: 15px;">
                <a href="https://instagram.com" target="_blank" aria-label="Instagram">
                    <img src="assets/icons/icon-instagram.png" alt="Instagram" style="width: 22px; height: 22px; object-fit: contain;">
                </a>
                <a href="https://facebook.com" target="_blank" aria-label="Facebook">
                    <img src="assets/icons/icon-facebook.png" alt="Facebook" style="width: 22px; height: 22px; object-fit: contain;">
                </a>
            </div>

            <!-- Menu de navegação (Centralizado no desktop) -->
            <nav class="menu" id="menu" style="display: flex; gap: 25px; margin: 0 auto;">
                <a href="#hero" style="text-decoration: none; color: #1F2937; font-weight: 500;">Início</a>
                <a href="#promocoes" style="text-decoration: none; color: #1F2937; font-weight: 500;">Promoções</a>
                <a href="#products" style="text-decoration: none; color: #1F2937; font-weight: 500;">Cardápio</a>
                <a href="#contato" style="text-decoration: none; color: #1F2937; font-weight: 500;">Contato</a>
            </nav>

            <!-- Ícones para Desktop (Alinhados à direita) -->
            <div class="social-desktop" style="display: flex; align-items: center; gap: 15px;">
                <a href="https://instagram.com" target="_blank" aria-label="Instagram">
                    <img src="assets/icons/icon-instagram.png" alt="Instagram" style="width: 24px; height: 24px; object-fit: contain;">
                </a>
                <a href="https://facebook.com" target="_blank" aria-label="Facebook">
                    <img src="assets/icons/icon-facebook.png" alt="Facebook" style="width: 24px; height: 24px; object-fit: contain;">
                </a>
            </div>

            <button id="menu-btn" aria-label="Abrir Menu" style="background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #1F2937; display: none;">
                &#9776;
            </button>
        </div>
    `;

    const menuBtn = document.getElementById('menu-btn');
    const menuNav = document.getElementById('menu');

    if (menuBtn && menuNav) {
        menuBtn.addEventListener('click', () => {
            menuNav.classList.toggle('active');
        });
    }
}

/* ==========================================
   HERO (Banner Principal limpo, sem o círculo extra)
========================================== */
function renderHero(dados) {
    const hero = document.getElementById("hero-container");
    hero.innerHTML = `
        <div class="container hero">
            <div class="hero-content">
                <span class="badge">${dados.hero.badge}</span>
                <h1>${dados.hero.titulo}</h1>
                <p>${dados.hero.descricao}</p>
                <div class="hero-buttons">
                    <a href="#products" class="btn-primary" style="display: inline-block; text-align: center; text-decoration: none;">
                        Ver Cardápio
                    </a>
                </div>
            </div>
            <div class="hero-image">
                <img src="${dados.hero.imagem}" alt="${dados.empresa.nome}" onerror="this.src='https://via.placeholder.com/400?text=Pizza'">
            </div>
        </div>
    `;
}

/* ==========================================
   CARDÁPIO E FILTROS
========================================== */
let categoriaAtual = "Todas";
let pesquisaAtual = "";

function renderProdutos(dados) {
    renderFiltros(dados);
    desenharPizzas(dados.cardapio, dados);
}

function renderFiltros(dados) {
    const container = document.getElementById("products-filters");
    const categorias = [
        "Todas",
        ...new Set(dados.cardapio.map(item => item.categoria))
    ];

    container.innerHTML = `
        <div class="filters">
            ${categorias.map(cat => `
                <button class="filter-btn ${cat === "Todas" ? "active" : ""}" data-categoria="${cat}">
                    ${cat}
                </button>
            `).join("")}
        </div>
    `;

    const botoes = container.querySelectorAll(".filter-btn");
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            botao.classList.add("active");
            categoriaAtual = botao.dataset.categoria;
            atualizarLista(dados);
        });
    });
}

function desenharPizzas(lista, dados) {
    const container = document.getElementById("products-container");
    let html = `
        <div class="container">
            <div class="grid-pizzas">
    `;

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    lista.forEach((pizza) => {
        const idStr = String(pizza.id);
        const ehFavorito = favoritos.includes(idStr);

        html += `
            <div class="card-pizza">
                <button class="btn-favorito ${ehFavorito ? "ativo" : ""}" data-id="${pizza.id}" aria-label="Favoritar pizza">
                    ${ehFavorito ? "❤️" : "🤍"}
                </button>

                <img src="${pizza.imagem}" alt="${pizza.nome}" onerror="this.src='https://via.placeholder.com/300?text=Pizza'">

                <div class="pizza-info">
                    ${pizza.destaque ? '<span class="tag-destaque">⭐ Mais Vendida</span>' : ''}
                    <h3>${pizza.nome}</h3>
                    <p>${pizza.descricao}</p>
                    <strong>R$ ${pizza.preco.toFixed(2).replace('.', ',')}</strong>
                    <button class="btn-primary" onclick="abrirModalPorId(${pizza.id})">
                        🍕 Menu / Montar Pedido
                    </button>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function atualizarLista(dados) {
    let lista = dados.cardapio;

    if (categoriaAtual !== "Todas") {
        lista = lista.filter(pizza => pizza.categoria === categoriaAtual);
    }

    if (pesquisaAtual !== "") {
        const texto = pesquisaAtual.toLowerCase();
        lista = lista.filter(pizza =>
            pizza.nome.toLowerCase().includes(texto) ||
            pizza.descricao.toLowerCase().includes(texto)
        );
    }

    desenharPizzas(lista, dados);

    const contador = document.getElementById("contador-produtos");
    if (contador) {
        contador.textContent = `${lista.length} pizza(s) encontrada(s)`;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const campo = document.getElementById("search-product");
    if (!campo) return;

    campo.addEventListener("input", () => {
        pesquisaAtual = campo.value;
        if (window.dadosSite) {
            atualizarLista(window.dadosSite);
        }
    });
});

/* ==========================================
   GESTÃO DE FAVORITOS
========================================== */
document.addEventListener("click", function (e) {
    const botao = e.target.closest(".btn-favorito");
    if (!botao) return;

    const id = String(botao.dataset.id);
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(item => item !== id);
        botao.classList.remove("ativo");
        botao.textContent = "🤍";
    } else {
        favoritos.push(id);
        botao.classList.add("ativo");
        botao.textContent = "❤️";
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
});

/* ==========================================
   POPUP / MODAL DE MONTAGEM E PEDIDO FINAL
========================================== */
function abrirModalMontagem(pizza, opcoes, whatsappEmpresa) {
    const modal = document.getElementById("modal-pedido");
    const conteudo = document.getElementById("modal-corpo-conteudo");

    if (!modal || !conteudo) {
        console.error("Elementos do modal não encontrados no HTML!");
        return;
    }

    const safeOpcoes = opcoes || { adicionais: [], bebidas: [], sobremesas: [] };

    conteudo.innerHTML = `
        <div style="padding: 10px;">
            <h2 style="color: #1F2937; margin-bottom: 5px; font-size: 1.5rem;">${pizza.nome}</h2>
            <p style="color: #6B7280; font-size: 0.95rem; margin-bottom: 15px;">${pizza.descricao}</p>
            <p style="font-weight: 700; color: #EE3947; font-size: 1.2rem; margin-bottom: 20px;">Preço Base: R$ <span id="preco-base">${pizza.preco.toFixed(2)}</span></p>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;">

            <!-- LINHA: QUANTIDADE E TAMANHO -->
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <label style="font-weight: 600; display: block; margin-bottom: 5px;">Quantidade:</label>
                    <input type="number" id="qtd-pizza" value="1" min="1" max="20" style="padding: 8px; width: 100%; border: 1px solid #ccc; border-radius: 6px;">
                </div>
                <div style="flex: 1;">
                    <label style="font-weight: 600; display: block; margin-bottom: 5px;">Tamanho: <span style="color: red;">*</span></label>
                    <select id="select-tamanho" style="width: 100%; padding: 9px; border: 1px solid #ccc; border-radius: 6px; background: white;">
                        <option value="" disabled selected>Selecione...</option>
                        <option value="Pequena (P)" data-acrescimo="0">Pequena (P)</option>
                        <option value="Media (M)" data-acrescimo="10">Média (M) + R$ 10,00</option>
                        <option value="Grande (G)" data-acrescimo="20">Grande (G) + R$ 20,00</option>
                    </select>
                </div>
            </div>

            <!-- ADICIONAIS -->
            <div style="margin-top: 15px; margin-bottom: 15px;">
                <label style="font-weight: 700; color: #EE3947; display: block; margin-bottom: 8px; font-size: 1rem;">Adicionais:</label>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${(safeOpcoes.adicionais || []).map((ad) => `
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.95rem; cursor: pointer; color: #374151;">
                            <input type="checkbox" class="check-adicional" value="${ad.nome}" data-preco="${ad.preco}" style="width: 16px; height: 16px; accent-color: #EE3947;"> 
                            ${ad.nome} (+ R$ ${ad.preco.toFixed(2)})
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- BEBIDAS -->
            <div style="margin-bottom: 15px;">
                <label style="font-weight: 600; display: block; margin-bottom: 5px;">Bebidas:</label>
                <select id="select-bebida" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px;">
                    <option value="" data-preco="0">Nenhuma bebida</option>
                    ${(safeOpcoes.bebidas || []).map(beb => `<option value="${beb.nome}" data-preco="${beb.preco}">${beb.nome} (R$ ${beb.preco.toFixed(2)})</option>`).join('')}
                </select>
            </div>

            <!-- SOBREMESAS -->
            <div style="margin-bottom: 15px;">
                <label style="font-weight: 600; display: block; margin-bottom: 5px;">Sobremesas:</label>
                <select id="select-sobremesa" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px;">
                    <option value="" data-preco="0">Nenhuma sobremesa</option>
                    ${(safeOpcoes.sobremesas || []).map(sob => `<option value="${sob.nome}" data-preco="${sob.preco}">${sob.nome} (R$ ${sob.preco.toFixed(2)})</option>`).join('')}
                </select>
            </div>

            <!-- ENDEREÇO DE ENTREGA -->
            <div style="margin-bottom: 15px;">
                <label style="font-weight: 600; display: block; margin-bottom: 5px;">Endereço de Entrega (com número e bairro): <span style="color: red;">*</span></label>
                <input type="text" id="input-endereco" placeholder="Ex: Rua Exemplo, 123 - Bairro..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px;">
            </div>

            <!-- FORMA DE PAGAMENTO E TROCO -->
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <label style="font-weight: 600; display: block; margin-bottom: 5px;">Forma de Pagamento: <span style="color: red;">*</span></label>
                    <select id="select-pagamento" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; background: white;">
                        <option value="" disabled selected>Selecione...</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartão">Cartão (Débito/Crédito)</option>
                        <option value="Dinheiro">Dinheiro</option>
                    </select>
                </div>
                <div style="flex: 1;">
                    <label style="font-weight: 600; display: block; margin-bottom: 5px;">Troco para:</label>
                    <input type="text" id="input-troco" placeholder="Ex: R$ 100,00 ou Não precisa" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px;">
                </div>
            </div>

            <!-- OBSERVAÇÕES -->
            <div style="margin-bottom: 20px;">
                <label style="font-weight: 600; display: block; margin-bottom: 5px;">Observações:</label>
                <textarea id="obs-pedido" placeholder="Ex: Tirar a cebola, caprichar no ponto..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; height: 70px;"></textarea>
            </div>

            <!-- TOTAL E BOTÃO FINAL -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <span style="font-size: 1.1rem; font-weight: 600;">Total:</span>
                <span id="span-total" style="font-size: 1.4rem; font-weight: 800; color: #EE3947;">R$ ${pizza.preco.toFixed(2)}</span>
            </div>

            <button id="btn-fazer-pedido-final" class="btn-primary" style="width: 100%; padding: 14px; font-size: 1.1rem; background: #22C55E; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; text-transform: uppercase;">
                🛒 Fazer Pedido (Enviar para WhatsApp)
            </button>
        </div>
    `;

    modal.style.display = "flex";

    const calcularTotal = () => {
        let qtd = parseInt(document.getElementById("qtd-pizza").value) || 1;
        let precoBase = pizza.preco;

        const selectTamanho = document.getElementById("select-tamanho");
        let acrescimoTamanho = 0;
        if (selectTamanho.selectedIndex > 0) {
            acrescimoTamanho = parseFloat(selectTamanho.options[selectTamanho.selectedIndex].dataset.acrescimo) || 0;
        }

        let precoAdicionais = 0;
        document.querySelectorAll(".check-adicional:checked").forEach(chk => {
            precoAdicionais += parseFloat(chk.dataset.preco) || 0;
        });

        const selectBebida = document.getElementById("select-bebida");
        let precoBebida = parseFloat(selectBebida.options[selectBebida.selectedIndex].dataset.preco) || 0;

        const selectSobremesa = document.getElementById("select-sobremesa");
        let precoSobremesa = parseFloat(selectSobremesa.options[selectSobremesa.selectedIndex].dataset.preco) || 0;

        let totalGeral = ((precoBase + acrescimoTamanho + precoAdicionais) * qtd) + precoBebida + precoSobremesa;
        document.getElementById("span-total").textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        return totalGeral;
    };

    document.getElementById("qtd-pizza").addEventListener("input", calcularTotal);
    document.getElementById("select-tamanho").addEventListener("change", calcularTotal);
    document.querySelectorAll(".check-adicional").forEach(chk => chk.addEventListener("change", calcularTotal));
    document.getElementById("select-bebida").addEventListener("change", calcularTotal);
    document.getElementById("select-sobremesa").addEventListener("change", calcularTotal);

    const fecharBtn = document.getElementById("fechar-modal");
    if (fecharBtn) {
        fecharBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    document.getElementById("btn-fazer-pedido-final").onclick = () => {
        let selectTamanho = document.getElementById("select-tamanho");
        if (!selectTamanho.value) {
            alert("Por favor, selecione o tamanho da pizza (P, M ou G) antes de enviar o pedido!");
            selectTamanho.focus();
            return;
        }

        let endereco = document.getElementById("input-endereco").value.trim();
        if (!endereco) {
            alert("Por favor, preencha o endereço de entrega antes de enviar o pedido!");
            document.getElementById("input-endereco").focus();
            return;
        }

        let selectPagamento = document.getElementById("select-pagamento");
        if (!selectPagamento.value) {
            alert("Por favor, selecione a forma de pagamento!");
            selectPagamento.focus();
            return;
        }

        let qtd = document.getElementById("qtd-pizza").value;
        let tamanhoNome = selectTamanho.value;
        
        let adicionaisArr = [];
        document.querySelectorAll(".check-adicional:checked").forEach(chk => {
            adicionaisArr.push(chk.value);
        });

        let bebidaSelect = document.getElementById("select-bebida");
        let bebidaNome = bebidaSelect.value;

        let sobremesaSelect = document.getElementById("select-sobremesa");
        let sobremesaNome = sobremesaSelect.value;

        let formaPagamento = selectPagamento.value;
        let troco = document.getElementById("input-troco").value.trim();
        let obs = document.getElementById("obs-pedido").value.trim();
        let totalStr = document.getElementById("span-total").textContent;

        let textoMsg = `*🚀 NOVO PEDIDO - ${pizza.nome.toUpperCase()}*\n\n` +
            `🍕 *Pizza:* ${pizza.nome}\n` +
            `📏 *Tamanho:* ${tamanhoNome}\n` +
            `🔢 *Quantidade:* ${qtd}\n` +
            `➕ *Adicionais:* ${adicionaisArr.length > 0 ? adicionaisArr.join(', ') : 'Nenhum'}\n` +
            `🥤 *Bebida:* ${bebidaNome ? bebidaNome : 'Nenhuma'}\n` +
            `🍰 *Sobremesa:* ${sobremesaNome ? sobremesaNome : 'Nenhuma'}\n` +
            `📍 *Endereço:* ${endereco}\n` +
            `💳 *Pagamento:* ${formaPagamento}` + (formaPagamento === 'Dinheiro' && troco ? ` (Troco para: ${troco})` : '') + `\n` +
            `📝 *Observações:* ${obs ? obs : 'Nenhuma'}\n\n` +
            `💰 *VALOR TOTAL: ${totalStr}*`;

        let urlWpp = `https://wa.me/${whatsappEmpresa}?text=${encodeURIComponent(textoMsg)}`;
        window.open(urlWpp, '_blank');
        modal.style.display = "none";
    };
}

function abrirModalPromocao(nome, preco, descricao) {
    const pizzaFicticia = {
        nome: nome,
        preco: preco,
        descricao: descricao
    };
    if (window.dadosSite) {
        abrirModalMontagem(pizzaFicticia, window.dadosSite.opcoesPedido, window.dadosSite.empresa.whatsapp);
    }
}