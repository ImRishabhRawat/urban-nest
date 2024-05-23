import ListingDetail from "../pages/ListingDetail";
import Home from "../pages/Home";
import { Routes, Route } from "react-router-dom";
import Reservation from "../pages/Reservation";
import Favorites from "../pages/Favorites";
import Property from "../pages/Property";
import ProtectedRoute from "./ProtectedRoute";
import OwnerRoomDetails from "../pages/OwnerRoomDetails";
import OAuthSuccess from "../components/OAuthSuccess";
import MyAccount from "../components/Dashboard/student/MyAccount";
import Dashboard from "../components/Dashboard/owner/Dashboard";


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="/listings/:listingId" element={<ListingDetail />} />
      <Route
        path="/booking"
        element={
          <ProtectedRoute roles={['student']}>
            <Reservation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute roles={['student']}>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <ProtectedRoute roles={['owner']}>
            <Property />
          </ProtectedRoute>
        }
      />
       <Route path="/owner/room/:roomId" element={
          <ProtectedRoute roles={['owner']}>
            <OwnerRoomDetails />
          </ProtectedRoute>
        } />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route
        path="/users/profile/me"
        element={
          <ProtectedRoute roles={['student']}>
            <MyAccount />
          </ProtectedRoute>
        }
      />
      <Route path="/owner/profile/me" element={
          <ProtectedRoute roles={['owner']}>
            <Dashboard />
          </ProtectedRoute>
        } />
    </Routes>
  );
};

export default Routers;
