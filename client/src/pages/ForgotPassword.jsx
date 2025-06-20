import { ArrowLeft } from "lucide-react";
import { Eye, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

const ForgotPassword = () => {
  return (
    <main className="flex bg-black justify-center items-center min-h-screen ">
      {/* Card - starts */}
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg ">
        {/* Top row - starts */}
        <div className=" font-bold text-2xl text-[#f2ebeb]">
          Forgot password?
        </div>

        <div className="mb-4 mt-2">
          <p className="text-gray-400 ">
            Enter you email and we'll send you a link to reset your password
          </p>
        </div>

        {/* Top row - ends */}
        {/* Input section - starts */}

        <Input
          label="Email"
          Placeholder="Enter your email address"
          Icon={Mail}
        />

        <button className="cursor-pointer text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2">
          Send reset link
        </button>
        {/* Input section - ends */}

        {/* Bottom row - starts */}
        <Link to="/" className="cursor-pointer mt-4 p-2 w-full rounded-lg hover:bg-gray-500/20 text-gray-400 flex gap-x-4 justify-center">
          <ArrowLeft /> Back to login
        </Link>
        {/* Bottom row - ends */}
      </div>
      {/* Card - ends */}
    </main>
  );
};

export default ForgotPassword;
