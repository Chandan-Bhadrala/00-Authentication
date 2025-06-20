import { useRef } from "react";

const OtpInput = () => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      e.target.value = value[0]; // only allow 1 digit
      if (index < 5) inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, idx) => {
      if (inputs.current[idx]) {
        inputs.current[idx].value = char;
      }
    });
    e.preventDefault();
  };

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
