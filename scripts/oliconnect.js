
let idPaneles = 0

truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

AFRAME.registerComponent('conexion-oli', {
    schema: {
    markerId: {type: 'string'},
    url: { type: 'string', default: '' },
    interval: { type: 'number', default: 2000 }
  },
  init: function () {
    // Referencia al div de consola
    idPaneles = this.data.markerId
    this.consoleDiv = document.getElementById('consola-datos') || document.getElementById('desact');
    this.consoleDiv.innerHTML = 'oliconnect.js se ha cargado correctamente.';

    this.timer = null;
    this.lastData = null;
    this.markerEl = this.el.parentNode;

    // Event listeners para el marker
    this.markerEl.addEventListener('markerFound', this.startPolling.bind(this));
    this.markerEl.addEventListener('markerLost', this.stopPolling.bind(this));
    
    // Variables para la orientación
    screen.orientation.addEventListener("change", (e) => {
        this.orientacion(e);
      });
    // Planos y textos
    this.topPlane = document.getElementById("topPlane");
    this.botPlane = document.getElementById("botPlane");
    this.topText = document.getElementById("topText");
    this.botText = document.getElementById("botText");
    this.scene = document.getElementById("escena");

    this.lastColor = "decanter_v6_1.glb";

    if (!this.topPlane || !this.botPlane) {
      console.warn("No se encontraron los planos para el marker:", this.data.markerId);
    }

    let orActual = window.innerWidth / window.innerHeight;

    if(orActual <1){
        this.topPlane.setAttribute("position", "0 0 -0.75");
        this.botPlane.setAttribute("position", "0 0 1.5");
    } else {
        this.topPlane.setAttribute("position", "2 0 0");
        this.botPlane.setAttribute("position", "-2 0 0")
    }

  },

  startPolling: function() {
    if (this.timer !== null) return;

    if(this.topPlane.classList.contains("invisible"))
      this.topPlane.classList.remove("invisible");

    if(this.botPlane.classList.contains("invisible"))
      this.botPlane.classList.remove("invisible");

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
    this.topPlane.classList.add("invisible");
    this.botPlane.classList.add("invisible");
  },

  syncData: function(url) {
    let hora = new Date().toLocaleTimeString();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (JSON.stringify(data) === JSON.stringify(this.lastData)) return;
        this.lastData = data;

        // Cambiar modelo según valor (IMPLEMENTACION NO FINAL PARA PRUEBA)
        if(data[1].valor !== undefined){
          let modelo = "modelos/decanter_black.glb";
          let porc = data[1].valor;
          if(0 <= porc && porc <= 30) modelo = "modelos/decanter_red.glb";
          else if(31 <= porc && porc <= 70) modelo = "modelos/decanter_yellow.glb";
          else if(71 <= porc && porc <= 100) modelo = "modelos/decanter_green.glb";
          else modelo = "modelos/decanter_black.glb";

          if(this.lastColor !== modelo){
            this.el.removeAttribute("gltf-model");
            this.el.setAttribute("gltf-model", modelo);
            this.lastColor = modelo;
          }
        }
        // Actualizar textos
        if(this.topText){
            let textoArriba = `Etiqueta: ${data[0].etiqueta} (ID: ${data[0].primario})\nSecundario\n`;
            data.forEach(e => {
                textoArriba = textoArriba + `${e.nombre_ts}: ${e.valor}(${e.medida})\n`
            });

          this.topText.textContent = textoArriba;
        }
        if(this.botText){
          let textoAbajo = `Etiqueta: ${data[0].etiqueta} (ID: ${data[0].primario})\nSecundario\n`;
            data.forEach(e => {
                textoAbajo = textoAbajo + `${e.nombre_ts}: \nId sec: ${e.tiposec}, Id subtipo sec: ${e.id_sts}`
            });

          this.botText.textContent = textoAbajo;
        }
      

      })
      .catch(error => {
        if(this.consoleDiv){
          this.consoleDiv.innerHTML = `ERROR: ${error.message}`;
          this.consoleDiv.style.color = "red";
        }
      });
  },

  orientacion: function(e) {
    const type = e.target.type;

    if(type === "portrait-primary" || type === "portrait-secondary"){

        if(this.topPlane.classList.contains("izquierda"))
          this.topPlane.classList.remove("izquierda");

        this.topPlane.classList.add("arriba");

        if(this.botPlane.classList.contains("derecha"))
          this.botPlane.classList.remove("derecha");

        this.botPlane.classList.add("abajo");

    } else {
      //Pone texto de arriba a la izquierda
        if(this.topPlane.classList.contains("arriba"))
          this.topPlane.classList.remove("arriba");

        this.topPlane.classList.add("izquierda");
      //Pone texto de abajo a la derecha
        if(this.botPlane.classList.contains("abajo"))
          this.botPlane.classList.remove("abajo");

        this.botPlane.classList.add("derecha");
    }
  },

  remove: function() {
    this.stopPolling();
    this.markerEl.removeEventListener('markerFound', this.startPolling);
    this.markerEl.removeEventListener('markerLost', this.stopPolling);
  }
})