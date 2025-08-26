<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('location')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('required_skills')->nullable();
            $table->integer('volunteers_needed')->default(1);
            $table->enum('status', ['Open', 'Ongoing', 'Completed'])->default('Open');
        });
    }

    public function down(): void {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['location', 'start_date', 'end_date', 'required_skills', 'volunteers_needed', 'status']);
        });
    }
};
