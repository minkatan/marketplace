import { MapContainer, TileLayer, Marker } from "react-leaflet";

const Map = ({lat, lng}) => {
  return (
    <>
      <MapContainer 
      center={[lat, lng]} 
      zoom={13} 
      scrollWheelZoom={false} 
      className='h-full w-full inline-block'>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        <Marker position={[lat, lng]}>
        </Marker>
      </MapContainer>
    </>
  );
}

export default Map