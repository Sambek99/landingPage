// js/firebase.js

// Importar las funciones de Firebase desde el CDN
// Se utiliza la versión 11.9.1 como se especifica
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración de Firebase utilizando variables de entorno de Vite
// Las variables de entorno en Vite se acceden a través de import.meta.env
// y deben tener el prefijo VITE_ para ser expuestas al cliente.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener una referencia a la base de datos en tiempo real
const database = getDatabase(app);

/**
 * Guarda un voto para un producto específico en la base de datos de Firebase.
 *
 * @param {string} productID El ID del producto por el que se está votando.
 * @returns {Promise<{success: boolean, message: string}>} Una promesa que resuelve con un objeto indicando el resultado de la operación.
 */
const saveVote = async (productID) => {
  try {
    // 1. Obtener una referencia a la colección 'votes'
    const votesRef = ref(database, 'votes');

    // 2. Crear una nueva referencia para un voto utilizando push()
    // Esto generará una clave única para cada voto (ej: -M_abcd123XYZ)
    const newVoteRef = push(votesRef);

    // 3. Obtener la fecha y hora actual
    const now = new Date();
    const voteData = {
      productID: productID,
      timestamp: now.toISOString() // Guarda la fecha en formato ISO para fácil comparación y lectura
    };

    // 4. Guardar los datos en la base de datos con set()
    await set(newVoteRef, voteData);

    return { success: true, message: 'Voto guardado exitosamente.' };
  } catch (error) {
    console.error("Error al guardar el voto:", error);
    return { success: false, message: `Error al guardar el voto: ${error.message}` };
  }
};

// Exportar la función saveVote
export { saveVote };