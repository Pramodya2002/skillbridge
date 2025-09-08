<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('volunteers', function (Blueprint $table) {
            $table->json('availability')->nullable()->change();

            $table->json('skills')->nullable()->change();

            $table->dropColumn('experience_level');

            $table->integer('max_hours_per_week')->nullable()->after('availability');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('volunteers', function (Blueprint $table) {
            // Revert back to original structure
            $table->string('availability')->nullable()->change();
            $table->json('skills')->nullable()->change();
            $table->string('experience_level')->nullable();
            $table->dropColumn('max_hours_per_week');
        });
    }
};
