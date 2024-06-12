<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{

    protected function convertBulan($value)
    {
        $bulan = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        foreach ($bulan as $key => $item) {
            if ($key == $value) {
                return $item;
            }
        }
    }

    protected function getStatistik()
    {
        $data1 = [];

        for ($i = 0; $i < 4; $i++) {
            $data1[] = array(
                'bulan' => $this->convertBulan((int) date('m', strtotime('-' . $i . ' month'))),
                'total' => 0
            );
        }

        $kejahatan = Laporan::query();

        $kejahatan->where('status', 'disetujui');

        $kejahatan->whereMonth('created_at', '>=', date('m', strtotime('-4 month')))->whereMonth('created_at', '<=', date('m'));

        $kejahatan->whereHas('detailKategori', function ($query) {
            $query->where('kategori_id', 1);
        });

        $arrayKejahatan = $kejahatan->select(DB::raw('count(*) as total, MONTH(created_at) as bulan'))->groupBy('bulan')->get()->toArray();

        foreach ($data1 as $key => $value) {
            foreach ($arrayKejahatan as $item) {
                if ($value['bulan'] == $this->convertBulan(($item['bulan']))) {
                    $data1[$key]['total'] = $item['total'];
                }
            }
        }

        $data2 = [];

        for ($i = 0; $i < 4; $i++) {
            $data2[] = array(
                'bulan' => $this->convertBulan((int) date('m', strtotime('-' . $i . ' month'))),
                'total' => 0
            );
        }

        $kecelakaan = Laporan::query();

        $kecelakaan->where('status', 'disetujui');

        $kecelakaan->whereMonth('created_at', '>=', date('m', strtotime('-4 month')))->whereMonth('created_at', '<=', date('m'));

        $kecelakaan->whereHas('detailKategori', function ($query) {
            $query->where('kategori_id', 2);
        });

        $arrayKecelakaan = $kecelakaan->select(DB::raw('count(*) as total, MONTH(created_at) as bulan'))->groupBy('bulan')->get()->toArray();

        foreach ($data2 as $key => $value) {
            foreach ($arrayKecelakaan as $item) {
                if ($value['bulan'] == $this->convertBulan(($item['bulan']))) {
                    $data2[$key]['total'] = $item['total'];
                }
            }
        }

        return array(
            'kejahatan' => $data1,
            'kecelakaan' => $data2
        );
    }

    public function index()
    {
        $statistik = $this->getStatistik();


        return Inertia::render('Admin/Dashboard', [
            'statistik' => $statistik
        ]);
    }
}
