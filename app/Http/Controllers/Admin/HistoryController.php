<?php

namespace App\Http\Controllers\Admin;

use App\Exports\HistoryExport;
use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class HistoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/History');
    }

    public function getData(Request $request)
    {

        $data = Laporan::with(['user', 'detailKategori.kategori'])->where(function ($query) {
            $query->where('status', 'disetujui')->orWhere('status', 'ditolak');
        })->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('keterangan', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function export()
    {

        return Excel::download(new HistoryExport(request()->status ?? ""), 'history.xlsx');
    }

    public function getAllLaporanFinished(Request $request)
    {
        $data = Laporan::with(['user', 'detailKategori.kategori'])->where(function ($query) {
            $query->where('status', 'disetujui');
        })->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('keterangan', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate($request->limit ?? 10)
        ], 200);
    }
}
