// -----------------VARIABLES----------------------------

// LISTA DE HOTELES CARGADOS POR EL JSON

var listadoHoteles;

// LISTA DE HOTELES DEL RESULTADO DE LA BÚSQUEDA

var listadoHotelesBusqueda;

// LISTA DE HOTELES DEL RESULTADO DE LA BÚSQUEDA Y DE LOS FILTROS

var listadoHotelesFiltrados;

// LISTA HABITACIONES SELECCIONADAS

var listadoHabSeleccionadas;

// ------------------CARGAR JSON DESDE EL LINK------------------

function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://raw.githubusercontent.com/jrivasdam19/LLMJSON/master/HOTEL%2BHAB.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// ----------------TRANSFORMAR DE STRING A JSON------------------

function init() {
    loadJSON(function (response) {
        listadoHoteles = JSON.parse(response);
    });
}

// --------------------RESTAURAR FILTROS------------------------

function borrarResultadosAnteriores() {
    document.getElementById("resultado").innerHTML = "";
}

function desmarcarFiltrosNav() {
    var filtros = document.getElementsByClassName("filtroComodidades");
    for (filtro of filtros) {
        filtro.checked = false;
    }
    var filtros = document.getElementsByClassName("temporada");
    for (filtro of filtros) {
        filtro.checked = false;
    }
    document.getElementById("valoracion").value = "selecciona";
    var filtros = document.getElementsByClassName("camas");
    for (filtro of filtros) {
        filtro.value = 0;
    }
}

function desmarcarFiltrosAsideIzq() {
    var filtros = document.getElementsByClassName("filtroCheckbox");
    for (filtro of filtros) {
        filtro.checked = false;
    }
    var filtros = document.getElementsByName("comidas");
    for (filtro of filtros) {
        filtro.checked = false;
    }
}

function borrarPrecioTotalHab() {
    document.getElementById("precioValor").innerText = 0;
    document.getElementById("numHabitaciones").innerText = 0;
}

//-----------------------------REALIZAR BÚSQUEDA----------------------

function realizarBusqueda() {
    borrarResultadosAnteriores();
    var datosCompletos = controlDeDatos();
    if (datosCompletos == "") {
        var temporada = getValorRadio("temporada");
        var numIndividual = document.getElementById("individual").value;
        var numDoble = document.getElementById("doble").value;
        var valoracion = document.getElementById("valoracion").value;
        var minibar = getValorCheckBox("minibar");
        var tv = getValorCheckBox("tv");
        var cafetera = getValorCheckBox("cafetera");
        var balcon = getValorCheckBox("balcon");
        var vistas = getValorCheckBox("vistas");
        var climatizacion = getValorCheckBox("climatizacion");

        desmarcarFiltrosAsideIzq();

        listadoHotelesBusqueda = new Array();
        for (objHotel of listadoHoteles) {
            for (objHab of objHotel.habitaciones) {
                if (comprobarCamas(objHab, numIndividual, numDoble)) {
                    if (comprobarValoracion(objHab, valoracion)) {
                        if (comprobarComodidades(objHab, minibar, tv, cafetera, balcon, vistas, climatizacion)) {
                            precioMenor = 1000;
                            var precio = new Object();
                            for (objPrecio of objHab.precio) {
                                if (objPrecio.temporada == temporada) {
                                    if (calcularPrecioTotal(objPrecio) < precioMenor) {
                                        precioMenor = calcularPrecioTotal(objPrecio);
                                        precio = objPrecio;
                                    }
                                }
                            }
                            var objResultado = new Object();
                            objResultado.hotel = objHotel;
                            objResultado.hab = objHab;
                            objResultado.precio = precio;
                            listadoHotelesBusqueda.push(objResultado);
                            pintarHabitacion(objResultado);
                        }
                    }
                }
            }
        } if (listadoHotelesBusqueda.length == 0) {
            document.getElementById("resultado").innerHTML = "No se han encontrado habitaciones con estos criterios de búsqueda.";
        }
    } else {
        alert("Faltan datos por completar:\n" + datosCompletos);
    }

}

//--------------CONTROL DE SELECCIÓN DE FILTROS------------

function controlDeDatos() {
    var strErrores = "";
    strErrores += controlTemporada();
    strErrores += controlCamas();
    strErrores += controlValoracion();
    return strErrores;
}

function controlTemporada() {
    var strErrores = "";
    var opciones = document.getElementsByClassName("temporada");
    var contador = 0;
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            contador++;
        }
    }
    if (contador == 0) {
        strErrores += "Seleccione una temporada.\n";
    }
    return strErrores;
}

function controlCamas() {
    var strErrores = "";
    if ((document.getElementById("individual").value == 0) && (document.getElementById("doble").value == 0)) {
        strErrores = "Seleccione al menos una cama individual o doble.\n";
    }
    return strErrores;
}

function controlValoracion() {
    var strErrores = "";
    if (document.getElementById("valoracion").value == "selecciona") {
        strErrores = "Seleccione una valoración.\n";
    }
    return strErrores;
}

// -------------COMPROBAR FILTROS DE BÚSQUEDA-----------------

function comprobarCamas(objHab, numIndividual, numDoble) {
    var camas = false;
    var individual = 0;
    var doble = 0;
    for (cama of objHab.servicios.cama) {
        if (cama == "individual") {
            individual += 1;
        } else if (cama == "doble") {
            doble += 1;
        }
    } if ((individual == numIndividual) && (doble == numDoble)) {
        camas = true;
    }
    return camas;
}

function comprobarValoracion(objHab, valoracion) {
    var dentroRango = false;
    switch (valoracion) {
        case "excelente":
            if (objHab.valoracion == "excelente") {
                dentroRango = true;
            }
            break;
        case "bueno":
            if (objHab.valoracion == "bueno") {
                dentroRango = true;
            }
            break;
        case "aceptable":
            if (objHab.valoracion == "aceptable") {
                dentroRango = true;
            }
            break;
    }
    return dentroRango;
}

function comprobarComodidades(objHab, minibar, tv, cafetera, balcon, vistas, climatizacion) {
    var comodidades = true;
    if (minibar) {
        if (!objHab.servicios.minibar) {
            comodidades = false;
        }
    }
    if (tv) {
        if (!objHab.servicios.television) {
            comodidades = false;
        }
    }
    if (cafetera) {
        if (!objHab.servicios.cafetera) {
            comodidades = false;
        }
    }
    if (balcon) {
        if (!objHab.servicios.balcon) {
            comodidades = false;
        }
    }
    if (vistas) {
        if (!objHab.servicios.vistas) {
            comodidades = false;
        }
    }
    if (climatizacion) {
        if (!objHab.servicios.climatizacion) {
            comodidades = false;
        }
    }
    return comodidades;
}

//-----------------COMPROBAR MENOR PRECIO-------------------------

function comprobarMenorPrecio(listaObjPrecio) {
    var objAux = new Object();
    var precioAux = 1000;
    for (objeto of listaObjPrecio) {
        if (calcularPrecioTotal(objeto) < precioAux) {
            objAux = objeto;
            precioAux = calcularPrecioTotal(objeto);
        }
    }
    return objAux;
}

// -------------------------APLICAR FILTROS A LA BÚSQUEDA-------------------------

function aplicarFiltros() {
    if (listadoHotelesBusqueda != null && listadoHotelesBusqueda.length > 0) {
        listadoHotelesFiltrados = listadoHotelesBusqueda;
        var listaAuxiliar = new Array();
        for (objResultado of listadoHotelesFiltrados) {
            var cumpleRequisitos = false;
            cumpleRequisitos = comprobarFiltrosActivados(objResultado);
            if (cumpleRequisitos) {
                listaAuxiliar.push(objResultado);
            }
        }
        listadoHotelesFiltrados = listaAuxiliar;
        borrarResultadosAnteriores();
        if (listadoHotelesFiltrados != null) {
            for (objFiltrado of listadoHotelesFiltrados) {
                pintarHabitacion(objFiltrado);
            }
        } else {
            document.getElementById("resultado").innerHTML = "No se han encontrado habitaciones con estos criterios de búsqueda.";
        }
    } else {
        document.getElementById("resultado").innerHTML = "Debe realizar una búsqueda para poder aplicar estos filtros.";
    }
}

function comprobarFiltrosActivados(objResultado) {
    var cumpleRequisitos = false;
    var cumpleComidas = false;
    var servicioComida = getValorRadio("comidas");
    if (objResultado.hotel.servicioComida == servicioComida) {
        cumpleRequisitos = true;
    } else {
        cumpleRequisitos = false;
    }
    for (filtro of document.getElementsByClassName("filtroCheckbox")) {
        if (filtro.checked) {
            switch (filtro.id) {
                case "restaurante":
                    if (objResultado.hotel.establecimientos.restaurante != null) {
                        cumpleRequisitos = true;
                    } else {
                        cumpleRequisitos = false;
                    }
                    break;
                case "bar":
                    if (objResultado.hotel.establecimientos.bar != null) {
                        cumpleRequisitos = true;
                    } else {
                        cumpleRequisitos = false;
                    }
                    break;
                case "catering":
                    if (objResultado.hotel.establecimientos.catering) {
                        cumpleRequisitos = true;
                    } else {
                        cumpleRequisitos = false;
                    }
                    break;
                case "minimarket":
                    if (objResultado.hotel.establecimientos.minimarket) {
                        cumpleRequisitos = true;
                    } else {
                        cumpleRequisitos = false;
                    }
                    break;
                case "mascotas":
                    if (objResultado.hotel.mascotas != null) {
                        cumpleRequisitos = true;
                    } else {
                        cumpleRequisitos = false;
                    }
                    break;
                case "alquiler":
                    if (objResultado.hotel.alquilerVehiculos != null) {
                        cumpleRequisitos = true;
                    } else {
                        cumpleRequisitos = false;
                    }
                    break;
            }
        }
    }
    return cumpleRequisitos;
}

// -----------------PINTAR HABITACIONES------------------------

function pintarHabitacion(objResultado) {

    var StrHtml = "<div class=\"habitacion\">";
    StrHtml += "<div class=\"imagenHab\">";
    StrHtml += "<img class=\"imgMiniHab\" src=\"https://raw.githubusercontent.com/jrivasdam19/LLMJSON/master/img/" + objResultado.hab.id + ".jpg\">";
    StrHtml += "</div>";
    StrHtml += "<div class=\"infoHab\">";
    StrHtml += "<h3 class=\"nomHotel\">" + objResultado.hotel.nom + "</h3><br>";
    StrHtml += "<h4 class=\"nomHab\">" + objResultado.hab.nombre + "</h4><br>";
    StrHtml += "<h5 class=\"nomLugar\">" + objResultado.hotel.ubicacion + "</h5><br>";
    StrHtml += "<div id=\"seleccionar\">";
    StrHtml += "<label>Cantidad: </label>";
    StrHtml += "<input type=\"number\" id=\"" + objResultado.hotel.id + "_" + objResultado.hab.id + "_" + objResultado.precio.temporada + "_" + objResultado.precio.agregador + "\" value=\"0\" min=\"0\"/>";
    StrHtml += "<button type=\"button\" onclick=\"seleccionarHabitacion(" + objResultado.hotel.id + "," + objResultado.hab.id + ",'" + objResultado.precio.temporada + "','" + objResultado.precio.agregador + "'," + calcularPrecioTotal(objResultado.precio) + ")\" >Seleccionar</button>";
    StrHtml += "</div>";
    StrHtml += "</div>";
    StrHtml += "<div class=\"precioHab\">";
    StrHtml += "<p>Precio: " + objResultado.precio.valorNeto + " " + objResultado.precio.moneda + "</p><br>";
    StrHtml += "<p>Impuestos: " + objResultado.precio.impuestos + "%</p><br></br>";
    StrHtml += "<p>Precio total: " + calcularPrecioTotal(objResultado.precio); + " " + objResultado.precio.moneda + "</p>";
    StrHtml += "</div>";
    StrHtml += "</div>";
    StrHtml += "";

    document.getElementById("resultado").innerHTML += StrHtml;
}

// -----------------CALCULAR PRECIO TOTAL----------------------

function calcularPrecioTotal(precio) {
    var precioBase = precio.valorNeto;
    var impuestos = precio.impuestos;
    var comision = precio.comision;
    var precioTotal = precioBase + ((precioBase * impuestos) / 100) + comision;
    return precioTotal;
}

// ------------ACTUALIZAR ASIDE DERECHO CON CANTIDAD DE HABITACIONES---------------------------

function seleccionarHabitacion(hotelId, habId, temporada, agregador, precioTotal) {

    if (listadoHabSeleccionadas == null) {
        listadoHabSeleccionadas = new Array();
    }

    var valorActual = parseFloat(document.getElementById("precioValor").innerText);
    var numHabActual = parseInt(document.getElementById("numHabitaciones").innerText);
    var numHabSeleccionadas = parseInt(document.getElementById(hotelId + "_" + habId + "_" + temporada + "_" + agregador).value);

    if (numHabSeleccionadas > 0) {
        document.getElementById("numHabitaciones").innerText = numHabActual + numHabSeleccionadas;
        document.getElementById("precioValor").innerText = valorActual + (precioTotal * numHabSeleccionadas);

        var habitacionSeleccionada = new Object();
        habitacionSeleccionada.hotelId = hotelId;
        habitacionSeleccionada.habId = habId;
        habitacionSeleccionada.temporada = temporada;
        habitacionSeleccionada.agregador = agregador;
        habitacionSeleccionada.numHabSeleccionadas = numHabSeleccionadas;
        listadoHabSeleccionadas.push(habitacionSeleccionada);

    } else {
        alert("Selecciona alguna habitación.");
    }
}

// -------------OBTENER VALOR DE LOS INPUT RADIO-------------------

function getValorRadio(nomRadio) {
    var radios = document.getElementsByName(nomRadio);
    for (radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return "";
}

// ----------OBTENER VALOR DE LOS INPUT CHECKBOX------------------

function getValorCheckBox(nomCheckBox) {
    var box = false;
    if (document.getElementById(nomCheckBox).checked) {
        var box = true;
    }
    return box;
}

//------------ENVIAR listadoHabSeleccionadas A cotització.html PASÁNDOLO A STRING--------------------

function continuar() {
    if (listadoHabSeleccionadas == null || listadoHabSeleccionadas.length == 0) {
        alert("No hay ninguna habitación seleccionada.");
    } else {
        var jsonString = JSON.stringify(listadoHabSeleccionadas);
        document.getElementById("parJson").value = jsonString;
        document.getElementById("dispo").submit();
    }
    borrarPrecioTotalHab();
    desmarcarFiltrosNav();
    desmarcarFiltrosAsideIzq();
}
