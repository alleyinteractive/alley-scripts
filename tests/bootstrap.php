<?php
/**
 * PHPUnit bootstrap file
 *
 * @package WP_Irving
 */

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	// PHPCS is complaining about this line not being translated, but it not really relevant for this file.
	// phpcs:disable
	echo "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL;
	exit( 1 );
	// phpcs:enable
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	update_option( 'permalink_structure', '/%year%/%monthnum%/%day%/%postname%/' );

	require_once dirname( __DIR__ ) . '/wp-irving.php';

	/**
	 * Plugins to load for integration tests.
	 *
	 * @todo move these loaders to test classes where they're tested.
	 */
	$plugins = [
		// Add plugins here.
	];

	// Autoload plugins if they are present.
	foreach ( $plugins as $plugin ) {
		$path = dirname( __DIR__, 3 ) . "/plugins/${plugin}/${plugin}.php";

		if ( file_exists( $path ) ) {
			require_once $path;
		}
	}

}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
