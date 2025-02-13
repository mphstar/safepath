<?php

namespace App\Exports;

use App\Models\Laporan;
use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class HistoryExport implements FromCollection, WithStyles, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected $status;
    protected $kategori;

    public function __construct($status, $kategori)
    {
        $this->status = $status;
        $this->kategori = $kategori;
    }

    public function collection()
    {

        $data = Laporan::with(['user', 'polsek', 'detailKategori.kategori']);

        if ($this->status == 'history') {
            $data->where(function ($query) {
                $query->where('status', 'disetujui')->orWhere('status', 'ditolak');
            });
        } else {
            $data->where('status', 'menunggu');
        }


        if ($this->kategori == 'kejahatan') {
            $data->whereHas('detailKategori', function ($query) {
                $query->where('kategori_id', 1);
            });
        } else {
            $data->whereHas('detailKategori', function ($query) {
                $query->where('kategori_id', 2);
            });
        }



        $column = [
            'No',
            'Nama Pelapor',
            'ID Kategori',
            'Detail Kategori',
            'ID Kecamatan',
            'Kecamatan',
            'Keterangan',
            'Latitude',
            'Longitude',
            'Status',
            'Tanggal'
        ];
        $formatData = [];

        foreach ($data->get() as $key => $value) {
            $koordinate = explode(",", $value->lokasi);
            $latitude = $koordinate[0];
            $longitude = $koordinate[1];

            $formatData[] = [
                $key + 1,
                $value->user->name,
                $value->detailKategori->id,
                $value->detailKategori->nama,
                $value->polsek->id,
                $value->polsek->nama_kecamatan,
                $value->keterangan,
                $latitude,
                $longitude,
                $value->status,
                $value->created_at->format('d-m-Y') ?? ""
            ];
        }

        return new Collection([
            $column,
            $formatData
        ]);
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }
}
