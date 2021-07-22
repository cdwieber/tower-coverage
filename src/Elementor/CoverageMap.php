<?php

namespace Gigacity\Elementor;
use Elementor\Widget_Base;

class CoverageMap extends Widget_Base
{

    public function get_name() {
        return 'Coverage Map';
    }

    public function get_icon() {
        return 'fa fa-broadcast-tower';
    }

    public function get_script_depends()
    {
        return [ 'google-maps-cdn' ];
    }

    public function render() {
        ?>
        <style>
            /* Always set the map height explicitly to define the size of the div
           * element that contains the map. */
            #map-wrapper {
                width: 100%;
                display: inline;
            }
            #map-container {
                height:400px;
                width: 66%;
                float: right;
            }
            #map {
                height: 100%;
            }

            #location-selection {
                float: left;
                width: 25%;
                height: 90%;
                margin: 30px;
                padding: 15px;
                border: 1px solid #000;
                border-radius: 5px;
            }

            #location-selection p {
                cursor: pointer;
            }

            #location-selection p:hover {
                color: #0c88b4;
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
        <div id="map-wrapper">
            <div id="location-selection">
                <p onclick="moveMap(this)" id="loc_reno" data-lat="39.498718531075085" data-long="-119.79336264375">Reno</p>
                <p onclick="moveMap(this)" id="loc_tahoe" data-lat="39.09700463392126" data-long="-120.03231528046875">Tahoe</p>
                <p onclick="moveMap(this)" id="loc_carson" data-lat="39.16198741013299" data-long="-119.76177695039063">Carson City</p>
                <p onclick="moveMap(this)" id="loc_gardner" data-lat="38.93481961769251" data-long="-119.74255087617188">Gardnerville</p>
                <p onclick="moveMap(this)" id="loc_winnemucca" data-lat="40.897920357302766" data-long="-117.74029257539063">Winnemucca</p>
                <p onclick="moveMap(this)" id="loc_battle_mountain" data-lat="40.614971350002335" data-long="-116.91082480195313">Battle Mountain</p>
            </div>
            <div id="map-container">
                <span id="location_detected"></span>
                <div id="map"></div>
            </div>
        </div>
        <?php
    }

}