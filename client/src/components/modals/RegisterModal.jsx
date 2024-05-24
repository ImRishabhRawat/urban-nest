import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import useRegisterModal from '../../hooks/useRegisterModal';
import Modals from './Modals';
import Heading from '../Heading';
import Input from '../input/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import { BASE_URL } from '../../config';
import useLoginModal from '../../hooks/useLoginModal';

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();

    const [isLoading, setIsLoading] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: '',
        }
    });

    const googleAuth = () => {
        window.open(
            `${BASE_URL}/Oauth/google`,
            "_self"
        );
    };

    const githubAuth = () => {
        window.open(
            `${BASE_URL}/github`,
            "_self"
        );
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, data);
            const { message } = res.data;

            if (res.status !== 200) {
                throw new Error(message);
            }
            toast.success(message);
            registerModal.onClose();
            loginModal.onOpen();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong ");
        } finally {
            setIsLoading(false);
        }
    };

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome to UrbaNest"
                subtitle="Create an account"
            />
            <Input
                id="email"
                label="Email"
                type='email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                registerOptions={{
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email address"
                    }
                }}
            />
            <Input
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                type='password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="role"
                label="Role"
                type='select'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                options={['student', 'owner']}
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                label="Continue with Google"
                icon={<FcGoogle />}
                onClick={googleAuth}
            />
            {/* <Button
                outline
                label="Continue with GitHub"
                icon={<AiFillGithub />}
                onClick={githubAuth}
            /> */}
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>
                        Already have an account?
                    </div>
                    <div
                        onClick={() => {
                            registerModal.onClose();
                            loginModal.onOpen();
                        }}
                        className='text-neutral-800 cursor-pointer hover:underline'>
                        Log in
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modals
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default RegisterModal;
