(function ($) {
  $(() => {
    let mymap;
    let currentMapID = 1;
    console.log(currentMapID);

    $('.new-map').hide();
    displayMapByID(currentMapID);
    displayListOfMaps();
    injectMapIDToForm(currentMapID);

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
  }
})(jQuery);
