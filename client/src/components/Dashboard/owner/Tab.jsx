import { BiMenu } from "react-icons/bi";
import { useContext, useState } from "react";
import { authContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BASE_URL, token } from "../../../config";

const Tab = ({ data, tab, setTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    console.log("Delete Owner Account Handler");
    console.log(data._id);
    try {
      const response = await fetch(`${BASE_URL}/owners/${data._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Handle successful deletion here
        // Maybe dispatch a logout action?
        dispatch({ type: 'LOGOUT' });
        toast.success(result.message || 'Account deleted successfully');
      } else {
        throw new window.Error('Error deleting account');
      }
    } catch (error) {
      console.error("Error deleting account: ", error);
      toast.error(error.message || 'Error deleting account');
      // Handle error here
    }
  };

  return (
    <div>
      <span className='lg:hidden'>
        <BiMenu onClick={() => setIsOpen(!isOpen)} className="w-6 h-6 cursor-pointer" />
      </span>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md`}>
        <button
          onClick={() => setTab("overview")}
          className={`${tab === 'overview' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}>Overview</button>
        <button
          onClick={() => setTab("properties")}
          className={`${tab === 'properties' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}>Properties</button>
        <button
          onClick={() => setTab("settings")}
          className={`${tab === 'settings' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}>Profile</button>

        <div className="mt-[50px] md:mt-[100px]">
          <button onClick={handleLogout} className="w-full bg-[#181a1e] p-3 text-[16px] leading-7 rounded-md text-white">LogOut</button>
          <button onClick={handleDeleteAccount} className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">Delete account</button>
        </div>
      </div>
    </div>
  );
};

export default Tab;
