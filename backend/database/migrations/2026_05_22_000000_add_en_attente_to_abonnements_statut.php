<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Add the 'en_attente' state so a subscription can wait for
     * manual payment validation by an admin before becoming 'actif'.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE abonnements MODIFY COLUMN statut ENUM('actif', 'expire', 'annule', 'en_attente') NOT NULL DEFAULT 'actif'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE abonnements MODIFY COLUMN statut ENUM('actif', 'expire', 'annule') NOT NULL DEFAULT 'actif'");
    }
};
