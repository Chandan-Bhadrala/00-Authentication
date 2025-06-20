import { Upload, User, Mail, Lock, Eye } from "lucide-react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
const Signup = () => {
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
          <div className="rounded-full bg-gray-600 w-fit p-8">
            <User size={32} color="white" />
          </div>
          <div className="absolute top-24 left-60 bg-gray-600 rounded-full p-2">
            <Upload color="white" size={"12"} />
          </div>
        </div>
        {/* Top row - ends */}
        {/* Input section - starts */}
        <Input
          label="Full Name"
          Placeholder="Enter your full name"
          Icon={User}
        />
        <Input
          label="Username"
          Placeholder="Enter desired username"
          Icon={User}
        />
        <Input label="Email" Placeholder="Enter your email" Icon={Mail} />
        <Input
          label="Password"
          Placeholder="Create a password"
          Icon={Lock}
          Icon2={Eye}
        />
        <Input
          label="Confirm Password"
          Placeholder="Confirm your password"
          Icon={Lock}
          Icon2={Eye}
        />
        <button className="text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2">
          Create account
        </button>
        {/* Input section - ends */}

        {/* Bottom row - starts */}
        <p className="text-[#f2ebeb] mt-4 text-md ">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:text-white" to={"/"}>
            Sign in
          </Link>
        </p>
        {/* Bottom row - ends */}
      </div>
      {/* Card - ends */}
    </main>
  );
};

export default Signup;
