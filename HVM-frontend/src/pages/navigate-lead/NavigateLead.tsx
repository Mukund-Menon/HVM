import React from "react";
import { useLocation, useNavigate } from "react-router";
import printerSVG from "src/assets/printer.svg";
import peopleSVG from "src/assets/associates.svg";
import bg from "src/assets/back.png";

export default function NavigateLead() {
  const location = useLocation();
  const navigate = useNavigate();

  const uuid = location.state?.uuid;

  const handlePrint = () => {
    navigate("/print", { state: { uuid: uuid } });
  };

  const handleAccompanying = () => {
    navigate("/accompanyingform", { state: { uuid: uuid } });
  };
  return (
    <div
      className="h-screen w-full bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="z-10 h-full w-full flex justify-center items-center">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-96 w-full p-4 rounded-lg bg-white drop-shadow-md flex flex-col justify-center items-center">
            <img src={printerSVG} width={70} />
            <div className="text-xl text-center">
              <p className="pt-4">To continue printing the pass</p>
              <p className="pt-2">Click the button below</p>
              <button
                onClick={handlePrint}
                className="mt-6 bg-amritaOrange text-white font-semibold rounded-lg px-12 py-4"
              >
                Go to Printing
              </button>
            </div>
          </div>
          <div className="h-96  w-full p-4 rounded-lg bg-white drop-shadow-md flex flex-col justify-center items-center">
            <img src={peopleSVG} width={70} />
            <div className="text-xl text-center">
              <p className="pt-4">
                To continue adding accompanying people details
              </p>
              <p className="pt-2">Click the button below</p>
              <button
                onClick={handleAccompanying}
                className="mt-6 bg-amritaOrange text-white font-semibold rounded-lg px-12 py-4"
              >
                Go to Acccompanying Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
