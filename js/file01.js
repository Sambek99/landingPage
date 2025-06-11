"use strict";

// Importar las funciones necesarias desde firebase.js
import { saveVote, getVotes } from './firebase.js'; // Importamos getVotes
import { fetchFakerData } from './functions.js';

(function () {
    const welcomeMessage = "¡Bienvenido a nuestra página!";
    alert(welcomeMessage);
    console.log(welcomeMessage);
})();

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

const loadData = async () => {
    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
        } else {
            console.error('Error al obtener los datos:', result.error);
        }

        if (result.success) {
            renderCards(result.body.data);
            console.log('Datos obtenidos con éxito:', result.body);
        }
    } catch (error) {
        console.error('Ocurrió un error inesperado:', error);
    }
};

const renderCards = (items) => {
    const container = document.getElementById("skeleton-container");
    if (!container) return;

    container.innerHTML = ""; // Limpiar contenido previo

    items.slice(0, 3).forEach(({ title, author, genre, content }) => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow-md p-6 mb-4 max-w-md mx-auto";
        card.innerHTML = `
            <h2 class="text-xl font-bold mb-2">${title}</h2>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Autor:</span> ${author}</p>
            <p class="text-gray-500 mb-2"><span class="font-semibold">Género:</span> ${genre}</p>
            <p class="text-gray-800">${content}</p>
        `;
        container.appendChild(card);
    });
};

/**
 * Muestra los votos obtenidos de Firebase en una tabla HTML.
 */
async function displayVotes() {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) {
        console.error('Error: Elemento con ID "results" no encontrado en el HTML.');
        return;
    }

    resultsDiv.innerHTML = '<p class="text-gray-500 text-center mt-4">Cargando resultados de votación...</p>';

    const productSelect = document.getElementById('select_product');
    let productNames = {};
    if (productSelect) {
        // Mapear los value a textContent para mostrar nombres legibles
        Array.from(productSelect.options).forEach(option => {
            if (option.value) {
                productNames[option.value] = option.textContent;
            }
        });
    }


    const result = await getVotes();

    if (result.success && result.data) {
        const votes = result.data;
        const productCounts = {};

        // Inicializar conteos para todos los productos posibles del select
        for (const productId in productNames) {
            productCounts[productId] = 0;
        }

        // Contar los votos
        votes.forEach(vote => {
            if (productCounts.hasOwnProperty(vote.productID)) {
                productCounts[vote.productID]++;
            } else {
                // Si hay un voto para un producto no listado en el select
                productCounts[vote.productID] = (productCounts[vote.productID] || 0) + 1;
                productNames[vote.productID] = `Producto (ID: ${vote.productID})`; // Nombre genérico
            }
        });

        let tableHtml = `
            <h3 class="text-lg font-semibold text-center text-gray-800 mb-2">Resultados de Votación:</h3>
            <table class="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-b text-left text-gray-700">Producto</th>
                        <th class="py-2 px-4 border-b text-right text-gray-700">Total de Votos</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Ordenar los productos por la cantidad de votos de forma descendente
        const sortedProductIds = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);

        sortedProductIds.forEach(productId => {
            tableHtml += `
                <tr>
                    <td class="py-2 px-4 border-b text-gray-800">${productNames[productId] || productId}</td>
                    <td class="py-2 px-4 border-b text-right text-gray-800">${productCounts[productId]}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;
        resultsDiv.innerHTML = tableHtml;

    } else if (result.success && result.data.length === 0) {
        resultsDiv.innerHTML = '<p class="text-gray-500 text-center mt-16">Aún no hay votos registrados.</p>';
    }
    else {
        resultsDiv.innerHTML = `<p class="text-red-600 text-center mt-4">Error al cargar los votos: ${result.message}</p>`;
    }
}


/**
 * Habilita el formulario de votación, añadiendo un listener para el evento submit.
 */
function enableForm() {
    const votingForm = document.getElementById('form_voting');
    const productSelect = document.getElementById('select_product');
    const resultsDiv = document.getElementById('results');

    if (!votingForm || !productSelect || !resultsDiv) {
        console.error('Error: No se encontraron los elementos HTML del formulario de votación. Asegúrate de que los IDs "form_voting", "select_product" y "results" existen en tu HTML.');
        return;
    }

    votingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedProduct = productSelect.value;

        if (!selectedProduct) {
            resultsDiv.innerHTML = '<p class="text-red-600 text-center mt-4">Por favor, selecciona un producto antes de votar.</p>';
            return;
        }

        resultsDiv.innerHTML = '<p class="text-blue-600 text-center mt-4">Enviando tu voto...</p>';

        const result = await saveVote(selectedProduct);

        if (result.success) {
            resultsDiv.innerHTML = `<p class="text-green-600 text-center mt-4">${result.message}</p>`;
            productSelect.value = ''; // Limpia la selección
            displayVotes(); // <-- Invoca displayVotes después de guardar un voto
        } else {
            resultsDiv.innerHTML = `<p class="text-red-600 text-center mt-4">${result.message}</p>`;
        }
    });
}

// Función de autoejecución para inicializar todas las funcionalidades
(() => {
    showToast();
    showVideo();
    loadData();
    enableForm(); // Inicializa el formulario de votación
    displayVotes(); // <-- Invoca displayVotes al cargar la página para mostrar resultados iniciales
})();