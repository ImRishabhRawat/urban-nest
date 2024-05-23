import Container from '../Container';
import { TbBeach, TbMountain, TbPool, TbTrash } from 'react-icons/tb';
import { GiWindmill, GiModernCity, GiIsland, GiFarmTractor, GiBarn } from 'react-icons/gi';
import { MdOutlineVilla, MdApartment, MdHouse, MdHotel } from 'react-icons/md';
import { FaBuilding, FaTree, FaCampground } from 'react-icons/fa';
import { IoIosBed, IoIosBusiness } from 'react-icons/io';
import CategoryBox from './CategoryBox';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import qs from 'query-string';

export const categories = [
    {
        label: 'Single',
        icon: IoIosBed,
        description: 'This property is only for single students',
    },
    {
        label: 'Double',
        icon: IoIosBusiness,
        description: 'This property is for students with one roommate',
    },
    {
        label: 'Triple',
        icon: MdHouse,
        description: 'This property is for students with two roommates',
    },
    {
        label: 'Quad',
        icon: MdHotel,
        description: 'This property is for students with three roommates',
    },
    {
        label: 'Apartment',
        icon: MdApartment,
        description: 'This property is an apartment for students',
    },
    {
        label: 'Studio',
        icon: MdOutlineVilla,
        description: 'This property is a studio for students',
    },
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'This property is near the beach',
    },
    {
        label: 'Mountain',
        icon: TbMountain,
        description: 'This property is near the mountains',
    },
    {
        label: 'City',
        icon: GiModernCity,
        description: 'This property is in the city',
    },
    {
        label: 'Island',
        icon: GiIsland,
        description: 'This property is on an island',
    },
    {
        label: 'Countryside',
        icon: GiFarmTractor,
        description: 'This property is in the countryside',
    },
    {
        label: 'Farmhouse',
        icon: GiBarn,
        description: 'This property is a farmhouse',
    },
    {
        label: 'Treehouse',
        icon: FaTree,
        description: 'This property is a treehouse',
    },
    {
        label: 'Campground',
        icon: FaCampground,
        description: 'This property is a campground',
    },
    {
        label: 'Resort',
        icon: TbPool,
        description: 'This property is a resort',
    },
];

const Categories = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const handleCategoryClick = (category) => {
        setSelectedCategories((prevCategories) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter((c) => c !== category);
            } else {
                return [...prevCategories, category];
            }
        });
    };

    const handleRemoveAllFilters = () => {
        setSelectedCategories([]);
        navigate('/');
    };

    useEffect(() => {
        const params = qs.parse(location.search);
        if (selectedCategories.length > 0) {
            params.categories = selectedCategories.join('+');
        } else {
            delete params.categories;
        }

        const queryString = qs.stringify(params, { skipNull: true });
        navigate(`/?${queryString}`);
    }, [selectedCategories, navigate, location.search]);

    return (
        <div>
            <Container>
                <div className="pt-4 flex flex-row items-center">
                    <div className=" scroll flex flex-row items-center justify-between overflow-x-auto">
                        {categories.map((item) => (
                            <CategoryBox
                                key={item.label}
                                label={item.label}
                                description={item.description}
                                icon={item.icon}
                                onClick={() => handleCategoryClick(item.label)}
                                selected={selectedCategories.includes(item.label)}
                            />
                        ))}
            </div>
            <button
                        className="mb-4 p-3 bg-red-500 text-white rounded-full flex items-center justify-center"
                        onClick={handleRemoveAllFilters}
                    >
                        <TbTrash className="" size={20} />
                    </button>
                </div>
            </Container>
        </div>
    );
};

export default Categories;
