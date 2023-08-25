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
  
  //array for data file paths to use
  var basinFilePath = [
    "data/BasinATLAS_levxx",  //index 0
    "data/BasinATLAS_levxx",
    "data/BasinATLAS_lev02.topojson",
    "data/BasinATLAS_lev03.topojson",
    "data/BasinATLAS_lev04.topojson",
    "data/BasinATLAS_lev05.topojson",
    "data/BasinATLAS_lev06.topojson",
    "data/BasinATLAS_lev07.topojson",
    "data/BasinATLAS_lev08.topojson" //index 8
  ]

  //objects to define descriptions, unit, spatial extent, dimension, and land cover & climate classes
  var attrDescription = 
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
  var attrUnit = 
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
  var attrExtent = 
        {"p": "at sub-basin pour point",
        "s": "per sub-basin",
        "u": "in total watershed of sub-basin pour point"
      };
  var attrDimension = 
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
  var landCoverClasses = { //colors taken from BasinATLAS Catalog
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
      11:	{classDesc: "Shrub cover, closed-open, evergreen (with or without sparse tree layer)", color: '#d0ff72'},
      12:	{classDesc: "Shrub cover, closed-open, deciduous (with or without sparse tree layer)", color: '#eae405'},
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
  var climateZoneClasses = { //colors taken from BasinATLAS Catalog
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
  var basinGeoSet = new Set (["HYBAS_ID","DIST_SINK","DIST_MAIN","SUB_AREA","UP_AREA","PFAF_ID","ORDER_"]);
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

    //create layer group for styling/organizing layer control
    var baseMaps = {
      "OpenStreetMap": osm,
      "CartoDB Positron": positron
    };

    //create map object and add initial layers (here it's just one), remove default zoom
    map = L.map('map', {
      zoomControl: false,
      layers: [osm]
    }).setView([37.8, -96], 5);

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
    document.querySelector(".range-slider").min = 2;
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
                index = index > 8 ? 2 : index;
            } else if (step.id == 'reverse'){
                index--;
                //if past the first attribute, wrap around to last attribute
                index = index < 2 ? 8 : index;
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

  //function to handle geojson fetch and return
  function getData(basinLevel){
      //use Promise.all to parallelize asynchronous data loading
      var promises = [d3.json(basinFilePath[basinLevel])];
      Promise.all(promises).then(callback);

      function callback(data){
        var json = data[0]; //choosing to only load one topojson at a time
        
        //translate from topojson to geojson using parameter based on basinLevel (from topojson.min.js)
        var currentBasinJson = topojson.feature(json, json.objects["BasinATLAS_lev0"+basinLevel]);
        //console.log(currentBasinJson); //FeatureCollection object, same as a geojson file would be

        //functions that need geojson data need to be called within callback
        attributes = getAttributes(currentBasinJson);
        calcStats(currentBasinJson);
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
  function calcStats(data){
    basinVals = []; //reset to empty in case this function is after the slider is changed
    stats = [];
      for (basin of data.features){
        var val = basin.properties[expressed];
        basinVals.push(val);
      };
    stats.min = Math.min(...basinVals);
    stats.max = Math.max(...basinVals);
  }

  //function to consolidate properties for adding data to map
  //parent function to styling function and event handlers
  function addLayer(data){
    //make the d3 color scale generator at layer creation
    // https://d3js.org/d3-scale-chromatic/sequential
    colorScale = d3.scaleQuantile(d3.schemeYlOrRd[5]).domain(basinVals);

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
      var expressedSplit = expressed.split('_');
      //special description for parameters with "less coded" names
      if (basinGeoSet.has(expressed)==true){
        description = attrDescription[expressed];
        this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
          '<b>' + props[expressed] + ' ' + attrUnit[expressed] + '</b>'
          : 'Hover over a basin');
      }
      //special description and label for "Spatial Majority" classes
      else if (expressedSplit[2] == "smj"){
        description = attrDescription[expressedSplit[0]]
        + " class majority <br>"
        + attrExtent[expressedSplit[2].slice(0,1)];

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
        description = attrDescription[expressedSplit[0]] + ' ' 
        + attrExtent[expressedSplit[2].slice(0,1)] + ': <br>'
        + landCoverClasses[expressedSplit[2].slice(1)].classDesc;

        this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
          '<b>' + props[expressed] + ' percent </b>'
          : 'Hover over a basin');
      }
      //the most 'standard' version
      else {
        description = attrDescription[expressedSplit[0]] + '<br>' 
            + attrExtent[expressedSplit[2].slice(0,1)] + '<br>'
            + attrDimension[expressedSplit[2].slice(1)];

        this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
            '<b>' + props[expressed] + ' ' + attrUnit[expressedSplit[1]] + '</b>'
            : 'Hover over a basin');
        }
    };

    info.addTo(map);

    setLegend();            //function to set up the legend based on current attributes
    createDropdown(data);   //function to create dropdown which allows user to change attributes
  }

  function setLegend(){
    legend = L.control({position: 'bottomright'});
    //function to create the legend. Finicky/needs formatting
    legend.onAdd = function (map) {
      //start empty array to hold grades of legend
      var grades = [];

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
        grades.push(stats.min,stats.max);
        //add quantiles of expressed to grades, from colorScale function-part of d3
        grades = grades.concat(colorScale.quantiles());
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
  function createDropdown(data){
    //add select element
    var dropdown = d3.select(".sequence-control-container")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){changeAttribute(this.value,data)}); //function to restyle map, legend

    //add initial option
    var titleOption = dropdown
        .append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select Attribute");

    //add attribute name options
    var attrOptions = dropdown
        .selectAll("attrOptions")
        .data(attributes)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
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

    //remove legend, info, dropdown
    map.removeControl(legend);
    map.removeControl(info);
    var dropdown = d3.select(".dropdown")
        .remove();

    //triggers new load of topojson for basin of "index" level, which creates new: layer, legend, info, dropdown
    getData(index);
  }

  //function to restyle the layer based on new attribute data, also updates the legend and info
  function changeAttribute(newAttribute, data){
        //change the expressed attribute
        expressed = newAttribute;
        //pass current geojson data to calcstats to update basinVals for new attribute
        calcStats(data);
        //use updated basinVals to update colorScale which is used in getColor
        colorScale = d3.scaleQuantile(d3.schemeYlOrRd[5]).domain(basinVals);

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
  }

  //function to color map based on attribute
  function getColor(val){ //compare property against some categorization
    //check if 'expressed' is an attribute where color should be graduated per value or unique value
    if (expressed == "clz_cl_smj") {
      return climateZoneClasses[val].color;
    } else if (expressed == "glc_cl_smj") {
      return landCoverClasses[val].color;
    }
    else {
      //create d3 color scale generator
      return colorScale(val);
    }
  }


})(); //wraps the initial function