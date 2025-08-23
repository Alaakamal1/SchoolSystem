import React from "react";

const Header = ({ children, title }) => {
  return (
    <div className="flex items-center justify-between mb-2 mt-4">
      <h1 className="text-2xl font-semibold text-[#4B4D4F]">{title}</h1>
      {children}
    </div>
  );
};

export default Header;
