import { useEffect, useState } from "react";
import { AiOutlineDelete } from 'react-icons/ai';
import uploadImageToCloudinary from '../../../utils/uploadCloudinary';
import { BASE_URL, token } from '../../../config';
import { toast } from 'react-toastify';
import HashLoader from "react-spinners/HashLoader";

const Profile = ({ ownerData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        photo: null,
    });

    useEffect(() => {
        setFormData({
            name: ownerData?.name || '',
            email: ownerData?.email || '',
            phone: ownerData?.phone || '',
            gender: ownerData?.gender || '',
            photo: ownerData?.photo || '',
        });
    }, [ownerData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        const data = await uploadImageToCloudinary(file);
        setFormData({ ...formData, photo: data.url });
    };

    const updateProfileHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/owners/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            toast.success(result.message);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        }
    };

    return (
        <div>
            <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">Profile Information</h2>
            <form onSubmit={updateProfileHandler}>
                <div className="mb-5">
                    <p className="form_label">Name*</p>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="form_input"
                    />
                </div>
                <div className="mb-5">
                    <p className="form_label">Email*</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="email@domain.com"
                        className="form_input"
                        readOnly
                        disabled
                    />
                </div>
                <div className="mb-5">
                    <p className="form_label">Phone*</p>
                    <input
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="form_input"
                    />
                </div>
                <div className="mb-5">
                    <p className="form_label">Gender*</p>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="form_input py-3.5"
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="mb-5 flex items-center gap-3">
                    {formData.photo && (
                        <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center overflow-hidden">
                            <img src={formData.photo} alt="" className='w-full h-full object-cover' />
                        </figure>
                    )}
                    <div className='relative w-[130px] h-[50px]'>
                        <input
                            type="file"
                            name='photo'
                            id='customerFile'
                            onChange={handleFileInputChange}
                            accept='.jpg, .png'
                            className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                        />
                        <label htmlFor="customerFile" className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'>
                            Upload Photo
                        </label>
                    </div>
                </div>
                <div className="mt-7">
                    <button type="submit" className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg">
                        {loading ? <HashLoader /> : 'Update Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
