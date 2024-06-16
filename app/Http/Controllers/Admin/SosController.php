<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SosMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class SosController extends Controller
{
    public function sendSos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'location' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()->first()], 400);
        }

        $user = User::with(['userPreference.contactPreference'])->where('id', $request->user_id)->first();

        $data = [
            'user' => $user,
            'location' => $request->location,
            'pesan' => $user->userPreference->pesan,
        ];

        foreach ($data["user"]->userPreference->contactPreference as $contact) {
            // kirim email ke contact
            if ($contact->status == 1) {
                Mail::to($contact->email)->send(new SosMail($data));
            }
        }

        return response()->json(['message' => 'SOS sent successfully'], 200);
    }
}
