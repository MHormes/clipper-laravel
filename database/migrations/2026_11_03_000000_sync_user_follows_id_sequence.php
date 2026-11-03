<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * CSV-seeded rows carry explicit ids, which leaves the Postgres sequence behind
     * and causes duplicate key errors on the next insert. Advance it past MAX(id).
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement(
            "SELECT setval(pg_get_serial_sequence('user_follows', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM user_follows"
        );
    }

    public function down(): void
    {
        // Nothing to revert.
    }
};
