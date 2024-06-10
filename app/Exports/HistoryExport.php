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

    public function __construct($status)
    {
        $this->status = $status;
    }

    public function collection()
    {
        if ($this->status == 'history') {
            $data = Laporan::with(['user', 'detailKategori.kategori'])->where(function ($query) {
                $query->where('status', 'disetujui')->orWhere('status', 'ditolak');
            })->get();
        } else {
            $data = Laporan::with(['user', 'detailKategori.kategori'])->where(function ($query) {
                $query->where('status', 'menunggu');
            })->get();
        }

        $column = [
            'No',
            'Nama Pelapor',
            'Kategori Kejahatan',
            'Detail Kategori',
            'Keterangan',
            'Status',
            'Tanggal'
        ];
        $formatData = [];

        foreach ($data as $key => $value) {
            $formatData[] = [
                $key + 1,
                $value->user->name,
                $value->detailKategori->kategori->nama,
                $value->detailKategori->nama,
                $value->keterangan,
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
