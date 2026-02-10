
let idPaneles = 0;

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
    this.datos = [];
    idPaneles = this.data.markerId;
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
        this.updateOrientation(e);
      });

    // Planos y textos
    this.topPlane = document.getElementById("topPlane");
    this.botPlane = document.getElementById("botPlane");
    this.topText = document.getElementById("topText");
    this.botText = document.getElementById("botText");
    this.scene = document.getElementById("escena");

    this.lastColor = "decanter_v6_1.glb";

    if (!this.topPlane || !this.botPlane) {
      console.warn("No se encontraron los divs intentando mostrar el marker:", this.data.markerId);
    }

    this.topPlane.addEventListener("click", () => {
      if(!botPlane.classList.contains("fullscreen")){
        topPlane.classList.toggle("fullscreen");
      }
      
      botPlane.classList.toggle("invisible");
      this.updateText();
    })

    this.botPlane.addEventListener("click", () => {
      if(!topPlane.classList.contains("fullscreen")){
        botPlane.classList.toggle("fullscreen");
      }

      topPlane.classList.toggle("invisible");
      this.updateText();
    })

    let orActual = window.innerWidth / window.innerHeight;

    if(orActual > 1){
        this.topPlane.classList.remove("arriba");
        this.topPlane.classList.add("izquierda");
        this.botPlane.classList.remove("abajo");
        this.botPlane.classList.add("derecha");
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

    if(this.topPlane.classList.contains("fullscreen"))
      this.topPlane.classList.remove("fullscreen");

    if(this.botPlane.classList.contains("fullscreen"))
      this.botPlane.classList.remove("fullscreen");
  },

  stopPolling: function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.lastData = null;
      this.consoleDiv.innerHTML = `Parando polling para el marker con ID ${this.data.markerId}`;
    }
    if(!this.topPlane.classList.contains("invisible"))
      this.topPlane.classList.add("invisible");

    if(!this.botPlane.classList.contains("invisible"))
      this.botPlane.classList.add("invisible");


    
  },

  syncData: function(url) {
    let hora = new Date().toLocaleTimeString();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.datos = data.slice();
        const dataChanged = JSON.stringify(data) !== JSON.stringify(this.lastData)
        this.lastData = data;
        if (dataChanged && data[1]?.valor !== undefined){

        // Cambiar modelo según valor (IMPLEMENTACION NO FINAL PARA PRUEBA)
          let modelo = "modelos/decanter_black.glb";

          /////////////////////////////////////////////////////////////////////////////////////////////////////
          //  OJO!!! ESTE PORCENTAJE ESTÁ PUESTO A MODO DE DEBUG. UTILIZAR OTRA MEDIDA EN VERSION FINAL!!!!  //
          /////////////////////////////////////////////////////////////////////////////////////////////////////
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
        this.updateText();

      })
      .catch(error => {
        if(this.consoleDiv){
          this.consoleDiv.innerHTML = `ERROR: ${error.message}`;
          this.consoleDiv.style.color = "red";
        }
      });
  },
  
  updateText() {
    if(this.datos[0].etiqueta && this.datos[0].etiqueta !== undefined){
    //ACtualización de textos y tal
    if(this.topText){
            let textoArriba = `Etiqueta: ${this.datos[0].etiqueta} (ID: ${this.datos[0].primario})\r\nSecundario\r\n`;
            if (this.topPlane.classList.contains("fullscreen")){
              this.datos.forEach(e => {
                  textoArriba = textoArriba + `${e.nombre_ts}: ${e.valor}(${e.medida})\r\n`;
              });
          } else {
            for(let i = 1;  i < 3 && i < this.datos.length; i++){ //En la versión pequeña del recuadro solo imprimimos los 2 primeros valores
              textoArriba = textoArriba + `${this.datos[i].nombre_ts}: ${this.datos[i].valor}(${this.datos[i].medida})\r\n`;
            }
          }

          this.topText.textContent = textoArriba;
        
        }
        if(this.botText){
          let textoAbajo = `Etiqueta: ${this.datos[0].etiqueta} (ID: ${this.datos[0].primario})\r\nSecundario:\r\n`;
            this.datos.forEach(e => {
                textoAbajo = textoAbajo + `${e.nombre_ts}: \r\nId sec: ${e.tiposec}, Id subtipo sec: ${e.id_sts}`
            });

          this.botText.textContent = textoAbajo;
        }
      }
  },

  updateOrientation: function(e) {
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