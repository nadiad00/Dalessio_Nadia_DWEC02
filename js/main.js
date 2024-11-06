// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = '../data/tarifasCombustible.json';
let gastosJSONpath = '../data/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }
    
    for(let i = 2010; i <= 2020; i++){
        let sum = 0;
        let gastoAnio = document.getElementById("gasto" + i);
        
        for(const viaje in gastosJSON) {
            let fecha = new Date(gastosJSON[viaje].date);
            let anio = fecha.getFullYear();
            if(anio === i){
                sum += gastosJSON[viaje].precioViaje;
            }
        }

        aniosArray[i] = sum.toFixed(2);
        gastoAnio.textContent = aniosArray[i];
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

    let anioViaje = fecha.getFullYear();
    let precioViaje;

    for(const tarifa in tarifasJSON.tarifas) {
        
        let anioTarifa = tarifasJSON.tarifas[tarifa].anio;
        let vehiAux = tarifasJSON.tarifas[tarifa].vehiculos;

        if(anioTarifa === anioViaje){
            
            for(const tipo in vehiAux) {

                if(tipo === tipoVehiculo) {
                    precioViaje = Math.round((vehiAux[tipo] * kilometros) * 100) / 100;
                    
                }
            }
        }
    }

    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);
    gastosJSON.push(nuevoGasto);
    calcularGastoTotal();
    const nuevoGastoJSON = nuevoGasto.convertToJSON();

    const li = document.createElement("li");
    const node = document.createTextNode(nuevoGastoJSON);
    li.appendChild(node);
    document.getElementById("expense-list").appendChild(li);

    document.getElementById("fuel-form").reset();
}

