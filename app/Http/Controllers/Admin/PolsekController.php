<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Polsek;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PolsekController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Polsek');
    }

    public function getData(Request $request)
    {

        $data = Polsek::orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('nama_kecamatan', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function storePolsek(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_kecamatan' => 'required|string|max:50',
            'kontak' => 'required|email',
            'penanggungjawab' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new Polsek;
        $data->nama_kecamatan = $request->nama_kecamatan;
        $data->kontak = $request->kontak;
        $data->penanggung_jawab = $request->penanggungjawab;

        $data->save();

        // Berikan respon dengan data yang berhasil dibuat
        return response()->json(['message' => 'Data created successfully', 'data' => $data], 201);
    }

    public function updatePolsek(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'nama_kecamatan' => 'required|string|max:50',
            'kontak' => 'required|email',
            'penanggungjawab' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = Polsek::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->nama_kecamatan = $request->nama_kecamatan;
        $data->kontak = $request->kontak;
        $data->penanggung_jawab = $request->penanggungjawab;

        $data->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $data], 200);
    }

    public function deletePolsek(Request $request)
    {
        $data = Polsek::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->delete();

        return response()->json(['message' => 'Data deleted successfully'], 200);
    }
}
