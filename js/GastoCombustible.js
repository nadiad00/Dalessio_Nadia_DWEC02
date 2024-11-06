class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }

    convertToJSON() {
        const atrJSON = JSON.stringify([this.vehicleType, this.date, this.kilometers, this.precioViaje]);
        return atrJSON;
    }
}