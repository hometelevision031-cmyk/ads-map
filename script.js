if (!localStorage.getItem("currentUser")) {
    window.location.href = "index.html";
}

let map = L.map('map').setView([43.23, 76.88], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {})
.addTo(map);

let ads = JSON.parse(localStorage.getItem("ads")) || [];
let markers = [];

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function save() {
    localStorage.setItem("ads", JSON.stringify(ads));
}

function addAd() {
    let title = document.getElementById("title").value;
    let desc = document.getElementById("desc").value;
    let lat = parseFloat(document.getElementById("lat").value);
    let lng = parseFloat(document.getElementById("lng").value);
    let file = document.getElementById("image").files[0];

    if (!title || !desc || !lat || !lng || !file) {
        alert("Заполни всё");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        ads.push({
            title,
            desc,
            lat,
            lng,
            image: e.target.result,
            user: localStorage.getItem("currentUser")
        });

        save();
        render();
    };

    reader.readAsDataURL(file);
}

function render(data = ads) {
    document.getElementById("list").innerHTML = "";
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    data.forEach(ad => {
        let marker = L.marker([ad.lat, ad.lng]).addTo(map)
            .bindPopup(ad.title);

        markers.push(marker);

        let div = document.createElement("div");
        div.className = "ad";
        div.innerHTML = `
            <b>${ad.title}</b><br>
            ${ad.desc}<br>
            <img src="${ad.image}">
        `;

        div.onclick = () => {
            map.setView([ad.lat, ad.lng], 15);
            marker.openPopup();
        };

        document.getElementById("list").appendChild(div);
    });
}

function searchAds() {
    let val = document.getElementById("search").value.toLowerCase();

    let filtered = ads.filter(a =>
        a.title.toLowerCase().includes(val)
    );

    render(filtered);
}

render();
