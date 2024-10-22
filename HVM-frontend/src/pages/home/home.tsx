import React, { useState, useEffect } from "react";
import bg from "src/assets/back.png";
import axios from "axios";
import { useNavigate } from "react-router";
import printerSVG from "src/assets/printer.svg";
import dayjs, { Dayjs } from 'dayjs';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { CirclesWithBar } from "react-loader-spinner";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Visitor } from "visitorTypes";

const ITEMS_PER_PAGE = 15;
const API = process.env.REACT_APP_API_URL

export default function Home() {
  const [data, setData] = useState<Visitor[]>([]);
  const [Loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const currentUser = localStorage.getItem("current_user_fullname");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("cached_lead_visitor");

        if (cachedData) {
          setData(JSON.parse(cachedData));
          setLoading(false);
        }

        const response = await axios.get(
          `${API}/visitors`,
          {
            params: {
              date: selectedDate?.format("YYYY-MM-DD"),
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const newData = response.data.lead_visitor.reverse();
        

        if (JSON.stringify(newData) !== cachedData) {
          localStorage.setItem("cached_lead_visitor", JSON.stringify(newData));
          setData(newData);
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handlePrint = (unique_id: string) => {
    navigate("/print", { state: { uuid: unique_id } });
  };

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const displayedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const visiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`mx-2 px-4 py-2 rounded-full ${
            currentPage === i
              ? "bg-[#f58220] text-white"
              : "bg-gray-300 font-bold"
          } transform transition-transform hover:scale-110 transition-200`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-6">
        <button
          className={`mx-2 px-4 py-2 rounded-full ${
            currentPage === 1 ? "bg-gray-300" : "bg-[#f58220] text-white"
          }`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded-full ${
            currentPage === 1 ? "bg-gray-300" : "bg-[#f58220] text-white"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>
        {pages}
        <button
          className={`mx-2 px-4 py-2 rounded-full hover:animate-pulse transition-100 ${
            currentPage === totalPages
              ? "bg-gray-200"
              : "bg-[#f58220] text-white"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded-full ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-[#f58220] text-white"
          }`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    );
  };

  const datePickerStyles = `
  .css-1u23akw-MuiButtonBase-root-MuiPickersDay-root.Mui-selected{
    background-color: orange !important;
  }
  .css-jgls56-MuiButtonBase-root-MuiPickersDay-root.Mui-selected {
    background-color: orange !important;
  }
  .css-1u23akw-MuiButtonBase-root-MuiPickersDay-root.Mui-selected:hover{
    background-color: orange !important;
  }
  .css-jgls56-MuiButtonBase-root-MuiPickersDay-root.Mui-selected:hover {
    background-color: orange !important;
  }
  .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root{
    border-radius: 24px !important;
    height: 48px !important;
  }
`;

  return (
    <div>
      <div
        className="w-full bg-cover bg-center bg-repeat min-h-screen"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="mx-64 p-12 drop-shadow-sm">
          <div className="bg-white bg-opacity-75 p-4 rounded-md mb-4 flex justify-between items-center">
            <p className="font-Heading font-semibold text-xl">
              Namah Shivaya, {currentUser}
            </p>
            <style>{datePickerStyles}</style>
            <div className="flex justify-between items-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="items-center h-1/2 right-[30px] w-48 rounded-lg"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              </LocalizationProvider>
              <a href="/leadform">
                <button className="px-4 py-2 rounded-full bg-[#f58220] text-white hover:bg-black transition-200">
                  Add Lead Visitor
                </button>
              </a>
            </div>
          </div>
          <br />
          {Loading ? (
            <div className="w-full flex justify-center items-center pt-12">
              <CirclesWithBar
                height="100"
                width="100"
                color="#F48221"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel="circles-with-bar-loading"
              />
            </div>
          ) : (
            <div className="overflow-x-auto drop-shadow-2xl">
              <table className="min-w-full border-white border-[3px]">
                <thead className="bg-[#ff9e4f] border-white border-[3px]">
                  <tr>
                    <th className="py-3 px-4 text-right">S.No</th>
                    <th className="py-3 px-4 text-left">Full Name</th>
                    <th className="py-3 px-4 text-left">Company</th>
                    <th className="py-3 px-4 text-left">Department</th>
                    <th className="py-3 px-4 text-right">Valid From</th>
                    <th className="py-3 px-4 text-right">Valid Till</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((visitor: Visitor, index: number) => (
                    <tr
                      key={visitor.unique_id}
                      className={index % 2 === 0 ? "bg-orange-100" : "bg-white"}
                    >
                      <td className="py-2 px-4 text-right">{index + 1}</td>
                      <td className="py-2 px-4 ">{visitor.full_name}</td>
                      <td className="py-2 px-4 ">{visitor.company_name}</td>
                      <td className="py-2 px-4 text-left">{visitor.department}</td>
                      <td className="py-2 px-4">
                        <div className="text-right">
                          <div className="font-bold">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(visitor.visiting_date))}
                          </div>
                          <div className="text-sm">
                            {new Intl.DateTimeFormat("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }).format(
                              new Date(
                                `${visitor.visiting_date}T${visitor.visiting_time}`
                              )
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="text-right">
                          <div className="font-bold">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(visitor.valid_till))}
                          </div>
                          <div className="text-sm">
                            {new Intl.DateTimeFormat("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }).format(new Date(visitor.valid_till))}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 hover:cursor-pointer">
                        <img
                          src={printerSVG}
                          alt="Print"
                          width={20}
                          onClick={() => handlePrint(visitor.unique_id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination controls */}
          {totalPages > 1 && renderPagination()}
        </div>
      </div>
    </div>
  );
};

