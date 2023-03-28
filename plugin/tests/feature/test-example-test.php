<?php
namespace Alley_Scripts_Demo_Plugin\Tests\Feature;

use Alley_Scripts_Demo_Plugin\Tests\Test_Case;

/**
 * Visit {@see https://mantle.alley.co/testing/test-framework.html} to learn more.
 */
class Example_Test extends Test_Case {
	public function test_example() {
		$this->assertTrue( true );
		$this->assertNotEmpty( home_url() );
	}
}
