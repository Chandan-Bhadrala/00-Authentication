// components/OtpInput.jsx
import { useRef, useEffect } from "react";

const OtpInput = ({ otp, setOtp }) => {
  const inputs = useRef([]);

  // Handle change on each input box
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value[0]; // Only allow one digit
      setOtp(newOtp);

      // Move focus to next box
      if (index < 5) inputs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputs.current[index - 1].focus();
    }
  };

  // Handle paste event (e.g., full OTP paste)
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    paste.split("").forEach((char, idx) => {
      if (inputs.current[idx]) {
        inputs.current[idx].value = char;
        newOtp[idx] = char;
      }
    });
    setOtp(newOtp);
    e.preventDefault();
  };

  // Set input values if otp updates externally
  useEffect(() => {
    otp.forEach((val, idx) => {
      if (inputs.current[idx]) {
        inputs.current[idx].value = val;
      }
    });
  }, [otp]);

  return (
    <div
      onPaste={handlePaste}
      className="flex justify-center gap-2 text-white"
    >
      {Array(6)
        .fill(0)
        .map((_, idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            className="w-12 h-12 text-center bg-gray-800 border border-gray-600 rounded-md outline-none focus:border-white"
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            ref={(el) => (inputs.current[idx] = el)}
          />
        ))}
    </div>
  );
};

export default OtpInput;
