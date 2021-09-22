(function ($) {
  $(() => {
    console.log(currentMapID);

    $('.new-map').hide();
    displayMapByID(currentMapID);
    displayListOfMaps();
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
          });
          counter++;
        }
      });
  };

  const displayMapByID = (mapID) => {
    $.get(`/maps/${mapID}`, data => {
      const coordinates = [data.map[0].longitude_1, data.map[0].latitude_1, data.map[0].longitude_2, data.map[0].latitude_2];

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

    mymap.on('click', onMapClick);
  }





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
    $('.add-pin').submit(function(event) {
      event.preventDefault();
      console.log($('form .add-pin').data('pin-id'));
      pinSubmit($('form .add-pin').data('pin-id'), e.latlng, currentMapID);
    });
  };

  const markerData = {};
  const markers = {};
  let markerCount = 1;
  // const currentMapID = 1;
  const userID = 1;

  const marked = function(data) {
    tempMarker.remove();
    markers[data.pinID] = new L.marker([data.latitude, data.longitude], { draggable: true })
      .addTo(mymap)
      .bindPopup(`<h1>${data.pinTitle}</h1><h2>${data.pinDescript}</h2><img width="100%" src ="${data.pinImg}" />`).openPopup();
  };

  const delPin = function(pinID) {
    markers[pinID].remove();
    delete markers[pinID];    // In case of an error or inaccessibility, these will be run?
    delete markerData[pinID];
  }

  const pinSubmit = function(currentPinID, coords, currentMapID) {

    const pinID = currentPinID || markerCount++;
    const mapID = currentMapID; // !!VARIABLE TO BE REPLACED WITH SOMETHING
    const creatorID = userID; // !!VARIABLE TO BE REPLACED WITH A COOKIE ID
    const pinTitle = $('#pin-title').val();
    const pinDescript = $('#pin-descript').val();
    const pinImg = $('#pin-img').val();
    const longitude = coords.lng;
    const latitude = coords.lat;

    markerData[pinID] = { // ??Keep for backup?
      pinID,
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

    console.log('pinsubmit: ', currentPinID);
    if (!currentPinID) {
      marked(markerData[pinID])
    }

    markers[pinID].bindPopup(`<h1>${pinTitle}</h1><h2>${pinDescript}</h2><img width="100%" src ="${pinImg}" />`).openPopup();
    markers[pinID].off('click');
    markers[pinID].on('click', function(e) {
      tempMarker.remove();
      markers[pinID].openPopup();
      console.log('marked: ', pinTitle);

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
      $('.add-pin').submit(function(event) {
        event.preventDefault();
        console.log($('form .add-pin').data('pin-id'));
        pinSubmit($('form .add-pin').data('pin-id'), { lat: latitude, lng: longitude });
        $('#pin-delete').remove();
      });
    });

    markers[pinID].on('moveend', function(e) {
      console.log('moveend: ', e)
      markerData[pinID].latitude = e.target._latlng.lat;
      markerData[pinID].longitude = e.target._latlng.lng;
      console.log('moveend: ', markerData[pinID]);
    });
    console.log(markerData);
    console.log(markers);
  };




})(jQuery);
