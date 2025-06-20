import { Eye, Lock } from "lucide-react";
import Input from "../components/Input";

const Home = () => {
  return (
    <main className="flex bg-black justify-center items-center min-h-screen ">
      {/* Card - starts */}
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg ">
        {/* Top row - starts */}
        <div className=" font-bold text-2xl text-[#f2ebeb]">Welcome!</div>

        <p className="text-gray-400 mb-8">You are successfully logged in.</p>

        {/* Top row - ends */}
        {/* Input section - starts */}

        <div className=" space-y-4">
          <button className="text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2 cursor-pointer">
            Change password
          </button>
          <button className="text-[#f2ebeb] bg-gray-400 w-full rounded-lg p-2 cursor-pointer  transition-all duration-200 hover:text-black ease-in-out hover:bg-gray-400">
          Logout
          </button>{" "}
        </div>
        {/* Input section - ends */}
      </div>
      {/* Card - ends */}
    </main>
  );
};

export default Home;
