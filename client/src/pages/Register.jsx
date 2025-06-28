// Updated Register.jsx with cropping feature
import { Eye, Lock, Mail, Upload, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useRegisterUserMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";
import ImageCropper from "../components/ImageCropper"; // 🆕

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (croppedFile) formData.append("avatarFile", croppedFile);

      const userData = await useRegisterUserMutation(formData).unwrap();

      dispatch(
        userLoggedIn({
          user: userData.data,
          accessToken: userData.meta?.accessToken,
        })
      );

      navigate("/verify-email");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setRawImage(imageUrl);
      setShowCropper(true);
    }
  };

  const handleCropComplete = ({ blob, fileUrl }) => {
    setPreview(fileUrl);
    setCroppedFile(new File([blob], "avatar.jpg", { type: blob.type }));
    setShowCropper(false);
  };

  return (
    <main className="flex bg-black justify-center items-center min-h-screen">
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg">
        <div className="font-bold text-2xl text-[#f2ebeb]">Create account</div>
        <p className="text-gray-400">
          Sign up to get started with your account
        </p>

        <div className="relative p-4 flex justify-center">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
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
          <button
            className="text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2"
            type="submit"
          >
            Create account
          </button>
        </form>

        <p className="text-[#f2ebeb] mt-4 text-md">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:text-white" to="/login">
            Log in
          </Link>
        </p>
      </div>

      {showCropper && rawImage && (
        <ImageCropper
          image={rawImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </main>
  );
};

export default Register;

// A way to extract image url to store it in a preview variable without React-hook-form.

// import { useState } from "react";

// const Register = () => {
//   const [avatarFile, setAvatarFile] = useState(null);   // Holds the actual file
//   const [preview, setPreview] = useState(null);         // Holds the image URL

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatarFile(file);                         // Save the file for upload
//       setPreview(URL.createObjectURL(file));       // Create local preview URL
//     }
//   };

//   return (
//     <div>
//       <label htmlFor="avatar-upload" className="cursor-pointer">
//         {preview ? (
//           <img
//             src={preview}
//             alt="Avatar Preview"
//             className="w-24 h-24 rounded-full object-cover"
//           />
//         ) : (
//           <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center text-white">
//             Upload
//           </div>
//         )}
//       </label>

//       <input
//         id="avatar-upload"
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={handleFileChange} // ✅ This is what extracts the local file
//       />
//     </div>
//   );
// };
