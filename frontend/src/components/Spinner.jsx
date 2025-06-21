// src/components/Spinner.jsx
const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`rounded-full border-t-indigo-500 border-b-indigo-300 border-transparent ${sizes[size]} animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;