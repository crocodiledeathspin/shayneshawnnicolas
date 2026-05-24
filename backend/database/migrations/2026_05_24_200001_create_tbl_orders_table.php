<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->string('order_number', 20)->unique();
            $table->string('customer_name', 100);
            $table->string('customer_phone', 20);
            $table->string('customer_email', 100)->nullable();
            $table->enum('fulfillment_type', ['pickup', 'delivery']);
            $table->text('delivery_address')->nullable();
            $table->string('delivery_landmark', 150)->nullable();
            $table->enum('status', [
                'pending',
                'accepted',
                'preparing',
                'ready_for_pickup',
                'out_for_delivery',
                'completed',
                'cancelled',
            ])->default('pending');
            $table->enum('payment_method', ['cash'])->default('cash');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->string('notes', 300)->nullable();
            $table->unsignedBigInteger('handled_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('handled_by')
                ->references('user_id')
                ->on('tbl_users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_orders');
    }
};
