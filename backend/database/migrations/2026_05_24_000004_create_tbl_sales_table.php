<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_sales', function (Blueprint $table) {
            $table->id('sale_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('user_id');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->dateTime('sale_date');
            $table->string('notes', 200)->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('product_id')
                ->references('product_id')
                ->on('tbl_products')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('user_id')
                ->on('tbl_users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_sales');
    }
};
