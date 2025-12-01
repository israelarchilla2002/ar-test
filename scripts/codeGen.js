/// @brief Generador de códigos de barras 5x5 para ser leídos por AR.js, A-Frame, ARToolKit y otras herramientas AR.
///         La herramienta trabaja con una matriz M 9x9 donde las 2 primeras y últimas filas y columnas valdrán siempre 1 (coloreado en negro).
///         Asimismo, las posiciones M[2][2], M[6][2] y M[6][6] quedarán fijas

function generateBarcode(num){
    if(num < 0 || num > 4194303){
        throw new Error("Número inválido. Comprueba que el valor se encuentre entre 0 y 4194303.");
    };

    let M = Array.from( { length:9 }, () => Array(9).fill(0) );

    //Creamos el marco, rellenando solo cuando fila o columna sea 7 o mayor; o 1 o menor
    for(let fila = 0; fila < 9; fila++){
        for (let col = 0; col < 9; col++){
            if(fila <= 1 || fila >= 7 || col <= 1 || col >= 7){
                M[fila][col] = 1;
            }
        }
    }

    console.log("Generando matriz");
    //Rellenamos la marca
    M[2][2] = 1;
    M[6][2] = 1;
    //M[6][6] = 0; Pero no hace falta ponerlo porque ya he rellenado antes la matriz con 0

    //Ejecución del bucle de recorrido. Se trata de un recorrido inverso, es decir, comenzamos en la esquina inferior derecha 
    // y terminamos en la esquina superior derecha, sin escribir en las marcas
    for (let i = 6; i >= 2; i--){
        for (let j = 6; j >= 2; j--){
            //Evitamos escribir en las marcas
            if((i === 2 && j === 2) || (i === 6 && j === 2) || (i === 6 && j === 6)){
                continue; //Sigue a la siguiente iteración del bucle, para evitar escribir
            }

            //Tomamos el bit menos significativo de num en la iteración actual...
            let bitActual = num & 1;
            //...y colocamos su valor en la matriz
            M[i][j] = bitActual;

            //Movemos un bit a la derecha para comprobar cual es el siguiente bit a pintar.
            num = num >>> 1;
        }
    }
    console.log(M);
    return M;
}

//Imprimimos la matriz por consola para comprobar que se ha hecho bien antes de pasarla a imágen
function printM(num){
    const M = generateBarcode(num);
    const tamPx = 100;
    const canvas = document.getElementById("codigo");

    //Creamos canvas indicando tamaño
    canvas.width = M[0].length * tamPx;
    canvas.height = M.length * tamPx;
    const bar = canvas.getContext('2d');
    bar.clearRect(0, 0, canvas.width, canvas.height);

    //Rellenamos de blanco
    bar.fillStyle = 'white';
    bar.fillRect(0, 0, canvas.width, canvas.height);

    //Pintamos en negro
    bar.fillStyle = 'black';

    for (let i = 0; i < M[0].length; i++){
        for (let j = 0; j < M.length; j++){
            if (M[j][i] === 1){
                bar.fillRect(i * tamPx, j * tamPx, tamPx, tamPx);
            }
        }
    }
    
}
console.log("Script cargado.");
let acc = document.getElementById("aceptar");
acc.addEventListener("click", function(){
    let inputElement = document.getElementById("num");
    let num = parseInt(inputElement.value);
    printM(num);
});

