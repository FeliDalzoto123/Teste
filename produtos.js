
/*
 * CATÁLOGO CAMPOS GERAIS
 * Não utiliza banco de dados.
 *
 * Para cadastrar produtos, edite a lista abaixo.
 * Confirme preços, imagens e disponibilidade antes de publicar.
 */

const WHATSAPP_NUMBER = "5542984410430";

const products = [
    {
        id: 1,
        name: "Ração para cães",
        category: "Cães",
        description: "Alimentação para a rotina do seu cão. Consulte marcas e tamanhos.",
        price: null,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Petiscos para cães",
        category: "Cães",
        description: "Opções de petiscos para agradar seu companheiro.",
        price: null,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Brinquedos para pets",
        category: "Acessórios",
        description: "Brinquedos para diversão e enriquecimento ambiental.",
        price: null,
        image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Coleiras e guias",
        category: "Acessórios",
        description: "Consulte modelos, tamanhos e opções para passeios.",
        price: null,
        image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Produtos para gatos",
        category: "Gatos",
        description: "Consulte opções de alimentação e acessórios para felinos.",
        price: null,
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Higiene para pets",
        category: "Higiene",
        description: "Produtos para a rotina de higiene e cuidados do seu pet.",
        price: null,
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Camas para pets",
        category: "Acessórios",
        description: "Consulte modelos e tamanhos para o conforto do seu pet.",
        price: null,
        image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Areia para gatos",
        category: "Gatos",
        description: "Consulte marcas e tipos de areia disponíveis.",
        price: null,
        image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=700&q=80"
    }
];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("product-search");
const categoryFilters = document.getElementById("category-filters");
const emptyState = document.getElementById("empty-state");
const cartCount = document.getElementById("cart-count");
const clearCartButton = document.getElementById("clear-cart");
const sendOrderButton = document.getElementById("send-order");

const cart = new Map();

let selectedCategory = "Todos";

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));
}

function formatPrice(product) {
    if (typeof product.price === "number" &&
        Number.isFinite(product.price) &&
        product.price >= 0) {

        return product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    return "Consultar preço";
}

function renderProducts() {
    const searchTerm = searchInput.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "Todos" ||
            product.category === selectedCategory;

        const searchableText = [
            product.name,
            product.category,
            product.description
        ].join(" ").toLocaleLowerCase("pt-BR");

        return matchesCategory &&
            searchableText.includes(searchTerm);
    });

    productGrid.innerHTML = filteredProducts.map(product => {
        const quantity = cart.get(product.id) || 0;

        return `
            <article class="product-card">
                <div class="product-image-wrap">
                    <img
                        class="product-image"
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >
                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>
                </div>

                <div class="product-info">
                    <h3>${escapeHTML(product.name)}</h3>

                    <p class="product-description">
                        ${escapeHTML(product.description)}
                    </p>

                    <div class="product-price">
                        ${escapeHTML(formatPrice(product))}
                        <small>
                            Consulte preço e disponibilidade
                        </small>
                    </div>

                    <div class="product-actions">
                        <button
                            class="add-button ${quantity ? "selected" : ""}"
                            type="button"
                            data-add="${product.id}"
                        >
                            ${quantity
                                ? `Adicionar mais (${quantity})`
                                : "Adicionar ao pedido"}
                        </button>

                        ${quantity ? `
                            <button
                                class="remove-button"
                                type="button"
                                data-remove="${product.id}"
                            >
                                Remover
                            </button>
                        ` : ""}
                    </div>
                </div>
            </article>
        `;
    }).join("");

    emptyState.hidden = filteredProducts.length !== 0;

    // Evita que uma imagem indisponível quebre o card.
    productGrid.querySelectorAll(".product-image").forEach(image => {
        image.addEventListener("error", () => {
            image.src =
                "https://placehold.co/700x500/edf4ec/14532d?text=Produto";
        }, { once: true });
    });

    updateCart();
}

function updateCart() {
    let totalItems = 0;

    for (const quantity of cart.values()) {
        totalItems += quantity;
    }

    cartCount.textContent = totalItems;
    sendOrderButton.disabled = totalItems === 0;
}

productGrid.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const removeButton = event.target.closest("[data-remove]");

    if (addButton) {
        const id = Number(addButton.dataset.add);

        cart.set(id, (cart.get(id) || 0) + 1);

        renderProducts();
    }

    if (removeButton) {
        const id = Number(removeButton.dataset.remove);
        const quantity = cart.get(id) || 0;

        if (quantity <= 1) {
            cart.delete(id);
        } else {
            cart.set(id, quantity - 1);
        }

        renderProducts();
    }
});

searchInput.addEventListener("input", renderProducts);

categoryFilters.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category;

    categoryFilters.querySelectorAll("[data-category]")
        .forEach(categoryButton => {
            const active = categoryButton === button;

            categoryButton.classList.toggle("active", active);
            categoryButton.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

    renderProducts();
});

clearCartButton.addEventListener("click", () => {
    cart.clear();
    renderProducts();
});

sendOrderButton.addEventListener("click", () => {
    const selectedProducts = products.filter(product =>
        cart.has(product.id)
    );

    if (selectedProducts.length === 0) return;

    const orderLines = selectedProducts.map(product => {
        const quantity = cart.get(product.id);

        return `- ${product.name} | Quantidade: ${quantity} | ${formatPrice(product)}`;
    });

    const message = [
        "Olá! Gostaria de consultar os seguintes produtos da Campos Gerais:",
        "",
        ...orderLines,
        "",
        "Poderiam confirmar os preços finais e a disponibilidade?"
    ].join("\n");

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

renderProducts();