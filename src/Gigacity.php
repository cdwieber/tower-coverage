<?php

namespace Gigacity;

use Gigacity\Elementor\CoverageMap;
use Gigacity\Shortcode\CoverageReport;

class Gigacity {

    /**
     * The unique instance of the plugin.
     *
     * @var Gigacity
     */
    private static $instance;

    public $assets_dir;

    /*** Plugin Feature Classes ***/
    public $gc_coverage_report;

    /**
     * Gets an instance of our plugin.
     *
     * @return Gigacity
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Constructor.
     */
    public function __construct() {
        $this->assets_dir = WP_PLUGIN_DIR . '/gigacity/assets/';
    }

    public function init() {
        // Init coverage reports.
        $this->gc_coverage_report = new Shortcode\CoverageReport();
    }

    public function register_scripts() {
        //TODO: make this the FQURI
        wp_register_script('coverage-map',  '/wp-content/plugins/gigacity/assets/js/coverageMap.js', []);
        wp_register_script('coverage-report',  '/wp-content/plugins/gigacity/assets/js/coverageReport.js', []);
        //TODO: Store api keys in db
        wp_register_script(
            'google-maps-coverage',
            'https://maps.googleapis.com/maps/api/js?key=[REDACTED]&callback=initMap&libraries=&v=weekly',
            [ 'coverage-report' ],
            null,
            true
        );
        wp_register_script(
            'swal',
            '//cdn.jsdelivr.net/npm/sweetalert2@11',
        );
    }

    public function el_widget_scripts() {
        wp_register_script(
            'google-maps-cdn',
            'https://maps.googleapis.com/maps/api/js?key=[REDACTED]&callback=initMap&libraries=&v=weekly',
            [ 'coverage-map' ],
            null,
            true
        );
    }

    private function hooks() {
        add_action( 'elementor/widgets/widgets_registered', [ $this, 'register_widgets' ] );
        add_action('wp_enqueue_scripts', [$this, 'register_scripts']);
        // Register Widget Scripts
        add_action( 'elementor/frontend/after_register_scripts', [ $this, 'el_widget_scripts' ]);
    }

    public function register_widgets() {
        \Elementor\Plugin::instance()->widgets_manager->register_widget_type( new CoverageMap() );
    }

    public function run() {
        $this->hooks();
        $this->init();
    }
}