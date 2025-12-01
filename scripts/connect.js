console.log("Script connect.js cargado");

window.addEventListener("load", (event) => {
  let id = document.getElementById("qr0");
  console.log("value: " + id.value);
});

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
      this.syncData();
      this.timer = setInterval(() => this.syncData(), this.data.interval);
    }
  },

  syncData: function () {
    // Añadimos un timestamp para ver que se actualiza
    let hora = new Date().toLocaleTimeString();

    fetch(this.data.url)
      .then(response => response.json())
      .then(data => {
        // 1. ACTUALIZAMOS LA ESCENA 3D (Tu código normal)
        if (data.color) this.el.setAttribute('material', 'color', data.color);
        if (data.size) {
            let s = parseFloat(data.size);
            this.el.setAttribute('scale', {x: s, y: s, z: s});
        }

        // 2. ACTUALIZAMOS EL TEXTO EN PANTALLA
        // Usamos JSON.stringify para convertir el objeto de datos a texto legible
        let mensaje = `
          <strong>[${hora}] Datos recibidos:</strong><br>
          Color: ${data.color}<br>
          Escala: ${data.size}<br>
          Visible: ${data.visible}
        `;
        
        if (this.consoleDiv) {
            this.consoleDiv.innerHTML = mensaje;
            this.consoleDiv.style.color = "#00FF00"; // Verde si todo va bien
        }
      })
      .catch(error => {
        // SI HAY ERROR, LO MOSTRAMOS EN ROJO
        if (this.consoleDiv) {
            this.consoleDiv.innerHTML = `[${hora}] ERROR: ${error.message}`;
            this.consoleDiv.style.color = "red";
        }
      });
  },

  remove: function () {
    if (this.timer) clearInterval(this.timer);
  }
});