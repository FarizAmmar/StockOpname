<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_name',
        'original_name',
        'file_size',
        'ext',
        'path'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
