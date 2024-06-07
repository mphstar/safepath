import React from "react";
import AdminLayout from "../../Components/Templates/AdminLayout";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Dashboard = () => {
    return (
        <AdminLayout title="Dashboard" noPadding>
            <div className="w-full h-full">
                <MapContainer
                className="w-[100%] h-[100%]"
                    center={[-8.17458474693488, 113.70135789730354]}
                    zoom={13}
                    scrollWheelZoom={true}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
