<?php

namespace App\Imports;

use App\Models\Laporan;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class LaporanImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    protected $user_id;

    public function __construct($user_id)
    {
        $this->user_id = $user_id;
    }

    public function model(array $row)
    {
        return new Laporan([
            'user_id' => $this->user_id,
            'detail_kategori_id' => $row['id_kategori'],
            'polsek_id' => $row['id_kecamatan'],
            'keterangan' => $row['keterangan'],
            'status' => $row['status'],
            'lokasi' => $row['latitude'] . ',' . $row['longitude'],
            'created_at' => $row['tanggal'],
        ]);
    }
}
