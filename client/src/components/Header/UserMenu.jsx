import {AiOutlineMenu} from 'react-icons/ai'
import Avatar from '../Avatar'
import { useCallback, useContext, useState } from 'react'
import MenuItem from './MenuItem';
import useRegisterModal from '../../hooks/useRegisterModal';
import useLoginModal from '../../hooks/useLoginModal';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useRentModal from '../../hooks/useRentModal';

const UserMenu = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const [isOpen, setisOpen] = useState(false);
    const { user, dispatch } = useContext(authContext);
    const navigate = useNavigate();


    const toggleOpen = () => {
        setisOpen(!isOpen);
    }
    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setisOpen(!isOpen);
    }

    const onRent = useCallback(() => {
        if (!user) {
            return loginModal.onOpen();
        }
        rentModal.onOpen();
    },[user, loginModal, rentModal])
    
  return (
    <div className="relative">
          <div className="flex flex-row items-center gap-3">
              <div
                  onClick={onRent}
                  className="hidden md:block font-normal py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                  Airbnb your home
              </div>
              <div
                  onClick={toggleOpen}
                  className="px-4 py-3 md:py-2 md:px-3 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                  <AiOutlineMenu />
              <div className=" ">
                      <Avatar userImg={user?.photo} />
              </div>
              </div>
      </div>
          {isOpen && (
              <div className="absolute rounded-xl shadow-md w-[35vw] md:w-3/4 bg-white overflow-hidden right-0 top-[100%] text-sm">
                  <div className="flex flex-col cursor-pointer">
                      {user ? (
                          <>
                              <MenuItem
                                  onClick={() => { }}
                                  label="Profile"
                              />
                              <MenuItem
                                  onClick={() => { }}
                                  label="My booking"
                              />
                              <MenuItem
                                  onClick={() => { }}
                                  label="My favorites"
                              />
                               <MenuItem
                                  onClick={onRent}
                                  label="Rent your home"
                              />
                              <hr />
                              <MenuItem
                                  onClick={handleLogout}
                                  label="Logout"
                              />
                          </>
                      ): (   
                      <>
                          {/* <Link to="/register"> */}
                          <MenuItem onClick={loginModal.onOpen} label={"login"} />
                          {/* </Link> */}
                          {/* <Link to="/login"> */}
                              <MenuItem onClick={registerModal.onOpen} label={"Sign up"} />
                              {/* </Link> */}

                      </>
                      )
                          
                    }
                  </div>
              </div>
      )}
    </div>
  )
}

export default UserMenu
