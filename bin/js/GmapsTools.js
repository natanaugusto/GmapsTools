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
    },
    /**
     * Cria um novo objeto Gmap relacionado a uma div
     * @param div HTML Element
     * @param MapOptions Opçoes do Objeto mapa https://developers.google.com/maps/documentation/javascript/reference?hl=#MapOptions
     */
    NewGmap: function(div, MapOptions) {
        if (!div) {
            console.error('Nenhuma div encontrada');
            return false;
        }

        var Gmap = {
            /**
             * Armazena o objeto Google Map
             * google.maps.Map
             * https://developers.google.com/maps/documentation/javascript/reference?hl=#Map
             */
            Map: null,
            /**
             *Array para armazenar objetos google.maps.InfoWindow
             * https://developers.google.com/maps/documentation/javascript/reference#InfoWindow
             */
            InfoWindows: null,
            /**
             * Array para armazenar objetos google.maps.Marker
             * https://developers.google.com/maps/documentation/javascript/reference#Marker
             */
            Markers: null,
            /**
             * Armazena um objeto google.maps.Polyline
             * https://developers.google.com/maps/documentation/javascript/reference#Polyline
             */
            Polylines: null,
            /**
             * Distancia da rota
             */
            Distance: 0
        };

        var Options = GmapsTools.options.MapOptions;
        if (typeof MapOptions === 'object')
            Options = Tools.MergeRecursive(Options, MapOptions);

        //Inicia o map
        Gmap.Map = new google.maps.Map(div, Options);

        return Gmap;
    },
    NewMarker: function(Gmap, MarkerOptions) {
        var Options = GmapsTools.options.MarkerOptions;
        if (typeof MarkerOptions === 'object')
            Options = Tools.MergeRecursive(Options, MarkerOptions);

        if (typeof Options.position[0] !== 'undefined' && Options.position[1] !== 'undefined')
            Options.position = new google.maps.LatLng(Options.position[0], Options.position[1]);

        Options.map = Gmap.Map;

        if (Gmap.Markers === null)
            Gmap.Markers = new Array();

        Gmap.Markers.push(new google.maps.Marker(Options));
    },
    LoadMarkersByArray: function(Gmap, Markers, MarkerOptions) {
        var MarkersLen = Markers.length;

        for (var a = 0; a < MarkersLen; a++) {
            MarkerOptions = typeof MarkerOptions === 'object' ? Tools.MergeRecursive(MarkerOptions, Markers[a]) : Markers[a];
            GmapsTools.NewMarker(Gmap, MarkerOptions);
        }
    },
    NewInfoWindow: function(Gmap, InfoWindowOptions) {
        var Options = GmapsTools.options.InfoWindowOptions;

        if (typeof InfoWindowOptions === 'object')
            Options = Tools.MergeRecursive(Options, InfoWindowOptions);

        if (typeof Options.position !== 'undefined' && typeof Options.position[0] !== 'undefined' && Options.position[1] !== 'undefined')
            Options.position = new google.maps.LatLng(Options.position[0], Options.position[1]);

        Options.map = Gmap.Map;

        if (Gmap.InfoWindows === null)
            Gmap.InfoWindows = new Array();

        Gmap.InfoWindows.push(new google.maps.InfoWindow(Options));

        var kInfo = Gmap.InfoWindows.length - 1;

        if (Options.closed === true)
            Gmap.InfoWindows[kInfo].close();
    },
    LoadInfoWindowsByArray: function(Gmap, InfoWindows, InfoWindowOptions) {
        var InfoWindowsLen = InfoWindows.length;

        for (var a = 0; a < InfoWindowsLen; a++) {
            InfoWindowOptions = typeof InfoWindowOptions === 'object' ? Tools.MergeRecursive(InfoWindowOptions, InfoWindows[a]) : InfoWindows[a];
            GmapsTools.NewInfoWindow(Gmap, InfoWindows[a]);
        }
    },
    /**
     * Cria um marcador com uma InfoWindow relacionada
     * @param {GmapsTools.Gmaps} Gmap
     * @param {object{position,content}} MarkerInfo
     * @param {google.maps.MarkerOptions} MarkerOptions
     * @param {google.maps.InfoWindowOptions} InfoWindowOptions
     * @returns {void}
     */
    NewMarkerInfo: function(Gmap, MarkerInfo, MarkerOptions, InfoWindowOptions) {
        if (typeof MarkerInfo !== 'object')
            return false;

        if (typeof MarkerInfo.position !== 'object' || typeof MarkerInfo.content !== 'string')
            return false;

        if (typeof MarkerOptions !== 'object')
            MarkerOptions = {};

        if (typeof InfoWindowOptions !== 'object')
            InfoWindowOptions = {};

        MarkerOptions.position = MarkerInfo.position;
        GmapsTools.NewMarker(Gmap, MarkerOptions);
        var kMarker = Gmap.Markers.length - 1;

        InfoWindowOptions.content = MarkerInfo.content;
        GmapsTools.NewInfoWindow(Gmap, InfoWindowOptions);
        var kInfo = Gmap.InfoWindows.length - 1;

        if (Gmap.InfoWindows[kInfo].closed !== true)
            Gmap.InfoWindows[kInfo].open(Gmap.Map, Gmap.Markers[kMarker]);

        GoogleLibs.Event.addListener(Gmap.Markers[kMarker], 'click', function() {
            Gmap.InfoWindows[kInfo].open(Gmap.Map, Gmap.Markers[kMarker]);
        });
    },
    /**
     * Carrega varios MarkerInfos
     * @param {GmapsTools.Gmaps} Gmap
     * @param {object[]{position,content}} MarkerInfos
     * @param {google.maps.MarkerOptions} MarkerOptions
     * @param {google.maps.InfoWindowOptions} InfoWindowOptions
     */
    LoadMarkerInfos: function(Gmap, MarkerInfos, MarkerOptions, InfoWindowOptions) {
        var MarkerInfosLen = MarkerInfos.length;

        for (var a = 0; a < MarkerInfosLen; a++) {
            GmapsTools.NewMarkerInfo(Gmap, MarkerInfos[a], MarkerOptions, InfoWindowOptions);
        }
    },
    /**
     * Carrega uma rota apartir de uma url codificada do google
     * https://developers.google.com/maps/documentation/javascript/geometry?hl=pt-br
     * @param Gmap object
     * @param Path string|array
     * @param PolylineOptions object
     */
    NewPolyline: function(Gmap, Path, PolylineOptions) {
        if (!Path)
            throw '@param Path não informado';
        if (typeof Gmap !== 'object')
            throw '@param Gmap não é um object';

        if (typeof PolylineOptions !== 'object')
            PolylineOptions = GmapsTools.options.PolylineOptions;

        if (Gmap.Polylines === null)
            Gmap.Polylines = new Array(new google.maps.Polyline());

        //Pega a ultima Polyline que foi adicionada
        var Polyline = Gmap.Polylines[Gmap.Polylines.length - 1];

        //Seta as opções da Polyline de rota
        Polyline.setOptions(PolylineOptions);

        //Seta o mapa da Polyline de rota
        Polyline.setMap(Gmap.Map);

        switch (typeof Path) {
            case 'string':
                //Passa um MVCArray para o Polyline da rota
                Polyline.setPath(GoogleLibs.Geometry.encoding.decodePath(Path));
                break;
            case 'object':
                Polyline.setPath(GmapsTools.ArrayToMVCArray(Path));
                break;
        }

        //Calcula a distancia da rota
        Gmap.Distance = GoogleLibs.Geometry.spherical.computeLength(Polyline.getPath());

        //Centraliza o mapa
        GmapsTools.CenterMapByPath(Gmap);
    },
    /**
     * Centraliza o mapa baseado na rota atual
     * @param Gmap
     */
    CenterMapByPath: function(Gmap) {
        //Pega o objeto path
        var path = Gmap.Polylines[0].getPath();

        //Instancia um objeto LatLngBounds
        //https://developers.google.com/maps/documentation/javascript/reference?hl=pt-br#LatLngBounds
        var bounds = new google.maps.LatLngBounds();

        path.forEach(function(e) {
            bounds.extend(e);
        });

        Gmap.Map.fitBounds(bounds);
    },
    /**
     * Adiciona um StreetView ao mapa
     * https://developers.google.com/maps/documentation/javascript/reference?hl=#StreetViewPanorama
     * @param {object} Gmap
     * @param {object} StreetViewOptions
     * @returns object
     */
    AddStreetView: function(Gmap, StreetViewOptions) {
        if (typeof StreetViewOptions === 'object')
            StreetViewOptions = Tools.MergeRecursive(GmapsTools.options.StreetViewOptions, StreetViewOptions);

        if (StreetViewOptions.position === null)
            StreetViewOptions.position = Gmap.Map.getCenter();

        Gmap.Map.setStreetView(new google.maps.StreetViewPanorama(Gmap.Map.getDiv(), StreetViewOptions));
    },
    /**
     * Retorna um objeto MVCArray baseado em um Array 
     * @param {array} array
     * @returns {google.maps.MVCArray}
     */
    ArrayToMVCArray: function(array) {
        var PathLen = array.length;

        for (a = 0; a < PathLen; a++) {
            array[a] = new google.maps.LatLng(Number(array[a][0]), Number(array[a][1]));
        }

        return new google.maps.MVCArray(array);
    }
};