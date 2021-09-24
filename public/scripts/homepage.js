(function ($) {
  $(() => {
    //back to home
    $('.logo').click(() => {
      window.location.replace('/');
    })
    $('.map-list').hide();
    $('.new-map-footer').hide();
    $('.current-map-footer').hide();

    // $('.new-map').hide();
    displayMapByID(currentMapID);
    displayListOfMaps('/maps');
    injectMapIDToForm(currentMapID);
    $('#add-to-favorites').on('submit', addMapToFavorites);
    $('#remove-from-favorites').on('submit', removeMapFromFavorites);
    $('#new-map-form').on('submit', createNewMap);
    $('#remove-from-favorites').hide();

    //map list buttons
    $('#favorites').click(() => {
      $('.map-list-title').text('Favorites');
      $('#categories').hide();
      $('.map-list').fadeIn('fast');
      displayListOfMaps('/favorites/');
    });
    $('#my-maps').click(() => {
      $('.map-list-title').text('My Maps');
      $('#categories').hide();
      $('.map-list').fadeIn('fast');
      displayListOfMaps('/maps/mymaps');
    });
    $('#my-contributions').click(() => {
      $('.map-list-title').text('Contributions');
      $('#categories').hide();
      $('.map-list').fadeIn('fast');
      displayListOfMaps('/maps/contributions');
    });
    $('#discover').click(() => {
      $('#categories').show();
      $('.map-list-title').text('Discover');
      $('.map-list').fadeIn('fast');
      displayListOfMaps('/maps');
    });
    $('#discover-not-logged-in').click(() => {
      $('#categories').show();
      $('.map-list-title').text('Discover');
      $('.map-list').fadeIn('fast');
      displayListOfMaps('/maps/notloggedin');
    });

    //close map-list button
    $('#close-map-list').click(() => {
      $('.map-list').fadeOut('fast');
    })

    $('#close-edit-map').click(() => {
      $('.current-map-footer').slideUp(450);
      setTimeout(() => {
        $('.current-map-header').show();
      }, 500);
      mymap.off('click');
    })

    //filter discover page by category feature
    $('#categories').on('change', (e) => {
      console.log(e);
      e.preventDefault();
      const category = $('#categories option:selected').val()

      displayListOfMaps(`/maps/categories/${category}`);
    })

    // $('#categories option:selected').text();
    const $createMap = $('#create-new-map');
    $createMap.click(() => {
      $('.new-map-footer').show();
      $('current-map-footer').hide();
      $('.dropdown').hide();
      $('.current-map-header').hide();
      $('.map-list').hide();
      $createMap.hide();
      markers = {};
      markerData = {};
      markerGroup.clearLayers();
      currentMapID = undefined;
    })

    $('#edit').on('click', () => {
      cursorAddToggle();
      mymap.on('click', onMapClick);
      $('.current-map-header').hide();
      $('.current-map-footer').slideDown(450);
    })
    //document ready ends
  });

  let mymap;
  let currentMapID = 1;
  let firstLoad = true;
  let markerGroup;
  let markerData = {};
  let markers = {};
  const coordDatabase = { url: undefined };


  const createNewMap = function (e) {
    e.preventDefault();
    getCoords();

    const mapArr = $(this).serializeArray();
    const mapObj = {};

    for (const keyValue of mapArr) {
      mapObj[keyValue.name] = keyValue.value;
    }
    // $('#title').text(`${mapObj.title}`)
    // add ajax post request to maps and redirect to homepage
    $.post(`/maps/`, mapObj)
      .then(() => {
        $('.dropdown').show();
        $('.current-map-header').show();
        $('.new-map-footer').hide();
        $('#title').show();
        $('#create-new-map').show();
        $('#categories').hide();
      })
      .then(() => {
        displayNewlyCreatedMap();
      });
  };

  //inject coords into map submit form
  const getCoords = function () {
    coordDatabase.url = mymap.getBounds();
    $('#form1').val(coordDatabase.url._northEast.lat);
    $('#form2').val(coordDatabase.url._northEast.lng);
    $('#form3').val(coordDatabase.url._southWest.lat);
    $('#form4').val(coordDatabase.url._southWest.lng);
  };

  //display newly created map after submission
  const displayNewlyCreatedMap = () => {
    $.get('/maps/mymaps', data => {
      $('#add-to-favorites').hide();
      mymap.remove();
      currentMapID = data.maps[0].id;
      injectMapIDToForm(currentMapID);
      displayMapByID(currentMapID);
      $('.map-overlay h2').text(`${data.maps[0].title}`)
    })
  }

  const addMapToFavorites = function (e) {
    e.preventDefault();

    const favArr = $(this).serializeArray();
    const favObj = {};

    for (const favorite of favArr) {
      favObj[favorite.name] = favorite.value;
    }

    $.post('/favorites/', favObj)
    // .then(() => {
    //   // displayListOfMaps('/maps');
    // })
    $(this).slideUp('slow');
  };

  const removeMapFromFavorites = function (e) {
    e.preventDefault();

    const favArr = $(this).serializeArray()
    const favObj = {};

    for (const favorite of favArr) {
      favObj[favorite.name] = favorite.value;
    }

    $.ajax({
      url: '/favorites/',
      type: 'DELETE',
      data: favObj
    })
      .then(() => {
        displayListOfMaps('/favorites/');
        // $('.map-list').hide();
        $('#remove-from-favorites').slideUp('slow');
      });
  }



  const injectMapIDToForm = (currentMapID) => {
    $('#favorites-mapid').val(`${currentMapID}`);
    $('#remove-from-favorites-mapid').val(`${currentMapID}`);
  };

  //accept route parameter, use template literal to change route in get request

  //favorites.onclick( displaylistofmaps(/favorites)

  const displayListOfMaps = (route) => {

    $.get(route, data => {
      $('#list-of-maps').hide();
      $('#list-of-maps').empty();
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

            //if user on discover, show add-to-favorites, if user on favorites, show remove-from-favorites

            if (route === '/maps') {
              $('#add-to-favorites').show();
              $('#remove-from-favorites').hide();
            };
            if (route === '/favorites/') {
              $('#add-to-favorites').hide();
              $('#remove-from-favorites').show();
            }
            if (route === '/maps/mymaps') {
              $('#add-to-favorites').hide();
              $('#remove-from-favorites').hide();
            }
            if (route === '/maps/contributions') {
              $('#add-to-favorites').hide();
              $('#remove-from-favorites').hide();
            }

            //replace "Map of the day" with the map title
            $('.map-overlay h2').text(`${map.title}`);

            mymap.remove();
            currentMapID = $(this).val();
            injectMapIDToForm(currentMapID);
            displayMapByID(currentMapID);
            mymap.on('load', function () {
              displayPinsByMapID(currentMapID);
            });
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
    markerGroup = L.layerGroup().addTo(mymap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data, imagery &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>',
      maxZoom: 18,
    }).addTo(mymap);

    mymap.fitBounds([
      [coords[0], coords[1]],
      [coords[2], coords[3]]
    ]);
    displayPinsByMapID(currentMapID);
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


  const myIcon = L.divIcon({ iconAnchor: [15, 15], className: 'fas fa-crosshairs' });
  let tempMarker = L.marker(null, { icon: myIcon });


  const cursorAddToggle = function() {
      $('#current-mapid').addClass('cursor-toggle');
  }

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
      .addTo(markerGroup)
      .bindPopup(`<h1>${data.pinTitle}</h1><h2 "marker-popup-h2">${data.pinDescription}</h2><img width="100%" src ="${data.pinImg}" />`).openPopup()
    // markers[data.pinID].addTo(markerGroup);
    // markerGroup.addLayer(markers[data.pinID]);

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

    $('#current-mapid').removeClass('cursor-toggle');

    mymap.off('click');
    $('.current-map-footer').hide();

    $('.current-map-header').show();
    $('.map-overlay h2').show();

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
    markers[pinID].bindPopup(`<h1>${pinTitle}</h1><h2 class="marker-popup-h2">${pinDescript}</h2><img width="100%" src ="${pinImg}" />`).openPopup();


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
