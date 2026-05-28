<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_customer_debts', function (Blueprint $table) {
            $table->id('debt_id');
            $table->string('customer_name', 120);
            $table->string('customer_phone', 20)->nullable();
            $table->decimal('amount', 12, 2);
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->string('description', 255)->nullable();
            $table->date('debt_date');
            $table->enum('status', ['open', 'paid'])->default('open');
            $table->unsignedBigInteger('recorded_by');
            $table->timestamp('paid_at')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('recorded_by')->references('user_id')->on('tbl_users');
            $table->index(['status', 'is_deleted']);
            $table->index('customer_phone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_customer_debts');
    }
};
