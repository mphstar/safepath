<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
