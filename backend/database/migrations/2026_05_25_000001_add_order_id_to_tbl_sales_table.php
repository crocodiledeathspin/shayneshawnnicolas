<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tbl_sales', function (Blueprint $table) {
            $table->unsignedBigInteger('order_id')->nullable()->after('sale_id');
            $table->foreign('order_id')
                ->references('order_id')
                ->on('tbl_orders')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tbl_sales', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
        });
    }
};
