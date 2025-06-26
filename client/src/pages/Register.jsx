import { Eye, Lock, Mail, Upload, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useRegisterUserMutation } from "../features/auth/authApi";

const Register = () => {
  // 00. Way to show uploaded Avatar-Image.
  const [preview, setPreview] = useState(null);

  // 01. Setting up react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // 02a. Form submission handler
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      if (data.avatarFile && data.avatarFile[0]) {
        formData.append("avatarFile", data.avatarFile[0]);
      }
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const userData = await registerUser(formData).unwrap();
      console.log("User registered:", userData);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  // 02b. Watch the avatar field to update preview
  const fileWatch = watch("avatarFile");

  useEffect(() => {
    if (fileWatch && fileWatch[0]) {
      const imageUrl = URL.createObjectURL(fileWatch[0]);
      setPreview(imageUrl);
    }
  }, [fileWatch]);

  // 03. RTK POST Query to register user.
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  return (
    <main className="flex bg-black justify-center items-center min-h-screen ">
      {/* Card - starts */}
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg ">
        {/* Top row - starts */}
        <div className=" font-bold text-2xl text-[#f2ebeb]">Create account</div>
        <p className="text-gray-400">
          Sign up to get started with your account
        </p>
        <div className="relative p-4 flex justify-center">
          <label className="cursor-pointer" htmlFor="avatar-upload">
            {preview ? (
              <img
                src={preview}
                alt="Uploaded Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="rounded-full bg-gray-600 w-fit p-8">
                <User size={32} color="white" />
              </div>
            )}
          </label>

          <div className="absolute top-24 left-60 bg-gray-600 rounded-full p-2">
            <Upload color="white" size={"12"} />
          </div>
        </div>
        {/* Top row - ends */}

        {/* Input section - starts */}
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("avatarFile")}
          />
          <Input
            label="Full Name"
            Placeholder="Enter your full name"
            Icon={User}
            {...register("fullName")}
          />
          <Input
            label="Username"
            Placeholder="Enter desired username"
            Icon={User}
            {...register("username")}
          />
          <Input
            label="Email"
            Placeholder="Enter your email"
            Icon={Mail}
            {...register("email")}
          />
          <Input
            label="Password"
            Placeholder="Create a password"
            Icon={Lock}
            Icon2={Eye}
            {...register("password")}
          />
          <Input
            label="Confirm Password"
            Placeholder="Confirm your password"
            Icon={Lock}
            Icon2={Eye}
            {...register("confirmPassword")}
          />
          <button
            className="text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2 cursor-pointer"
            type="submit"
          >
            Create account
          </button>
        </form>
        {/* Input section - ends */}

        {/* Bottom row - starts */}
        <p className="text-[#f2ebeb] mt-4 text-md ">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:text-white" to={"/login"}>
            Log in
          </Link>
        </p>
        {/* Bottom row - ends */}
      </div>
      {/* Card - ends */}
    </main>
  );
};

export default Register;
