const firebaseConfig = {
  apiKey: "AIzaSyDO_C2ZChRJXxd0pgZ_jsVa1-kwYMqcyzY",
  authDomain: "c4d2v-1r-t2st.firebaseapp.com",
  projectId: "c4d2v-1r-t2st",
  storageBucket: "c4d2v-1r-t2st.firebasestorage.app",
  messagingSenderId: "816530265874",
  appId: "1:816530265874:web:30b752fd785c708e8f85cb"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
// Inicializa Firestore
const db = firebase.firestore();

// Actualización del cubo según la base de datos
window.onload = function() {
  const consoleDiv = document.getElementById('consola-datos');
  const container = document.getElementById('markers');
    // db.collection("modelos").doc("1").onSnapshot((doc) => {
    //         if (doc.exists) {
    //             const data = doc.data();
                
    //             // Por ahora solo color y tamaño para probar
    //             const color = data.clr_model || 'gray';
    //             const size = data.sz_model || 1;
                
    //             // Aplica los datos al marcador de A-Frame (Ejemplo con marcador 0)
    //             const marker0Box = document.querySelector('a-marker[value="0"] a-box');
    //             if (marker0Box) {
    //                 marker0Box.setAttribute('color', color);
    //                 marker0Box.setAttribute('scale', `${size} ${size} ${size}`);
    //                 const horaAct = new Date();
    //                 consoleDiv.innerHTML = `Datos de Firebase cargados: Color=${color}, Tamaño=${size}.\nActualizados a las [${horaAct.toLocaleTimeString()}]`;
    //             } else {
    //                 consoleDiv.innerHTML = `ERROR: No se encontró el elemento a-box del marcador 0.`;
    //             }
    //         } else {
    //             consoleDiv.innerHTML = `ERROR: El documento '1' no existe en Firebase.`;
    //         }
    //     }, (error) => {
    //       consoleDiv.innerHTML = `El listener de Firebase falló. Error: ${error}`;
    //     })
    //     .catch((error) => {
    //         const consoleDiv = document.getElementById('consola-datos');
    //         consoleDiv.innerHTML = `ERROR al leer Firebase: ${error}`;
    //         console.error("Error al obtener el documento:", error);
    //     });

  db.collection("modelos").get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        consoleDiv.innerHTML = "No hay nada en la colección 'modelos'";
        return;
      }

      const documentos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      consoleDiv.innerHTML = `Documentos obtenidos: ${documentos.length}<br>`;

      documentos.forEach((el) => {
        const idMarker = el.id;
        const marker = document.createElement("a-marker");
        // Se utiliza el ID de la base de datos tanto para identificar al marcador como para indicarle que valor de barcode va a utilizar
        marker.setAttribute("id", idMarker);
        marker.setAttribute("type", "barcode");
        marker.setAttribute("value", idMarker);

        // Por ahora voy a insertar cajas para ir probando
        // TODO: Añadir un condicional que compruebe si se le ha pasado la URL de un modelo y, de haberlo hecho.
        //        usar el modelo. SI no lo tiene, usar una caja

        const obj = document.createElement("a-box");

        const color = data.clr_model || 'gray';
        const size = data.sz_model || 1;
        obj.setAttribute("color", color);
        obj.setAttribute("scale", `${size} ${size} ${size}`);
        obj.setAttribute("position", "0 0.5 0");
        obj.setAttribute("rotation", "-90 0 0");

        marker.appendChild(obj);
        container.appendChild(marker);

        consoleDiv.innerHTML += `➤ Creado marker ID=${markerId}, barcode=${barcodeValue}<br>`;
      })
      .catch((error) => {
            const consoleDiv = document.getElementById('consola-datos');
            consoleDiv.innerHTML = `ERROR al leer Firebase: ${error}`;
            console.error("Error al obtener el documento:", error);
        });
    })
  };

