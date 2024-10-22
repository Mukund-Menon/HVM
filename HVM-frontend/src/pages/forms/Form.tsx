"use client";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import cameraSVG from "src/assets/camera.svg";
import placeHolder from "src/assets/placeholder.jpeg";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/loader";
import bg from "src/assets/formback.png";
import { FormValues } from "formTypes";

const API = process.env.REACT_APP_API_URL;

export default function Mainform() {
  const accessToken = localStorage.getItem("access_token");
  // form hook definitions
  const leadForm = useForm<FormValues>();
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    if (location.state?.error === "NULL_UUID") {
      toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "UUIDerr",
      });
    }
  }, [location.state?.error, message]);


  const { register, control, handleSubmit } = leadForm;

  // Navigation to Printing page
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: FormValues) => {
    
    try {
      setLoading(true);

      if (imageSrc !== "0") {
        data.leadImage = imageSrc;
      }

      const requestData = {
        full_name: data.leadFullName,
        email: data.leadEmail,
        department: data.department,
        visitee: data.facultyFullName,
        visitee_designation: data.facultyDesignation,
        company_name: data.companyName,
        contact_number: data.leadPhoneNumber,
        image: data.leadImage,
        address: `${data.leadAddress1}, ${data.leadAddress2}`,
      };
      
      const url = `${API}/leadvisitor/`;
      const token = accessToken;

      const response = await axios.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const uniqueId = response.data.unique_id;
      navigate("/navigate", { state: { uuid: uniqueId } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("0");

  const departmentOptions = [
    "Biomedical",
    "Clinical engineering",
    "Dietary department",
    "Dining services",
    "Facilities management",
    "Health records",
    "Inpatient service (IP)",
    "IT Services",
    "Medical director department",
    "Non-professional services",
    "Nursing department",
    "Nursing department (led by a director of nursing or chief nursing officer)",
    "Operation theater complex (OT)",
    "Outpatient department (OPD)",
    "Paramedical department",
    "Pharmacy department",
    "Physical medicine",
    "Plant operations",
    "Radiology department (X-ray)",
    "Rehabilitation department",
    "Surgical department",
    "Technical support",
    "Disclosure of information",
  ];

  const facultyDesignationOptions = [
    "Chief Executive Officer (CEO)",
    "Chief Financial Officer",
    "Chief Information Officer",
    "Chief Medical Officer",
    "Chief Nursing Officer",
    "Chief Operating Officer",
    "Chief Pharmacist",
    "Chief Radiologist",
    "Chief Surgeon",
    "Chief Technology Officer",
    "Chief Facilities Officer",
    "Chief of Clinical Engineering",
    "Chief of Staff",
    "Clinical Engineer",
    "Dietitian",
    "Director of Medical Services",
    "Director of Operations",
    "Director of Patient Services",
    "Director of Nursing",
    "Facilities Manager",
    "Health Records Specialist",
    "Hospital Administrator",
    "Information Disclosure Officer",
    "Inpatient Care Specialist",
    "Medical Director",
    "Non-professional Service Provider",
    "Nurse",
    "Operating Room Technician",
    "Paramedic",
    "Pharmacist",
    "Physical Therapist",
    "Plant Operations Manager",
    "Radiologist",
    "Rehabilitation Specialist",
    "Surgeon",
    "Technical Support Specialist",
    "Dining Services Manager",
    "General Practitioner",
  ];

  const webCamRef = useRef<Webcam>(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const captureWebcam = () => {
    if (webCamRef.current) {
      const screenshot = webCamRef.current.getScreenshot();
      if (screenshot) {
        setImageSrc(screenshot);
        leadForm.setValue("leadImage", screenshot);
      }
    } else {
      console.error("Webcam is not available.");
    }
  };
  

  return loading ? <Loader /> : (
    <div className="h-full w-full bg-cover bg-no-repeat bg-center bg-fixed overflow-scroll" style={{ backgroundImage: `url(${bg})` }}>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="h-full w-30 flex flex-col items-center justify-center py-20"
      >
        <div className="bg-white w-[53rem] rounded-lg py-5 drop-shadow-lg">
          <div className="w-full flex flex-col items-start">
            <span className="font-bold text-black text-2xl pt-8 pb-6 px-5">Visitor Details</span>
          </div>
          <div className="pb-12 w-full">
            <div className="h-1/2 px-12 py-8 w-full flex">
              <div className="flex flex-col w-1/2">
                <label className="text-[#868686] font-semibold text-md">Full Name</label>
                <input
                  type="text"
                  id="leadFullName"
                  required
                  {...register("leadFullName")}
                  className="h-10 px-2 border-2 border-[#eae9e7] rounded-md"
                />
                <label className=" text-[#868686] font-semibold text-md pt-6 pb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  required
                  {...register("companyName")}
                  className=" h-10 px-2 border-2 border-[#eae9e7] rounded-md"
                />
                <label className="text-[#868686] font-semibold text-md pt-6 pb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="leadPhoneNumber"
                  required
                  {...register("leadPhoneNumber")}
                  className=" h-10 px-2 border-2 border-[#eae9e7] rounded-md"
                />
                <label className="text-[#868686] font-semibold text-md pt-6 pb-2">Email</label>
                <input
                  type="email"
                  id="leadEmail"
                  required
                  {...register("leadEmail")}
                  className=" h-10 px-2 border-2 border-[#eae9e7] rounded-md"
                />

              </div>
              <div className="w-full">
                <input type="hidden" required {...register("leadImage")} />
                {/* WEBCAM COMPONENT  */}
                {showModal && (
                  <div
                    className="fixed top-0 left-0 h-screen w-full flex flex-col justify-center items-center"
                    onClick={toggleModal}
                  >
                    <div className="h-1/2 flex flex-col justify-center items-center w-1/2 bg-[#bebebe] rounded-md p-4">
                      <Webcam
                        ref={webCamRef}
                        audio={false}
                        className="w-full h-full"
                        screenshotFormat="image/jpeg"
                      ></Webcam>
                      <button
                        type="button"
                        className=" w-1/2  text-white font-semibold flex justify-evenly items-center py-4 px-2 mt-4 rounded-lg bg-amber-600"
                        onClick={captureWebcam}
                      >
                        <img src={cameraSVG} width={40} alt=""></img>
                        Capture image
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col  justify-center items-center w-full">

                  {imageSrc !== "0" ? (
                    <div className="flex flex-col justify-center items-center">
                      <img src={imageSrc} width={360} alt="Profile" />

                      <button
                        type="button"
                        className="h-auto w-1/2 mt-4 p-2 rounded-lg text-white font-semibold bg-amritaOrange "
                        onClick={toggleModal}
                      >
                        Take Picture Again
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <img src={placeHolder} width={240} alt="Profile" className=" p-4" />
                      <button
                        type="button"
                        className="h-auto w-1/2 mt-4 p-2 font-semibold text-white rounded-lg bg-amritaOrange"
                        onClick={toggleModal}
                      >
                        Take Picture
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex px-12">
              <div className="w-1/2 flex flex-col">
                <label className="text-[#868686] font-semibold text-md">Address Line 1</label>

                <input
                  type="text"
                  required
                  {...register("leadAddress1")}
                  className="w-3/4 h-10 px-2 border-2 border-[#eae9e7] rounded-md"
                />
              </div>
              <div className="w-1/2 flex flex-col">
                <label className="text-[#868686] font-semibold text-md">Address Line 2</label>
                <input
                  type="text"
                  required
                  {...register("leadAddress2")}
                  className="w-3/4 h-10 px-2 border-2 border-[#eae9e7] rounded-md"
                />

              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col items-start">
            <span className=" font-bold text-black text-2xl pt-8 pb-6 px-5">Visit Details</span>
          </div>
          <div className="w-full">
            <div className="h-1/2 px-12 py-8 w-full flex">
              <div className="flex flex-col w-1/2">

                <label className="text-[#868686] font-semibold text-md">
                  Full Name Of Faculty
                </label>
                <input
                  type="text"
                  required
                  id="facultyFullName"
                  {...register("facultyFullName")}
                  className="h-10 px-2 border-2 border-[#eae9e7] rounded-md"
                />
                <label className="text-[#868686] first-letter:font-semibold text-md pt-6 pb-2">
                  Department
                </label>

                <Controller
                  name="department"
                  defaultValue={departmentOptions[0]}
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => (
                    <select {...field} className="h-10 px-2 bg-white border-2 border-[#eae9e7] rounded-md">
                      {departmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <label className="text-[#868686] font-semibold text-md pt-6 pb-2">
                  Designation Of Faculty
                </label>
                <Controller
                  name="facultyDesignation"
                  defaultValue={facultyDesignationOptions[0]} 
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => (
                    <select {...field} className="h-10 px-2 bg-white border-2 border-[#eae9e7] rounded-md">
                      {facultyDesignationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div className="w-1/2">

                <input type="hidden" {...register("leadImage")} required />

                <div className="flex flex-col  justify-center items-center w-full"></div>

              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-6 bg-amritaOrange text-white font-semibold rounded-lg px-12 py-4"
              onClick={()=>onSubmit}
            >
              Submit
            </button>
          </div>

        </div>
      </form>

      <ToastContainer />
    </div>
  );
};
