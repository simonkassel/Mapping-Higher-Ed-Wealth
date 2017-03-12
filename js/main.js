/* =====================
Helper functions
===================== */
var defaultMapview = function(){
  map.setView([39.7392358, -112.990251], 4);
};

var clearMap = function(){
  if (typeof featureGroup !== 'undefined') {
    map.removeLayer(featureGroup);
  }
};

var pointPopup = function(feature) {
  thePopup = L.popup({className: 'popup'})
      .setContent(
        feature.properties["Institution.Name"] +
        "<br><em class='popup-body'> Median household income: </em>" +
        "$" + feature.properties.Median_HHIncome +
        "<br><em class='popup-body'>Student body in top 1%: </em>" +
        feature.properties.top1pct_rate + "%" +
        "<br><em class='popup-body'>Student body in bottom 20%: </em>" +
        feature.properties.Low_income_access + "%"
      );
    return(thePopup);
};

var polyPopUp = function(feature) {
    thePopup = L.popup({className: 'poly-popup'})
      .setContent(
        feature.properties.NAME +
        "<br><em class='popup-body'>Low-income students: </em>" +
        feature.properties.pctLowIncome + "%"
      );
    return(thePopup);
};

var polyPopUp2 = function(feature) {
    thePopup = L.popup({className: 'poly-popup'})
      .setContent(
        feature.properties.NAME +
        "<br><em class='popup-body'>Upwardly mobile low-income students: </em>" +
        feature.properties.pctMobile_lowincome + "%"
      );
    return(thePopup);
};

/* =====================
Basemap
===================== */
var map = L.map('map', {
  zoomControl: false
});

var zoom = L.control.zoom({position: 'topright'}).addTo(map);
defaultMapview();

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19,
  minZoom: 0,
  ext: 'png'
}).addTo(map);

/* =====================
Slide functions
===================== */
var slide1Func = function() {
  // Reset map
  clearMap();
  defaultMapview();

  pricesArray = _.map(parsedData.features,
    function(college){
      return college.properties.Median_HHIncome;
  });

  theLimits = chroma.limits(pricesArray, 'q', 5);

  myStyle = function(feature){
    if (feature.properties.Median_HHIncome < theLimits[1]) {
      return {fillColor: colorRamp[0], stroke: false};
    } else if (feature.properties.Median_HHIncome < theLimits[2]) {
      return {fillColor: colorRamp[1], stroke: false};
    } else if (feature.properties.Median_HHIncome < theLimits[3]) {
      return {fillColor: colorRamp[2], stroke: false};
    } else if (feature.properties.Median_HHIncome < theLimits[4]) {
      return {fillColor: colorRamp[3], stroke: false};
    } else {
      return {fillColor: colorRamp[4], stroke: false};
    }
  };

  featureGroup = L.geoJson(parsedData, {
    style: myStyle,

    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
    },

    onEachFeature: function (feature, layer) {
        layer.bindPopup(pointPopup(feature));
    }
  });
  map.addLayer(featureGroup);
};

var slide2Func = function() {
  clearMap();
  map.setView([40.7752301,-73.9871553], 11);

  pricesArray = _.map(parsedData.features,
    function(college){
      return college.properties.Median_HHIncome;
  });

  theLimits = chroma.limits(pricesArray, 'q', 5);

  myStyle = function(feature){
    if (feature.properties.Median_HHIncome < theLimits[1]) {
      return {fillColor: colorRamp[0], stroke: false};
    } else if (feature.properties.Median_HHIncome < theLimits[2]) {
      return {fillColor: colorRamp[1], stroke: false};
    } else if (feature.properties.Median_HHIncome < theLimits[3]) {
      return {fillColor: colorRamp[2], stroke: false};
    } else if (feature.properties.Median_HHIncome < theLimits[4]) {
      return {fillColor: colorRamp[3], stroke: false};
    } else {
      return {fillColor: colorRamp[4], stroke: false};
    }
  };

  featureGroup = L.geoJson(parsedData, {
    style: myStyle,

    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
    },

    onEachFeature: function (feature, layer) {
        layer.bindPopup(pointPopup(feature));
    }
  });
  map.addLayer(featureGroup);
};

var slide3Func = function() {
  // Reset map
  defaultMapview();
  map.removeLayer(featureGroup);

  var onePctFilter = function(feature) {
    if (feature.properties.top1pct_rate > feature.properties.Low_income_access){
      return true;
    }
    else {
      return false;
    }
  };

  myStyle = function(feature){
    return {
      stroke: true,
      strokeOpacity: 1,
      fillOpacity: 0.5,
      color: colorRamp[4],
      radius: feature.properties.ratio_top_to_bottom * 0.8
    };
  };

  featureGroup = L.geoJson(parsedData, {
   style: myStyle,
   filter: onePctFilter,
   pointToLayer: function(feature, latlng) {
       return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
   },
   onEachFeature: function (feature, layer) {
       layer.bindPopup(pointPopup(feature));
   }

 }).addTo(map);

};

var slide4Func = function() {
  clearMap();
  defaultMapview();

  mobilityArray = _.map(msasParsed.features,
    function(msa){
      return msa.properties.pctLowIncome;
  });

  theLimits = chroma.limits(mobilityArray, 'q', 5);

  // Define color scheme
  colorPolygons = function(feature){
    if (feature.properties.pctLowIncome < theLimits[1]) {
      return colorRamp[0];
    } else if (feature.properties.pctLowIncome < theLimits[2]) {
      return colorRamp[1];
    } else if (feature.properties.pctLowIncome < theLimits[3]) {
      return colorRamp[2];
    } else if (feature.properties.pctLowIncome < theLimits[4]) {
      return colorRamp[3];
    } else {
      return colorRamp[4];
    }
  };

  myStyle = function(feature){
    var theStyle = {
      color: colorPolygons(feature),
      fillOpacity: 0.75,
      stroke: true,
      strokeOpacity: 1,
      weight: 1
    };
    return(theStyle);
  };

  featureGroup = L.geoJson(msasParsed, {
    style: myStyle,

    onEachFeature: function(feature, layer) {
        layer.bindPopup(polyPopUp(feature));
    }
  });
  map.addLayer(featureGroup);
};

var slide5Func = function() {
  clearMap();
  defaultMapview();

  mobilityArray = _.map(msasParsed.features,
    function(msa){
      return msa.properties.pctMobile_lowincome;
  });

  theLimits = chroma.limits(mobilityArray, 'q', 5);

  // fix this
  colorPolygons = function(feature){
    if (feature.properties.pctMobile_lowincome < theLimits[1]) {
      return colorRamp[0];
    } else if (feature.properties.pctMobile_lowincome < theLimits[2]) {
      return colorRamp[1];
    } else if (feature.properties.pctMobile_lowincome < theLimits[3]) {
      return colorRamp[2];
    } else if (feature.properties.pctMobile_lowincome < theLimits[4]) {
      return colorRamp[3];
    } else {
      return colorRamp[4];
    }
  };

  myStyle = function(feature){
    var theStyle = {
      color: colorPolygons(feature),
      fillOpacity: 0.75,
      stroke: true,
      strokeOpacity: 1,
      weight: 1
    };
    return(theStyle);
  };

  featureGroup = L.geoJson(msasParsed, {
    style: myStyle,

    onEachFeature: function(feature, layer) {
        layer.bindPopup(polyPopUp2(feature));
    }
  });
  map.addLayer(featureGroup);
};


/* =====================
State object
===================== */
var state = {
  "slideNumber": 0,
  "slideData": [
    {
      "title": "Where do wealthy families send their kids to college?",
      "text": slide1text
    },
    {
      "title": "Close together but far apart",
      "text": slide2text
    },
    {
      "title": "The 1% of colleges",
      "text": slide3text
    },
    {
      "title": "Low-income education access by metro area",
      "text": slide4text
    },
    {
      "title": "Where is economic mobility accessible through education?",
      "text": slide5text
    }
  ]
};

/* =====================
Data
===================== */
var pointDat = "https://gist.githubusercontent.com/simonkassel/0e8c40fc9b0a6fd3862b77acdd96db97/raw/3b057b3c514ad5f98349d0665113b68fb47a8602/colleges.geojson";
var msas = "https://gist.githubusercontent.com/simonkassel/d219926e2b797ebebb196dbbd58b5efb/raw/1efe344a58661f2e86c4adc27ba6cac7613a429b/msas2.geojson";

var colorRamp = ["#C07CBE","#DFBCDD","#FEFDFC","#FCD47F","#FBAC02"];

/* =====================
Functionality
===================== */
var parsedData;
var msasParsed;
var test;
var theLimits;

var myStyle = {};

$.ajax(msas).done(function(msas) {
  // Parse JSON
  msasParsed = JSON.parse(msas);
});

$.ajax(pointDat).done(function(pointDat) {
  // Parse JSON
  parsedData = JSON.parse(pointDat);
  // Show the initial slide
  featureGroup = L.geoJson(parsedData, {
    style: {
      fillColor: colorRamp[4],
      stroke: false
    },

    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
    },
  });
  map.addLayer(featureGroup);



  // Click functionality
  //  Button functions
  var clickNextButton = function() {
    if(state.slideNumber < state.slideData.length) {
      state.slideNumber += 1;
    } else {
      state.slideNumber = 1;
    }
    $(".Slide-title").html(state.slideData[state.slideNumber - 1].title);
    $(".Slide-text").html(state.slideData[state.slideNumber - 1].text);
    showTheSlide(state.slideNumber);
  };

  var clickPreviousButton = function() {
    if(state.slideNumber > 1) {
      state.slideNumber -= 1;
    } else {
      state.slideNumber = state.slideData.length;
    }
    $(".Slide-title").html(state.slideData[state.slideNumber - 1].title);
    $(".Slide-text").html(state.slideData[state.slideNumber - 1].text);
    showTheSlide(state.slideNumber);
  };
  //  Function to call the appropriate slide function
  var showTheSlide = function(slideNumber) {
    switch(slideNumber) {
      case 1:
        slide1Func();
        break;
      case 2:
        slide2Func();
        break;
      case 3:
        slide3Func();
        break;
      case 4:
        slide4Func();
        break;
      case 5:
        slide5Func();
        break;
      default:
        break;
      }
  };
  //  On clicks call the clickbutton functions, calling the showslide function
  $('#next').click(function() {
    clickNextButton();
  });
  $('#previous').click(function() {
    clickPreviousButton();
  });
});
