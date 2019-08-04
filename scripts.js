var mymap = L.map("mapid").setView([0, 0], 1);
var myIcon = L.icon({
  iconUrl: "iss.png",
  iconSize: [25, 25],
  iconAnchor: [0, 0]
});
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZXdhanMiLCJhIjoiY2p5dzFzaGw3MHV0azNjbXJwN2R2bzBueSJ9.pySzpkrmk-NegJWp-FbcCA",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken:
      "pk.eyJ1IjoiZXdhanMiLCJhIjoiY2p5dzFzaGw3MHV0azNjbXJwN2R2bzBueSJ9.pySzpkrmk-NegJWp-FbcCA"
  }
).addTo(mymap);

var TRACK_ISS_FLAG = false;
var updateInterval;

var trackBtn = document.getElementById("track");
trackBtn.addEventListener("click", () => {
  TRACK_ISS_FLAG = !TRACK_ISS_FLAG;
  if (TRACK_ISS_FLAG) {
    trackBtn.classList.remove("btn-primary");
    trackBtn.classList.add("btn-danger");
    trackBtn.innerText = "Untrack the ISS";
    trackISS();
    updateInterval = setInterval(trackISS, 180000);
  } else {
    trackBtn.classList.remove("btn-danger");
    trackBtn.classList.add("btn-primary");
    trackBtn.innerText = "Track the ISS";
    clearInterval(updateInterval);
  }
});

document.getElementById("apodBtn").addEventListener("click", getAPOD);

function trackISS() {
  if (TRACK_ISS_FLAG) {
    fetch("http://api.open-notify.org/iss-now.json")
      .then(rep => {
        return rep.json();
      })
      .then(rep => update(rep));
  } else {
    // Do nothing
  }
}

function update(data) {
  let lat = data.iss_position.latitude;
  let long = data.iss_position.longitude;
  document.getElementById("lat").innerText = lat;
  document.getElementById("long").innerText = long;
  L.marker([lat, long], { icon: myIcon }).addTo(mymap);
}

function getAPOD() {
  fetch(
    "https://api.nasa.gov/planetary/apod?api_key=ormiOh7YZARe5G52OnOlgQBxjkAhhO9vhUy3Ldva&date=" +
      randomDate(new Date(2000, 0, 1), new Date())
  )
    .then(rep => rep.json())
    .then(rep => populateAPOD(rep));
}

function populateAPOD(data) {
  console.log(data);
  document.getElementById("apod").setAttribute("src", data.hdurl);
  document.getElementById("apodTitle").innerText = data.title;
  document.getElementById("apodDate").innerText = data.date;
  document.getElementById("apodDesc").innerText = data.explanation;
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .slice(0, 10);
}
