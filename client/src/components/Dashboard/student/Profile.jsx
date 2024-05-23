import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import uploadImageToCloudinary from '../../../utils/uploadCloudinary';
import { BASE_URL, token } from '../../../config';
import { toast } from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';

const Profile = ({ user }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photo: null,
        gender: '',
        phone: '',
        college: '',
        location: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            photo: user?.photo || '',
            gender: user?.gender || '',
            phone: user?.phone || '',
            college: user?.college || '',
            location: user?.location || ''
        });
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        const data = await uploadImageToCloudinary(file);
        setSelectedFile(data.url);
        setFormData({ ...formData, photo: data.url });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/user/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            // Check for non-JSON responses
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Server returned non-JSON response');
            }

            const { message } = await res.json();

            if (!res.ok) {
                throw new Error(message);
            }

            toast.success(message);
            navigate('/users/profile/me');
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mt-10'>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder='Full Name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer'
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="email"
                        placeholder='Enter Your Email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer'
                        readOnly
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="password"
                        placeholder='Enter Your Password'
                        name='password'
                        disabled
                        value={formData.password}
                        onChange={handleInputChange}
                        className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer'
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder='Phone Number'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer'
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder='College'
                        name='college'
                        value={formData.college}
                        onChange={handleInputChange}
                        className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer'
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder='Location'
                        name='location'
                        value={formData.location}
                        onChange={handleInputChange}
                        className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer'
                    />
                </div>
                <div className="mb-5 flex items-center justify-between">
                    <label className='text-headingColor font-bold text-[16px] leading-7'>
                        Gender:
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            id="gender"
                            className="text-textColor font-semibold text-[15px] leading-6 px-4 py-3 focus:outline-none"
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </label>
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
                        <label
                            htmlFor="customerFile"
                            className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'
                        >
                            {selectedFile ? selectedFile.name : 'Upload Photo'}
                        </label>
                    </div>
                </div>
                <div className="mt-7">
                    <button
                        disabled={loading}
                        type='submit'
                        className="w-full bg-primaryColor text-white text-[18px] rounded-lg px-4 py-3"
                    >
                        {loading ? <HashLoader size='35' color='#fff' /> : 'Update'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
