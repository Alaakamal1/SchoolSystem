import React from "react";

const PrimaryTableRow = ({ children, columns = [], classes }) => {
  const className = `px-4 flex w-full gap-2 items-center ${classes}`;

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          className:
            child.props.className + " " + columns[index],
        })
      )}
    </div>
  );
};

export default PrimaryTableRow;
