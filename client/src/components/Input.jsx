const Input = ({
  label = "",
  Placeholder = "",
  Icon,
  Icon2,
  type = "text",
  min,
  max,
  ...rest // 👈 Accept react-hook-form props (name, onChange, ref, etc.)
}) => {
  return (
    <div className="flex flex-col items-start gap-y-2 text-[#f2ebeb] mb-4">
      <label htmlFor={label}>{label}</label>

      {/* Input & Icon div - starts*/}
      {label?.includes("Password") ? (
        <div className="flex gap-x-4 items-center border focus-within:border-[#9b9898] border-gray-500 p-2 rounded-lg w-full ">
          <Icon color="gray" size={20} />
          <input
            id={label}
            placeholder={Placeholder}
            className="w-full outline-none "
            type={type}
            min={min}
            max={max}
            {...rest} // ✅ Spread react-hook-form props here
          />
          <div className="text-gray-400 hover:text-[#f2ebeb] cursor-pointer">
            <Icon2 size={20} />
          </div>
        </div>
      ) : (
        <div className="flex gap-x-4 items-center border focus-within:border-[#9b9898] border-gray-500 p-2 rounded-lg w-full ">
          <Icon color="gray" size={20} />
          <input
            id={label}
            placeholder={Placeholder}
            className="w-full outline-none "
            type={type}
            min={min}
            max={max}
             {...rest} // ✅ Spread here too
          />
        </div>
      )}
      {/* Input & Icon div - ends*/}
    </div>
  );
};

export default Input;
