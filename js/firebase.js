// js/firebase.js

// Importar las funciones de Firebase desde el CDN
// Se utiliza la versión 11.9.1 de las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración de Firebase utilizando variables de entorno de Vite.
// Es crucial que estas variables en tu archivo .env comiencen con VITE_
// para que Vite las exponga al código del lado del cliente.
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
 * @returns {Promise<{success: boolean, message: string}>} Una promesa que resuelve
 * con un objeto indicando el resultado de la operación (éxito o error).
 */
const saveVote = async (productID) => {
  try {
    // Obtener una referencia a la colección 'votes' en la base de datos.
    const votesRef = ref(database, 'votes');

    // Crear una nueva referencia única para este voto utilizando push().
    // Esto genera una clave única y cronológica (ej: -M_abcd123XYZ), ideal para nuevas entradas.
    const newVoteRef = push(votesRef);

    // Obtener la fecha y hora actual para registrar el momento del voto.
    const now = new Date();
    const voteData = {
      productID: productID,
      timestamp: now.toISOString() // Guarda la fecha en formato ISO para facilitar la comparación y lectura.
    };

    // Guardar los datos del voto en la base de datos utilizando la referencia única.
    await set(newVoteRef, voteData);

    // Si la operación es exitosa, devuelve un objeto con un mensaje de éxito.
    return { success: true, message: '¡Tu voto ha sido guardado exitosamente!' };
  } catch (error) {
    // Si ocurre un error, registra el error en la consola y devuelve un objeto
    // con un mensaje de error para el usuario.
    console.error("Error al guardar el voto:", error);
    return { success: false, message: `Ocurrió un error al guardar tu voto: ${error.message}` };
  }
};

// Exportar la función saveVote para que pueda ser importada y utilizada
// en otros archivos JavaScript de tu proyecto.
// También exportamos 'onValue', 'database' y 'ref' para las funcionalidades de lectura.
export { saveVote, onValue, database, ref };