//javascript code associated with Mississippi River Basins Final Project

//wrap everything in an anonymous function which is immediately invoked
(function(){

  //psuedo-global variables
  var map;
  var stats = {};
  var basinVals = [];
  var attributes = [];
  var properties;
  var legend;
  var info;
  var colorScale;
  var breakPoints;
  var dropAttributes = [];
  
  //array for data file paths to use
  const basinFilePath = [
    "data/BasinATLAS_levxx",  //index 0
    "data/BasinATLAS_lev01.topojson",
    "data/BasinATLAS_lev02.topojson",
    "data/BasinATLAS_lev03.topojson",
    "data/BasinATLAS_lev04.topojson",
    "data/BasinATLAS_lev05.topojson",
    "data/BasinATLAS_lev06.topojson",
    "data/BasinATLAS_lev07.topojson",
    "data/BasinATLAS_lev08.topojson" //index 8
  ]

  //objects to define descriptions, unit, spatial extent, dimension, and land cover & climate classes
  const attrDescription = {
        "HYBAS_ID": "HydroBASIN ID",
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
        "wet": "Wetland Extent",
        "for": "Forest Extent",
        "crp": "Cropland Extent",
        "pst": "Pasture Extent",
        "ire": "Irrigated Area Extent",
        "pac": "Protected Area Extent",
        "cly": "Clay fraction in soil",
        "slt": "Silt fraction in soil",
        "snd": "Sand fraction in soil",
        "soc": "Organic cargon content in soil",
        "swc": "Soil water content",
        "ero": "Soil erosion",
        "ppd": "Population density",
        "urb": "Urban extent",
        "rdd": "Road density",
        "gdp": "Gross Domestic Product"
      }
  const attrUnit = {
        "m3": "cubic meters per second",
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
        "pk": "people per sq. kilometer",
        "mk": "meters per sq. kilometer",
        "ud": "US dollars",
        "HYBAS_ID": "",
        "DIST_SINK": "kilometers",
        "DIST_MAIN": "kilometers",
        "SUB_AREA": "sq. kilometers",
        "UP_AREA": "sq. kilometers",
        "PFAF_ID": "",
        "ORDER_": "nth order"
      };
  const attrExtent = {
        "p": "at sub-basin pour point",
        "s": "per sub-basin",
        "u": "above sub-basin" //"in total watershed of sub-basin pour point"
      };
  const attrExtentLong = {
        "p": "at sub-basin pour point",
        "s": "per sub-basin",
        "u": "in total watershed of sub-basin pour point"
      };
  const attrDimension = {
        "yr": "annual average",
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
  const landCoverClasses = { //colors taken from BasinATLAS Catalog
      1:	{classDesc: "Tree cover, broadleaved, evergreen", color:"#277300"},
      2:	{classDesc: "Tree cover, broadleaved, deciduous, closed", color: '#38a800'},
      3:	{classDesc: "Tree cover, broadleaved, deciduous, open", color: '#6fa900'},
      4:	{classDesc: "Tree cover, needle-leaved, evergreen", color: '#89cd66'},
      5:	{classDesc: "Tree cover, needle-leaved, deciduous", color: '#89ce64'},
      6:	{classDesc: "Tree cover, mixed leaf type", color: '#727200'},
      7:	{classDesc: "Tree cover, regularly flooded, fresh", color: '#458970'},
      8:	{classDesc: "Tree cover, regularly flooded, saline, (daily variation)", color: '#436584'},
      9:	{classDesc: "Mosaic: tree cover/other natural vegetation", color: '#a9a800'},
      10:	{classDesc: "Tree cover, burnt", color: '#8a4444'},
      11:	{classDesc: "Shrub cover, closed-open, evergreen", color: '#d0ff72'},
      12:	{classDesc: "Shrub cover, closed-open, deciduous", color: '#eae405'},
      13:	{classDesc: "Herbaceous cover, closed-open", color: '#d8d79e'},
      14:	{classDesc: "Sparse herbaceous or sparse shrub cover", color: '#cbcc66'},
      15:	{classDesc: "Regularly flooded shrub and/or herbaceous cover", color: '#aa66cd'},
      16:	{classDesc: "Cultivated and managed areas", color: '#f678b5'},
      17:	{classDesc: "Mosaic: cropland/tree cover/other natural vegetation", color: '#6f448a'},
      18:	{classDesc: "Mosaic: cropland/shrub and/or herbaceous cover", color: '#de71fe'},
      19:	{classDesc: "Bare areas", color: '#ffeabd'},
      20:	{classDesc: "Water bodies (natural and artificial)", color: '#005ce7'},
      21:	{classDesc: "Snow and ice (natural and artificial)", color: '#bee6ff'},
      22:	{classDesc: "Artificial surfaces and associated areas", color: '#333'},
      23:	{classDesc: "No data", color: '#686868'}
      };
  const climateZoneClasses = { //colors taken from BasinATLAS Catalog
      1:	{classDesc: "Arctic 1	(A)", color: '#bdffe8'},
      2:	{classDesc: "Arctic 2	(B)", color: '#7af4c9'},
      3:	{classDesc: "Extremely cold and wet 1	(C)", color: '#004da6'},
      4:	{classDesc: "Extremely cold and wet 2	(D)", color: '#0085a8'},
      5:	{classDesc: "Cold and wet	(E)", color: '#7c8df5'},
      6:	{classDesc: "Extremely cold and mesic	(F)", color: '#00724b'},
      7:	{classDesc: "Cold and mesic	(G)", color: '#38a800'},
      8:	{classDesc: "Cool temperate and dry	(H)", color: '#98e500'},
      9:	{classDesc: "Cool temperate and xeric	(I)", color: '#d0ff72'},
      10:	{classDesc: "Cool temperate and moist	(J)", color: '#ae64ce'},
      11: {classDesc: "Warm temperate and mesic	(K)", color: '#cd6598'},
      12:	{classDesc: "Warm temperate and xeric	(L)", color: '#ff7f7d'},
      13:	{classDesc: "Hot and mesic	(M)", color: '#f678b5'},
      14:	{classDesc: "Hot and dry	(N)", color: '#d69dbe'},
      15:	{classDesc: "Hot and arid	(O)", color: '#ffa77f'},
      16:	{classDesc: "Extremely hot and arid	(P)", color: '#ffeabd'},
      17:	{classDesc: "Extremely hot and xeric	(Q)", color: '#ffffbf'},
      18:	{classDesc: "Extremely hot and moist	(R)", color: '#ffbee8'}
      };
  const basinGeoSet = new Set (["HYBAS_ID","DIST_SINK","DIST_MAIN","SUB_AREA","UP_AREA","PFAF_ID","ORDER_"]);
  //Dist_SINK and DIST_MAIN have very similar data, but they are different with smaller sub-basins

  //initial values for expressed attribute and basinLevel
  var expressed = "sgr_dk_sav";
  var basinLevel = 5;

  //begin script
  window.onload = createMap();
  
  //function to create map
  function createMap(){
    //define layers to add to the map or to layer control
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

    var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    });

    var USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20,
      attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20,
      attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    //create layer group for styling/organizing layer control
    var baseMaps = {
      "OpenStreetMap": osm,
      "CartoDB Positron": positron,
      "USGS Topography": USGS_USTopo,
      "USGS Imagery": USGS_USImagery
    };

    //create map object and add initial layers (here it's just one), remove default zoom
    map = L.map('map', {
      zoomControl: false,
      layers: [osm],
      worldCopyJump: true
    }).setView([37.8, -96], 5);

    if(innerWidth < 1000) {map.setView([37.8,-96],4)};

    //moves zoom to topright, 1st control placed so 1st at the top
    var zooms = L.control.zoom({position:'topright'}).addTo(map);

    //Plugin to create a button control to reset view to default ('home' button), under zooms
    L.control.resetView({
      position: "topright",
      title: "Reset view",
      latlng: L.latLng([37.8, -96]),
      zoom: 5,
    }).addTo(map);

    //create layer control, can make other layer groups to add here
    var layerControl = L.control.layers(baseMaps).addTo(map);

    //function to create the slider for sequencing between basin levels
    createSequenceControls();

    //function to create dialog div for droptown of attributes to sit in
    createDialogs();

    //Leaflet method to add a scale, default is bottom left
    L.control.scale().addTo(map);

    //Leaflet plugin to add a styled sidepanel
		const sidepanelLeft = L.control.sidepanel('mySidepanelLeft', {
			tabsPosition: 'left',
			startTab: 'tab-1'
		}).addTo(map);

    //brings data from topojsons to webpage, parent function for many map stylings
    getData(basinLevel);
  }

  //Create new slider to sequence between basin levels
  function createSequenceControls(){
    var SequenceControl = L.Control.extend({
        options: {position: "topleft",},

        onAdd: function () {
            //create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //creates a div for a title above the slider
            container.insertAdjacentHTML('beforeend', '<div class="slider-text" id="slider-text">Basin Level: ' + basinLevel.toString() + '</div>');
            
            //create range input element (slider) and buttons in one div, below the slider-text
            //slider is a DOM object https://www.w3schools.com/jsref/dom_obj_range.asp
            container.insertAdjacentHTML('beforeend', 
                '<div>' + 
                '<button class="step" id="reverse" title="Reverse"><img src="img/arrow-left.png"></button>' +
                '<input class="range-slider" type="range">' + 
                '<button class="step" id="forward" title="Forward"><img src="img/arrow-right.png"></button>' +
                '</div>')

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });
    //add sequence control to map
    map.addControl(new SequenceControl());

    //set slider attributes
    document.querySelector(".range-slider").max = 8;
    document.querySelector(".range-slider").min = 1;
    document.querySelector(".range-slider").value = basinLevel; //initial value
    document.querySelector(".range-slider").step = 1;

    var steps = document.querySelectorAll('.step'); //create var to hold selection of step

    //add event listener to step to change slider position and activate changeBasinlevel
    steps.forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value;
            if (step.id == 'forward'){
                index++;
                //if past the last attribute, wrap around to first attribute
                index = index > 8 ? 1 : index;
            } else if (step.id == 'reverse'){
                index--;
                //if past the first attribute, wrap around to last attribute
                index = index < 1 ? 8 : index;
            };
            //update slider
            document.querySelector('.range-slider').value = index;
            //pass new attribute to update basinLevel --> changes GeoJSON
            basinLevel = index;
            changeBasinLevel(index);
        })
    })

    //input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        //pass new attribute to update basinLevel --> changes GeoJSON  
        //get the new index value
        var index = this.value;
        basinLevel = index;
        changeBasinLevel(index);
    });
  }

  //function to create a dialog box to hold the dropdown and add event handlers for toggle/reset view
  function createDialogs(){
    //create dialog control to hold dropdown
    var dropdownDialog = L.control.dialog({
      size: [280,110],
      minSize: [280,110],
      maxSize: [280,110],
      anchor:[110,20],
      position: "topleft",
      initOpen: true
      }).setContent("<div id='dropdown-dialog'><p>Select a basin attribute:</p></div>")
      .addTo(map);

      //remove resizing option for dropdown dialog. Not helpful or necessary.
      dropdownDialog.hideResize();

      //create dialog control to hold chart
      var chartDialog = L.control.dialog({
        size: [500,500],
        minSize: [200,100],
        maxSize: [1000,1000],
        anchor: [300,20],
        position: "topleft",
        initOpen: true
      }).setContent("<div id='chart-dialog'><p style='display:none;'>Histogram for basin attribute:</p></div>")
      .addTo(map);

      //add a toggle icon to the Data Per Basin button
      document.querySelector("#attr-toggle").innerHTML = "<i class='bi bi-toggle-on'></i>";
      
      //add event listener to both dialogs so dialog close button also switches toggle to off
      var closeDialog = document.querySelectorAll(".leaflet-control-dialog-close")
      closeDialog.forEach(function(dialog){
        dialog.addEventListener("click", function(){
          document.querySelector("#attr-toggle").innerHTML = "<i class='bi bi-toggle-off'></i>";  
        })
      })
      
      //add event listeners to Data Per Basin button to open or close both dialogs and switch the toggle
      var basinDataButton = document.querySelector(".map-button"); //create var to hold selection
      basinDataButton.addEventListener("click", function(){
        if (document.querySelector(".leaflet-control-dialog").style.visibility === "hidden"){
          dropdownDialog.open();                      chartDialog.open();
          dropdownDialog.setSize([280,110]);          chartDialog.setSize([500,500]);
          dropdownDialog.setLocation([110,20]);       chartDialog.setLocation([300,20]);
          document.querySelector("#attr-toggle").innerHTML = "<i class='bi bi-toggle-on'></i>";
        } else {
          dropdownDialog.close();                     chartDialog.close();
          document.querySelector("#attr-toggle").innerHTML = "<i class='bi bi-toggle-off'></i>";
        }
      });

      //set listener on reset view button to also reset the location and size of the dialog
      var resetViewButton = document.querySelector(".leaflet-control-resetview");
      resetViewButton.addEventListener("click", function(){
        dialog.setLocation([110,20]);
        dialog.setSize([300,110]);
        if(innerWidth < 1000){map.setView([37.8,-96],4)};
      });
  }

  //function to handle geojson fetch and return
  function getData(basinLevel){
      //use Promise.all to parallelize asynchronous data loading
      var promises = [d3.json(basinFilePath[basinLevel])];
      Promise.all(promises).then(callback);

      function callback(data){
        var json = data[0]; //choosing to only load one topojson at a time
        
        //translate from topojson to geojson using parameter based on basinLevel (from topojson.min.js)
        //special object name for basinLevel 1 because it was simplified differently
        if (basinLevel == 1) {var currentBasinJson = topojson.feature(json, json.objects["BasinATLAS_v10_lev02"]);}
        else {var currentBasinJson = topojson.feature(json, json.objects["BasinATLAS_lev0"+basinLevel]);}
        //console.log(currentBasinJson); //FeatureCollection object, same as a geojson file would be

        //functions that need geojson data need to be called within callback
        attributes = getAttributes(currentBasinJson);
        calcStatsAndColorScale(currentBasinJson);
        addLayer(currentBasinJson);
      }
  }

  function getAttributes(data){
    //clear array to hold attributes of current feature (basins may have varying totals)
    attributes = [];
    //properties of the first feature in the dataset
    properties = [];
    properties = data.features[0].properties;
    //push each attribute name into attributes array
    for (var attribute in properties){
            attributes.push(attribute);
    }
    //console.log("list of attributes: ",attributes);
    return attributes;
  }

  //either: want to store values for every basin for every attribute for one geojson, so vals are available at attribute change
  //or: store values for every basin for one attribute for one geojson and call calcStats at attribute change
  function calcStatsAndColorScale(data){
    basinVals = []; //reset to empty in case this function is after the slider is changed
    stats = [];
    basinVals.push(data.features[0].properties[expressed]); //for loop misses the very first basin
      for (var basin of data.features){
        var val = basin.properties[expressed];
        basinVals.push(val);
      };
    stats.min = Math.min(...basinVals);
    stats.max = Math.max(...basinVals);

    //set up color scale with N color classes, N+1 colors and the lightest removed
    var colors = [];
    for (var i = 1; i < 6; i++){
      colors.push(d3.schemePuBuGn[6][i]);
    }

    if (basinLevel > 3){
      colorScale = d3.scaleThreshold().range(colors);
      //cluster data using ckmeans clustering algorithm to create natural breaks
      var clusters = ss.ckmeans(basinVals,5);
      //reset domain array to cluster minimums
      breakPoints = clusters.map(function(d){
        return d3.min(d);
      })
      //remove first value from domain array to create class breakpoints
      var breakPointsDomain = breakPoints;
      breakPointsDomain.shift();
      //assign array of last 4 cluster minimums as domain
      colorScale.domain(breakPointsDomain);
    } else if (basinLevel > 2){
      basinVals.sort(function(a,b){return a - b});
      colorScale = d3.scaleLinear().range(["#a6bddb","#016c59"]).domain([stats.min,stats.max]);
      breakPoints = basinVals;
      breakPoints.reverse().pop();
    } else {breakPoints = [];}
    
  }

  //function to consolidate properties for adding data to map
  //parent function to styling function and event handlers
  function addLayer(data){
    //create layer for geojson data, style each feature, add to map
    geojson = L.geoJson(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);

    //function to style geojson layer
    function style(data){
      var basinColor =  getColor(data.properties[expressed]);

      return {
        fillColor: basinColor,
        weight: 0.7,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.7
      };
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
        geojson.resetStyle(e.target); //geojson variable defined in parent function
        info.update();
    }

    //zooms and centers to feature, with maximum zoom
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds(), {maxZoom: 8});
    }

    //create new control to present attribute info to user on hover
    info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    //method to update the control based on feature properties passed
    //extremely specific to dataset, uses many if/else
    info.update = function (props) {
      //get useful description from coded term 'expressed'
      var description = "";
      var expressedSplit = expressed.split('_');
      //special description for parameters with "less coded" names
      if (basinLevel == 1){
        try {description = '<h2>' + expressed + '</h2>' + '<p>' + description + '</p>' + (props ? '<b>' + props[expressed] + '</b>'
          : 'Hover over a basin')
        } catch {description = ""}
        this._div.innerHTML = '<p>Basin Level 1 is the entire ground surface, undivided. This map shows how hydroSHEDS divides Level 1 into Level 2 watersheds around the world. Watersheds on this Basin Level have minimal attributes.<p>' + description;
      }
      else if (basinGeoSet.has(expressed)==true){
        description = attrDescription[expressed];
        this._div.innerHTML = '<h2>' + expressed + '</h2>' + '<p>' + description + '</p>' + (props ?
          '<b>' + props[expressed] + ' ' + attrUnit[expressed] + '</b>'
          : 'Hover over a basin');
      }
      //special description and label for "Spatial Majority" classes
      else if (expressedSplit[2] == "smj"){
        description = '<h2>' + attrDescription[expressedSplit[0]] + '</h2>'
        + " class majority <br>"
        + attrExtentLong[expressedSplit[2].slice(0,1)];

        if (expressedSplit[0] == "clz"){
          this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
            '<b>' + props[expressed] + ': ' + climateZoneClasses[props[expressed]].classDesc + '</b>'
            : 'Hover over a basin');
        }
        else if (expressedSplit[0] == "glc"){
          this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
            '<b>' + props[expressed] + ': ' + landCoverClasses[props[expressed]].classDesc + '</b>'
            : 'Hover over a basin');
        }
      }
      //special description for percent of land cover classes
      else if (expressedSplit[0] == "glc"){
        description = '<h2>' + attrDescription[expressedSplit[0]] + '</h2>'+ ' ' 
        + attrExtentLong[expressedSplit[2].slice(0,1)] + ': <h3>'
        + landCoverClasses[parseInt(expressedSplit[2].slice(1))].classDesc + '</h3>';

        this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
          '<b>' + props[expressed] + ' percent </b>'
          : 'Hover over a basin');
      }
      //the most 'standard' version
      else {
        description = '<h2>' + attrDescription[expressedSplit[0]] + '</h2>' 
            + attrExtentLong[expressedSplit[2].slice(0,1)] + '<br>'
            + attrDimension[expressedSplit[2].slice(1)];

        this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
            '<b>' + props[expressed] + ' ' + attrUnit[expressedSplit[1]] + '</b>'
            : 'Hover over a basin');
        }
    };

    info.addTo(map);

    setLegend();            //function to set up the legend based on current attributes
    createDropdownAndChart(data);   //function to create dropdown which allows user to change attributes
  }

  function setLegend(){
    legend = L.control({position: 'bottomright'});
    //function to create the legend. Finicky/needs formatting
    legend.onAdd = function (map) {
      //start empty array to hold grades of legend
      var grades = [];
      
      if (basinLevel == 1) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += 
        '<i style="background:' + getColor(grades[i]) + '"></i> ' +
        grades[i] +': ' + '' + (grades[i + 1] ? '<br>' : '');
      } 
      //special legend styling for attributes that show class (non-numeric data)
      if (expressed == "clz_cl_smj" || expressed == "glc_cl_smj") {
        let unique = basinVals.filter((item, i, ar) => ar.indexOf(item) === i);
        unique.sort(function(a,b){return a-b});
        grades = unique;

        var div = L.DomUtil.create('div', 'info legend');

        if (expressed == "clz_cl_smj") {
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i]) + '"></i> ' +
              grades[i] +': ' + climateZoneClasses[grades[i]].classDesc + (grades[i + 1] ? '<br>' : '');
          }
        }
        else if (expressed == "glc_cl_smj") {
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i]) + '"></i> ' +
              grades[i] +': ' + landCoverClasses[grades[i]].classDesc + (grades[i + 1] ? '<br>' : '');
          }
        }
      }
      //more 'standard' legend for the rest of the attributes
      else {
        //push stats min and max to grades array
        grades.push(stats.min);
        grades = grades.concat(breakPoints);
        grades.sort(function(a,b){return a-b}); //reversing this messes up legend, needs formatting

          var div = L.DomUtil.create('div', 'info legend');

          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
        }
        return div;
      };
    legend.addTo(map);
  }

  //function to create a dropdown menu for attribute selection
  function createDropdownAndChart(data){

    //resetting array to hold descriptive names of attributes
    dropAttributes = [];

    for (var i = 0; i < attributes.length; i++) {
      var attr = attributes[i];
      //get useful description from coded term 'expressed'
      var dropText = "";
      
      //special description for parameters with "less coded" names
      if (basinGeoSet.has(attr)==true){
        dropText = attr + ': ' + attrDescription[attr] ;
      }
      else {
        var attrSplit = attr.split('_');
      
        //special description and label for "Spatial Majority" classes
        if (attrSplit[2] == "smj"){
          dropText = attr + ': ' + attrDescription[attrSplit[0]]
          + " class majority " + attrExtent[attrSplit[2].slice(0,1)];
        }
        //special description for percent of land cover classes
        else if (attrSplit[0] == "glc"){
          dropText = attr + ': ' + attrDescription[attrSplit[0]] + ' ' 
          + attrExtent[attrSplit[2].slice(0,1)] + ': '
          + landCoverClasses[parseInt(attrSplit[2].slice(1))].classDesc;
        }
        //the most 'standard' version
        else {
          dropText = attr + ': ' + attrDescription[attrSplit[0]] + ' ' 
              + attrExtent[attrSplit[2].slice(0,1)] + ' '
              + attrDimension[attrSplit[2].slice(1)];
        }
      }
      dropAttributes.push((i+1) +'. ' + dropText);
    }
    
    //add select element
    var dropdown = d3.select("#dropdown-dialog")      //.sequence-control-container
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){changeAttribute(this.value,data)}); //function to restyle map, legend

    //add initial option
    var titleOption = dropdown
        .append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select attribute");

    //add attribute name options
    var attrOptions = dropdown
        .selectAll("attrOptions")
        .data(dropAttributes)
        .enter()
        .append("option")
        .attr("value", function(d){ return attributes[dropAttributes.indexOf(d)] })
        .text(function(d){ return d });

    makeChart();
  }

  function makeChart(){

    //code to add a chart title based on current attribute
    document.querySelector("#chart-dialog").insertAdjacentHTML("beforeend", 
    "<div class='chart-title'><p style='margin:0;'>" + dropAttributes[attributes.indexOf(expressed)].split(":")[0] + "</p>" +  
    "<h3 style='margin-top:0;'>" + dropAttributes[attributes.indexOf(expressed)].split(":")[1] + "</h3></div>");

    document.querySelector("#chart-dialog").insertAdjacentHTML("afterend", "<p class='chart-text'>Total number of basins: " + basinVals.length);

    //declare the chart dimensions and margins
    const width = 650;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 20;

    //threshold value sensitive to number of basins, could look through d3 threshold generators
    var threshold = "";
    if(basinVals.length < 10){threshold = basinVals.length}
    else if (basinVals.length < 100){threshold = basinVals.length/5}
    else if (basinVals.length < 1000){threshold = basinVals.length/40}
    else {threshold = 60}

    //bin the data
    const bins = d3.bin()
        .thresholds(threshold)
        .value((d) => d)
        (basinVals);

    //declare the x (horizontal position) scale
    const x = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length - 1].x1])
        .range([marginLeft, width - marginRight]);

    //declare the y (vertical position) scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([height - marginBottom, marginTop]);

    //create the SVG container and attach to chart-dialog
    const svg = d3.select("#chart-dialog")
        .append("svg")
        .attr("class","chart")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    //add a rectangle for each bin
    svg.append("g")
        .attr("fill", "#5db0b7")
      .selectAll()
      .data(bins)
      .join("rect")
        .attr("x", (d) => x(d.x0) + 1)
        .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
        .attr("y", (d) => y(d.length))
        .attr("height", (d) => y(0) - y(d.length));

    //add the x-axis and label
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .call((g) => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(function(){ return dropAttributes[attributes.indexOf(expressed)].split(":")[1] }));

    //add the y-axis and label, and remove the domain line
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Frequency (no. of basins)"));
    
    //return the SVG element
    return svg.node()
  }

  function changeBasinLevel(index){
    document.getElementById("slider-text").innerHTML = 'Basin Level: ' + index.toString();
    //remove current layer before we switch
    //this method cycles through layers and removes all but 1 basemap. Might cause errors down the line
    //can access geoJSON layer by creating a global variable and redefining it under addLayer (not declaring again)
    var layCount = 0;
    map.eachLayer(function(layer){
      if (layCount > 0) {layer.remove()}
      layCount +=1;
    });

    //remove legend, info, dropdown, chart
    map.removeControl(legend);
    map.removeControl(info);
    var dropdown = d3.select(".dropdown").remove();
    var chartTitle = d3.select(".chart-title").remove();
    var chart = d3.select(".chart").remove();
    var chartText = d3.select(".chart-text").remove();

    //triggers new load of topojson for basin of "index" level, which creates new: layer, legend, info, dropdown
    getData(index);
  }

  //function to restyle the layer based on new attribute data, also updates the legend and info
  function changeAttribute(newAttribute, data){
        //change the expressed attribute
        expressed = newAttribute;
        //pass current geojson data to calcstats to update basinVals for new attribute
        calcStatsAndColorScale(data);

        //search for layer with features to update style of basin layer
        map.eachLayer(function(layer){
          if (layer.feature){
            layer.setStyle({
              fillColor: getColor(layer.feature.properties[expressed])
            });
          }
        });

        //remove legend and set legend with new attribute and basinVals
        map.removeControl(legend);
        setLegend();

        //update the info control with new attribute info
        info.update(data.properties);

        var chartTitle = d3.select(".chart-title").remove();
        var chart = d3.select(".chart").remove();
        var chartText = d3.select(".chart-text").remove();
        makeChart();
  }

  //function to color map based on attribute
  function getColor(val){ //compare property against some categorization
    //check if 'expressed' is an attribute where color should be graduated per value or unique value
    var valColor;
    try{
        if(basinLevel == 1) {
          valColor = "#016c59";
        } else if (expressed == "clz_cl_smj") {
          valColor = climateZoneClasses[val].color;
        } else if (expressed == "glc_cl_smj") {
          valColor = landCoverClasses[val].color;
        }
        else if (basinLevel == 2){
          valColor = "#67a9cf";
        } else {
          //use d3 color scale generator
          valColor = colorScale(val);
        }
    }
    catch(err){
      console.log("error within getColor: ",err.name);
      valColor = "#333333";   //if there is an error, set color as dark grey
    }
    finally{
      return valColor;        //return appropriate color with or without error
    }
  }


})(); //wraps the initial function

