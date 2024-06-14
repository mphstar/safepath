<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailKategori;
use App\Models\Laporan;
use App\Models\Polsek;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GrafikController extends Controller
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

    public function index()
    {
        return Inertia::render('Admin/Grafik');
    }

    protected function getStatistik($tahun)
    {
        $data1 = [];

        for ($i = 0; $i < 12; $i++) {
            $data1[] = array(
                'bulan' => $this->convertBulan($i + 1),
                'total' => 0
            );
        }

        $kejahatan = Laporan::query();

        $kejahatan->where('status', 'disetujui');

        $kejahatan->whereYear('created_at', $tahun);

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

        for ($i = 0; $i < 12; $i++) {
            $data2[] = array(
                'bulan' => $this->convertBulan($i + 1),
                'total' => 0
            );
        }

        $kecelakaan = Laporan::query();

        $kecelakaan->where('status', 'disetujui');

        $kecelakaan->whereYear('created_at', $tahun);

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

    public function filterTahun(Request $request)
    {
        $tahun = $request->tahun;

        $data = $this->getStatistik($tahun);

        return response()->json([
            'status' => 'success',
            'result' => $data
        ], 200);
    }

    protected function getReport($date_from, $date_to)
    {


        $kecamatan = Polsek::withCount(['laporan' => function ($query) use ($date_from, $date_to) {
            $query->where('status', 'disetujui')->whereBetween('created_at', [$date_from, $date_to]);
        }])->orderBy('laporan_count', 'desc')->get();

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

        $kejahatan = Polsek::withCount(['laporan' => function ($query) use ($date_from, $date_to) {
            $query->where('status', 'disetujui')->whereBetween('created_at', [$date_from, $date_to])->whereHas('detailKategori', function ($query) {
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

        $kecelakaan = Polsek::withCount(['laporan' => function ($query) use ($date_from, $date_to) {
            $query->where('status', 'disetujui')->whereBetween('created_at', [$date_from, $date_to])->whereHas('detailKategori', function ($query) {
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

    public function getCountKategori($date_from, $date_to)
    {
        $data = DetailKategori::withCount(['laporan' => function ($query) use ($date_from, $date_to) {
            $query->where('status', 'disetujui')->whereBetween('created_at', [$date_from, $date_to]);
        }])->orderBy('laporan_count', 'desc')->get();


        return $data;
    }

    public function filterRange(Request $request)
    {
        $date_from = $request->date_from;
        $date_to = $request->date_to;

        $report = $this->getReport($date_from, $date_to);
        $countKategori = $this->getCountKategori($date_from, $date_to);


        return response()->json([
            'status' => 'success',
            'result' => array(
                'report' => $report,
                'countKategori' => $countKategori
            )
        ], 200);
    }
}
