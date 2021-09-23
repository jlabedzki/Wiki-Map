(function ($) {
  $(() => {
    // $('.add-pin').prop('disabled', true);
    $('.new-map').hide();
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
      displayListOfMaps('/favorites/');
      openNav();
    });
    $('#my-maps').click(() => {
      $('.map-list-title').text('My Maps');
      $("#map-sidenav").on("transitionend", function(e) {
        $('.map-list-title, #categories').fadeIn(100);
        displayListOfMaps('/maps/mymaps');
        $(this).off(e);
     });
      openNav();
    });
    $('#my-contributions').click(() => {
      $('.map-list-title').text('Contributions');
      displayListOfMaps('/maps/contributions');
      openNav();
    });
    $('#discover').click(() => {
      $('.map-list-title').text('Discover');
      displayListOfMaps('/maps');
      openNav();
    });

    $('.closebtn').on('click', function() {
      closeNav();
    });

    const $createMap = $('#create-new-map');
    $createMap.click(() => {
      // $('.new-map').show();
      $('.current-map-footer').hide();
      $('.map-list').hide();
      $createMap.hide();
      markers = {};
      markerData = {};
      markerGroup.clearLayers();
      currentMapID = undefined;
      $('.current-map').css('border-left-style', 'none');
      $('.current-map h2').text("Create a new map")
    })

  });

  let mymap;
  let currentMapID = 1;
  let firstLoad = true;
  let markerGroup;
  let markerData = {};
  let markers = {};
  const coordDatabase = { url: undefined };


  const openNav = function() {
    $('.map-list-title, #categories').hide();
    $('#map-sidenav').css('width', '25em')
  }
  const closeNav = function() {
    $('.map-list-title, #categories').hide();
    $('ul').empty();
    $('#map-sidenav').css('width', '0px')
  }


  const createNewMap = function (e) {
    e.preventDefault();
    getCoords();

    const mapArr = $(this).serializeArray();
    const mapObj = {};

    for (const keyValue of mapArr) {
      mapObj[keyValue.name] = keyValue.value;
    }

    // add ajax post request to maps and redirect to homepage
    $.post(`/maps/`, mapObj)
      .done(() => {
        window.location.replace('/');
      })
  };

  const getCoords = function () {
    // $('.get-coords').click(function () {
    coordDatabase.url = mymap.getBounds();
    $('#form1').val(coordDatabase.url._northEast.lat);
    $('#form2').val(coordDatabase.url._northEast.lng);
    $('#form3').val(coordDatabase.url._southWest.lat);
    $('#form4').val(coordDatabase.url._southWest.lng);
    // })
  }

  const addMapToFavorites = function (e) {
    e.preventDefault();

    const favArr = $(this).serializeArray();
    const favObj = {};

    for (const favorite of favArr) {
      favObj[favorite.name] = favorite.value;
    }

    $.post('/favorites/', favObj)
      .then(() => {
        displayListOfMaps('/maps');
      })
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

            //if user on discover, show add-to-favorites, if user on favorites, show remove-from-favorites

            if (route === '/maps') {
              $('#add-to-favorites').show();
              $('#remove-from-favorites').hide();
            };
            if (route === '/favorites/') {
              $('#add-to-favorites').hide();
              $('#remove-from-favorites').show();

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
    $('.add-pin').fadeIn(500);
    $('.add-pin').attr('style', 'display:flex');
    $('#pin-title').focus();
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
      .bindPopup(`<h1>${data.pinTitle}</h1><h2>${data.pinDescription}</h2><img width="100%" src ="${data.pinImg}" />`).openPopup()
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
    $('.add-pin').fadeOut(500);
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
      $('#pin-delete').remove();
      $('.add-pin button').text('Edit Pin');
      $('<button class="add-pin" id="pin-delete" type="button">Delete Pin</button>').insertBefore('#pin-submit');
      $('.add-pin').prop('disabled', false);
      $('.add-pin').fadeIn(500);
      $('.add-pin').attr('style', 'display:flex');
      $('#pin-title').focus();

      $('form .add-pin').data('pin-id', `${pinID}`)
      $('#pin-title').val(`${pinTitle}`);
      $('#pin-descript').val(`${pinDescript}`);
      $('#pin-img').val(`${pinImg}`);



      // DELETE BUTTON
      $('#pin-delete').on('click', function () {

        delPin(markerData[pinID]); // The below functions ignore edge cases where server deletion failed. But good enought for the demo.

        $('#pin-title').val('');
        $('#pin-descript').val('');
        $('#pin-img').val('');
        $('.add-pin').fadeOut(500);
        $('.add-pin').prop('disabled', true);
        // $(this).remove();
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
        // $('#pin-delete').remove();
      });
    });
  };

})(jQuery);
