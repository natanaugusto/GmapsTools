/**
 * Ferramentas gerais. Normalmente ferramentas para facilitar tarefas em
 * JavaScript puro.
 * @type object
 */
var Tools = {
    /*
     * Recursively merge properties of two objects 
     */
    MergeRecursive: function(obj1, obj2) {

        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor === Object) {
                    obj1[p] = Tools.MergeRecursive(obj1[p], obj2[p]);

                } else {
                    obj1[p] = obj2[p];

                }

            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];

            }
        }

        return obj1;
    }
};

/**
 * Bibliotecas do Google
 * @type object
 */
var GoogleLibs = {
    /**
     * Instancia do objeto Google Geocoder
     * https://developers.google.com/maps/documentation/javascript/reference?hl=#Geocoder
     * @type google.maps.Geocoder
     */
    Geocoder: new google.maps.Geocoder(),
    /**
     * Instancia do objeto Google Events
     * https://developers.google.com/maps/documentation/javascript/reference?hl=#event
     * @type google.maps.event
     */
    Event: google.maps.event,
    /**
     * Instancia do objeto Google Geometry
     * https://developers.google.com/maps/documentation/javascript/reference?hl=pt-br#encoding
     * https://developers.google.com/maps/documentation/javascript/reference?hl=pt-br#spherical
     * https://developers.google.com/maps/documentation/javascript/reference?hl=pt-br#poly
     * @type google.maps.geometry
     */
    Geometry: google.maps.geometry
};

/**
 * Obejeto de ferramentas para auziliar o desenvolvimento com mapas do Google
 * @type object
 */
var GmapsTools = {
    /**
     * Opções padrões para as ferramentas da API Google Maps V3.
     * Ex.: MapOptions, PolylineOptions, MarkerOptions, etc...
     * @type object
     */
    options: {
        /**
         * Opçoes do Objeto mapa 
         * https://developers.google.com/maps/documentation/javascript/reference?hl=#MapOptions
         * @type object
         */
        MapOptions: {
            zoom: 15,
            mapTypeOptions: {
                mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.TERRAIN,
                    google.maps.MapTypeId.HYBRID
                ]
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(-23.55052, -46.633309)
        },
        /**
         * Opçoes do Objeto Rota(Polyline)
         * https://developers.google.com/maps/documentation/javascript/reference?hl=#PolylineOptions
         * @type object
         */
        PolylineOptions: {
            strokeColor: "#4C4CFF",
            strokeOpacity: 0.6,
            strokeWeight: 5,
            clickable: true
        },
        /**
         * Opções do StreetView
         * https://developers.google.com/maps/documentation/javascript/reference?hl=#StreetViewPanoramaOptions
         * @type object
         */
        StreetViewOptions: {
            position: null,
            pov: {
                heading: 90,
                pitch: 0,
                zoom: 0
            }
        },
        /**
         * Opções do Objeto de Marcador
         * https://developers.google.com/maps/documentatin/javascript/reference?hl=pt-br#MarkerOptions
         * @type object
         */
        MarkerOptions: {},
        /**
         * Opções de InfoWindows
         * https://developers.google.com/maps/documentation/javascript/reference?hl=pt-br#InfoWindowOptions
         * @type object
         */
        InfoWindowOptions: {
            maxWidth: 200,
            content: 'New InfoWindow',
            closed: false
        }
    }
};

function Gmap(div, options) {
    console.trace();
    /**
     * Armazena o objeto Google Map
     * https://developers.google.com/maps/documentation/javascript/reference?hl=#Map
     * @type google.maps.Map 
     */
    var map;
    /**
     *Array para armazenar objetos google.maps.InfoWindow
     * https://developers.google.com/maps/documentation/javascript/reference#InfoWindow
     * @type Array
     */
    var InfoWindows;
    /**
     * Array para armazenar objetos google.maps.Marker
     * https://developers.google.com/maps/documentation/javascript/reference#Marker
     * @type Array
     */
    var Markers;
    /**
     * Armazena um objeto google.maps.Polyline
     * https://developers.google.com/maps/documentation/javascript/reference#Polyline
     * @type Array
     */
    var Polylines;

    //@construct
    this.InfoWindows = null;
    this.Markers = null;
    this.Polylines = null;

    //Verifica se @param div é um objeto html
    if (typeof div !== 'object' && div.nodeType !== 1)
        return false;

    //Define as opções dos objetos do GoogleMaps
    options = {
        MapOptions: typeof options === 'object' && typeof options.MapOptions === 'object' ?
                Tools.MergeRecursive(GmapsTools.options.MapOptions, options.MapOptions) :
                GmapsTools.options.MapOptions
    };

    //Cria o mapa
    this.map = new google.maps.Map(div, options.MapOptions);
    //@end

    //@implementation
    /**
     * Centraliza o mapa baseado em latitude e longitude ou endereço textual
     * @param {string|object(google.maps.LatLng)} center
     * @returns {Boolean}
     */
    this.setCenter = function(center) {
        //Verifica o tipo do @param center passado
        switch (typeof center) {
            case 'object':
                if (typeof center.lat === 'object' && typeof center.lng === 'object')
                    this.map.setCenter(center);
                else
                    return false;
                break;
            case 'string':
                //Código para centralizar pelo endereço
                return false;
                break;
            default:
                return false;
                break;
        }
    };

    /**
     * Retorna a latitude e longitude do centro do mapa
     * Alias para google.maps.Map.getCenter()
     * @returns {google.maps.LatLng}
     */
    this.getCenter = function() {
        return this.map.getCenter();
    };

    //@end
}