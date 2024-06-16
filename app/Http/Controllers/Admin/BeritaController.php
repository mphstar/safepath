<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

use Intervention\Image\Facades\Image;

class BeritaController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Berita');
    }

    public function getData(Request $request)
    {

        $data = Berita::orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('judul', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate($request->limit ?? 10)
        ], 200);
    }

    public function storeBerita(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required',
            'deskripsi' => 'required',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'penulis' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new Berita;

        $image = $request->file('gambar');

        $image_name = time() . '.' . $image->getClientOriginalExtension();

        $path = public_path('uploads/berita/') . "/" . $image_name;

        Image::make($image->getRealPath())->resize(700, null, function ($constraint) {
            $constraint->aspectRatio();
        })->save($path);

        $data->judul = $request->judul;
        $data->deskripsi = $request->deskripsi;
        $data->gambar = $image_name;
        $data->penulis = $request->penulis;

        $data->save();

        // Berikan respon dengan data yang berhasil dibuat
        return response()->json(['message' => 'Data created successfully', 'data' => $data], 201);
    }

    public function updateBerita(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'judul' => 'required',
            'deskripsi' => 'required',
            'penulis' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }



        $data = Berita::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        // check validasi jika ada gambar
        if ($request->hasFile('gambar')) {
            $validator = Validator::make($request->all(), [
                'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
            }

            // hapus gambar lama
            $image_path = public_path('uploads/berita/') . "/" . $data->gambar;
            if (file_exists($image_path)) {
                unlink($image_path);
            }

            $image = $request->file('gambar');

            $image_name = time() . '.' . $image->getClientOriginalExtension();

            $path = public_path('uploads/berita/') . "/" . $image_name;

            Image::make($image->getRealPath())->resize(700, null, function ($constraint) {
                $constraint->aspectRatio();
            })->save($path);

            $data->gambar = $image_name;
        }

        $data->judul = $request->judul;
        $data->deskripsi = $request->deskripsi;
        $data->penulis = $request->penulis;

        $data->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $data], 200);
    }

    public function deleteBerita(Request $request)
    {
        $data = Berita::find($request->id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $image_path = public_path('uploads/berita/') . "/" . $data->gambar;
        if (file_exists($image_path)) {
            unlink($image_path);
        }


        $data->delete();

        return response()->json(['message' => 'Data deleted successfully'], 200);
    }
}
