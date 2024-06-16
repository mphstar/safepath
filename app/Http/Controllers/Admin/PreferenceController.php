<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactPreference;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PreferenceController extends Controller
{
    public function getData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = UserPreference::with(['contactPreference'])->where('user_id', $request->user_id)->first();

        return response()->json([
            'status' => 'success',
            'result' => $data
        ], 200);
    }

    public function updateData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'pesan' => 'required',
            'contact' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $data = UserPreference::where('user_id', $request->user_id)->first();
        $data->pesan = $request->pesan;

        $data->save();

        ContactPreference::where('user_preference_id', $data->id)->delete();

        foreach ($request->contact as $contact) {
            $contactPreference = new ContactPreference;
            $contactPreference->user_preference_id = $data->id;
            $contactPreference->nama = $contact['nama'];
            $contactPreference->email = $contact['email'];
            $contactPreference->status = $contact['status'];
            $contactPreference->save();
        }

        return response()->json(['message' => 'Data updated successfully', 'data' => $data], 200);
    }
}
