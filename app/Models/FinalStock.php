<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'final_date',
        'final_stock'
    ];

    
}
