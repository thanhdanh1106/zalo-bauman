<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactForm extends Model
{
    protected $table = 'contact_forms';

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'email',
        'title',
        'content',
        'status',
    ];
}
