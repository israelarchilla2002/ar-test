console.log("Script connect.js cargado");

//Establecer conexion con API
AFRAME.registerComponent('conexion-db', {
  schema: {
    url: { type: 'string', default: '' },
    interval: { type: 'number', default: 2000 }
  },

  init: function () {
    // Referencia al div de la pantalla
    this.consoleDiv = document.getElementById('consola-datos');
    
    if (this.data.url) {
      // this.syncData();
      this.debugFetch();
      // this.timer = setInterval(() => this.syncData(), this.data.interval);
    }
  },


  debugFetch: function () {

    const url = this.data.url;
    const hora = new Date().toLocaleTimeString();

    console.log("===== DEBUG INICIADO =====");
    console.log("URL consultada:", url);

    fetch(url, { redirect: "follow" })
        .then(async (response) => {

            console.log("Estado HTTP:", response.status);
            console.log("Content-Type:", response.headers.get("content-type"));
            console.log("¿Redirigido?:", response.redirected);
            console.log("URL final:", response.url);

            // Primero leemos la respuesta como texto crudo
            const rawText = await response.text();

            console.log("---- RESPUESTA CRUDA ----");
            console.log(rawText);

            // Si empieza con "<", seguro es HTML → error
            if (rawText.trim().startsWith("<")) {
                console.error("❌ ERROR: El servidor devolvió HTML, NO JSON.");
                this.consoleDiv.innerHTML =
                    `<span style="color:red">[${hora}] ERROR: El servidor devolvió HTML, no JSON.</span><br><pre>${rawText.substring(0,300)}</pre>`;
                return; 
            }

            // Intentar parsear JSON
            try {
                const data = JSON.parse(rawText);
                console.log("JSON decodificado:", data);

                // Mostrarlo en pantalla
                this.consoleDiv.innerHTML = `
                    <strong>[${hora}] JSON recibido:</strong><br>
                    Color: ${data.color}<br>
                    Size: ${data.size}<br>
                `;
                this.consoleDiv.style.color = "#00FF00";

            } catch (jsonError) {
                console.error("❌ ERROR PARSEANDO JSON:", jsonError);
                this.consoleDiv.innerHTML =
                    `<span style="color:red">[${hora}] ERROR al parsear JSON:</span><br>${jsonError}<br><pre>${rawText.substring(0,300)}</pre>`;
            }
        })
        .catch((error) => {
            console.error("❌ ERROR FETCH:", error);
            this.consoleDiv.innerHTML =
                `<span style="color:red">[${hora}] ERROR en fetch: ${error.message}</span>`;
        });
  },


  // syncData: function () {
  //   // Añadimos un timestamp para ver que se actualiza
  //   let hora = new Date().toLocaleTimeString();

  //   fetch(this.data.url)
  // .then(response => response.json())   // ← aquí devolvemos la promesa
  // .then(texto => {
  //   this.consoleDiv.innerHTML = `CRUDO: ${texto}`;
  // })
  // .then(data => {                      // ← aquí recibimos el JSON ya convertido

  //   this.consoleDiv.innerHTML = `<p>${data}</p>`;

  //   // 1. ACTUALIZAMOS LA ESCENA 3D
  //   if (data.color) this.el.setAttribute('material', 'color', data.color);

  //   if (data.size) {
  //     let s = parseFloat(data.size);
  //     this.el.setAttribute('scale', { x: s, y: s, z: s });
  //   }

  //   // 2. TEXTO EN PANTALLA
  //   let hora = new Date().toLocaleTimeString();
  //   let mensaje = `
  //     <strong>[${hora}] Datos recibidos:</strong><br>
  //     Color: ${data.color}<br>
  //     Escala: ${data.size}<br>
  //     Visible: ${data.visible}
  //   `;

  //   if (this.consoleDiv) {
  //     this.consoleDiv.innerHTML = mensaje;
  //     this.consoleDiv.style.color = "#00FF00";
  //   }
  // })
  // .catch(error => {
  //   if (this.consoleDiv) {
  //     this.consoleDiv.innerHTML = `ERROR: ${error.message}`;
  //     this.consoleDiv.style.color = "red";
  //   }
  // });
    
  // },

  remove: function () {
    if (this.timer) clearInterval(this.timer);
  }
});