<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SosMail;
use App\Models\Polsek;
use App\Models\Sos;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Spatie\Geocoder\Geocoder;

class SosController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sos');
    }

    public function getData(Request $request)
    {

        $data = Sos::with(['user'])->orderBy('created_at', 'DESC');

        if ($request->has('search')) {
            // $data->where('keterangan', 'like', '%' . $request->search . '%');
            $data->whereHas('user', function ($query) use ($request) {
                $query->where('nama', 'like', '%' . $request->search . '%');
            });
        }

        $data = $data->paginate(10);


        return response()->json([
            'status' => 'success',
            'result' => $data,
        ], 200);
    }

    public function sendSos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'location' => 'required',
            'kecamatan' => 'required',
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

        // split koordinate to latitude and longitude
        $koordinate = explode(",", $request->location);
        $latitude = $koordinate[0];
        $longitude = $koordinate[1];

        $detailLokasi = "-";
        try {
            //code...
            $client = new Client();
            $response = $client->request('GET', 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' . $latitude . '&lon=' . $longitude);
            $result = json_decode($response->getBody(), true);

            $detailLokasi = $result['display_name'];
        } catch (\Throwable $th) {
            //throw $th;
        }

        $sos = Sos::create([
            'user_id' => $request->user_id,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'detail_lokasi' => $detailLokasi,
        ]);

        $polsek = Polsek::where('nama_kecamatan', 'LIKE', '%' . $request->kecamatan . '%')->first();

        foreach ($data["user"]->userPreference->contactPreference as $index => $contact) {
            // kirim email ke contact
            if ($contact->status == 1) {
                if ($index == 0) {
                    if ($polsek) {
                        Mail::to($polsek->kontak)->send(new SosMail($data));
                    } else {
                        Mail::to($contact->email)->send(new SosMail($data));
                    }
                } else {
                    Mail::to($contact->email)->send(new SosMail($data));
                }
            }
        }

        return response()->json(['message' => 'SOS sent successfully'], 200);
    }
}
