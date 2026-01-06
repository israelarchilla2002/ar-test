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
          modelo.setAttribute("gltf-model", "modelos/decanter_v6_1.glb"); // TODO: Modificar para hacerlo dinámico dependiendo del id de tipo
          modelo.setAttribute("position", "0 0 0");
          modelo.setAttribute("conexion-oli",`markerId: ${id}; url: conexiones/oliconfig.php; interval: 500`);
          modelo.setAttribute("scale", "0.02 0.02 0.02");
          /*
          // const top = document.createElement("a-entity");
          // top.setAttribute("position", "0 1 0");
          const topPlaneId = "topPlane" + id;
          const botPlaneId = "botPlane" + id;

          const topTextId = "topText" + id;
          const botTextId = "botText" + id;

          
          const topPlane = document.createElement("a-plane");
          topPlane.setAttribute("width", 1.4);
          topPlane.setAttribute("height", 0.75);
          topPlane.setAttribute("color", "#000");
          topPlane.setAttribute("opacity", 0.7);
          topPlane.setAttribute("rotation", "-90 0 0"); //TODO: Cambiar rotación a 0 aquí y a -90 en Blender
          topPlane.setAttribute("id", topPlaneId);
          
          const topText = document.createElement("a-text");
          topText.setAttribute("align", "center");
          topText.setAttribute("width", 1.3);
          topText.setAttribute("value", "Prueba texto de arriba/derecha");
          topText.setAttribute("color", "#FFF");
          topText.setAttribute("position", "0 0 0.1"); //Para despegarlo del plano respecto a la cámara
          topText.setAttribute("scale", "1.4 1.4 1.4");
          topText.setAttribute("id", topTextId);

          // const bot = document.createElement("a-entity");
          // bot.setAttribute("position", "0 -1 0");

          const botPlane = document.createElement("a-plane");
          botPlane.setAttribute("width", 1.4);
          botPlane.setAttribute("height", 0.75);
          botPlane.setAttribute("color", "#000");
          botPlane.setAttribute("opacity", 0.7);
          botPlane.setAttribute("rotation", "-90 0 0"); //TODO: Cambiar rotación a 0 aquí y a -90 en Blender
          botPlane.setAttribute("id", botPlaneId);

          const botText = document.createElement("a-text");
          botText.setAttribute("align", "center");
          botText.setAttribute("width", 1.3);
          botText.setAttribute("value", "Prueba texto de abajo/izquierda");
          botText.setAttribute("color", "#FFF");
          botText.setAttribute("position", "0 0 0.1");
          botText.setAttribute("scale", "1.4 1.4 1.4");
          botText.setAttribute("id", botTextId);

          topPlane.appendChild(topText);
          // top.appendChild(topPlane);

          botPlane.appendChild(botText);
          // bot.appendChild(botPlane);

          mark.appendChild(topPlane);
          mark.appendChild(botPlane);

          */

          mark.appendChild(modelo);
          escena.appendChild(mark);
        }

        
    });