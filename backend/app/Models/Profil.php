<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profil extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filiere',
        'annee',
        'phone',
        'bio',
        'disponibilite',
        'avatar',
    ];

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
