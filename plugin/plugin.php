<?php
/**
 * Plugin Name: Alley Scripts Demo Plugin
 * Plugin URI: https://github.com/alleyinteractive/alley-scripts
 * Description: Demo plugin for Alley Scripts development.
 * Version: 0.1.0
 * Author: Alley
 * Author URI: https://github.com/alleyinteractive/alley-scripts
 * Requires at least: 6.4
 * Tested up to: 6.4
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
	register_meta_helper(
		'post',
		[ 'post' ],
		'alley_scripts_audio_picker_id',
	);

	register_meta_helper(
		'post',
		[ 'post' ],
		'alley_scripts_image_picker_id',
		[
			'type' => 'integer',
		]
	);

	register_meta_helper(
		'post',
		[ 'post' ],
		'alley_scripts_media_picker_id',
		[
			'type' => 'integer',
		]
	);

	register_meta_helper(
		'post',
		[ 'post' ],
		'alley_scripts_post_picker_id',
		[
			'type' => 'integer',
		]
	);

	register_meta_helper(
		'post',
		[ 'post' ],
		'alley_scripts_repeater',
		[
			'type'         => 'array',
			'show_in_rest' => [
				'schema' => [
					'items' => [
						'type' => 'string',
					],
				],
			],
		]
	);
}
main();

/**
 * A 'sanitize_callback' for the csv_data meta field.
 *
 * @param mixed $meta_value Meta value to sanitize.
 * @return string Sanitized meta value.
 */
function sanitize_csv_data( $meta_value ) : string {
	// The meta value should be a stringified JSON array. Ensure that it is.
	$raw_meta_value = json_decode( $meta_value, true );
	if ( ! is_array( $raw_meta_value ) ) {
		return '';
	}

	// Rebuild the data, sanitizing values, and validating keys.
	$sanitized_meta_value = [];
	foreach ( $raw_meta_value as $row ) {
		$sanitized_meta_value[] = [
			'title'       => sanitize_text_field( $row['title'] ?? '' ),
			'slug'        => sanitize_title( $row['slug'] ?? '' ),
			'description' => sanitize_text_field( $row['description'] ?? '' ),
		];
	}

	return wp_json_encode( $sanitized_meta_value );
}
