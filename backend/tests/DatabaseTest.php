<?php

use PHPUnit\Framework\TestCase;
use App\Database;

class DatabaseTest extends TestCase
{

    public function testGetConnectionReturnsPDOInstance()
    {
        $db = Database::getConnection();
        $this->assertInstanceOf(PDO::class, $db);
    }

    public function testGetConnectionIsSingleton()
    {
        $db1 = Database::getConnection();
        $db2 = Database::getConnection();

        // Assert they are the exact same instance
        $this->assertSame($db1, $db2);
    }

    public function testConnectionAttributes()
    {
        $db = Database::getConnection();

        // Ensure error mode is set to Exception
        $this->assertEquals(PDO::ERRMODE_EXCEPTION, $db->getAttribute(PDO::ATTR_ERRMODE));

        // Ensure default fetch mode is ASSOC
        $this->assertEquals(PDO::FETCH_ASSOC, $db->getAttribute(PDO::ATTR_DEFAULT_FETCH_MODE));

        // Ensure emulated prepares are off
        $this->assertFalse((bool) $db->getAttribute(PDO::ATTR_EMULATE_PREPARES));
    }
}
