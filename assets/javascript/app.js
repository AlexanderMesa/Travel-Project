var map;
var infowindow;
var posLatitude;
var posLongitude;
var origin = "";
var dataRetrieved = 0;

//Adds one month
var oneMonth = moment()
  .add(1, "months")
  .format("YYYY-MM-DD");
console.log(oneMonth);

var oneMonthFourDays = moment()
  .add(1, "months")
  .add(4, "days")
  .format("YYYY-MM-DD");
console.log(oneMonthFourDays);

//Gets the latitude and longitude of user's location once the current position is located
var getLocation = new Promise(function(resolve, reject) {
  function showPosition(position) {
    resolve(position);
  }
  navigator.geolocation.getCurrentPosition(showPosition);
});

getLocation.then(function(position) {
  posLatitude = position.coords.latitude;
  posLongitude = position.coords.longitude;
  console.log(posLatitude);
  console.log(posLongitude);

  getAccessToken();
});

//JSON object for map (Alex)
var style = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121"
      }
    ]
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121"
      }
    ]
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a"
      }
    ]
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c"
      }
    ]
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e"
      }
    ]
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161"
      }
    ]
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d"
      }
    ]
  }
];

function initMap() {
  var raleigh = { lat: 0, lng: 0 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: raleigh,
    zoom: 2,
    styles: style,
    disableDefaultUI: true
  });

  map.addListener("click", function(event) {
    map.setZoom(5);
    map.panTo({ lat: event.latLng.lat(), lng: event.latLng.lng() });

    // AJAX CALL CHAIN TRIGGERED HERE, DO NOT UNCOMMENT
    // #region DO_NOT_UNCOMMENT
    // $.ajax({
    //   url: "https://test.api.amadeus.com/v1/security/oauth2/token",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   method: "POST",
    //   dataType: "json",
    //   data: {
    //     grant_type: "client_credentials",
    //     client_id: "2TqxmYIjBHdCQixlwlgBMpnD2uCA4IPi",
    //     client_secret: "oabpCuBYyfpcRGsa"
    //   },
    //   success: function(response) {
    //     var accessToken = response.access_token;

    //     findNearestAirports(
    //       event.latLng.lat(),
    //       event.latLng.lng(),
    //       accessToken
    //     );
    //   },
    //   error: function() {
    //     alert("error");
    //   }
    // });
    // #endregion

    console.log(
      "Latitude: " +
        event.latLng.lat() +
        " " +
        ", longitude: " +
        event.latLng.lng()
    );
  });
}

function getAccessToken() {
  $.ajax({
    url: "https://test.api.amadeus.com/v1/security/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    dataType: "json",
    data: {
      grant_type: "client_credentials",
      client_id: "2TqxmYIjBHdCQixlwlgBMpnD2uCA4IPi",
      client_secret: "oabpCuBYyfpcRGsa"
    },
    success: function(response) {
      console.log(response.expires_in);
      // return response.access_token;

      findStartAirport(posLatitude, posLongitude, response.access_token);
    },
    error: function() {
      alert("Error with getting access token");
    }
  });
}

function findStartAirport(lat, lng, accessToken) {
  var queryURL =
    "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=" +
    +lat +
    "&longitude=" +
    lng +
    "&page[limit]=4";
  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    origin = response.data[0].iataCode;
  });
}

function findNearestAirports(lat, lng, accessToken) {
  var queryURL =
    "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=" +
    +lat +
    "&longitude=" +
    lng +
    "&page[limit]=4";
  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    var airports = response.data;
    var airportCodeArray = [];
    for (var i = 0; i < airports.length; i++) {
      var obj = {
        airportCode: airports[i].iataCode,
        cityCode: airports[i].address.cityCode
      };
      airportCodeArray.push(obj);
    }
    var departureDate = "2019-01-07"; // YYYY-MM-DD
    var returnDate = "2019-01-12";
    findFlights(airportCodeArray, accessToken, departureDate, returnDate);
    findHotels(airportCodeArray, accessToken, departureDate, returnDate);
  });
}

function findFlights(airports, accessToken, departureDate, returnDate) {
  var destination = airports[0].airportCode;

  var max = 5;
  var queryURL =
    "https://test.api.amadeus.com/v1/shopping/flight-offers?origin=" +
    origin +
    "&destination=" +
    destination +
    "&departureDate=" +
    departureDate +
    "&returnDate=" +
    returnDate +
    "&max=" +
    max +
    "&currency=USD";

  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    var flights = response.data;
    for (var i = 0; i < flights.length; i++) {
      DISPLAY_DATA.flights.push({
        airline:
          flights[i].offerItems[0].services[0].segments[0].flightSegment
            .carrierCode,
        price: flights[i].offerItems[0].price.total,
        departureTime:
          flights[i].offerItems[0].services[0].segments[0].flightSegment
            .departure.at,
        layovers: flights[i].offerItems[0].services[0].segments.length
      });
    }
    console.log(response);
    updateData();
  });
}

function findHotels(airports, accessToken, departureDate, returnDate) {
  var cityCode = airports[0].cityCode;
  var queryURL =
    "https://test.api.amadeus.com/v1/shopping/hotel-offers?cityCode=" +
    cityCode +
    "&checkInDate=" +
    departureDate +
    "&checkOutDate=" +
    returnDate +
    "&radius=15";

  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    var hotels = response.data;
    var hotelLength = 0;
    if (hotels.length > 5) {
      hotelLength = 5;
    } else {
      hotelLength = hotels.length;
    }
    for (var i = 0; i < hotelLength; i++) {
      DISPLAY_DATA.hotels.push({
        hotel: hotels[i].hotel.name,
        price: hotels[i].offers[0].price.total,
        stars: hotels[i].hotel.rating,
        beds: hotels[i].offers[0].room.type
      });
    }
    console.log(response);
    updateData();
  });
}

function updateData() {
  dataRetrieved++;

  if (dataRetrieved === 2) {
    console.log("READY");
    localStorage.setItem("DATA", JSON.stringify(DISPLAY_DATA));
  }
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      console.log(results[i]);
      $("#results").append(
        "<div>" + results[i].name + ", Price level: " + results[i].price_level
      );
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

var TEST_DATA = {
  flights: [
    {
      airline: "American Airlines",
      price: 200,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    },
    {
      price: 500,
      airline: "United",
      departureTime: "12:34 PM",
      layovers: "Non-stop"
    },
    {
      price: 1500,
      airline: "Frontier",
      departureTime: "11:34 PM",
      layovers: "Non-stop"
    },
    {
      price: 550,
      airline: "JetBlue",
      departureTime: "04:34 PM",
      layovers: "Non-stop"
    },
    {
      price: 560,
      airline: "Delta",
      departureTime: "06:34 PM",
      layovers: "Charlotte"
    }
  ],
  hotels: [
    {
      hotel: "Motel 6",
      price: 100,
      stars: "2-star",
      beds: "1 queen bed"
    },
    {
      price: 110,
      hotel: "Holiday Inn",
      stars: "4-star",
      beds: "2 queen beds"
    }
  ]
};

var DISPLAY_DATA = {
  flights: [],
  hotels: []
};

$(document).ready(function() {
  // Rajita changes
  $("#search").on("click", function() {
    var city = $("#searchField").val();
    console.log(city);
    var queryURL =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      city +
      "&key=AIzaSyAtkZKjttye0ywNE5_lGpE2VG-4_X7FLGE";
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var results = response.results;
      console.log(results);
      console.log(results[0].geometry.location);

      $("#results").empty();
      //lat and lng of the city

      //copied from above
      var zoomLocation = results[0].geometry.location;
      map.setZoom(14);
      map.panTo(zoomLocation);

      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: zoomLocation,
          radius: 500,
          type: ["lodging"]
        },
        callback
      );
    });
  });
  var flightData = TEST_DATA.flights;
  for (var i = 0; i < flightData.length; i++) {
    var newRow = $("<tr>");
    newRow.append("<td>" + flightData[i].airline + "</td>");
    $("#flight").append(newRow);
    newRow.append("<td>" + flightData[i].price + "</td>");
    $("#flight").append(newRow);
    newRow.append("<td>" + flightData[i].departureTime + "</td>");
    $("#flight").append(newRow);
    newRow.append("<td>" + flightData[i].layovers + "</td>");
    $("#flight").append(newRow);
  }

  var hotelData = TEST_DATA.hotels;
  for (var i = 0; i < hotelData.length; i++) {
    var newRow = $("<tr>");
    newRow.append("<td>" + hotelData[i].hotel + "</td>");
    $("#hotels").append(newRow);
    newRow.append("<td>" + hotelData[i].price + "</td>");
    $("#hotels").append(newRow);
    newRow.append("<td>" + hotelData[i].stars + "</td>");
    $("#hotels").append(newRow);
    newRow.append("<td>" + hotelData[i].beds + "</td>");
    $("#hotels").append(newRow);
  }
});
