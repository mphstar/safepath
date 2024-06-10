<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    use HasFactory;
    protected $table = 'laporan'; // mendevinisikan nama table
    protected $primaryKey = 'id'; // mendevinisikan primary key
    public $incrementing = true; // auto pada primaryKey incremment true
    public $timestamps = true; // create_at dan update_at false

    // fillable mendevinisikan field mana saja yang dapat kita isikan
    protected $guarded = [];

    // relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // relasi ke detail kategori
    public function detailKategori()
    {
        return $this->belongsTo(DetailKategori::class, 'detail_kategori_id', 'id');
    }

    // relasi ke polsek
    public function polsek()
    {
        return $this->belongsTo(Polsek::class, 'polsek_id', 'id');
    }
}
