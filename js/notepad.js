//javascript code associated with Mississippi River Basins Final Project

//copied code for later use, not currently used with main


  //attribute matching 20230816 Basin08 geojson. May further reduce. Basin02 has less than, possibly less u?
  var attributeArray = [
    "HYBAS_ID",
    "DIST_SINK","DIST_MAIN",
    "SUB_AREA","UP_AREA",
    "PFAF_ID","ORDER_",
    "dis_m3_pyr",
    "run_mm_syr",
    "inu_pc_smn","inu_pc_umn","inu_pc_smx","inu_pc_umx","inu_pc_slt","inu_pc_ult",
    "ria_ha_ssu","ria_ha_usu",
    "gwt_cm_sav",
    "ele_mt_sav","ele_mt_uav",
    "sgr_dk_sav",
    "clz_cl_smj",
    "tmp_dc_syr",
    "tmp_dc_uyr",
    "pre_mm_syr","pre_mm_uyr",
    "aet_mm_syr","aet_mm_uyr",
    "cmi_ix_syr","cmi_ix_uyr",
    "glc_cl_smj",
    "glc_pc_s01","glc_pc_s02","glc_pc_s04","glc_pc_s06","glc_pc_s09","glc_pc_s11","glc_pc_s12","glc_pc_s13","glc_pc_s14","glc_pc_s15","glc_pc_s16","glc_pc_s18","glc_pc_s20","glc_pc_s22","glc_pc_u01","glc_pc_u02","glc_pc_u04","glc_pc_u06","glc_pc_u09","glc_pc_u11","glc_pc_u12","glc_pc_u13","glc_pc_u14","glc_pc_u15","glc_pc_u16","glc_pc_u18","glc_pc_u20","glc_pc_u22",
    "wet_pc_sg1","wet_pc_ug1","wet_pc_sg2","wet_pc_ug2",
    "for_pc_sse","for_pc_use",
    "crp_pc_sse","crp_pc_use",
    "pst_pc_sse","pst_pc_use",
    "ire_pc_sse","ire_pc_use",
    "pac_pc_sse","pac_pc_use",
    "cly_pc_sav","cly_pc_uav",
    "slt_pc_sav","slt_pc_uav",
    "snd_pc_sav","snd_pc_uav",
    "soc_th_sav","soc_th_uav",
    "swc_pc_syr","swc_pc_uyr",
    "ero_kh_sav","ero_kh_uav",
    "ppd_pk_sav","ppd_pk_uav",
    "urb_pc_sse","urb_pc_use",
    "rdd_mk_sav","rdd_mk_uav",
    "gdp_ud_sav","gdp_ud_ssu","gdp_ud_usu"];


    //code to get unique vals of basin vals, attempted to generate a color scale but bulky for iterations
    let unique = basinVals.filter((item, i, ar) => ar.indexOf(item) === i);
    unique.sort(function(a,b){return b-a});
    colorScale = chroma.scale('RdYlBu').domain(unique, unique.length);

    //code to get unique vals of basin vals using Sets. Only sometimes useful
    var gradeSet = new Set ();
    for (val in basinVals) {
      gradeSet.add(basinVals[val]);
    }
    console.log(gradeSet);



    info.update = function (props) {
      //initialize label variable
      var expressedValue = props[expressed];
      //get useful description from coded term 'expressed'
      
      if (basinGeoSet.has(expressed)==true){
        //special description build
        description = expressed
      }
      
      var expressedSplit = expressed.split('_');
      //special description and label for "Spatial Majority" classes
      
      if (expressedSplit[2] == "smj") {
        description = attrDescription[expressedSplit[0]] + " "
        + attrExtent[expressedSplit[2].slice(0,1)] + " "
        + attrDimension[expressedSplit[2].slice(1)];
        if(expressedSplit[1] = "clz"){
          expressedValue = landCoverClasses[(props[expressed])];
        }
        else if(expressedSplit[1] == "glc"){
          expressedValue = climateZoneClasses[props[expressed]];
        }
      }
      
      else {
        description = attrDescription[expressedSplit[0]] + " " 
            + attrUnit[expressedSplit[1]] + " "
            + attrExtent[expressedSplit[2].slice(0,1)] + " "
            + attrDimension[expressedSplit[2].slice(1)];
      }
      
        this._div.innerHTML = '<h4>' + expressed + '</h4>' + '<p>' + description + '</p>' + (props ?
            '<b>' + expressedValue + '</b>'
            : 'Hover over a basin');
    };






    //code to create an array combining attributes (array) with descriptions of attributes. buggy with climate zone/land cover classes
    var dropAttributes = [];

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
          + landCoverClasses[attrSplit[2].slice(1)].classDesc;
        }
        //the most 'standard' version
        else {
          dropText = attr + ': ' + attrDescription[attrSplit[0]] + ' ' 
              + attrExtent[attrSplit[2].slice(0,1)] + ' '
              + attrDimension[attrSplit[2].slice(1)];
        }
      }
      dropAttributes.push(dropText);
    }
    //console.log(dropAttributes);











    function makeChart(dropAttributes){

      //declare the chart dimensions and margins
      const width = 600;
      const height = 500;
      const marginTop = 20;
      const marginRight = 20;
      const marginBottom = 30;
      const marginLeft = 20;
  
      //bin the data
      const bins = d3.bin()
          .thresholds(10)
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
  
      var chartTitle = d3.select("#chart-dialog")
        .attr("class","chartTitle");
  
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
              .text(function(){ return dropAttributes[attributes.indexOf(expressed)] }));
  
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
              .text("↑ Frequency (no. of counties)"));
      
      //return the SVG element
      return svg.node()
    }













    