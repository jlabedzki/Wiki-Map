$(() => {



  $(function () {
    // mymap.on('locationfound', function (e) {
    //   console.log(e.latlng);
    //   mymap.setView(e.latlng);
    // })

    getCoords();
    locateMe();
    mymap.on('click', onMapClick);
    pinSubmitList();
  })

  const mymap = L.map('mapid');
  const coordDatabase = { url: undefined };

  const getCoords = function () {
    $('#get-coords').click(function () {
      coordDatabase.url = mymap.getBounds();
      console.log(coordDatabase);
      console.log(coordDatabase.url._northEast.lat);
      console.log(coordDatabase.url._northEast.lng);
      console.log(coordDatabase.url._southWest.lat);
      console.log(coordDatabase.url._southWest.lng);
    })
  }

  const locateMe = function () {
    $('#locate-current').click(function () {
      mymap.locate({ setView: true });
    })
  }

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data, imagery &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>',
    maxZoom: 18,
  }).addTo(mymap);

  mymap.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
  ]);


  // const addPin = (pin, user_id) => {

  //   const values = [
  //     pin.map_id,
  //     user_id,
  //     pin.title,
  //     pin.description,
  //     pin.image_url,
  //     pin.longitude,
  //     pin.latitude
  //   ];

  //   return db
  //     .query(`
  //         INSERT INTO pins
  //         VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)
  //         RETURNING *;
  //     `, values)
  //     .then(res => res.rows[0])
  //     .catch(err => err.message);
  //   }

  //   const mapsRoutes = require("./routes/maps");

  // listAllPins();

  // const markers = {
  //   1: {
  //     map_id: 1,
  //     creator_id: 1,
  //     title: 'Hello World',
  //     description: "Welcome to Vancouver!",
  //     image_url: null,
  //     longitude: 49.2827,
  //     latitude: -123.1207
  //   }
  // };

  // const addMarker = function(eventObj) {
  //   markers[eventObj.id] = {
  //     map_id: eventObj.map_id,
  //     creator_id: eventObj.creator_id,
  //     title: eventObj.title,
  //     description: eventObj.description,
  //     image_url: eventObj.image_url,
  //     longitude: eventObj.longitude,
  //     latitude: eventObj.latitude
  //   }
  // };


  const myIcon = L.divIcon({ iconAnchor: [9, 32], className: 'fas fa-hand-point-down' });
  let marker = L.marker(null, { icon: myIcon, draggable: true });

  let markerStatus = 'temp';
  let markerCoords;

  $('.add-pin').prop('disabled', true);

  function onMapClick(e) {
    markerCoords = e;
    if (markerStatus === 'temp') {
      marker
        .setLatLng(e.latlng)
        .addTo(mymap);
      $('.add-pin').prop('disabled', false);
      $('#pin-title').val('');
      $('#pin-descript').val('');
      $('#pin-img').val('');
      $('.add-pin button').text('Add Pin');
    }
  }

  const pinSubmitList = function () {
    $('#pin-submit').on('click', function (e) {
      pinSubmit();
    });
  }

  // m001.on('move', e => m001.bindPopup("<h1>Hello World</h1><h2>You clicked the map at " + e.latlng.lat.toString() + ", " + e.latlng.lng.toString() + "</h2>"))


  const markerData = {};
  const markers = {};
  let markerCount = 0
  const currentMap = 1;
  const userID = 1;

  const marked = function (data) {
    marker.remove();
    markers[data.pinID] = new L.marker(markerCoords.latlng, { draggable: true })
      .addTo(mymap)
      .bindPopup(`<h1>${data.pinTitle}</h1><h2>${data.pinDescript}</h2><img src ="${data.pinImg}"`);
    markers[data.pinID]._icon.id = data.pinID;
    markers[data.pinID].on('click', function (e) {
      $('.add-pin').prop('disabled', false);
      $('.add-pin button').text('EDIT Pin');
      $('#pin-title').val(`${data.pinTitle}`);
      $('#pin-descript').val(`${data.pinDescript}`);
      $('#pin-img').val(`${data.pinImg}`);

    })
      ;
  }

  const pinSubmit = function (id) {
    $('.add-pin').submit(function (event) {
      event.preventDefault();
      const pinID = id || markerCount++;
      const mapID = currentMap;
      const creatorID = userID;
      const pinTitle = $('#pin-title').val();
      const pinDescript = $('#pin-descript').val();
      const pinImg = $('#pin-img').val();
      const longitude = markerCoords.latlng.lng;
      const latitude = markerCoords.latlng.lat;
      // const $mapID = currentMap; // !!VARIABLE TO BE REPLACED WITH SOMETHING
      // const $creatorID = userID; // !!VARIABLE TO BE REPLACED WITH A COOKIE ID
      // const $pinTitle = $('#pin-title :input').val();
      // const $pinDescript = $('#pin-descript :input').val();
      // const $pinImg = $('#pin-img :input').val();
      // const $longitude = e.latlng.lng;
      // const $latitude = e.latlng.lat;

      markerData[pinID] = {
        pinID,
        mapID,
        creatorID,
        pinTitle,
        pinDescript,
        pinImg,
        longitude,
        latitude
      };

      $('#pin-submit').off('click');
      $('#pin-title').val('');
      $('#pin-descript').val('');
      $('#pin-img').val('');
      $('.add-pin').prop('disabled', true);

      marked(markerData[pinID])

      console.log(markerData);
    });
    // TO BE CONTINUED...
  };

  // const markerListener = function() {
  //   $('body .leaflet-marker-icon').on('click', function(e) {
  //     console.log(e.target);
  //   });
  // }

  // const editMarker = function() {};




  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;
});
