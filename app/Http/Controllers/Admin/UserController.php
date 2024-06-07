<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/User');
    }

    public function getData(Request $request)
    {

        $data = User::orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            $data->where('nama', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 'success',
            'result' => $data->paginate(10)
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:50',
            'email' => 'required|max:50|email|unique:users,email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new User;
        $data->nama = $request->nama;
        $data->email = $request->email;
        $data->password = bcrypt($request->password);
        $data->role = 'admin';

        $data->save();

        // Berikan respon dengan data yang berhasil dibuat
        return response()->json(['message' => 'Data created successfully', 'data' => $data], 201);
    }

    public function updateUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'nama' => 'required|string|max:50',
            'email' => 'required|max:50|email|unique:users,email, ' . $request->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $user = User::find($request->id);

        if (!$user) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $user->nama = $request->nama;
        $user->email = $request->email;
        if ($request->has('password') && $request->password !== "" && $request->password !== null) {
            $request['password'] = bcrypt($request->password);
            $user->password = $request->password;
        }

        $user->save();

        return response()->json(['message' => 'Data updated successfully', 'data' => $user], 200);
    }

    public function deleteUser(Request $request)
    {
        $user = User::find($request->id);

        if (!$user) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Data deleted successfully'], 200);
    }
}