import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow
})

const Map = ({ center }) => {
  return (
    <div>
          <MapContainer
              center={center || [20.5937, 78.9629]}
              zoom={center ? 4 : 2}
              scrollWheelZoom={false}
              className='h-[35vh] rounded-lg'
          >
          <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />    
              {
                  center && (
                      <Marker position={center} />
                  )
              }
      </MapContainer>
    </div>
  )
}

export default Map
