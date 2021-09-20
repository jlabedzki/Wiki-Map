(function ($) {
  $(() => {
    let mapID = 1;
    //foo.click(() => {
    // mapID = $(this).id
    // })

    $('.new-map').hide();
    displayMapByID(mapID);
    displayListOfMaps();
  });

  const displayListOfMaps = () => {
    $.get('/maps', data => {
      console.log(data.maps);

      let id;
      let title;

      for (const map of data.maps) {
        $('#list-of-maps').append(`<li>${map.title}</li>`)
      }
    });
  };

  const displayMapByID = (mapID) => {
    $.get(`/maps/${mapID}`, data => {
      console.log(data.map[0].longitude_1);
      const coordinates = [data.map[0].longitude_1, data.map[0].latitude_1, data.map[0].longitude_2, data.map[0].latitude_2];
      loadMapByCoords(coordinates);
    });
  }

  const loadMapByCoords = (coords) => {
    const mymap = L.map('current-mapid');
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
