var comptadorHotels = 0;

//---------------GENERAR JSON HOTEL--------------------

function generarJsonHotels() {
    var llistaHotels = new Array();

    //Cada input hiden te el class jsonHotel. El getElementsByClassName ens retorna una llista d'elements.
    //Els recorrerem per recollir le dades dels hotels.
    var liHotels = document.getElementsByClassName("jsonHotel");
    //Comprovem si en tenim algún.
    if (liHotels != null) {
        for (var i = 0; i < liHotels.length; i++) {
            elementHotel = liHotels.item(i);
            var objHotel = new Object();
            objHotel = JSON.parse(elementHotel.value);
            llistaHotels.push(objHotel);
        }
    }
    var jsonString = JSON.stringify(llistaHotels);
    document.getElementById("JsonText").innerText = jsonString;
}

//--------------CREAR STRING DEL HOTEL------------------

function crearStringHotel(objHotel, idLlista) {
    var strHtmlHotel = "<li id=\"liHotel" + idLlista + "\">";
    //Crearem un input hidden. Com un text, però no visible per guardar el Json de l'hotel
    strHtmlHotel += "<label id=\"lblNomHot" + idLlista + "\">" + objHotel.nom + "</label>";
    strHtmlHotel += "<input type=\"hidden\" class=\"jsonHotel\" id=\"jsonHotel" + idLlista + "\" value=\"\" />";
    //Crearem un botó per eliminar l'hotel
    strHtmlHotel += "<button onclick=\"eliminarHotel(" + idLlista + ")\">Eliminar</button>";
    //Crearem un botó per modificar l'hotel
    strHtmlHotel += "<button onclick=\"modificarHotel(" + idLlista + ")\">Modificar</button>";
    strHtmlHotel += "</li>";
    return strHtmlHotel;
}

//------------------------------------FUNCIONES BOTONES-------------------------------------------------

// *********AÑADIR**********

function afegirHotel() {
    var dadesCompletes = controlDeLesDades();
    var idLlista = comptadorHotels;
    comptadorHotels += 1;
    if (dadesCompletes == "") {
        var objHotel = generarObjHotel(idLlista);
        //Crearem un element més a la llista d'hotels
        var strHtmlHotel = crearStringHotel(objHotel, idLlista);
        var jsonHotel = JSON.stringify(objHotel);
        document.getElementById("llistaHotels").innerHTML += strHtmlHotel;
        //Asignam el json al input hidden del hotel. Ho faig aquí així no he de fer el parse de les ". Ja ho fa javascript automàtic.
        document.getElementById("jsonHotel" + idLlista).value = jsonHotel;
        netejarCamps();
        alert("Añadido correctamente");
    } else {
        alert("Faltan datos por completar:\n" + dadesCompletes);
    }
}

// ***********GUARDAR***************

function desarModificacioHotel() {
    var idLlista = document.getElementById("idHotel").value;
    var dadesCompletes = controlDeLesDades();
    if (dadesCompletes == "") {
        //Creamos un nuevo objeto de hotel con los nuevos datos pero con el mismo id.
        var objHotel = generarObjHotel(idLlista);
        document.getElementById("lblNomHot" + idLlista).value = objHotel.nom;
        document.getElementById("lblNomHot" + idLlista).innerHTML = document.getElementById("nomHotel").value;
        var jsonHotel = JSON.stringify(objHotel);
        document.getElementById("jsonHotel" + idLlista).value = jsonHotel;
        netejarCamps();
        alert("Hotel modificado.");
    } else {
        alert("Faltan datos por completar:\n" + dadesCompletes);
    }
}

// **************MODIFICAR*****************

function modificarHotel(idLi) {
    var objHotel = new Object();
    objHotel = JSON.parse(document.getElementById("jsonHotel" + idLi).value);
    document.getElementById("nomHotel").value = objHotel.nom;
    document.getElementById("estrellesHotel").value = objHotel.estrelles;
    document.getElementById("ubicacion").value = objHotel.ubicacion;
    comprobarTrabajadores(objHotel);
    comprobarComida(objHotel);
    comprobarEstablecimientos(objHotel);
    comprobarMascotas(objHotel);
    comprobarLavanderia(objHotel);
    comprobarSpa(objHotel);
    comprobarAlquilerVehiculos(objHotel);
    document.getElementById("idHotel").value = idLi;
    document.getElementById("modificar").style.display = "inline";
    document.getElementById("afegir").style.display = "none";
}

// *****************ELIMINAR*******************

function eliminarHotel(idLi) {
    var hotel = document.getElementById("liHotel" + idLi);
    if (!hotel) {
        alert("El hotel seleccionado no existe.");
    } else {
        if (confirm("¿Seguro que quieres eliminar el hotel?")) {
            var nodePare = hotel.parentNode;
            nodePare.removeChild(hotel);
            alert("Eliminado correctamente.");
        }
    }
    netejarCamps();
}

//-------------------------------------------CONTROL DE LOS DATOS------------------------------------------------------------

function controlDeLesDades() {
    var strErrors = "";
    strErrors += datosNombre();
    strErrors += datosEstrellas();
    strErrors += datosUbicacion();
    strErrors += datosTrabajadores();
    strErrors += datosComida();
    strErrors += datosEstablecimientos();
    strErrors += datosMascotas();
    strErrors += datosVehiculos();
    return strErrors;
}

function datosNombre() {
    var strErrors = "";
    if (document.getElementById("nomHotel").value == "") {
        //El \n és un bot de linea.
        document.getElementById("nomHotel").style.backgroundColor = "yellow";
        strErrors += "Nombre no introducido.\n";
    } else {
        document.getElementById("nomHotel").style.backgroundColor = null;
    }
    return strErrors;
}

function datosEstrellas() {
    var strErrors = "";
    if (document.getElementById("estrellesHotel").value == "0") {
        //El \n és un bot de linea.
        document.getElementById("estrellesHotel").style.backgroundColor = "yellow";
        strErrors += "Número de estrellas no introducido.\n";
    } else {
        document.getElementById("estrellesHotel").style.backgroundColor = null;
    }
    return strErrors;
}

function datosUbicacion() {
    var strErrors = "";
    if (document.getElementById("ubicacion").value == "") {
        //El \n és un bot de linea.
        document.getElementById("ubicacion").style.backgroundColor = "yellow";
        strErrors += "Ubicación no introducida.\n";
    } else {
        document.getElementById("ubicacion").style.backgroundColor = null;
    }
    return strErrors;
}

function datosTrabajadores() {
    var strErrors = "";
    if (document.getElementById("trabajadores").checked) {
        if (document.getElementById("recepcionistas").value == 0) {
            strErrors += "El hotel debe contar al menos con un recepcionista."
            document.getElementById("recepcionistas").style.backgroundColor = "yellow";
        } else {
            document.getElementById("recepcionistas").style.backgroundColor = null;
        }
    }
    return strErrors;
}

function datosComida() {
    var strErrors = "";
    if (document.getElementById("servicioComida").checked) {
        var opciones = document.getElementsByClassName("comidas");
        var contador = 0;
        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                contador++;
            }
        }
        if (contador == 0) {
            strErrors += "Seleccione un servicio de comida.";
            document.getElementById("dvComidas").style.backgroundColor = "yellow";
        } else {
            document.getElementById("dvComidas").style.backgroundColor = null;
        }
    }
    return strErrors;
}

function datosEstablecimientos() {
    var strErrors = "";
    if (document.getElementById("establecimientos").checked) {
        var opciones = document.getElementsByClassName("establecimiento");
        var contador = 0;
        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                contador++;
            }
        }
        if (contador == 0) {
            strErrors += "Seleccione un establecimiento de comida."
            document.getElementById("dvEstablecimientos").style.backgroundColor = "yellow";
        } else {
            document.getElementById("dvEstablecimientos").style.backgroundColor = null;
        }
    }
    return strErrors;
}

function datosMascotas() {
    var strErrors = "";
    if (document.getElementById("mascotas").checked) {
        var opciones = document.getElementsByClassName("animal");
        var contador = 0;
        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                contador++;
            }
        }
        if (contador == 0) {
            strErrors += "Seleccione un animal de compañía.";
            document.getElementById("dvMascotas").style.backgroundColor = "yellow";
        } else {
            document.getElementById("dvMascotas").style.backgroundColor = null;
        }
    }
    return strErrors;
}

function datosVehiculos() {
    var strErrors = "";
    if (document.getElementById("vehiculos").checked) {
        var opciones = document.getElementsByClassName("alquiler");
        var contador = 0;
        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                contador++;
            }
        }
        if (contador == 0) {
            strErrors += "Seleccione una opción.";
            document.getElementById("dvVehiculos").style.backgroundColor = "yellow";
        } else {
            document.getElementById("dvVehiculos").style.backgroundColor = null;
        }
    }
    return strErrors;
}

//------------------------------------GENERAR HOTEL------------------------------------------------

function generarObjHotel(id) {
    var hotel = new Object();
    hotel.id = id;
    hotel.nom = document.getElementById("nomHotel").value;
    hotel.estrelles = document.getElementById("estrellesHotel").value;
    hotel.ubicacion = document.getElementById("ubicacion").value;
    hotel.trabajadores = crearTrabajadores(document.getElementById("trabajadores").checked);
    hotel.servicioComida = crearServicioComida(document.getElementById("servicioComida").checked);
    hotel.establecimientos = crearEstablecimientos(document.getElementById("establecimientos").checked);
    hotel.mascotas = crearMascotas(document.getElementById("mascotas").checked);
    hotel.servicioLavanderia = crearServicioLavanderia(document.getElementById("lavanderia").checked);
    hotel.centroSpa = crearCentroSpa(document.getElementById("spa").checked);
    hotel.alquilerVehiculos = crearAlquilerVehiculos(document.getElementById("vehiculos").checked);
    return hotel;
}

//------------------------------------FUNCIONES DE CREACIÓN DE OBJETOS DENTRO DE HOTEL----------------------------------------

function crearTrabajadores(trabajadores) {
    if (trabajadores) {
        var trabajadores = new Object();
        trabajadores.recepcionistas = document.getElementById("recepcionistas").value;
        trabajadores.camareros = document.getElementById("camareros").value;
        trabajadores.cocineros = document.getElementById("cocineros").value;
        trabajadores.camarerospiso = document.getElementById("camarerosPiso").value;
        trabajadores.botones = document.getElementById("botones").value;
        trabajadores.seguridad = document.getElementById("seguridad").value;
    } else {
        var trabajadores = null;
    }
    return trabajadores;
}

function getValorRadio(nombreInput) {
    var radios = document.getElementsByClassName(nombreInput);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value
        }
    }
}

function crearServicioComida(comida) {
    if (comida) {
        var servicioComida = getValorRadio("comidas");
    } else {
        var servicioComida = null;
    }
    return servicioComida;
}

function crearEstablecimientos(establecimientos) {
    if (establecimientos) {
        var establecimientos = new Object();
        establecimientos.restaurante = crearRestaurantes(document.getElementById("restaurante").checked);
        establecimientos.bar = crearBares(document.getElementById("bar").checked);
        establecimientos.catering = document.getElementById("catering").checked;
        establecimientos.minimarket = document.getElementById("minimarket").checked;
    } else {
        var establecimientos = null;
    }
    return establecimientos;
}

function crearRestaurantes(restaurante) {
    if (restaurante) {
        restaurante = document.getElementById("numeroRestaurantes").value;
    } else {
        var restaurante = null;
    }
    return restaurante;
}

function crearBares(bar) {
    if (bar) {
        bar = document.getElementById("numeroBares").value;
    } else {
        var bar = null;
    }
    return bar;
}

function crearPerro(perro) {
    if (perro) {
        perro = document.getElementById("numeroPerros").value;
    } else {
        var perro = null;
    }
    return perro;
}

function crearGato(gato) {
    if (gato) {
        gato = document.getElementById("numeroGatos").value;
    } else {
        var gato = null;
    }
    return gato;
}

function crearMascotas(mascotas) {
    if (mascotas) {
        var mascotas = new Object();
        mascotas.gatos = crearGato(document.getElementById("gato").checked);
        mascotas.perros = crearPerro(document.getElementById("perro").checked);
    } else {
        var mascotas = null;
    }
    return mascotas;
}

function crearServicioLavanderia(lavanderia) {
    if (lavanderia) {
        var servicioLavanderia = new Object();
        servicioLavanderia.lavadoSeco = document.getElementById("lavadoSeco").checked;
        servicioLavanderia.planchado = document.getElementById("planchado").checked;
    } else {
        var servicioLavanderia = null;
    }
    return servicioLavanderia;
}

function crearCentroSpa(spa) {
    if (spa) {
        var centroSpa = new Object();
        centroSpa.hidromasaje = document.getElementById("hidromasaje").checked;
        centroSpa.sauna = document.getElementById("sauna").checked;
        centroSpa.bañoTurco = document.getElementById("bañoTurco").checked;
        centroSpa.masaje = document.getElementById("masaje").checked;
    } else {
        var centroSpa = null;
    }
    return centroSpa;
}

function crearAlquilerVehiculos(vehiculos) {
    if (vehiculos) {
        var alquilerVehiculos = new Object();
        alquilerVehiculos.bicicletas = document.getElementById("bicicletas").checked;
        alquilerVehiculos.coches = document.getElementById("coches").checked;
        alquilerVehiculos.aparcamiento = document.getElementById("aparcamiento").checked;
    } else {
        var alquilerVehiculos = null;
    }
    return alquilerVehiculos;
}

//-----------------------------FUNCIONES DE COMPROBACIÓN PARA RELLENAR LOS INPUTS----------------------

function comprobarTrabajadores(objHotel) {
    if (objHotel.trabajadores == null) {
        limpiarTrabajadores();
    } else {
        document.getElementById("trabajadores").checked = true;
        document.getElementById("recepcionistas").value = objHotel.trabajadores.recepcionistas;
        document.getElementById("camareros").value = objHotel.trabajadores.camareros;
        document.getElementById("cocineros").value = objHotel.trabajadores.cocineros;
        document.getElementById("camarerosPiso").value = objHotel.trabajadores.camarerospiso;
        document.getElementById("botones").value = objHotel.trabajadores.botones;
        document.getElementById("seguridad").value = objHotel.trabajadores.seguridad;
        controlTrabajadores();
    }
}

function comprobarComida(objHotel) {
    if (objHotel.servicioComida == null) {
        limpiarComidas();
    } else {
        document.getElementById("servicioComida").checked = true;
        if (objHotel.servicioComida == "Media pensión") {
            document.getElementById("mediaPension").checked = true;
        } else if (objHotel.servicioComida == "Menú") {
            document.getElementById("menu").checked = true;
        } else if (objHotel.servicioComida == "Carta") {
            document.getElementById("carta").checked = true;
        }
        controlComidas();
    }
}

function comprobarEstablecimientos(objHotel) {
    if (objHotel.establecimientos == null) {
        limpiarEstablecimientos();
    } else {
        document.getElementById("establecimientos").checked = true;
        controlEstablecimientos();
        comprobarRestaurantes(objHotel);
        comprobarBares(objHotel);
        document.getElementById("catering").checked = objHotel.establecimientos.catering;
        document.getElementById("minimarket").checked = objHotel.establecimientos.minimarket;
    }
}

function comprobarRestaurantes(objHotel) {
    if (objHotel.establecimientos.restaurante == null) {
        limpiarRestaurante();
    } else {
        document.getElementById("restaurante").checked = true;
        document.getElementById("numeroRestaurantes").value = objHotel.establecimientos.restaurante;
        controlNumeroRestaurantes();
    }
}

function comprobarBares(objHotel) {
    if (objHotel.establecimientos.bar == null) {
        limpiarBar();
    } else {
        document.getElementById("bar").checked = true;
        document.getElementById("numeroBares").value = objHotel.establecimientos.bar;
        controlNumeroBares();
    }
}

function comprobarPerro() {
    if (objHotel.mascotas.perros == null) {
        limpiarPerro();
    } else {
        document.getElementById("perro").checked = true;
        controlPerro();
        document.getElementById("numeroPerros").value = objHotel.mascotas.perros;
    }
}

function comprobarGato() {
    if (objHotel.mascotas.gatos == null) {
        limpiarGato();
    } else {
        document.getElementById("gato").checked = true;
        controlGato();
        document.getElementById("numeroGatos").value = objHotel.mascotas.gatos;
    }
}

function comprobarMascotas(objHotel) {
    if (objHotel.mascotas == null) {
        limpiarMascotas();
    } else {
        document.getElementById("mascotas").checked = true;
        controlMascotas();
        comprobarPerro();
        comprobarGato();
    }
}

function comprobarLavanderia(objHotel) {
    if (objHotel.servicioLavanderia == null) {
        limpiarLavanderia();
    } else {
        document.getElementById("lavanderia").checked = true;
        controlLavanderia();
        document.getElementById("lavadoSeco").checked = objHotel.servicioLavanderia.lavadoSeco;
        document.getElementById("planchado").checked = objHotel.servicioLavanderia.planchado;
    }
}

function comprobarSpa(objHotel) {
    if (objHotel.centroSpa == null) {
        limpiarSpa();
    } else {
        document.getElementById("spa").checked = true;
        controlSpa();
        document.getElementById("hidromasaje").checked = objHotel.centroSpa.hidromasaje;
        document.getElementById("sauna").checked = objHotel.centroSpa.sauna;
        document.getElementById("bañoTurco").checked = objHotel.centroSpa.bañoTurco;
        document.getElementById("masaje").checked = objHotel.centroSpa.masaje;
    }
}

function comprobarAlquilerVehiculos(objHotel) {
    if (objHotel.alquilerVehiculos == null) {
        limpiarAlquilerVehiculos();
    } else {
        document.getElementById("vehiculos").checked = true;
        controlVehiculos();
        document.getElementById("bicicletas").checked = objHotel.alquilerVehiculos.bicicletas;
        document.getElementById("coches").checked = objHotel.alquilerVehiculos.coches;
        document.getElementById("aparcamiento").checked = objHotel.alquilerVehiculos.aparcamiento;
    }
}

//------------------------------FUNCIONES LIMPIAR CAMPOS--------------------------------------

function netejarCamps() {
    document.getElementById("nomHotel").value = "";
    document.getElementById("estrellesHotel").value = 0;
    document.getElementById("ubicacion").value = "";
    limpiarTrabajadores();
    limpiarComidas();
    limpiarEstablecimientos();
    limpiarMascotas();
    limpiarLavanderia();
    limpiarSpa();
    limpiarAlquilerVehiculos();
    document.getElementById("idHotel").value = "";

    //Deixam la visibilitat dels botons per defecte.
    document.getElementById("modificar").style.display = "none";
    document.getElementById("afegir").style.display = "inline";
}

function limpiarTrabajadores() {
    document.getElementById("trabajadores").checked = false;
    document.getElementById("recepcionistas").value = 0;
    document.getElementById("camareros").value = 0;
    document.getElementById("cocineros").value = 0;
    document.getElementById("camarerosPiso").value = 0;
    document.getElementById("botones").value = 0;
    document.getElementById("seguridad").value = 0;
    controlTrabajadores();
}

function limpiarComidas() {
    document.getElementById("servicioComida").checked = false;
    document.getElementById("mediaPension").checked = false;
    document.getElementById("menu").checked = false;
    document.getElementById("carta").checked = false;
    controlComidas();
}

function limpiarEstablecimientos() {
    document.getElementById("establecimientos").checked = false;
    limpiarRestaurante();
    limpiarBar();
    document.getElementById("catering").checked = false;
    document.getElementById("minimarket").checked = false;
    controlEstablecimientos();
}

function limpiarRestaurante() {
    document.getElementById("restaurante").checked = false;
    document.getElementById("numeroRestaurantes").value = 1;
    controlNumeroRestaurantes();
}

function limpiarBar() {
    document.getElementById("bar").checked = false;
    document.getElementById("numeroBares").value = 1;
    controlNumeroBares();
}

function limpiarMascotas() {
    document.getElementById("mascotas").checked = false;
    limpiarGato();
    limpiarPerro();
    controlMascotas();
}

function limpiarGato() {
    document.getElementById("gato").checked = false;
    document.getElementById("numeroGatos").value = 1;
    controlGato();
}

function limpiarPerro() {
    document.getElementById("perro").checked = false;
    document.getElementById("numeroPerros").value = 1;
    controlPerro();
}

function limpiarLavanderia() {
    document.getElementById("lavanderia").checked = false;
    document.getElementById("lavadoSeco").checked = false;
    document.getElementById("planchado").checked = false;
    controlLavanderia();
}

function limpiarSpa() {
    document.getElementById("spa").checked = false;
    document.getElementById("hidromasaje").checked = false;
    document.getElementById("sauna").checked = false;
    document.getElementById("bañoTurco").checked = false;
    document.getElementById("masaje").checked = false;
    controlSpa();
}

function limpiarAlquilerVehiculos() {
    document.getElementById("vehiculos").checked = false;
    document.getElementById("bicicletas").checked = false;
    document.getElementById("coches").checked = false;
    document.getElementById("aparcamiento").checked = false;
    controlVehiculos();
}

//----------------FUNCIONES QUE CONTROLAN LOS DIVS OCULTOS------------------------------

function controlTrabajadores() {
    if (document.getElementById("trabajadores").checked == true) {
        document.getElementById("dvTrabajadores").style.display = "block";
    } else {
        document.getElementById("dvTrabajadores").style.display = "none";
    }
}

function controlComidas() {
    if (document.getElementById("servicioComida").checked == true) {
        document.getElementById("dvComidas").style.display = "block";
    } else {
        document.getElementById("dvComidas").style.display = "none";
    }
}

function controlEstablecimientos() {
    if (document.getElementById("establecimientos").checked == true) {
        document.getElementById("dvEstablecimientos").style.display = "block";
    } else {
        document.getElementById("dvEstablecimientos").style.display = "none";
    }
}

function controlNumeroRestaurantes() {
    if (document.getElementById("restaurante").checked == true) {
        document.getElementById("dvRestaurantes").style.display = "block";
    } else {
        document.getElementById("dvRestaurantes").style.display = "none";
    }
}

function controlNumeroBares() {
    if (document.getElementById("bar").checked == true) {
        document.getElementById("dvBares").style.display = "block";
    } else {
        document.getElementById("dvBares").style.display = "none";
    }
}

function controlMascotas() {
    if (document.getElementById("mascotas").checked == true) {
        document.getElementById("dvMascotas").style.display = "block";
    } else {
        document.getElementById("dvMascotas").style.display = "none";
    }
}

function controlLavanderia() {
    if (document.getElementById("lavanderia").checked == true) {
        document.getElementById("dvLavanderia").style.display = "block";
    } else {
        document.getElementById("dvLavanderia").style.display = "none";
    }
}

function controlSpa() {
    if (document.getElementById("spa").checked == true) {
        document.getElementById("dvSpa").style.display = "block";
    } else {
        document.getElementById("dvSpa").style.display = "none";
    }
}

function controlVehiculos() {
    if (document.getElementById("vehiculos").checked == true) {
        document.getElementById("dvVehiculos").style.display = "block";
    } else {
        document.getElementById("dvVehiculos").style.display = "none";
    }
}

function controlPerro() {
    if (document.getElementById("perro").checked == true) {
        document.getElementById("dvPerro").style.display = "block";
    } else {
        document.getElementById("dvPerro").style.display = "none";
    }
}

function controlGato() {
    if (document.getElementById("gato").checked == true) {
        document.getElementById("dvGato").style.display = "block";
    } else {
        document.getElementById("dvGato").style.display = "none";
    }
}
