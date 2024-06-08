<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function indexConfirmReport()
    {
        return Inertia::render('Admin/ConfirmReport');
    }

    public function getDataConfirmReport(Request $request)
    {

        $data = Laporan::with(['user', 'detailKategori.kategori'])->where('status', 'menunggu')->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('keterangan', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function confirmReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = Laporan::find($request->id);
        $data->status = 'disetujui';
        $data->save();

        return response()->json(['message' => 'Data berhasil di konfirmasi', 'data' => $data], 200);
    }

    public function rejectReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = Laporan::find($request->id);
        $data->status = 'ditolak';
        $data->save();

        return response()->json(['message' => 'Data berhasil di tolak', 'data' => $data], 200);
    }
}
