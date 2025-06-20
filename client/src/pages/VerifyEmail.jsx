import { ShieldCheck } from "lucide-react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import OtpInput from "../components/OtpInput";

const VerifyEmail = () => {
  return (
    <main className="flex bg-black justify-center items-center min-h-screen ">
      {/* Card - starts */}
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg ">
        {/* Top row - starts */}
        <div className="flex justify-center mb-4 mt-2">
          <div className="flex justify-center bg-gray-500 p-4 rounded-full w-fit">
            <Mail color="white" size={32} />
          </div>
        </div>
        <div className=" font-bold text-2xl text-[#f2ebeb]">
          Verify your email
        </div>

        <div className="mb-4 mt-2">
          <p className="text-gray-400 ">
            We've sent a verification code to your email
          </p>
        </div>

        {/* Top row - ends */}
        {/* Input section - starts */}

        <div className="flex justify-center mb-2">
          <div className="mb-4 flex items-start flex-col">
            <div className="text-[#f2ebeb] mb-4">
              Please enter 6 digit verification code below
            </div>
            <OtpInput />
          </div>
        </div>

        <button className="cursor-pointer text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2">
          Verify Email
        </button>
        {/* Input section - ends */}

        {/* Bottom row - starts */}
        <p className="text-[#f2ebeb] mt-6 text-md ">
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
        {/* Bottom row - ends */}
      </div>
      {/* Card - ends */}
    </main>
  );
};

export default VerifyEmail;
