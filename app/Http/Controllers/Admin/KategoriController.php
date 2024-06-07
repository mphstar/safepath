<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailKategori;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function indexKejahatan()
    {
        return Inertia::render('Admin/KategoriKejahatan');
    }

    public function getKategoriKejahatan(Request $request)
    {

        $data = DetailKategori::where('kategori_id', 1)->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('nama', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function storeKategoriKejahatan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new DetailKategori;

        $data->kategori_id = 1;
        $data->nama = $request->nama;

        $data->save();

        // Berikan respon dengan data yang berhasil dibuat
        return response()->json(['message' => 'Data created successfully', 'data' => $data], 201);
    }

    public function updateKategoriKejahatan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'nama' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = DetailKategori::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->nama = $request->nama;

        $data->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $data], 200);
    }

    public function deleteKategoriKejahatan(Request $request)
    {
        $data = DetailKategori::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->delete();

        return response()->json(['message' => 'Data deleted successfully'], 200);
    }

    public function indexKecelakaan()
    {
        return Inertia::render('Admin/KategoriKecelakaan');
    }

    public function getKategoriKecelakaan(Request $request)
    {

        $data = DetailKategori::where('kategori_id', 2)->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('nama', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function storeKategoriKecelakaan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new DetailKategori;

        $data->kategori_id = 2;
        $data->nama = $request->nama;

        $data->save();

        // Berikan respon dengan data yang berhasil dibuat
        return response()->json(['message' => 'Data created successfully', 'data' => $data], 201);
    }

    public function updateKategoriKecelakaan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'nama' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = DetailKategori::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->nama = $request->nama;

        $data->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $data], 200);
    }

    public function deleteKategoriKecelakaan(Request $request)
    {
        $data = DetailKategori::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->delete();

        return response()->json(['message' => 'Data deleted successfully'], 200);
    }
}
