import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import useRegisterModal from "../../hooks/useRegisterModal";
import Modals from "./Modals";
import Heading from "../Heading";
import Input from "../input/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import { BASE_URL } from "../../config";
import useLoginModal from "../../hooks/useLoginModal";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";

const LoginModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(authContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const googleAuth = () => {
    window.open(`${BASE_URL}/Oauth/google/callback`, "_self");
  };
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, data);
      const { message } = res.data;

      if (res.status !== 200) {
        throw new Error(message);
      }
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: res.data.data,
          token: res.data.token,
          role: res.data.role,
        },
      });
      toast.success(message);
      loginModal.onClose();
      navigate("/");
    } catch (error) {
      error.message;
      toast.error("Invalid Credentials" );
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className=" flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="login to your account" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        registerOptions={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email address",
          },
        }}
      />
      <Input
        id="password"
        label="password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
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
      <Button
        outline
        label="Continue with GitHub"
        icon={<AiFillGithub />}
        onClick={() => {}}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>Don't have any account?</div>
          <div
            onClick={() => {
              loginModal.onClose();
              registerModal.onOpen();
            }}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Sign up
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modals
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
