<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Badge;


class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Badge::insert([
            [
                'name' => 'React Contributor',
                'skill' => 'React',
                'criteria' => 'Completed at least one React-based task',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'UI/UX Specialist',
                'skill' => 'UI/UX',
                'criteria' => 'Completed a UI/UX related task',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
