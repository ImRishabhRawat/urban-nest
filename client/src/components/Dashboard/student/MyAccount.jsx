import { useContext, useState } from "react"
import Container from "../../Container"
import { authContext } from "../../../context/AuthContext"
import { BASE_URL, token } from "../../../config"
import toast from "react-hot-toast"
import useGetProfile from '../../../hooks/useFetchData'
import Error from "../../Error/Error"
import MyBookings from "../../MyBookings"
import Profile from "./Profile"
import Loading from "../../Loader/Loading"
import { useNavigate } from "react-router-dom"


const MyAccount = () => {
    const {dispatch} = useContext(authContext)
    const [tab, setTab] = useState('bookings')
    const navigate = useNavigate();

    const {
    data: userData,
    loading,
    error,
  } = useGetProfile(`${BASE_URL}/user/profile/me`)

  const handleLogout = () => { 
    dispatch({type:'LOGOUT'})
  }

  const handleDeleteAccount = async () => {
        console.log("Delete Account Handler");
        console.log(userData._id);
        try {
            const response = await fetch(`${BASE_URL}/user/${userData._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const result = await response.json();
                dispatch({ type: 'LOGOUT' });
                toast.success(result.message || 'Account deleted successfully');
                navigate("/");
            } else {
                throw new window.Error('Error deleting account');
            }
        } catch (error) {
            console.error("Error deleting account: ", error);
            toast.error(error.message || 'Error deleting account');
        }
    };
  return (
      <Container>
          <div className="max-w-[1170px] px-5 mx-auto">

      {loading && <Loading />}
      {error && !loading && <Error errMessage={error} />}

        {
          !loading && !error && (<div className="grid md:grid-cols-3 gap-10">
        <div className="pb-[50px] px-[30px] rounded-md">
          <div className="flex items-center justify-center ">
            <figure className="w-[100px] h-[100px] rounded-full  border-2 border-solid border-primaryColor overflow-hidden">
              <img src={userData.photo} alt="user image" className="w-full h-full object-cover" />
            </figure>
        </div>
          <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold ">{ userData.name }</h3>
                <p className="text-textColor text[15px] leading-6 font-medium">{ userData.email}</p>
            <p className="text-textColor text[15px] leading-6 font-medium">Blood Type:
                  <span className="ml-2 text-headingColor text-[22px] leading-8">{ userData.bloodType}</span>
            </p>
        </div>

          <div className="mt-[50px] md:mt-[100px]">
            <button onClick={handleLogout} className="w-full bg-[#181a1e] p-3 text-[16px] leading-7 rounded-md text-white">LogOut</button>
            <button onClick={handleDeleteAccount} className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">Delete account</button>
          </div>
        </div>

        <div className="md:col-span-2 md:px-[30px]">
          <div>
            <button onClick={() => { setTab('bookings') }}
              className={`${tab === 'bookings' && "bg-primaryColor text-white font-normal"} p-2 mr-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>
              My Bookings
            </button>
            <button onClick={() => { setTab('settings') }}
              className={`${tab === 'settings' && "bg-primaryColor text-white font-normal"} p-2 mr-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>
              Profile Setting
            </button>
          </div>
           {
            tab === 'bookings' && <MyBookings />
          }
          {
            tab === 'settings' && <Profile user={userData} />
          }
        </div>
      </div>)
      }
    </div>
    </Container>
  )
}

export default MyAccount
