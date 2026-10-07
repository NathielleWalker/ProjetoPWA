const products = [

    {
        id: 1,
        name: "Ração Premium",
        category: "Alimentação",
        price: 79.90,
        image: "Imagens/produtos/images (1).jpg",
        description: "Alimento completo para uma rotina equilibrada."
    },

    {
        id: 2,
        name: "Petisco Natural",
        category: "Alimentação",
        price: 24.90,
        image: "Imagens/produtos/petisco.png",
        description: "Petisco para recompensar com carinho."
    },

    {
        id: 3,
        name: "Shampoo Suave",
        category: "Higiene",
        price: 32.90,
        image: "Imagens/produtos/shampoo1.jpg",
        description: "Limpeza suave para pele e pelos."
    },

    {
        id: 4,
        name: "Brinquedo Mordedor",
        category: "Brinquedos",
        price: 29.90,
        image: "Imagens/produtos/brinquedo.webp",
        description: "Diversão e estímulo para o seu pet."
    },

    {
        id: 5,
        name: "Bola Interativa",
        category: "Brinquedos",
        price: 39.90,
        image: "Imagens/produtos/bola.jpg",
        description: "Brincadeira para gastar energia."
    },

    {
        id: 6,
        name: "Cama Confortável",
        category: "Acessórios",
        price: 119.90,
        image: "Imagens/produtos/cama.jpg",
        description: "Um cantinho confortável para descansar."
    },

    {
        id: 7,
        name: "Coleira Ajustável",
        category: "Acessórios",
        price: 44.90,
        image: "Imagens/produtos/coleira.jpg",
        description: "Conforto e segurança para os passeios."
    },

    {
        id: 8,
        name: "Kit Higiene",
        category: "Higiene",
        price: 54.90,
        image: "Imagens/produtos/kithigiene.webp",
        description: "Itens essenciais para a rotina de cuidados."
    },

    {
        id: 9,
        name: "Comedouro",
        category: "Acessórios",
        price: 35.90,
        image: "Imagens/produtos/comedouro.jpg",
        description: "Prático para água e alimentação."
    },

    {
        id: 10,
        name: "Arranhador",
        category: "Brinquedos",
        price: 89.90,
        image: "Imagens/produtos/arranhador.jpg",
        description: "Diversão e enriquecimento para gatos."
    }

];


/* =========================
   CARRINHO E FAVORITOS
========================= */

let cart = JSON.parse(
    localStorage.getItem("connectpet-cart") || "{}"
);

let favorites = JSON.parse(
    localStorage.getItem("connectpet-favorites") || "[]"
);


/*
    Compatibilidade com a versão anterior.

    Se o navegador ainda tiver o carrinho
    antigo salvo como array, transformamos
    automaticamente em quantidade.
*/

if (Array.isArray(cart)) {

    const oldCart = {};

    cart.forEach(id => {

        oldCart[id] =
            (oldCart[id] || 0) + 1;

    });

    cart = oldCart;

    localStorage.setItem(
        "connectpet-cart",
        JSON.stringify(cart)
    );
}


/* ELEMENTOS */

const productGrid =
    document.getElementById("productGrid");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const emptyState =
    document.getElementById("emptyState");

const cartCount =
    document.getElementById("cartCount");

const toast =
    document.getElementById("toast");


/* =========================
   FORMATAÇÃO DO PREÇO
========================= */

function money(value) {

    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================
   PRODUTOS
========================= */

function renderProducts() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const category =
        categoryFilter.value;


    const filtered =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.description
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "Todos"

                ||

                product.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    productGrid.innerHTML =
        filtered.map(product => {

            const isFavorite =
                favorites.includes(product.id);

            const quantity =
                cart[product.id] || 0;


            return `

                <article class="product-card">

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                        <button
                            class="favorite ${isFavorite ? "active" : ""}"
                            data-favorite="${product.id}"
                            aria-label="Favoritar">

                            ${isFavorite ? "♥" : "♡"}

                        </button>

                    </div>


                    <div class="product-info">

                        <span class="tag">
                            ${product.category}
                        </span>


                        <h3>
                            ${product.name}
                        </h3>


                        <p>
                            ${product.description}
                        </p>


                        <div class="product-bottom">

                            <span class="price">
                                ${money(product.price)}
                            </span>


                            <div class="quantity-control">

                                <button
                                    class="quantity-btn decrease"
                                    data-quantity="decrease"
                                    data-id="${product.id}"
                                    aria-label="Diminuir quantidade">

                                    −

                                </button>


                                <span class="quantity-value">
                                    ${quantity}
                                </span>


                                <button
                                    class="quantity-btn increase"
                                    data-quantity="increase"
                                    data-id="${product.id}"
                                    aria-label="Aumentar quantidade">

                                    +

                                </button>

                            </div>

                        </div>

                    </div>

                </article>

            `;

        }).join("");


    emptyState.hidden =
        filtered.length !== 0;


    updateCartCount();

}


/* =========================
   CONTADOR DO CARRINHO
========================= */

function updateCartCount() {

    const totalItems =
        Object.values(cart)
            .reduce(
                (total, quantity) =>
                    total + quantity,
                0
            );


    cartCount.textContent =
        totalItems;

}


/* =========================
   MENSAGEM
========================= */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =========================
   BOTÕES DOS PRODUTOS
========================= */

productGrid.addEventListener(
    "click",
    event => {

        const quantityButton =
            event.target.closest(
                "[data-quantity]"
            );


        const favoriteButton =
            event.target.closest(
                "[data-favorite]"
            );


        /* AUMENTAR / DIMINUIR */

        if (quantityButton) {

            const id =
                Number(
                    quantityButton.dataset.id
                );


            const action =
                quantityButton.dataset.quantity;


            const currentQuantity =
                cart[id] || 0;


            if (action === "increase") {

                cart[id] =
                    currentQuantity + 1;


                showToast(
                    "Produto adicionado ao carrinho! 🐾"
                );

            }


            else if (
                action === "decrease"
            ) {

                if (currentQuantity <= 1) {

                    delete cart[id];

                    showToast(
                        "Produto removido do carrinho."
                    );

                }

                else {

                    cart[id] =
                        currentQuantity - 1;

                }

            }


            localStorage.setItem(
                "connectpet-cart",
                JSON.stringify(cart)
            );


            renderProducts();

        }


        /* FAVORITOS */

        if (favoriteButton) {

            const id =
                Number(
                    favoriteButton.dataset.favorite
                );


            favorites =
                favorites.includes(id)

                ?

                favorites.filter(
                    item => item !== id
                )

                :

                [
                    ...favorites,
                    id
                ];


            localStorage.setItem(
                "connectpet-favorites",
                JSON.stringify(favorites)
            );


            renderProducts();


            showToast(
                favorites.includes(id)

                ?

                "Adicionado aos favoritos! ♥"

                :

                "Removido dos favoritos."
            );

        }

    }
);


/* =========================
   PESQUISA
========================= */

searchInput.addEventListener(
    "input",
    renderProducts
);


categoryFilter.addEventListener(
    "change",
    renderProducts
);


/* =========================
   CATEGORIAS
========================= */

document
    .querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                categoryFilter.value =
                    card.dataset.filter;


                renderProducts();


                document
                    .getElementById("produtos")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* =========================
   CARRINHO
========================= */

document
    .getElementById("cartBtn")
    .addEventListener(
        "click",
        () => {

            const totalItems =
                Object.values(cart)
                    .reduce(
                        (total, quantity) =>
                            total + quantity,
                        0
                    );


            if (!totalItems) {

                showToast(
                    "Seu carrinho está vazio."
                );

                return;
            }


            showToast(
                `Você tem ${totalItems} item(ns) no carrinho.`
            );

        }
    );


/* =========================
   FAVORITOS
========================= */

document
    .getElementById("favoritesBtn")
    .addEventListener(
        "click",
        () => {

            if (!favorites.length) {

                showToast(
                    "Você ainda não tem favoritos."
                );

                return;
            }


            categoryFilter.value =
                "Todos";

            searchInput.value =
                "";


            renderProducts();


            document
                .getElementById("produtos")
                .scrollIntoView({
                    behavior: "smooth"
                });


            showToast(
                `Você tem ${favorites.length} favorito(s). ♥`
            );

        }
    );


/* =========================
   MENU MOBILE
========================= */

const nav =
    document.getElementById("nav");


document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "open"
            );

        }
    );


document
    .querySelectorAll(".nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                nav.classList.remove(
                    "open"
                );

            }
        );

    });


/* =========================
   MODAL DE AGENDAMENTO
========================= */

const modal =
    document.getElementById(
        "appointmentModal"
    );


const serviceSelect =
    document.getElementById(
        "serviceSelect"
    );


function openModal(service = "") {

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    serviceSelect.value =
        service;


    document
        .getElementById("clientName")
        .focus();

}


function closeModal() {

    modal.classList.remove(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


document
    .getElementById("openAppointment")
    .addEventListener(
        "click",
        () => openModal()
    );


document
    .getElementById("closeAppointment")
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


/* BOTÕES DE SERVIÇO */

document
    .querySelectorAll(".service-book")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openModal(
                    button.dataset.service
                );

            }
        );

    });


/* =========================
   FORMULÁRIO
========================= */

document
    .getElementById("appointmentForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("clientName")
                    .value;


            const pet =
                document
                    .getElementById("petName")
                    .value;


            const service =
                serviceSelect.value;


            const date =
                document
                    .getElementById("appointmentDate")
                    .value;


            const formattedDate =
                new Date(
                    `${date}T12:00:00`
                )
                    .toLocaleDateString(
                        "pt-BR"
                    );


            document
                .getElementById("formMessage")
                .textContent =

                `Pronto, ${name}! O atendimento de ${pet} para ${service} foi solicitado para ${formattedDate}.`;


            event.target.reset();


            showToast(
                "Agendamento realizado! 🐶"
            );

        }
    );


/* =========================
   DATA MÍNIMA
========================= */

const today =
    new Date()
        .toISOString()
        .split("T")[0];


document
    .getElementById("appointmentDate")
    .min = today;


/* =========================
   INICIALIZAÇÃO
========================= */

renderProducts();