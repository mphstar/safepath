<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailKategori;
use App\Models\Laporan;
use App\Models\Polsek;
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

    protected function getReport()
    {
        $kecamatan = Polsek::withCount(['laporan' => function ($query) {
            $query->where('status', 'disetujui');
        }])->orderBy('laporan_count', 'desc')->limit(4)->get();


        $jumlah = 0;

        foreach ($kecamatan as $key => $value) {
            $jumlah++;
        }

        $data1 = [];
        for ($i = 0; $i < $jumlah; $i++) {
            $data1[] = array(
                'kecamatan' => $kecamatan[$i]->nama_kecamatan,
                'total' => 0
            );
        }

        $kejahatan = Polsek::withCount(['laporan' => function ($query) {
            $query->where('status', 'disetujui')->whereHas('detailKategori', function ($query) {
                $query->where('kategori_id', 1);
            });
        }])->orderBy('laporan_count', 'desc')->get();


        foreach ($data1 as $key => $value) {
            foreach ($kejahatan as $item) {
                if ($value['kecamatan'] == $item->nama_kecamatan) {
                    $data1[$key]['total'] = $item->laporan_count;
                }
            }
        }

        $data2 = [];
        for ($i = 0; $i < $jumlah; $i++) {
            $data2[] = array(
                'kecamatan' => $kecamatan[$i]->nama_kecamatan,
                'total' => 0
            );
        }

        $kecelakaan = Polsek::withCount(['laporan' => function ($query) {
            $query->where('status', 'disetujui')->whereHas('detailKategori', function ($query) {
                $query->where('kategori_id', 2);
            });
        }])->orderBy('laporan_count', 'desc')->get();


        foreach ($data2 as $key => $value) {
            foreach ($kecelakaan as $item) {
                if ($value['kecamatan'] == $item->nama_kecamatan) {
                    $data2[$key]['total'] = $item->laporan_count;
                }
            }
        }

        return array(
            'kejahatan' => $data1,
            'kecelakaan' => $data2
        );
    }

    public function getCountKategori()
    {
        $data = DetailKategori::withCount(['laporan' => function ($query) {
            $query->where('status', 'disetujui');
        }])->orderBy('laporan_count', 'desc')->limit(8)->get();

        $filter = $data->filter(function ($value, $key) {
            return $value->laporan_count > 0;
        });

        return $filter;
    }

    public function index()
    {
        $statistik = $this->getStatistik();
        $report = $this->getReport();
        $kategori = $this->getCountKategori();

        $laporan = Laporan::with(['detailKategori.kategori', 'user'])->where('status', 'disetujui')->orderBy('created_at', 'DESC')->select('lokasi', 'detail_kategori_id')->get();


        return Inertia::render('Admin/Dashboard', [
            'statistik' => $statistik,
            'report' => $report,
            'kategori' => $kategori,
            'laporan' => $laporan
        ]);
    }
}
