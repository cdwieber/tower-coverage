<?php

namespace Gigacity\Shortcode;

class CoverageReport
{
    public function __construct() {
        add_shortcode( 'gc_coverage', [$this, 'gc_coverage'] );
        add_action( 'wp_enqueue_scripts', [$this, 'scripts'] );
    }

    public function scripts() {
        wp_enqueue_script( 'google-maps-coverage' );
        wp_enqueue_script( 'swal' );
    }

    public function gc_coverage() {
        //var_dump($_GET);
        ob_start();
        ?>
        <style>
            /* Always set the map height explicitly to define the size of the div
           * element that contains the map. */
            #map-container {
                height: 600px;
            }
            #map {
                height: 100%;
            }

            .custom-map-control-button {
                background-color: #fff;
                border: 0;
                border-radius: 2px;
                box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
                margin: 10px;
                padding: 0 0.5em;
                font: 400 18px Roboto, Arial, sans-serif;
                overflow: hidden;
                height: 40px;
                cursor: pointer;
            }
            .custom-map-control-button:hover {
                background: #ebebeb;
            }

        </style>
            <p>
                Checking coverage for: <em><span id="address_yoink"><?= $_GET['street_address'] . ', ' . $_GET['city'] . ', ' . $_GET['zip']  ?></span></em>.
                Please inspect the marker. If needed, drag it to <em>exactly</em> where you need coverage before continuing.
            </p>
            <p>
                Query Coordinates: <span id="latlong"></span>
            </p>
            <div id="map-container">
                <div id="map"></div>
            </div>

        <button role="button" id="coverage_confirm">Continue</button>
        <?php
        return ob_get_clean();
    }

}