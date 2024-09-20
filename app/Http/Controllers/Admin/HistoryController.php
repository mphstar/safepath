<?php

namespace App\Http\Controllers\Admin;

use App\Exports\HistoryExport;
use App\Http\Controllers\Controller;
use App\Imports\LaporanImport;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class HistoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/History', [
            'auth' => Auth::user()
        ]);
    }

    public function getData(Request $request)
    {

        $data = Laporan::with(['user', 'detailKategori.kategori', 'polsek'])->where(function ($query) {
            $query->where('status', 'disetujui')->orWhere('status', 'ditolak');
        })->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            // $data->where('keterangan', 'like', '%' . $request->search . '%');
            $data->whereHas('detailKategori', function ($query) use ($request) {
                $query->where('nama', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->has('filter')) {
            // $data->where('keterangan', 'like', '%' . $request->search . '%');
            if ($request->filter != "all") {
                $data->where('status', $request->filter);
            }
        }

        if ($request->has('kategori')) {
            $data->whereHas('detailKategori', function ($query) use ($request) {
                if ($request->kategori == 'kejahatan') {
                    $query->where('kategori_id', 1);
                } else {
                    $query->where('kategori_id', 2);
                }
            });
        }



        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function importLaporan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'file' => 'required|mimes:xlsx,xls'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', $validator->errors()->first());
        }

        Excel::import(new LaporanImport($request->user_id), $request->file('file'));

        return response()->json([
            'status' => 'success',
            'result' => 'Data berhasil di import'
        ], 200);
    }

    public function export()
    {

        return Excel::download(new HistoryExport(request()->status ?? "", request()->kategori), 'history.xlsx');
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
