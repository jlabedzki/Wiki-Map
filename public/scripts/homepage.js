(function ($) {
  $(() => {
    console.log(currentMapID);

    $('.new-map').hide();
    displayMapByID(currentMapID);
    displayListOfMaps();
    // displayPinsByMapID(currentMapID);
    injectMapIDToForm(currentMapID);

    // mymap.on('click', onMapClick);

    $('#add-to-favorites').on('submit', function (e) {
      e.preventDefault();
      const favArr = $(this).serializeArray();
      const favObj = {};

      for (const favorite of favArr) {
        favObj[favorite.name] = favorite.value;
      }

      $.post('/favorites/', favObj);
    })
  });

  let mymap;
  let currentMapID = 1;
  let firstLoad = true;

  const injectMapIDToForm = (currentMapID) => {
    $('#favorites-mapid').val(`${currentMapID}`);
  }

  //accept route parameter, use template literal to change route in get request
  const displayListOfMaps = () => {


    $.get('/maps', data => {
      let counter = 1;
      for (const map of data.maps) {
        $('#list-of-maps').append(`<li value="${map.id}" id="list-item-${counter}">${map.title}</li>`);
        counter++;
      }
    })
      .then((data) => {
        let counter = 1;
        for (const map of data.maps) {
          $(`#list-item-${counter}`).click(function () {
            mymap.remove();
            currentMapID = $(this).val();
            injectMapIDToForm(currentMapID);
            displayMapByID(currentMapID);
            displayPinsByMapID(currentMapID);
          });
          counter++;
        }
      });
  };

  const displayMapByID = (mapID) => {

    markerData = {};
    markers = {};
    firstLoad = true;

    $.get(`/maps/${mapID}`, data => {
      const coordinates = [data.map[0].longitude_1, data.map[0].latitude_1, data.map[0].longitude_2, data.map[0].latitude_2];
;
      loadMapByCoords(coordinates);
    });
  }

  const loadMapByCoords = (coords) => {
    mymap = L.map('current-mapid');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data, imagery &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>',
      maxZoom: 18,
    }).addTo(mymap);

    mymap.fitBounds([
      [coords[0], coords[1]],
      [coords[2], coords[3]]
    ]);
    displayPinsByMapID(currentMapID);
    mymap.on('click', onMapClick);
  }


  const displayPinsByMapID = pinMapID => {
    $.get(`/pins/${pinMapID}`, data => {
      console.log(data.pins);
      const pinArr = data.pins;
      for (const pin of pinArr) {
        pinSubmit(pin);
      }
      firstLoad = false;
    })
  };


  const myIcon = L.divIcon({ iconAnchor: [9, 32], className: 'fas fa-hand-point-down' });
  let tempMarker = L.marker(null, { icon: myIcon });

  $('.add-pin').prop('disabled', true);

  function onMapClick(e) {

    tempMarker
    .setLatLng(e.latlng)
    .addTo(mymap);

    $('.add-pin').prop('disabled', false);
    $('#pin-title').val('');
    $('#pin-descript').val('');
    $('#pin-img').val('');
    $('form .add-pin').data('pin-id', null);
    $('#pin-delete').remove();
    $('#pin-submit').html('Add Pin');
    $('#pin-submit').off('click');
    $('.add-pin').off('submit');

    $('.add-pin').on('submit', function(event) {
      event.preventDefault();
      $('#pin-longitude').val(e.latlng.lng)
      $('#pin-latitude').val(e.latlng.lat);
      $('#pin-mapid').val(currentMapID);

      const pinArr = $(this).serializeArray();
      const pinObj = {};
      console.log(pinArr);
      for (const pin of pinArr) {
        pinObj[pin.name] = pin.value;
      }
      $.post('/pins/', pinObj)
        .done(function(returnedPin) {
          pinSubmit(returnedPin.pin);
        })

      // pinSubmit($('form .add-pin').data('pin-id'), e.latlng, currentMapID);
    });
  };

  let markerData = {};
  let markers = {};
  let markerCount = 1;
  // const currentMapID = 1;
  const userID = 1;

  // const marked = function(data) {
  //   tempMarker.remove();
  //   markers[data.id] = new L.marker([data.latitude, data.longitude], { draggable: true })
  //     .addTo(mymap)
  //     .bindPopup(`<h1>${data.title}</h1><h2>${data.description}</h2><img width="100%" src ="${data.image_url}" />`).openPopup();
  // };

  const generateMarker = function (data) {
    tempMarker.remove();
    markers[data.pinID] = new L.marker([data.latitude, data.longitude], { draggable: true })
      .addTo(mymap)
      .bindPopup(`<h1>${data.pinTitle}</h1><h2>${data.pinDescription}</h2><img width="100%" src ="${data.pinImg}" />`).openPopup();
    console.log(markers[data.pinID]);
    // tempMarker.remove();
    // markers[data.pinID] = new L.marker([data.latitude, data.longitude], { draggable: true })
    //   .addTo(mymap)
    //   .bindPopup(`<h1>${data.pinTitle}</h1><h2>${data.pinDescript}</h2><img width="100%" src ="${data.pinImg}" />`).openPopup();
    // console.log(markers[data.pinID]);
  };


  const delPin = function(pinID) {
    markers[pinID].remove();
    delete markers[pinID];    // In case of an error or inaccessibility, these will be run?
    delete markerData[pinID];
  }

  const pinSubmit = function(pinObject) {
    console.log('pinSubmit: ', pinObject);
    const pinID = pinObject.id; // To be replaced with an if
    const mapID = pinObject.map_id; // !!VARIABLE TO BE REPLACED WITH SOMETHING
    const creatorID = pinObject.creator_id; // !!VARIABLE TO BE REPLACED WITH A COOKIE ID
    const pinTitle = pinObject.title;
    const pinDescript = pinObject.description;
    const pinImg = pinObject.image_url;
    const longitude = pinObject.longitude;
    const latitude = pinObject.latitude;
    console.log('pinObject__', pinObject);

    markerData[pinID] = { // ??Keep for backup?
      // pinID,
      mapID,
      creatorID,
      pinTitle,
      pinDescript,
      pinImg,
      longitude,
      latitude
    };

    $('#pin-title').val('');
    $('#pin-descript').val('');
    $('#pin-img').val('');
    $('.add-pin').prop('disabled', true);

    console.log('markerData: ', markerData[pinID]);
    console.log(firstLoad, markerData[pinID]);
    if (firstLoad || !markerData[pinID].pinID) {
      // console.log('pinSubmit: ', pinObject);
      markerData[pinID].pinID = pinID;
      console.log('markerData2: ', markerData[pinID]);
      generateMarker(markerData[pinID]);
    }

    markers[pinID].bindPopup(`<h1>${pinTitle}</h1><h2>${pinDescript}</h2><img width="100%" src ="${pinImg}" />`).openPopup();

    // EDIT
    markers[pinID].off('click');
    markers[pinID].on('click', function() {
      tempMarker.remove();
      markers[pinID].openPopup();
      console.log('marked: ', pinTitle);
      console.log('bigining');

      $('.add-pin').prop('disabled', false);
      $('.add-pin button').text('Edit Pin');
      $('form .add-pin').data('pin-id', `${pinID}`)
      $('#pin-title').val(`${pinTitle}`);
      $('#pin-descript').val(`${pinDescript}`);
      $('#pin-img').val(`${pinImg}`);
      $('#pin-delete').remove();
      $('<button class="add-pin" id="pin-delete" type="button">Delete Pin</button>').insertAfter('#pin-submit');

      $('#pin-delete').on('click', function() {
        delPin(pinID);
        $('#pin-title').val('');
        $('#pin-descript').val('');
        $('#pin-img').val('');
        $('.add-pin').prop('disabled', true);
        $(this).remove();
      });

      $('.add-pin').off('submit');

      // EDIT BUTTON SUBMIT
      $('.add-pin').submit(function(event) {
        event.preventDefault();
        $('#pin-longitude').val(longitude)
        $('#pin-latitude').val(latitude);
        $('#pin-mapid').val(mapID);

        const pinArr = $(this).serializeArray();
        const pinObj = {};
        console.log('EDIT:', pinArr);

        for (const pin of pinArr) {
          pinObj[pin.name] = pin.value;
        }
        pinObj.id = $('form .add-pin').data('pin-id');
        console.log('pinObj.id', pinObj.id);
        $.post(`/pins/edit/${pinObj.id}`, pinObj)
          .done(function(returnedPin) {
            console.log("hello pinSubmit", returnedPin);
            pinSubmit(returnedPin.pin);
          })
          console.log('end');
        // pinSubmit($('form .add-pin').data('pin-id'), e.latlng, currentMapID);
      });

        // pinSubmit($('form .add-pin').data('pin-id'), { lat: latitude, lng: longitude });
        // $('#pin-delete').remove();
      // });
      // $('#pin-submit').on('click', function(e) {
      //     pinSubmit($('form .add-pin').data('pin-id'), e.latlng, currentMapID);
      //     $('#pin-delete').remove();
      //   });
    });

    markers[pinID].on('moveend', function(e) {
      markerData[pinID].latitude = e.target._latlng.lat;
      markerData[pinID].longitude = e.target._latlng.lng;
    });
    console.log(markerData);
    console.log(markers);
  };

})(jQuery);
