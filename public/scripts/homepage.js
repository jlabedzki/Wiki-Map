(function ($) {
  $(() => {
    // $('.add-pin').prop('disabled', true);
    $('.new-map').hide();
    displayMapByID(currentMapID);
    displayListOfMaps('/maps');
    injectMapIDToForm(currentMapID);
    $('#add-to-favorites').on('submit', addMapToFavorites);
    $('#remove-from-favorites').on('submit', removeMapFromFavorites);

    //map list buttons
    $('#favorites').click(() => {
      displayListOfMaps('/favorites/');
    });
    $('#my-maps').click(() => {
      displayListOfMaps('/maps/mymaps');
    });
    $('#my-contributions').click(() => {
      console.log('clicked')
      displayListOfMaps('/maps/contributions');
    });
    $('#discover').click(() => {
      displayListOfMaps('/maps');
    });
  });

  let mymap;
  let currentMapID = 1;
  let firstLoad = true;

  let markerData = {};
  let markers = {};

  const addMapToFavorites = function (e) {
    e.preventDefault();
    // $('#heart')
    //   .removeClass('far')
    //   .addClass('fas');

    const favArr = $(this).serializeArray();
    const favObj = {};

    for (const favorite of favArr) {
      favObj[favorite.name] = favorite.value;
    }

    $.post('/favorites/', favObj)
    $(this).slideUp('slow');
  };



  const removeMapFromFavorites = function (e) {
    e.preventDefault();

    const favArr = $(this).serializeArray()
    const favObj = {};

    for (const favorite of favArr) {
      favObj[favorite.name] = favorite.value;
    }

    // $.delete('/favorites/', favObj)
    $.ajax({
      url: '/favorites/',
      type: 'DELETE',
      data: favObj
    })
      .then(() => {
        displayListOfMaps('/favorites/');
      });
  }



  const injectMapIDToForm = (currentMapID) => {
    $('#favorites-mapid').val(`${currentMapID}`);
    $('#remove-from-favorites-mapid').val(`${currentMapID}`);
  };

  //accept route parameter, use template literal to change route in get request

  //favorites.onclick( displaylistofmaps(/favorites)

  const displayListOfMaps = (route) => {

    // if (route === '/favorites/') {
    //   $('removefromfavorites').show()
    //   $('addtofavroties').hide()
    // }

    $.get(route, data => {
      $('#list-of-maps').hide();
      $('#list-of-maps').empty();
      console.log(data);
      let counter = 1;
      for (const map of data.maps) {
        $('#list-of-maps').append(`<li value="${map.id}" id="list-item-${counter}">${map.title}</li>`);
        counter++;
      }
    })
      .then((data) => {
        let counter = 1;
        //this loop adds an onclick handler to each map in the map list which renders a new map when clicked
        for (const map of data.maps) {
          $(`#list-item-${counter}`).click(function () {

            //show favourite button if it's hidden (as a result of being clicked previously)
            if ($('#add-to-favorites').is(':hidden')) {
              $('#add-to-favorites').show();
              $('#heart')
                .removeClass('fas')
                .addClass('far');
            }

            //replace "Map of the day" with the map title
            $('.current-map h2').text(`${map.title}`);

            mymap.remove();
            currentMapID = $(this).val();
            injectMapIDToForm(currentMapID);
            displayMapByID(currentMapID);
            displayPinsByMapID(currentMapID);
          });
          counter++;
        }
      })
      .then(() => {
        $('#list-of-maps').slideDown('slow');
      })
  };

  const displayMapByID = (mapID) => {
    $('.add-pin').prop('disabled', true);

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

      const pinArr = data.pins;
      for (const pin of pinArr) {
        pinSubmit(pin);
      }
      firstLoad = false;
    })
  };


  const myIcon = L.divIcon({ iconAnchor: [9, 32], className: 'fas fa-hand-point-down' });
  let tempMarker = L.marker(null, { icon: myIcon });


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

    $('.add-pin').on('submit', function (event) {
      event.preventDefault();
      $('#pin-longitude').val(e.latlng.lng)
      $('#pin-latitude').val(e.latlng.lat);
      $('#pin-mapid').val(currentMapID);

      const pinArr = $(this).serializeArray();
      const pinObj = {};

      for (const pin of pinArr) {
        pinObj[pin.name] = pin.value;
      }
      $.post('/pins/', pinObj)
        .done(function (returnedPin) {
          pinSubmit(returnedPin.pin);
        })
    });
  };


  const generateMarker = function (data) {
    tempMarker.remove();
    markers[data.pinID] = new L.marker([data.latitude, data.longitude])
      .addTo(mymap)
      .bindPopup(`<h1>${data.pinTitle}</h1><h2>${data.pinDescription}</h2><img width="100%" src ="${data.pinImg}" />`).openPopup();
  };

  const delPin = function (pin) {

    const pinObj = pin;

    $.post(`/pins/delete/${pin.pinID}`, pinObj)
      .done(function (data) {
        markers[pin.pinID].remove();
        delete markers[pin.pinID];
        delete markerData[pin.pinID];
      })
  }

  const pinSubmit = function (pinObject) {
    const pinID = pinObject.id;
    const mapID = pinObject.map_id;
    const creatorID = pinObject.creator_id;
    const pinTitle = pinObject.title;
    const pinDescript = pinObject.description;
    const pinImg = pinObject.image_url;
    const longitude = pinObject.longitude;
    const latitude = pinObject.latitude;

    if (!markerData[pinID]) {

      markerData[pinID] = {
        mapID,
        creatorID,
        pinTitle,
        pinDescript,
        pinImg,
        longitude,
        latitude
      };
    }

    $('#pin-title').val('');
    $('#pin-descript').val('');
    $('#pin-img').val('');
    $('.add-pin').prop('disabled', true);

    if (firstLoad || !markerData[pinID].pinID) {
      markerData[pinID].pinID = pinID;
      generateMarker(markerData[pinID]);
    }
    markers[pinID].bindPopup(`<h1>${pinTitle}</h1><h2>${pinDescript}</h2><img width="100%" src ="${pinImg}" />`).openPopup();


    markers[pinID].off('click');
    markers[pinID].on('click', function () {

      tempMarker.remove();
      markers[pinID].openPopup();

      $('.add-pin').prop('disabled', false);
      $('.add-pin button').text('Edit Pin');
      $('form .add-pin').data('pin-id', `${pinID}`)
      $('#pin-title').val(`${pinTitle}`);
      $('#pin-descript').val(`${pinDescript}`);
      $('#pin-img').val(`${pinImg}`);
      $('#pin-delete').remove();
      $('<button class="add-pin" id="pin-delete" type="button">Delete Pin</button>').insertAfter('#pin-submit');

      // DELETE BUTTON
      $('#pin-delete').on('click', function () {

        delPin(markerData[pinID]); // The below functions ignore edge cases where server deletion failed. But good enought for the demo.

        $('#pin-title').val('');
        $('#pin-descript').val('');
        $('#pin-img').val('');
        $('.add-pin').prop('disabled', true);
        $(this).remove();
      });

      $('.add-pin').off('submit');

      // EDIT BUTTON SUBMIT
      $('.add-pin').submit(function (event) {
        event.preventDefault();
        $('#pin-longitude').val(longitude)
        $('#pin-latitude').val(latitude);
        $('#pin-mapid').val(mapID);


        const pinArr = $(this).serializeArray();
        const pinObj = {};

        for (const pin of pinArr) {
          pinObj[pin.name] = pin.value;
        }
        pinObj.id = $('form .add-pin').data('pin-id');
        $.post(`/pins/edit/${pinObj.id}`, pinObj)
          .done(function (returnedPin) {

            pinSubmit(returnedPin.pin);
          })
        $('#pin-delete').remove();
      });
    });
  };

})(jQuery);
