<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

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

    public function getReportUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = Laporan::with(['user', 'detailKategori.kategori'])->where('user_id', $request->user_id)->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('keterangan', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function insertReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'detail_kategori_id' => 'required',
            'polsek_id' => 'required',
            'bukti_gambar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'keterangan' => 'required',
            'lokasi' => 'required',
            'tanggal' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new Laporan();
        $data->user_id = $request->user_id;
        $data->detail_kategori_id = $request->detail_kategori_id;
        $data->polsek_id = $request->polsek_id;
        $data->keterangan = $request->keterangan;

        $image = $request->file('bukti_gambar');

        $image_name = time() . '.' . $image->getClientOriginalExtension();

        $path = public_path('uploads/laporan/') . "/" . $image_name;

        Image::make($image->getRealPath())->resize(700, null, function ($constraint) {
            $constraint->aspectRatio();
        })->save($path);

        $data->bukti_gambar = $image_name;
        $data->lokasi = $request->lokasi;
        $data->status = 'menunggu';
        $data->created_at = $request->tanggal;
        $data->save();

        return response()->json(['message' => 'Data berhasil di tambahkan', 'data' => $data], 200);
    }


    
}
