<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Billing cycle chosen by the user (monthly or yearly).
     * Needed so an admin can set the right end date when validating.
     */
    public function up(): void
    {
        Schema::table('abonnements', function (Blueprint $table) {
            $table->enum('cycle', ['mensuel', 'annuel'])->default('mensuel')->after('plan');
        });
    }

    public function down(): void
    {
        Schema::table('abonnements', function (Blueprint $table) {
            $table->dropColumn('cycle');
        });
    }
};
