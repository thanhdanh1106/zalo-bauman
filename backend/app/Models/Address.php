<?php

namespace App\Models;

use App\Enums\CountryCode;
use App\Models\Shop\Brand;
use App\Models\Shop\Customer;
use Database\Factories\AddressFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Address extends Model
{
    /** @use HasFactory<AddressFactory> */
    use HasFactory;

    protected $table = 'addresses';

    protected $fillable = [
        'name',
        'phone',
        'street',
        'city',
        'state',
        'zip',
        'country',
        'type',
        'is_default',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'country' => CountryCode::class,
            'is_default' => 'boolean',
        ];
    }

    /** @return MorphToMany<Customer, $this> */
    public function customers(): MorphToMany
    {
        return $this->morphedByMany(Customer::class, 'addressable');
    }

    /** @return MorphToMany<Brand, $this> */
    public function brands(): MorphToMany
    {
        return $this->morphedByMany(Brand::class, 'addressable');
    }
}
