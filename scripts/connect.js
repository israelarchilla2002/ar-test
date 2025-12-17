AFRAME.registerComponent('conexion-db', {
  schema: {
    markerId: {type: 'string'},
    url: { type: 'string', default: '' },
    interval: { type: 'number', default: 2000 }
  },

  init: function () {
    // Referencia al div de consola
    this.consoleDiv = document.getElementById('consola-datos') || document.getElementById('desact');
    this.consoleDiv.innerHTML = 'connect.js se ha cargado correctamente.';

    this.timer = null;
    this.lastData = null;
    this.markerEl = this.el.parentNode;

    // Event listeners para el marker
    this.markerEl.addEventListener('markerFound', this.startPolling.bind(this));
    this.markerEl.addEventListener('markerLost', this.stopPolling.bind(this));

    // Planos y textos
    this.topPlane = document.getElementById("topPlane" + this.data.markerId);
    this.botPlane = document.getElementById("botPlane" + this.data.markerId);
    this.topText = document.getElementById("topText" + this.data.markerId);
    this.botText = document.getElementById("botText" + this.data.markerId);
    this.scene = document.getElementById("escena");

    if (!this.topPlane || !this.botPlane) {
      console.warn("No se encontraron los planos para el marker:", this.data.markerId);
    }
  },

  startPolling: function() {
    if (this.timer !== null) return;

    const urlId = `${this.data.url}?id=${this.data.markerId}`;
    this.syncData(urlId);
    this.timer = setInterval(() => this.syncData(urlId), this.data.interval);
  },

  stopPolling: function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.lastData = null;
      this.consoleDiv.innerHTML = `Parando polling para el marker con ID ${this.data.markerId}`;
    }
  },

  syncData: function(url) {
    let hora = new Date().toLocaleTimeString();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (JSON.stringify(data) === JSON.stringify(this.lastData)) return;
        this.lastData = data;

        // Cambiar modelo según valor
        if(data.valor !== undefined){
          let modelo = "";
          if(0 <= data.valor && data.valor <= 30) modelo = "modelos/decanter_red.glb";
          else if(31 <= data.valor && data.valor <= 70) modelo = "modelos/decanter_yellow.glb";
          else if(71 <= data.valor && data.valor <= 100) modelo = "modelos/decanter_green.glb";
          else modelo = "modelos/decanter_black.glb";

          if(this.lastColor !== modelo){
            this.el.removeAttribute("gltf-model");
            this.el.setAttribute("gltf-model", modelo);
            this.lastColor = modelo;
          }
        }

        // Escala
        if(data.size) {
          let s = parseFloat(data.size);
          this.el.setAttribute('scale', { x: s, y: s, z: s });
        }

        // Rotación
        let _x = data.x ? parseFloat(data.x) : 0;
        let _y = data.y ? parseFloat(data.y) : 0;
        let _z = data.z ? parseFloat(data.z) : 0;
        this.el.setAttribute('rotation', { x: _x, y: _y, z: _z });

        // Actualizar posición de los planos según aspect
        let aspect = window.innerWidth / window.innerHeight;
        if(this.topPlane && this.botPlane){
          if(aspect >= 1){
            this.topPlane.setAttribute("position", "2 0 0");
            this.botPlane.setAttribute("position", "-2 0 0");
          } else {
            this.topPlane.setAttribute("position", "0 0 -0.75");
            this.botPlane.setAttribute("position", "0 0 1.5");
          }
        }

        // Actualizar textos
        if(this.topText){
          this.topText.setAttribute("value", `
            ID: ${this.data.markerId}
            Color: ${this.lastColor}
            Escala: ${data.size}
          `);
        }
        if(this.botText){
          this.botText.setAttribute("value", `
            Rotación X: ${data.x}
            Rotación Y: ${data.y}
            Rotación Z: ${data.z}
            Valor: ${data.valor}
          `);
        }

        // Consola
        if(this.consoleDiv){
          this.consoleDiv.innerHTML = `
            <strong>[${hora}] Marcador actualizado.</strong><br>
            ID: ${this.data.markerId}<br>
            Color: ${data.color}<br>
            Escala: ${data.size}<br>
            Visible: ${data.visible}
          `;
          this.consoleDiv.style.color = "#00FF00";
        }
      })
      .catch(error => {
        if(this.consoleDiv){
          this.consoleDiv.innerHTML = `ERROR: ${error.message}`;
          this.consoleDiv.style.color = "red";
        }
      });
  },

  remove: function() {
    this.stopPolling();
    this.markerEl.removeEventListener('markerFound', this.startPolling);
    this.markerEl.removeEventListener('markerLost', this.stopPolling);
  }
});
