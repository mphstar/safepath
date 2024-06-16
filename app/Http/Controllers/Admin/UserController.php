<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactPreference;
use App\Models\User;
use App\Models\UserPreference;
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

    public function registerUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:50',
            'email' => 'required|max:50|email|unique:users,email',
            'password' => 'required',
            'nohp' => 'required|max:13',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = new User;
        $data->nama = $request->nama;
        $data->email = $request->email;
        $data->password = bcrypt($request->password);
        $data->role = 'user';
        $data->nohp = $request->nohp;

        $data->save();

        $userPreference = UserPreference::create([
            'user_id' => $data->id,
            'pesan' => "Tolong aku...!!?",
        ]);

        $contactPreference = ContactPreference::create([
            'user_preference_id' => $userPreference->id,
            'nama' => "Polisi",
            'email' => "naisyuu21@gmail.com",
            'status' => 1,
        ]);

        // Berikan respon dengan data yang berhasil dibuat
        return response()->json(['message' => 'Data created successfully', 'data' => $data], 201);
    }

    public function loginUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|max:50|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email or Password is incorrect'], 400);
        }

        if (!password_verify($request->password, $user->password)) {
            return response()->json(['message' => 'Email or Password is incorrect'], 400);
        }

        return response()->json(['message' => 'Login success', 'data' => $user], 200);
    }
}
