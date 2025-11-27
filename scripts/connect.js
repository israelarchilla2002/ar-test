//Establecer conexion con API
AFRAME.registerComponent('conexion_db', {
    schema: {
        url: {type: 'string', default: ''}, //URL, que en el caso para hacer pruebas en local usaremos la del NAS
        interval: {type: 'number', default: 5000} //Cada cuantos ms se hace una llamada
    },

    //Conecta a la base de datos cuando cargue la página
    init: function() {
        console.log("Intentando realizar conexión con la DB.");

        if (!this.data.url){
            alert("ERROR: No se ha establecido ninguna URL con la que conectar.");
            return;
        }

        this.syncData(); //Primera sincronización en cuanto conecta con la DB

        //Cronómetro para ver cada cuanto realiza la llamada
        this.timer = setInterval(() => {
            this.syncData();
        }, this.data.interval);
    },

    //Sincroniza los datos con el objeto indicado
    syncData: function() {
        fetch(this.data.url).then(response => {
            //Si no hay respuesta, indica que hubo un fallo de conexión
            if(!response.ok){ 
                alert("Ha habido un error de conexión");
                throw new Error("Error de conexión. Comprueba el estado de red.");
            }
            return response.json();
        }).then(data => {
            //Establecemos el color
            if(data.color) {
                this.el.setAttribute('material', 'color', data.color);
            }

            //Establecemos el tamaño (a partir de una escala)
            if(data.size){
                let sz = parseFloat(data.size); //Por si acaso se pasara como string
                this.el.setAttribute('scale', {x: sz, y: sz, z: sz});
            }
        }).catch(error => {
            alert("Error de conexión con la API:", error);
        });
    },

    //Reinicio de cronómetro en caso de implementarlo como app
    remove: function(){
        if (this.timer) clearInterval(this.timer);
    }
});
