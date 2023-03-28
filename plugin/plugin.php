<?php
/**
 * Plugin Name: Alley Scripts Demo Plugin
 * Plugin URI: https://github.com/alleyinteractive/alley-scripts-demo-plugin
 * Description: Demo plugin for Alley Scripts development.
 * Version: 0.1.0
 * Author: Alley
 * Author URI: https://github.com/alleyinteractive/alley-scripts-demo-plugin
 * Requires at least: 5.9
 * Tested up to: 6.1.1
 *
 * Text Domain: alley-scripts-demo-plugin
 * Domain Path: /languages/
 *
 * @package alley-scripts-demo-plugin
 */

namespace Alley_Scripts_Demo_Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Root directory to this plugin.
 *
 * @var string
 */
define( 'ALLEY_SCRIPTS_DEMO_PLUGIN_DIR', __DIR__ );

// Load the plugin's main files.
require_once __DIR__ . '/src/assets.php';
require_once __DIR__ . '/src/meta.php';

/**
 * Instantiate the plugin.
 */
function main() {
	// ...
}
main();
