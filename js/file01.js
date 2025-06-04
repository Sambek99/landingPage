"use strict";
(function() {
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

(() => {
    showToast();
})();