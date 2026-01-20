const escena = document.getElementById("escena");

fetch('conexiones/oliid.php')
    .then(res => res.json())
    .then(ids => {
        for (let id of ids){
          const mark = document.createElement("a-marker");
          mark.setAttribute("id", id);
          mark.setAttribute("type", "barcode");
          mark.setAttribute("value", id);
          
          const modelo = document.createElement("a-entity");
          // TODO: Añadir un modelo genérico de carga
          modelo.setAttribute("position", "0 0 0");
          modelo.setAttribute("conexion-oli",`markerId: ${id}; url: conexiones/oliconfig.php; interval: 500`);
          modelo.setAttribute("scale", "0.02 0.02 0.02");

          mark.appendChild(modelo);
          escena.appendChild(mark);
        }

        
    });