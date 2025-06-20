import { Eye, Lock } from "lucide-react";
import Input from "../components/Input";

const ChangePassword = () => {
  return (
    <main className="flex bg-black justify-center items-center min-h-screen ">
      {/* Card - starts */}
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg ">
        {/* Top row - starts */}
        <div className=" font-bold text-2xl text-[#f2ebeb]">
          Change password
        </div>

        <p className="text-gray-400 mb-8">
          Update your password to keep your account secure
        </p>

        {/* Top row - ends */}
        {/* Input section - starts */}

        <Input
          label="Current Password"
          Placeholder="Enter your current password"
          Icon={Lock}
          Icon2={Eye}
        />
        <Input
          label="New Password"
          Placeholder="Enter your new password"
          Icon={Lock}
          Icon2={Eye}
        />
        <Input
          label="Confirm your new Password"
          Placeholder="confirm your new password"
          Icon={Lock}
          Icon2={Eye}
        />

        <div className="flex gap-x-3">
          <button className="text-[#f2ebeb] bg-gray-400 w-full rounded-lg p-2 cursor-pointer  transition-all duration-200 hover:text-black ease-in-out hover:bg-gray-400">
            Cancel
          </button>{" "}
          <button className="text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2 cursor-pointer">
            Update password
          </button>
        </div>
        {/* Input section - ends */}
      </div>
      {/* Card - ends */}
    </main>
  );
};

export default ChangePassword;
