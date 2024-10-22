import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";

import Loader from "../../components/loader/loader";

import placeHolder from "src/assets/placeholder.jpeg";
import addSVG from "src/assets/add.svg";
import closeSVG from "src/assets/close.svg";
import cameraSVG from "src/assets/camera.svg";
import warningSVG from "src/assets/warning.svg";
import crossSVG from "src/assets/cross.svg";
import bg from "src/assets/formback.png";

import { FormField } from "formFieldsTypes"; 

const API = process.env.REACT_APP_API_URL;


export default function AccompanyingForm() {
  const accessToken = localStorage.getItem("access_token");
  const location = useLocation();

  const navigate = useNavigate();
  const [toggleActive, setToggleActive] = useState(false);
  useEffect(() => {
    if (location.state === null || location.state.uuid === null) {
      navigate("/leadform", {
        state: {
          error: "NULL_UUID",
          message: "Cannot add accompanying visitors before lead visitor.",
        },
      });
    }
  }, [location.state, navigate]);

  const leadID = location.state?.uuid;

  const [formFields, setFormFields] = useState<FormField[]>([
    {
      full_name: "",
      email: "",
      contact_number: "",
      image: "",
      showModal: false,
      lead_visitor_id: leadID,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let data = [...formFields];

    const fieldName = event.target.name as keyof FormField;

    data[index] = {
        ...data[index],
        [fieldName]: event.target.value, 
    };

    setFormFields(data);
  };

  const toggleModal = (index: number) => {
    let data = [...formFields];
    data[index].showModal = !data[index].showModal;
    setFormFields(data);
    setToggleActive(!toggleActive);
  };

  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(
    (index: number) => {
      const imageSrc = webcamRef.current?.getScreenshot();
      let data = [...formFields];
      if (imageSrc) {
        data[index].image = imageSrc;
        setFormFields(data);
      }
    }, [formFields]);
  

  const [showConfirmationModal, setshowConfirmationModal] = useState(false);
  const toggleConfirmation = () => {
    setshowConfirmationModal(!showConfirmationModal);
  };

  const cleanData = () => {
    const cleanData = formFields.map((form, index) => {
      if (index === 0) {
        const { showModal, ...rest } = form;
        return rest;
      }
      return form;
    });
    return cleanData;
  };

  const onSubmit = async () => {
    const requestData = cleanData();
    try {
      setLoading(true);
      const url = `${API}/accompanying/`
      const token = accessToken;

      const response = await axios.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const uniqueId = leadID;
      navigate("/print", { state: { uuid: uniqueId } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addFields = () => {
    let object: FormField = {
      full_name: "",
      email: "",
      contact_number: "",
      image: "",
      showModal: false,
      lead_visitor_id: leadID,
    };

    setFormFields([...formFields, object]);
  };

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  return loading ? (
    <Loader />
  ) : (
    <div
      className="h-screen w-screen bg-fixed bg-cover bg-no-repeat overflow-scroll"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {showConfirmationModal && (
        <div
          className="fixed w-full h-full top-0 bottom-0 flex flex-col justify-center items-center z-10"
          onClick={toggleConfirmation}
        >
          <div className="bg-black opacity-75 absolute inset-0"></div>
          <div className="bg-white h-1/3 w-1/5 p-4 relative rounded-3xl">
            <div className="h-full  flex flex-col justify-center items-center rounded-3xl">
              <img src={warningSVG} width={50} className="mb-4" alt="warning"/>
              <img
                src={crossSVG}
                width={40}
                className="absolute top-0 right-0 mt-6 mr-6"
                onClick={toggleConfirmation}
                alt="cross"
              />
              <p className="text-red-900 font-semibold text-center">
                WARNING THE FORM WILL BE RESET AFTER CLICKING THE BUTTON BELOW
              </p>
              <p className="my-4">
                Are you sure all of the entered data is correct?
              </p>

              <button
                type="submit"
                onClick={onSubmit}
                className="mt-2 bg-amritaOrange px-6 py-4 text-center rounded-full"
              >
                Continue To Print
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="h-screen flex justify-center items-center flex-col"
      >
        <div className="w-[50rem]">
          {formFields.map((form, index) => {
            return (
              <div className="p-6 flex flex-col items-center" key={index}>
                <div className="h-1/2 w-full p-12 flex justify-between items-start rounded-lg border-2 bg-white drop-shadow-md">
                  <div className="flex flex-col w-1/2">
                    <label className="font-semibold text-md">Full Name</label>
                    <input
                      className="h-10 px-2 border-2 rounded-md"
                      name="full_name"
                      placeholder="Full Name"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.full_name}
                    />
                    <label className="font-semibold text-md pt-6 pb-2">
                      Email
                    </label>
                    <input
                      className="h-10 px-2 border-2 rounded-md"
                      name="email"
                      type="email"
                      placeholder="Email"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.email}
                    />
                    <label className="font-semibold text-md pt-6 pb-2">
                      Phone Number
                    </label>
                    <input
                      className="h-10 px-2 border-2 rounded-md"
                      name="contact_number"
                      type="number"
                      placeholder="Phone Number"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.contact_number}
                    />
                  </div>
                  <div className="w-1/2">
                    {form.image ? (
                      <div className="flex flex-col justify-center items-center">
                        <img
                          src={form.image}
                          width={360}
                          alt="Profile"
                          className="p-4 border-2 border-black rounded-lg"
                        />
                        <button
                          type="button"
                          className="h-auto w-1/2 mt-4 p-2 rounded-lg font-semibold text-white bg-amber-600 "
                          onClick={() => toggleModal(index)}
                        >
                          Take Picture Again
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-col justify-center items-center">
                          <img
                            src={placeHolder}
                            width={240}
                            alt="Profile"
                            className="p-4 border-2 rounded-lg"
                          />
                          <button
                            type="button"
                            className="h-auto w-1/2 mt-4 p-2 rounded-lg font-semibold text-white bg-amber-600 "
                            onClick={() => toggleModal(index)}
                          >
                            Take Picture
                          </button>
                        </div>
                        {form.showModal && (
                          <div
                            className="fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center"
                            onClick={() => toggleModal(index)}
                          >
                            <div className="h-auto flex flex-col justify-center items-center w-1/2 bg-[#bebebe] rounded-md p-4">
                              <Webcam
                                ref={webcamRef}
                                audio={false}
                                className="w-full h-full"
                                screenshotFormat="image/jpeg"
                              ></Webcam>
                              <button
                                className=" w-1/2 flex justify-evenly items-center py-4 px-2 mt-4 rounded-lg text-white font-semibold bg-amber-600"
                                onClick={() => capture(index)}
                              >
                                <img
                                  src={cameraSVG}
                                  width={40}
                                  className=""
                                  alt="Camera"
                                ></img>
                                Capture image
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button className="" onClick={() => removeFields(index)}>
                    <img src={closeSVG} width={30} alt="close"/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <button
            className="px-6 py-4 w-40 bg-amber-600 font-semibold text-md text-white rounded-lg"
            onClick={toggleConfirmation}
          >
            Submit
          </button>
        </div>
      </form>
      {toggleActive ? (
        <button className="fixed bottom-4 right-4 p-4 rounded-full hover-color-change bg-black">
          <img src={addSVG} width={50} alt="add"/>
        </button>
      ) : (
        <button
          className="fixed bottom-4 right-4 p-4 rounded-full hover-color-change bg-amber-600 hover:bg-black transition-colors duration-300"
          onClick={addFields}
        >
          <img src={addSVG} width={50} alt="add"/>
        </button>
      )}
    </div>
  );
}

