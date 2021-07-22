// This example adds hide() and show() methods to a custom overlay's prototype.
// These methods toggle the visibility of the container <div>.
// overlay to or from the map.

let moveMap;

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: { lat: 39.449844, lng: -119.7508379 },
        mapTypeId: google.maps.MapTypeId.HYBRID,
    });

    const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng( 13.1304703543976,-156.6674),  // from towercoverage post on lines 388 and 389
        new google.maps.LatLng( 48.6124196456024,-115.3286)); // https://sites.towercoverage.com/default.aspx?mcid=42263&Acct=30819
    // The photograph is courtesy of the U.S. Geological Survey.
    let image = "https://www.towercoverage.com/accounts/[REDACTED]/multicovs/[REDACTED]/42263_10.png";

    moveMap = (el) => {
        const newCenter = new google.maps.LatLng(el.dataset.lat, el.dataset.long);
        map.setCenter(newCenter);
        console.log(el.dataset);
    }

    /**
     * Get user location
     * @type {{enableHighAccuracy: boolean, maximumAge: number, timeout: number}}
     */
    const options = {
        timeout: 5000,
        maximumAge: 0
    };
    function success(pos) {

        const crd = pos.coords;
        const userPosition = new google.maps.LatLng(crd.latitude, crd.longitude);

        const geocoder = new google.maps.Geocoder();
        let userCity;
        geocoder.geocode({location: userPosition}).then( (response) => {
                if (response.results[0]) {
                    console.log(response);
                    userCity = response.results[0].formatted_address;
                    const userNotif = document.getElementById('location_detected');
                    userNotif.textContent = "We detected your approximate location: " + userCity;
                }
            }
        );

        map.setCenter(userPosition);

        const marker = new google.maps.Marker(
            {
                map: map,
                position: userPosition,
                draggable: true,
                animation: google.maps.Animation.DROP,
            });

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
    }
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);



    /**
     * The custom USGSOverlay object contains the USGS image,
     * the bounds of the image, and a reference to the map.
     */
    class USGSOverlay extends google.maps.GroundOverlay {
        bounds;
        image;
        div;
        constructor(bounds, image) {
            super();
            this.bounds = bounds;
            this.image = image;
        }
        /**
         * onAdd is called when the map's panes are ready and the overlay has been
         * added to the map.
         */
        onAdd() {
            this.div = document.createElement("div");
            this.div.style.borderStyle = "none";
            this.div.style.borderWidth = "0px";
            this.div.style.position = "absolute";
            // Create the img element and attach it to the div.
            const img = document.createElement("img");
            img.src = this.image;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.position = "absolute";
            this.div.appendChild(img);
            // Add the element to the "overlayLayer" pane.
            const panes = this.getPanes();
            panes.overlayLayer.appendChild(this.div);
        }
        draw() {
            // We use the south-west and north-east
            // coordinates of the overlay to peg it to the correct position and size.
            // To do this, we need to retrieve the projection from the overlay.
            const overlayProjection = this.getProjection();
            // Retrieve the south-west and north-east coordinates of this overlay
            // in LatLungs and convert them to pixel coordinates.
            // We'll use these coordinates to resize the div.
            const sw = overlayProjection.fromLatLngToDivPixel(
                this.bounds.getSouthWest()
            );
            const ne = overlayProjection.fromLatLngToDivPixel(
                this.bounds.getNorthEast()
            );

            // Resize the image's div to fit the indicated dimensions.
            if (this.div) {
                this.div.style.left = sw.x + "px";
                this.div.style.top = ne.y + "px";
                this.div.style.width = ne.x - sw.x + "px";
                this.div.style.height = sw.y - ne.y + "px";
            }
        }

    }
    const overlay = new google.maps.GroundOverlay(image,bounds);
    overlay.setMap(map);

}
