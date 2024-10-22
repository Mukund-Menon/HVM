import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { CirclesWithBar } from "react-loader-spinner";
import axios from "axios";
import logoSVG from "src/assets/amritaLogo.svg";
import { useReactToPrint } from "react-to-print";
import Pass from "../../components/pass/passComponent";
import "./print.css";
import { VisitorData } from "leadvisitorTypes";

const API = process.env.REACT_APP_API_URL


export default function PrintPDF() {
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state === null || location.state.uuid === null) {
      navigate("/leadform", {
        state: {
          error: "NULL_UUID",
          message: "Cannot print visiting card before adding visitors.",
        },
      });
    }
  }, [location.state, navigate]);

  const uuid = location.state?.uuid;
  const [data, setData] = useState<VisitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = `${API}/visitors?unique_id=${uuid}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const leadData = data?.lead_visitor[0];

  const pdfRef = useRef(null);
  const printPDF = useReactToPrint({
    documentTitle: `${leadData?.visiting_time}.pdf`,
    content: () => pdfRef.current,
  });
  function formatDateTime(dateStr: string) {
    const dateObj = new Date(dateStr);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = dateObj.getFullYear();

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="h-screen flex flex-col justify-center items-center">
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
        <div>
          <div
            ref={pdfRef}
            className="h-full w-full mt-12 flex flex-col justify-center items-center"
          >
          <Pass
            uuid={uuid}
            fullName={leadData?.full_name ?? 'N/A'} 
            companyName={leadData?.company_name ?? 'N/A'} 
            validFromDate={leadData?.visiting_date ?? 'N/A'} 
            validFromTime={leadData?.visiting_time ?? 'N/A'} 
            validTill={formatDateTime(leadData?.valid_till ?? 'N/A')} 
            visitee={leadData?.visitee ?? 'N/A'} 
            department={leadData?.department ?? 'N/A'} 
            imageSrc={leadData?.image ?? ''} 
          />
            {data?.accompanying.map((accompany, index) => (
              <Pass
                key={index}
                uuid={uuid}
                fullName={accompany?.full_name ?? 'N/A'}
                companyName={leadData?.company_name ?? 'N/A'}
                validFromDate={leadData?.visiting_date ?? 'N/A'}
                validFromTime={leadData?.visiting_time ?? 'N/A'}
                validTill={formatDateTime(leadData?.valid_till ?? '')}
                visitee={leadData?.visitee ?? 'N/A'}
                department={leadData?.department ?? 'N/A'}
                imageSrc={accompany?.image}
                className="page-break"
              />
            ))}
          </div>
        </div>
      )}
      <div className="pt-12 flex flex-col justify-center items-center">
        <button
          onClick={printPDF}
          className="px-12 py-4 bg-amber-600 text-black font-semibold rounded-full"
        >
          Print
        </button>
      </div>
    </div>
  );
};
