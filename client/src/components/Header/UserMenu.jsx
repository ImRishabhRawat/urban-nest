import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import { useCallback, useContext, useState } from 'react';
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
    const [isOpen, setIsOpen] = useState(false);
    const { user, dispatch, role } = useContext(authContext);

    const navigate = useNavigate();

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setIsOpen(!isOpen);
        window.location.reload();
    }

    const onRent = useCallback(() => {
        if (!user) {
            return loginModal.onOpen();
        }
        rentModal.onOpen();
    }, [user, loginModal, rentModal]);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                {role === "owner" && (
                    <div
                        onClick={onRent}
                        className="hidden md:block font-normal py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                        List your home
                    </div>
                )}
                {role === "student" && (
                    <div
                        onClick={() => navigate('/booking')}
                        className="hidden md:block font-normal py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                        My booking
                    </div>
                )}
                {user === null && (
                    <div
                        onClick={loginModal.onOpen}
                        className="hidden md:block font-normal py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                        Login
                    </div>
                )}
                <div
                    onClick={toggleOpen}
                    className="px-4 py-3 md:py-2 md:px-3 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    <AiOutlineMenu />
                    <Avatar userImg={user?.photo} />
                </div>
            </div>
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[35vw] md:w-3/4 bg-white overflow-hidden right-0 top-[100%] text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {user ? (
                            <>
                                {role === "student" ? (
                                    <MenuItem
                                        onClick={() => navigate("/users/profile/me")}
                                        label="Profile"
                                    />
                                ) : (
                                    <MenuItem
                                        onClick={() => navigate("/owner/profile/me")}
                                        label="Profile"
                                    />
                                )}
                                {role === "student" && <MenuItem
                                    onClick={() => navigate('/booking')}
                                    label="My booking"
                                />}
                                {role === "student" && <MenuItem
                                    onClick={() => navigate('/favorites')}
                                    label="My favorites"
                                />}
                                {role === "owner" && <MenuItem
                                    onClick={() => navigate('/properties')}
                                    label="My properties"
                                />}
                                {role === "owner" && <MenuItem
                                    onClick={onRent}
                                    label="Rent your home"
                                />}
                                <hr />
                                <MenuItem
                                    onClick={handleLogout}
                                    label="Logout"
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={loginModal.onOpen} label={"Login"} />
                                <MenuItem onClick={registerModal.onOpen} label={"Sign up"} />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
