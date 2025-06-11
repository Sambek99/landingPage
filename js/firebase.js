// js/firebase.js

// Importar las funciones de Firebase desde el CDN
// Se utiliza la versión 11.9.1 de las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
// Añadidas 'get' y 'child' a las importaciones
import { getDatabase, ref, set, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

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

/**
 * Obtiene todos los votos de la colección 'votes' de la base de datos.
 * Utiliza 'get' para una lectura única de los datos.
 *
 * @returns {Promise<{success: boolean, data: Array<Object>|null, message: string}>}
 * Una promesa que resuelve con un objeto que contiene el resultado de la operación.
 */
const getVotes = async () => {
  try {
    // Obtener una referencia a la colección 'votes' de la base de datos.
    const dbRef = ref(database); // Referencia a la raíz de la base de datos

    // Utilizar get() para obtener una instantánea de los datos del nodo 'votes'
    // child(dbRef, 'votes') construye la referencia al nodo 'votes'
    const snapshot = await get(child(dbRef, 'votes'));

    if (snapshot.exists()) {
      const data = snapshot.val();
      const votes = [];
      // Convertir el objeto de votos en un array
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          votes.push(data[key]);
        }
      }
      return { success: true, data: votes, message: 'Votos obtenidos exitosamente.' };
    } else {
      // No hay datos en la colección 'votes'
      return { success: true, data: [], message: 'No hay votos registrados.' };
    }
  } catch (error) {
    console.error("Error al obtener los votos:", error);
    return { success: false, data: null, message: `Error al obtener los votos: ${error.message}` };
  }
};

// Exportar las funciones saveVote y getVotes, junto con onValue, database y ref
export { saveVote, getVotes, onValue, database, ref };