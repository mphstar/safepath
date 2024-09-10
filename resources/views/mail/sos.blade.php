<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesan Darurat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            overflow: hidden;
        }

        .header {
            background-color: #f8e7b9;
            padding: 40px;
            text-align: left;
            position: relative;
        }

        .header:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Icon-round-Question_mark.svg/600px-Icon-round-Question_mark.svg.png') no-repeat top left;
            background-size: 150px 150px;
            opacity: 0.1;
        }

        .content {
            padding: 20px;
            text-align: start;
        }

        .content h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .content p {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .content .location {
            font-weight: bold;
            margin-bottom: 20px;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #f1c40f;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #777;
        }

        .footer img {
            width: 40px;
            height: 40px;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Pesan Darurat</h1>
        </div>
        <div class="content">
            <p><strong>“{{ $data['pesan'] }}”</strong></p>
            <p>Dari {{ $data['user']->nama }}</p>
            <p>Email: {{ $data['user']->email }}</p>
            <p class="location">Lokasi Akurat: {{ $data['detail_lokasi'] }}</p>
            <a href="http://maps.google.com?q={{ $data['location'] }}" class="button">Kunjungi Lokasi</a>
        </div>
        <div class="footer">
            <p>from</p>
            <img src="{{ asset('assets/images/safepath.png') }}" alt="Safe Path">
            <p>© Copyright. Safe Path. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
