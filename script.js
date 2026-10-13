
// PRODUTOS

const listaProdutos = [
    { id: 1, nome: "Ração Premium", categoria: "Alimentação", preco: 79.90, imagem: "Imagens/produtos/images (1).jpg", descricao: "Alimento completo para uma rotina equilibrada." },
    { id: 2, nome: "Petisco Natural", categoria: "Alimentação", preco: 24.90, imagem: "Imagens/produtos/petisco.png", descricao: "Petisco para recompensar com carinho." },
    { id: 3, nome: "Shampoo Suave", categoria: "Higiene", preco: 32.90, imagem: "Imagens/produtos/shampoo1.jpg", descricao: "Limpeza suave para pele e pelos." },
    { id: 4, nome: "Brinquedo Mordedor", categoria: "Brinquedos", preco: 29.90, imagem: "Imagens/produtos/brinquedo.webp", descricao: "Diversão e estímulo para o seu pet." },
    { id: 5, nome: "Bola Interativa", categoria: "Brinquedos", preco: 39.90, imagem: "Imagens/produtos/bola.jpg", descricao: "Brincadeira para gastar energia." },
    { id: 6, nome: "Cama Confortável", categoria: "Acessórios", preco: 119.90, imagem: "Imagens/produtos/cama.jpg", descricao: "Um cantinho confortável para descansar." },
    { id: 7, nome: "Coleira Ajustável", categoria: "Acessórios", preco: 44.90, imagem: "Imagens/produtos/coleira.jpg", descricao: "Conforto e segurança para os passeios." },
    { id: 8, nome: "Kit Higiene", categoria: "Higiene", preco: 54.90, imagem: "Imagens/produtos/kithigiene.webp", descricao: "Itens essenciais para a rotina de cuidados." },
    { id: 9, nome: "Comedouro", categoria: "Acessórios", preco: 35.90, imagem: "Imagens/produtos/comedouro.jpg", descricao: "Prático para água e alimentação." },
    { id: 10, nome: "Arranhador", categoria: "Brinquedos", preco: 89.90, imagem: "Imagens/produtos/arranhador.jpg", descricao: "Diversão e enriquecimento para gatos." }
];


let carrinho = {};
let favoritos = [];
let temporizadorAviso;

const elemento = id => document.getElementById(id);
const gradeProdutos = elemento("productGrid");
const campoBusca = elemento("searchInput");
const filtroCategoria = elemento("categoryFilter");
const estadoVazio = elemento("emptyState");
const contadorCarrinho = elemento("cartCount");
const aviso = elemento("toast");
const navegacao = elemento("nav");
const modalAgendamento = elemento("appointmentModal");
const seletorServico = elemento("serviceSelect");
const campoData = elemento("appointmentDate");
const modalCarrinho = elemento("cartModal");
const itensCarrinho = elemento("cartItems");
const totalCarrinhoTexto = elemento("cartTotal");
const botaoConfirmarCompra = elemento("confirmPurchase");


// FUNÇÕES 

function totalCarrinho() {
    return Object.values(carrinho).reduce((total, quantidade) => total + quantidade, 0);
}

function mostrarAviso(mensagem) {
    aviso.textContent = mensagem;
    aviso.classList.add("show");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove("show"), 2200);
}

function irParaProdutos() {
    elemento("produtos").scrollIntoView({ behavior: "smooth" });
}


// EXIBIÇÃO DOS PRODUTOS

function renderizarProdutos() {
    const busca = campoBusca.value.toLowerCase().trim();
    const categoria = filtroCategoria.value;

    const produtosFiltrados = listaProdutos.filter(produto =>
        (produto.nome.toLowerCase().includes(busca) || produto.descricao.toLowerCase().includes(busca)) &&
        (categoria === "Todos" || produto.categoria === categoria)
    );

    gradeProdutos.innerHTML = produtosFiltrados.map(produto => {
        const ehFavorito = favoritos.includes(produto.id);
        const quantidade = carrinho[produto.id] || 0;

        return `
            <article class="product-card">
                <div class="product-image">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <button class="favorite ${ehFavorito ? "active" : ""}" data-favorite="${produto.id}" aria-label="Favoritar">
                        ${ehFavorito ? "♥" : "♡"}
                    </button>
                </div>
                <div class="product-info">
                    <span class="tag">${produto.categoria}</span>
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="product-bottom">
                        <span class="price">R$ ${produto.preco.toFixed(2).replace(".", ",")}</span>
                        <div class="quantity-control">
                            <button class="quantity-btn decrease" data-quantity="decrease" data-id="${produto.id}" aria-label="Diminuir quantidade">−</button>
                            <span class="quantity-value">${quantidade}</span>
                            <button class="quantity-btn increase" data-quantity="increase" data-id="${produto.id}" aria-label="Aumentar quantidade">+</button>
                        </div>
                    </div>
                </div>
            </article>`;
    }).join("");

    estadoVazio.hidden = produtosFiltrados.length > 0;
    contadorCarrinho.textContent = totalCarrinho();
}


// CARRINHO E FAVORITOS

gradeProdutos.addEventListener("click", evento => {
    const botaoQuantidade = evento.target.closest("[data-quantity]");
    const botaoFavorito = evento.target.closest("[data-favorite]");

    if (botaoQuantidade) {
        const id = Number(botaoQuantidade.dataset.id);
        const quantidadeAtual = carrinho[id] || 0;

        if (botaoQuantidade.dataset.quantity === "increase") {
            carrinho[id] = quantidadeAtual + 1;
        } else if (quantidadeAtual <= 1) {
            delete carrinho[id];

        } else {
            carrinho[id] = quantidadeAtual - 1;
        }

        renderizarProdutos();
        return;
    }

    if (botaoFavorito) {
        const id = Number(botaoFavorito.dataset.favorite);
        const jaEraFavorito = favoritos.includes(id);

        favoritos = jaEraFavorito
            ? favoritos.filter(favorito => favorito !== id)
            : [...favoritos, id];

        renderizarProdutos();
        mostrarAviso(jaEraFavorito ? "Removido dos favoritos." : "Adicionado aos favoritos! ♥");
    }
});

campoBusca.addEventListener("input", renderizarProdutos);
filtroCategoria.addEventListener("change", renderizarProdutos);

document.querySelectorAll(".category-card").forEach(cartao => {
    cartao.addEventListener("click", () => {
        filtroCategoria.value = cartao.dataset.filter;
        renderizarProdutos();
        irParaProdutos();
    });
});


// JANELA DO CARRINHO E CONFIRMAÇÃO

function renderizarCarrinho() {
    const produtosNoCarrinho = listaProdutos.filter(produto => carrinho[produto.id]);

    itensCarrinho.innerHTML = produtosNoCarrinho.length
        ? produtosNoCarrinho.map(produto => `
            <div class="cart-item">
                <span>${produto.nome} × ${carrinho[produto.id]}</span>
                <span>R$ ${(produto.preco * carrinho[produto.id]).toFixed(2).replace(".", ",")}</span>
            </div>`).join("")
        : '<p class="cart-empty">Seu carrinho está vazio.</p>';

    const total = produtosNoCarrinho.reduce(
        (soma, produto) => soma + produto.preco * carrinho[produto.id], 0
    );

    totalCarrinhoTexto.textContent = "R$ " + total.toFixed(2).replace(".", ",");
    botaoConfirmarCompra.disabled = produtosNoCarrinho.length === 0;
}

function abrirCarrinho() {
    renderizarCarrinho();
    modalCarrinho.classList.add("open");
    modalCarrinho.setAttribute("aria-hidden", "false");
}

function fecharCarrinho() {
    modalCarrinho.classList.remove("open");
    modalCarrinho.setAttribute("aria-hidden", "true");
}

elemento("cartBtn").addEventListener("click", abrirCarrinho);
elemento("closeCart").addEventListener("click", fecharCarrinho);
elemento("cancelPurchase").addEventListener("click", fecharCarrinho);

modalCarrinho.addEventListener("click", evento => {
    if (evento.target === modalCarrinho) fecharCarrinho();
});

botaoConfirmarCompra.addEventListener("click", () => {
    if (!totalCarrinho()) return;

    carrinho = {};
    renderizarProdutos();
    fecharCarrinho();
    mostrarAviso("Compra confirmada! Obrigado pela preferência.");
});

elemento("favoritesBtn").addEventListener("click", () => {
    if (!favoritos.length) {
        mostrarAviso("Você ainda não tem favoritos.");
        return;
    }

    filtroCategoria.value = "Todos";
    campoBusca.value = "";
    renderizarProdutos();
    irParaProdutos();
    mostrarAviso(`Você tem ${favoritos.length} favorito(s). ♥`);
});


// MENU PARA CELULAR

elemento("menuBtn").addEventListener("click", () => navegacao.classList.toggle("open"));

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => navegacao.classList.remove("open"));
});


// AGENDAMENTO

function abrirModal(servico = "") {
    modalAgendamento.classList.add("open");
    modalAgendamento.setAttribute("aria-hidden", "false");
    seletorServico.value = servico;
    elemento("clientName").focus();
}

function fecharModal() {
    modalAgendamento.classList.remove("open");
    modalAgendamento.setAttribute("aria-hidden", "true");
}

elemento("openAppointment").addEventListener("click", () => abrirModal());
elemento("closeAppointment").addEventListener("click", fecharModal);

modalAgendamento.addEventListener("click", evento => {
    if (evento.target === modalAgendamento) fecharModal();
});

document.querySelectorAll(".service-book").forEach(botao => {
    botao.addEventListener("click", () => abrirModal(botao.dataset.service));
});

elemento("appointmentForm").addEventListener("submit", evento => {
    evento.preventDefault();

    const nomeCliente = elemento("clientName").value;
    const nomePet = elemento("petName").value;
    const servico = seletorServico.value;
    const dataFormatada = new Date(`${campoData.value}T12:00:00`).toLocaleDateString("pt-BR");

    elemento("formMessage").textContent = `Pronto, ${nomeCliente}! O atendimento de ${nomePet} para ${servico} foi solicitado para ${dataFormatada}.`;
    evento.target.reset();
    mostrarAviso("Agendamento realizado! ");
});

// Mostra os produtos assim que a página carrega.
renderizarProdutos();
