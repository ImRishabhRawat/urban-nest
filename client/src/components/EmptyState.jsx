import React from 'react'
import Heading from './Heading'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

const EmptyState = ({title="No exact matches" , subtitle="Try changing and removing some of your filters", showReset}) => {
    const navigate = useNavigate();
    return (

    <div className='h-[60vh] flex flex-col gap-2 justify-center items-center'>
            <Heading
                center 
                title={title}
                subtitle={subtitle}
            />
            <div className="w-48 mt-4">
                {showReset && (
                    <Button
                        outline
                        label="Remove all filters"
                        onClick={() => navigate("/") }
                    />
                )}
            </div>
    </div>
  )
}

export default EmptyState
