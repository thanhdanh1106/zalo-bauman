<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;

use Spatie\Permission\Traits\HasRoles;
use Bavix\Wallet\Traits\HasWallet;
use Bavix\Wallet\Interfaces\Wallet;

class User extends Authenticatable implements FilamentUser, HasTenants, MustVerifyEmail, Wallet
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasRoles;
    use HasWallet;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_id',
        'referred_by',
        'zalo_id',
        'email_verified_at',
        'phone',
        'birthday',
        'gender',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];
    /**
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'birthday' => 'date',
    ];

    public function canAccessPanel(Panel $panel): bool
    {
        return true;
    }

    public function canAccessTenant(Model $tenant): bool
    {
        return true;
    }

    /** @return Collection<int,Team> */
    public function getTenants(Panel $panel): Collection
    {
        return Team::all();
    }

    /** @return BelongsToMany<Team, $this> */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(\Awcodes\Curator\Models\Media::class, 'avatar_id');
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar->path);
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=8f0012&background=fdf2f2';
    }

    public function referredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by');
    }
}