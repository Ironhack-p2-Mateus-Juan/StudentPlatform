document.addEventListener(
  "DOMContentLoaded",
  () => {
    if (window.place) {
      const place = window.place;

      const position = {
        lat: place.location.coordinates[0],
        lng: place.location.coordinates[1]
      };

      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: position
      });

      const pin = new google.maps.Marker({
        position,
        map,
        title: place.title
      });
    }
  },
  false
);
