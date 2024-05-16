import React from "react";

export default function Encuesta({ visible, onClose }) {
  const handleOnCLose = (e) => {
    if(e.target.id === "container"){
        onClose();
    }
    
  };
  if (!visible) return null;

  return (
    <>
      <div
        id="container"
        onClick={handleOnCLose}
        className="fixed inset-0  bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
      >
        <div className=" bg-slate-50 p-2 rounded text-black ">
          <h1>Encuesta</h1>
        </div>
      </div>
    </>
  );
}

// export default Encuesta;
