import { useState, useEffect } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "../components/OtpInput";
import Input from "../components/Input";
import { useVerifyEmailMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(new Array(6).fill("")); // OTP array
  const [email, setEmail] = useState(""); // Email entered by user

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. RTK Mutation hook
  const [
    verifyEmail,
    {
      data: verifiedUserData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useVerifyEmailMutation();

  // 2. Submit OTP + Email to backend
  const handleVerifyEmail = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6 || !email.trim()) {
      alert("Please enter a valid 6-digit OTP and your email.");
      return;
    }

    const formData = new FormData();
    formData.append("userEmail", email);
    formData.append("emailVerifyToken", otpCode);

    await verifyEmail(formData); // triggers onQueryStarted internally
  };

  // 3. Dispatch after successful verification
  useEffect(() => {
    if (verifiedUserData?.success) {
      dispatch(
        userLoggedIn({
          user: verifiedUserData?.data,
          accessToken: verifiedUserData?.meta?.accessToken,
        })
      );
      navigate("/"); // or wherever you want to go after login
    }
  }, [verifiedUserData, dispatch, navigate]);

  return (
    <main className="flex bg-black justify-center items-center min-h-screen ">
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg ">
        {/* Envelope Icon */}
        <div className="flex justify-center mb-4 mt-2">
          <div className="flex justify-center bg-gray-500 p-4 rounded-full w-fit">
            <Mail color="white" size={32} />
          </div>
        </div>

        <div className="font-bold text-2xl text-[#f2ebeb]">
          Verify your email
        </div>

        <div className="mb-4 mt-2">
          <p className="text-gray-400">
            We've sent a verification code to your email
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center mb-2">
          <div className="mb-4 flex items-start flex-col">
            <div className="text-[#f2ebeb] mb-4">
              Please enter 6 digit verification code below
            </div>
            <OtpInput otp={otp} setOtp={setOtp} />
          </div>
        </div>

        {/* Email Input */}
        <Input
          Placeholder="Enter your email"
          Icon={Mail}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleVerifyEmail}
          disabled={registerIsLoading}
          className="cursor-pointer text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2"
        >
          {registerIsLoading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Resend + Back links */}
        <p className="text-[#f2ebeb] mt-6 text-md">
          Didn't receive the code?{" "}
          <Link className="text-blue-400 hover:text-white" to={"/"}>
            Resend email
          </Link>
        </p>

        <Link
          to="/"
          className="cursor-pointer mt-2 p-2 w-full rounded-lg hover:bg-gray-500/20 text-gray-400 flex gap-x-4 justify-center"
        >
          <ArrowLeft /> Back to login
        </Link>
      </div>
    </main>
  );
};

export default VerifyEmail;
