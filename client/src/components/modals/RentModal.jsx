import { useMemo, useState } from 'react';
import useRentModal from '../../hooks/useRentModal';
import Modals from './Modals'
import Heading from '../Heading';
import { categories } from '../Header/Categories';
import CategoryInput from '../input/CategoryInput';
import { useForm } from 'react-hook-form';
import StateSelect from '../input/StateSelect';
// import CountrySelect from '../input/CountrySelect';
import Map from '../Map';
import Counter from '../input/Counter';
import ImageUpload from '../input/ImageUpload';
import Input from '../input/Input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config';
import toast from 'react-hot-toast';
import CitySelect from '../input/CitySelect';


const STEPS = {
    CATEGORY : 0,
    LOCATION: 1,
    INFO: 2,
    IMAGES: 3,
    DESCRIPTION: 4,
    PRICE: 5,
}

const RentModal = () => {
    const rentModal = useRentModal();
    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm({
            defaultValues: {
            category: '',
            location: {
                state: '',
                city:'',
            },
            studentCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            images: '',
            price: 1,
            title: '',
            description: '',
                
        }
    })

    const category = watch('category');
    const {state, city} = watch('location');    
    //  const state = watch('state');
//   const city = watch('city');
    const studentCount = watch('studentCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const images = watch('images');


    const setCustomValue = (id, value) => { 
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }
    const onBack = () => { 
        setStep((value)=>value-1)
    }
    const onNext = () => { 
        setStep((value)=>value+1)
    }

    const onSubmit = async (data) => {
        const token = localStorage.getItem('token');
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);
        try {
    const response = await axios.post(`${BASE_URL}/room`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // replace 'token' with your actual token
      },
    });

    if (response.status === 200) {
      toast.success('Listing Created');
      reset();
      setStep(STEPS.CATEGORY);
        rentModal.onClose();
        window.location.reload(); 
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {
    toast.error('Something went wrong');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
    }


    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create'
        }
        return 'Next';
    }, [step]);

    const secondaryLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return 'Back'
     },[step])


    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <div className="scroll grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[45vh] overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) => {setCustomValue('category', category) }}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
        
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8 overflow-visible">
                <Heading
                    title="Where is your place located?"
                    subtitle="help students find you"
                />
               
                {/* <StateSelect
                    value={location}
                onChange={(value)=> setCustomValue('location', value)}
                /> */}
                 <StateSelect
          value={location.state}
          onChange={(value)=> setCustomValue('location. state', value)}
        />
        <CitySelect
          stateValue={state}
                    cityValue={city}
          onCityChange={(value)=> setCustomValue('location.city', value)}
                />
                <Map
          center={city?.latlng || state?.latlng}
        />

                {/* <Map
                center={location?.latlng}
                /> */}
            </div>
        )
    }
    
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place"
                    subtitle="What amenities do you have?"
                />
                <Counter
                title="Students"
                    subtitle="how many students do you allow?"
                    value={studentCount}
                    onChange={(value)=> setCustomValue('studentCount', value)}
                />
                <hr />
                <Counter
                title="Rooms"
                    subtitle="how many rooms do you have?"
                    value={roomCount}
                    onChange={(value)=> setCustomValue('roomCount', value)}
                />
                <hr />

                <Counter
                title="Bathroom"
                    subtitle="how many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value)=> setCustomValue('bathroomCount', value)}
                />
                
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Add a photo of your place"
                    subtitle= "Show students what your place looks like!"
                />
                <ImageUpload value={images} onChange={(value) => setCustomValue('images', value)}/>
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you describe your place?"
                    subtitle= "Short and sweet works best."
                />
                <Input
                    id='title'
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                    registerOptions={{ required: 'This field is required' }}
                />
                <hr />
                 <Input
                    id='description'
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                    registerOptions={{ required: 'This field is required' }}
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Now set your price"
                    subtitle= "How much do you charge per month?"
                />
                <Input
                    id='price'
                    label="Price"
                    formatPrice
                    type='number'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }


    return (
        <Modals
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryLabel={secondaryLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="List your home"
            body={bodyContent}
        />
  )
}

export default RentModal
