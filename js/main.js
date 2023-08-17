//javascript code associated with Mississippi River Basins Final Project

//much of this follows https://leafletjs.com/examples/choropleth/
//and Geog Lab 1

//wrap everything in an anonymous function which is immediately invoked
(function(){

  //psuedo-global variables
  var map;
  
  //array for data file paths to use
  var basinFilePath = [
    "data/BasinATLAS_levxx",  //index 0
    "data/BasinATLAS_levxx",
    "data/BasinATLAS_lev02.geojson",
    "data/BasinATLAS_lev03.geojson",
    "data/BasinATLAS_lev04.geojson",
    "data/BasinATLAS_lev05.geojson",
    "data/BasinATLAS_lev06.geojson",
    "data/BasinATLAS_lev07.geojson",
    "data/BasinATLAS_lev08.geojson" //index 8
  ]

  //objects to define descriptions, unit, spatial extent, dimension, and land cover & climate classes
  var attributeDescription = 
        {"HYBAS_ID": "HydroBASIN ID",
        "DIST_SINK": "Distance from polygon outlet to next downstream sink",
        "DIST_MAIN": "Distance from polygon outlet to most downstream sink",
        "SUB_AREA": "Area of sub-basin",
        "UP_AREA": "Total upstream area",
        "PFAF_ID": "Pfafstetter code",
        "ORDER_": "Indicator of river order (classical)",
        "dis": "Natural discharge",
        "run": "Land surface runoff",
        "inu": "Inundation extent",
        "ria": "River area",
        "gwt": "Groundwater table depth",
        "ele":"Elevation",
        "sgr": "Stream gradient",
        "clz": "Climate zone",
        "tmp": "Air temperature",
        "pre": "Precipitation",
        "aet": "Actual Evapotranspiration",
        "cmi": "Climate Moisture Index",
        "glc": "Land cover",
        "wet": "Wetland",
        "for": "Forest",
        "crp": "Cropland",
        "pst": "Pasture",
        "ire": "Irrigated",
        "pac": "Protected Area",
        "cly": "Clay fraction in soil",
        "slt": "Silt fraction in soil",
        "snd": "Sand fraction in soil",
        "soc": "Organic cargon content in soil",
        "swc": "Soil water content",
        "ero": "Soil erosion",
        "ppd": "Population density",
        "urb": "Urban extent",
        "rdd": "Road density",
        "gpd": "Gross Domestic Product"
      }
  var attributeUnit = 
        {"m3": "cubic meters per second",
        "mm": "millimeters",
        "pc": "percent",
        "ha": "hectares",
        "cm": "centimeters",
        "mt": "meters above sea level",
        "dk": "decimeters per kilometer",
        "cl": "class",
        "dc": "degrees Celsius",
        "ix": "", //Index Value, not a useful unit
        "th": "tonnes per hectare",
        "kh": "kg/hectare per year",
        "pk": "people per square kilometer",
        "mk": "meters per square kilometer",
        "ud": "US dollars"
      };
  var attributeExtent = 
        {"p": "at sub-basin pour point",
        "s": "per sub-basin",
        "u": "in total watershed of sub-basin pour point"
      };
  var attributeDimension = 
        {"yr": "annual average",
        "mn": "annual minimum",
        "mx": "annual maximum",
        "lt": "long-term maximum",
        "se": "spatial extent",
        "av": "average",
        "mj": "majority",
        "g1": "50-100% wetland",
        "g2": "25-50% wetland",
        "su": "sum"
      };
  var landCoverClasses = {
      1:	"Tree cover, broadleaved, evergreen",
      2:	"Tree cover, broadleaved, deciduous, closed",
      3:	"Tree cover, broadleaved, deciduous, open",
      4:	"Tree cover, needle-leaved, evergreen",
      5:	"Tree cover, needle-leaved, deciduous",
      6:	"Tree cover, mixed leaf type",
      7:	"Tree cover, regularly flooded, fresh",
      8:	"Tree cover, regularly flooded, saline, (daily variation)",
      9:	"Mosaic: tree cover/other natural vegetation",
      10:	"Tree cover, burnt",
      11:	"Shrub cover, closed-open, evergreen (with or without sparse tree layer)",
      12:	"Shrub cover, closed-open, deciduous (with or without sparse tree layer)",
      13:	"Herbaceous cover, closed-open",
      14:	"Sparse herbaceous or sparse shrub cover",
      15:	"Regularly flooded shrub and/or herbaceous cover",
      16:	"Cultivated and managed areas",
      17:	"Mosaic: cropland/tree cover/other natural vegetation",
      18:	"Mosaic: cropland/shrub and/or herbaceous cover",
      19:	"Bare areas",
      20:	"Water bodies (natural and artificial)",
      21:	"Snow and ice (natural and artificial)",
      22:	"Artificial surfaces and associated areas",
      23:	"No data"
    };
  var climateZoneClasses = {
      1:	"Arctic 1	(A)",
      2:	"Arctic 2	(B)",
      3:	"Extremely cold and wet 1	(C)",
      4:	"Extremely cold and wet 2	(D)",
      5:	"Cold and wet	(E)",
      6:	"Extremely cold and mesic	(F)",
      7:	"Cold and mesic	(G)",
      8:	"Cool temperate and dry	(H)",
      9:	"Cool temperate and xeric	(I)",
      10:	"Cool temperate and moist	(J)",
      11:"	Warm temperate and mesic	(K)",
      12:	"Warm temperate and xeric	(L)",
      13:	"Hot and mesic	(M)",
      14:	"Hot and dry	(N)",
      15:	"Hot and arid	(O)",
      16:	"Extremely hot and arid	(P)",
      17:	"Extremely hot and xeric	(Q)",
      18:	"Extremely hot and moist	(R)"
    };
  //attribute matching 20230816 Basin08 geojson. May further reduce. Basin02 has less than, possibly less u?
  //var attributeArray = ["HYBAS_ID","DIST_SINK","DIST_MAIN","SUB_AREA","UP_AREA","PFAF_ID","ORDER_","dis_m3_pyr","run_mm_syr","inu_pc_smn","inu_pc_umn","inu_pc_smx","inu_pc_umx","inu_pc_slt","inu_pc_ult","ria_ha_ssu","ria_ha_usu","gwt_cm_sav","ele_mt_sav","ele_mt_uav","sgr_dk_sav","clz_cl_smj","tmp_dc_syr","tmp_dc_uyr","pre_mm_syr","pre_mm_uyr","aet_mm_syr","aet_mm_uyr","cmi_ix_syr","cmi_ix_uyr","glc_cl_smj","glc_pc_s01","glc_pc_s02","glc_pc_s04","glc_pc_s06","glc_pc_s09","glc_pc_s11","glc_pc_s12","glc_pc_s13","glc_pc_s14","glc_pc_s15","glc_pc_s16","glc_pc_s18","glc_pc_s20","glc_pc_s22","glc_pc_u01","glc_pc_u02","glc_pc_u04","glc_pc_u06","glc_pc_u09","glc_pc_u11","glc_pc_u12","glc_pc_u13","glc_pc_u14","glc_pc_u15","glc_pc_u16","glc_pc_u18","glc_pc_u20","glc_pc_u22","wet_pc_sg1","wet_pc_ug1","wet_pc_sg2","wet_pc_ug2","for_pc_sse","for_pc_use","crp_pc_sse","crp_pc_use","pst_pc_sse","pst_pc_use","ire_pc_sse","ire_pc_use","pac_pc_sse","pac_pc_use","cly_pc_sav","cly_pc_uav","slt_pc_sav","slt_pc_uav","snd_pc_sav","snd_pc_uav","soc_th_sav","soc_th_uav","swc_pc_syr","swc_pc_uyr","ero_kh_sav","ero_kh_uav","ppd_pk_sav","ppd_pk_uav","urb_pc_sse","urb_pc_use","rdd_mk_sav","rdd_mk_uav","gdp_ud_sav","gdp_ud_ssu","gdp_ud_usu"]

  //begin script
  window.onload = createMap();
  

  //function to create map
  function createMap(){

    map = L.map('map').setView([37.8, -96], 5);

    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

    getData(map);

  };

  //function to create basemap and other contextual layers

  //function to move zooms

  //function to create slider

  //function to handle geojson fetch and return
  function getData(map){
    //load the data, then map
    fetch(basinFilePath[8])
      .then(function(response){
        return response.json();
      })
      .then(function(json){
        //functions that use json data are called here
        var attributes = processData(json);
        addLayer(json);

        
      })
  };

  function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
            attributes.push(attribute);
    }
    console.log(attributes);
    return attributes;
  };

  //function to consolidate properties for adding data to map
  //parent function to styling function and event handlers
  function addLayer(data){
    var geojson;
    geojson = L.geoJson(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  
    //function to style geojson layer
    function style(data){
      return {
        fillColor: getColor(data.properties.ORDER_), //pass property from geojson to color function
        weight: 0.5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.9
      };
    }
  
  
    //function to color map based on attribute
    function getColor(d){ //compare property against some categorization
      return d < 1  ? '#084081' :
             d < 2  ? '#0868ac' :
             d < 3  ? '#2b8cbe' :
             d < 4  ? '#4eb3d3' :
             d < 5  ? '#7bccc4' :
             d < 6  ? '#a8ddb5' :
             d < 8  ? '#ccebc5' :
             d < 9  ? '#e0f3db' :
                      '#f7fcf0';
    }

    //sets events on individual features of layer
    function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
      });
    }

    //function to highlight geojson feature when hovered
    function highlightFeature(e) {
      var layer = e.target;
      info.update(layer.feature.properties);

      layer.setStyle({
          weight: 2,
          color: '#555',
          dashArray: '',
          fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
    }
      //resets highlight
      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    //this one is kind of drastic, want to modify zoom level
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Basin Label</h4>' +  (props ?
            '<b>' + props.HYBAS_ID + '</b>'
            : 'Hover over a basin');
    };

    info.addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(i) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
  
  
  };


})(); //wraps the initial function