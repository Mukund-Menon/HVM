  import React from "react";
  import QRCode from "react-qr-code";
  import logoSVG from "src/assets/amritaLogo.svg";
  import placeholderImage from "src/assets/placeholder.jpeg";
  import { formatDateTime_validfrom } from "../../services/utils/dateFormat";
  import { PassProps } from "passTypes";

  const Pass: React.FC<PassProps>= ({
    uuid,
    fullName,
    companyName,
    validFromDate,
    validFromTime,
    validTill,
    visitee,
    department,
    imageSrc,
    className
  }) => {
    const currentDomain = window.location.origin; 
    const qrCodeValue = `${currentDomain}/expiry/${uuid}`;
    const formattedValidFrom = formatDateTime_validfrom(validFromDate, validFromTime);
    return (
      <div className={`w-1/2 border-black border-2 ${className}`}>
        <div className="w-full p-4 bg-amritaOrange flex justify-center">
          <img
            src={logoSVG}
            className="p-4 border-[2px] border-black rounded-md shadow-lg"
            alt="logo"
          />
        </div>
        <p className="p-8 text-center text-3xl font-bold">VISITOR PASS</p>
        {/* part which handles the image and QR code */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="aspect-w-1 aspect-h-1 flex items-center justify-center p-4 ">
            <img src={imageSrc || placeholderImage} className="object-cover" alt=""/>
          </div>
          <div className="aspect-w-1 aspect-h-1 flex items-center justify-center p-4">
            <QRCode value={qrCodeValue} className="object-contain" />
          </div>
        </div>
        <div className="w-full p-4 grid grid-cols-2 gap-4 text-start font-semibold text-lg">
          <div className="text-start font-bold text-lg">
            <p className="">Name of visitor</p>
            <p className="">Company Name</p>
            <p className="">Name of Visiting Person</p>
            <p className="">Department</p>
            <p className="">Valid from</p>
            <p className="">Valid Till</p>
          </div>
          <div className="text-start font-bold text-lg">
            <div>
              <p className="">{fullName}</p>
              <p className="whitespace-normal">{companyName}</p>
              <p className="">{visitee}</p>
              <p className="">{department}</p>
              <p className="">{formattedValidFrom}</p>
              <p className="">{validTill}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Pass;
