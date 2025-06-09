"use strict";
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


(() => {
    showToast();
    showVideo();
    loadData();
})();