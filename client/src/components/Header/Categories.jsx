import Container from '../Container'
import {TbBeach} from 'react-icons/tb'
import { GiWindmill } from 'react-icons/gi'
import {MdOutlineVilla} from 'react-icons/md'
import CategoryBox from './CategoryBox'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const categories = [
    {
        label: 'Single',
        icon: TbBeach,
        description: 'This property is only for single students'
    },
    {
         label: 'Double',
        icon: GiWindmill,
        description: 'This property is for students with roommate'
    },
    {
         label: 'Flat',
        icon: MdOutlineVilla,
        description: 'This property is for students with roommate'
    },
    {
        label: 'n1',
        icon: TbBeach,
        description: 'This property is only for single students'
    },
    {
         label: 'n2',
        icon: GiWindmill,
        description: 'This property is for students with roommate'
    },
    {
         label: 'n3',
        icon: MdOutlineVilla,
        description: 'This property is for students with roommate'
    },
    {
        label: 'n4',
        icon: TbBeach,
        description: 'This property is only for single students'
    },
    {
         label: 'n5',
        icon: GiWindmill,
        description: 'This property is for students with roommate'
    },
    {
         label: 'n6',
        icon: MdOutlineVilla,
        description: 'This property is for students with roommate'
    },
]

const Categories = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

    const handleCategoryClick = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        // If the category is already selected, remove it from the array
        return prevCategories.filter((c) => c !== category);
      } else {
        // If the category is not selected, add it to the array
        return [...prevCategories, category];
        }
    });
  };

  const handleNavigate = () => {
    // Convert the array of selected categories to a string
    const categoriesString = selectedCategories.join('+');
    // Navigate to the new URL with the selected categories as a query parameter
    navigate(`/rooms?categories=${categoriesString}`);
  };
  return (
    <div>
          <Container>
              <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
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
      </Container>
    </div>
  )
}

export default Categories
