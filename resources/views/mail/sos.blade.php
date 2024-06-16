<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <h1>{{ $data['pesan'] }}</h1>

    <p>From {{ $data['user']->nama }} ({{ $data['user']->email }})</p>
    <p>Lokasi: {{ $data['location'] }}</p> <a href="http://maps.google.com?q={{ $data['location'] }}">Klik
        disini</a>
</body>

</html>
