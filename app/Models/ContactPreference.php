<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactPreference extends Model
{
    use HasFactory;
    protected $table = 'contact_preference'; // mendevinisikan nama table
    protected $primaryKey = 'id'; // mendevinisikan primary key
    public $incrementing = true; // auto pada primaryKey incremment true
    public $timestamps = true; // create_at dan update_at false

    // fillable mendevinisikan field mana saja yang dapat kita isikan
    protected $guarded = [];

    // contact preference memiliki banyak user preference
    public function userPreference()
    {
        return $this->belongsTo(UserPreference::class, 'user_preference_id', 'id');
    }
}
