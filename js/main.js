//javascript code associated with Mississippi River Basins Final Project

//much of this follows https://leafletjs.com/examples/choropleth/
//and Geog Lab 1

//wrap everything in an anonymous function which is immediately invoked
(function(){

  //psuedo-global variables
  var map;
  
  //array for data file paths to use
  var basinFilePath = [
    "data/Bains_levxx",  //index 0
    "data/Bains_levxx",
    "data/Bains_lev02.geojson",
    "data/Bains_lev03.geojson",
    "data/Bains_lev04.geojson",
    "data/Bains_lev05.geojson",
    "data/Bains_lev06.geojson",
    "data/Bains_lev07.geojson",
    "data/Basins_lev08.geojson" //index 8
  ]


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

  //function to handle geojson fetch and return
  function getData(map){
    //load the data, then map
    fetch(basinFilePath[8])
      .then(function(response){
        return response.json();
      })
      .then(function(json){
        //functions that use json data are called here
        addLayer(json);

        
      })
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
        fillColor: getColor(), //pass property from geojson to color function
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.2
      };
    }
  
  
    //function to color map based on attribute
    function getColor(d){ //compare property against some categorization
      return "#888";
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