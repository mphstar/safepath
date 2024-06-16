<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cctv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CctvController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Cctv');
    }

    public function getData(Request $request)
    {

        $data = Cctv::orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('nama', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function storeCctv(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:50',
            'url' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new Cctv;
        $data->nama = $request->nama;
        $data->url = $request->url;

        $data->save();

        // Berikan respon dengan data yang berhasil dibuat
        return response()->json(['message' => 'Data created successfully', 'data' => $data], 201);
    }

    public function updateCctv(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'nama' => 'required|string|max:50',
            'url' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = Cctv::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->nama = $request->nama;
        $data->url = $request->url;


        $data->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $data], 200);
    }

    public function deleteCctv(Request $request)
    {
        $data = Cctv::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->delete();

        return response()->json(['message' => 'Data deleted successfully'], 200);
    }
}
