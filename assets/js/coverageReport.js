// This example adds hide() and show() methods to a custom overlay's prototype.
// These methods toggle the visibility of the container <div>.
// overlay to or from the map.
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: 39.449844, lng: -119.7508379 },
        mapTypeId: "satellite",
    });

    const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng( 13.1304703543976,-156.6674),  // from towercoverage post on lines 388 and 389
        new google.maps.LatLng( 48.6124196456024,-115.3286)); // https://sites.towercoverage.com/default.aspx?mcid=42263&Acct=30819
    // The photograph is courtesy of the U.S. Geological Survey.
    let image = "https://www.towercoverage.com/accounts/[REDACTED]/multicovs/[REDACTED]/42263_10.png"

    const address = document.getElementById('address_yoink').textContent;
    const coordDisplay = document.getElementById('latlong');
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:address},  function(results, status)
    {
        if (status === google.maps.GeocoderStatus.OK)
        {
            map.setCenter(results[0].geometry.location);//center the map over the result
            coordDisplay.textContent = results[0].geometry.location;
            //place a marker at the location
            const marker = new google.maps.Marker(
                {
                    map: map,
                    position: results[0].geometry.location,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                });
            // Get updated coordinates from drag event
            google.maps.event.addListener(marker, 'dragend', function (e) {
                coordDisplay.textContent = marker.getPosition();
            })
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    })

    const confirmButton = document.getElementById('coverage_confirm');
    confirmButton.addEventListener('click', function (e) {
        Swal.fire({
            title: 'You\'re about to submit an inquiry with the following info:',
            html: 'Address: ' + address + '<br />' +
                    'Exact Coordinates: ' + coordDisplay.textContent + '<br />',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Sounds Good!'
        }).then((result) => {

        });
    })
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