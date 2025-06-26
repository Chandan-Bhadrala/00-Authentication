import { Eye, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { useLoginUserMutation } from "../features/auth/authApi";

const Login = () => {
  // Setting up react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Form submission handler
  const onSubmit = (data) => {
    alert(`Form submitted with data: ${JSON.stringify(data)}`);
  };

  // RTK POST Query to login user.
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  return (
    <main className="flex bg-black justify-center items-center min-h-screen ">
      {/* Card - starts */}
      <div className="text-center bg-gray-700/70 backdrop-blur-md w-full max-w-md p-4 rounded-lg ">
        {/* Top row - starts */}
        <div className=" font-bold text-2xl text-[#f2ebeb]">Welcome back</div>

        <p className="text-gray-400 mb-8">
          Enter you credentials to access your account
        </p>

        {/* Top row - ends */}
        {/* Input section - starts */}

        <Input label="Email" Placeholder="Enter your email" Icon={Mail} />
        <Input
          label="Password"
          Placeholder="Enter your password"
          Icon={Lock}
          Icon2={Eye}
        />

        <button className="text-[#f2ebeb] bg-gray-500 w-full rounded-lg p-2">
          Create account
        </button>
        {/* Input section - ends */}

        {/* Forgot your password row - starts */}
        <div className="mt-4">
          <Link
            to="/forgot-password"
            className="text-md text-blue-400 hover:text-white"
          >
            Forgot your password?
          </Link>
        </div>
        {/* Forgot your password row - ends */}
        {/* Bottom row - starts */}
        <p className="text-[#f2ebeb] mt-2 text-md">
          Don't have an account?{" "}
          <Link className="text-blue-400 hover:text-white" to={"/signup"}>
            Sign up
          </Link>
        </p>
        {/* Bottom row - ends */}
      </div>
      {/* Card - ends */}
    </main>
  );
};

export default Login;
