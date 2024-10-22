import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import acceptIcon from 'src/assets/accept-icon.svg'; 
import rejectIcon from 'src/assets/cross-icon.svg';

// Extend Record<string, string | undefined> for URL params
interface Params extends Record<string, string | undefined> {
    uniqueId: string;
}

const API = process.env.REACT_APP_API_URL;

const ExpiryStatus: React.FC = () => {
    const { uniqueId } = useParams<Params>(); // Extracting UUID from URL
    const [status, setStatus] = useState<string>('Checking status...');
    const [isExpired, setIsExpired] = useState<boolean | null>(null); // null indicates loading state

    useEffect(() => {
        const fetchExpiryStatus = async () => {
            const token = localStorage.getItem("access_token");
            if (!uniqueId) {
                setStatus('No unique ID provided');
                setIsExpired(null);
                return;
            }

            try {
                const response = await axios.get(`${API}/status`, { // Proper string interpolation
                    params: { unique_id: uniqueId },
                    headers: {                    
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",    
                    },
                });

                // Process the response to set the status message
                if (response.data.message === 'not found') {
                    setStatus('UUID not found');
                    setIsExpired(false);
                } else if (response.data.message === 'expired') {
                    setStatus('Not Verified/Expired');
                    setIsExpired(true);
                } else {
                    setStatus('Verified');
                    setIsExpired(false);
                }
            } catch (error: any) {
                setStatus('Error fetching status');
                console.error(error.response ? error.response.data : error.message);
            }            
        };

        fetchExpiryStatus();
    }, [uniqueId]); // Dependency array includes uniqueId

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center">
                {/* Show the SVG icon above the 'Verified' text */}
                {status === 'Verified' && (
                    <img src={acceptIcon} alt="Verified" className="mx-auto mb-4" />
                )}
                {(status === 'Not Verified/Expired' || status === 'UUID not found') && (
                    <img src={rejectIcon} alt="Not Verified" className="mx-auto mb-4 h-1/3 w-1/3" />
                )}
                <div className={`text-4xl font-bold ${isExpired === null ? 'text-gray-500' : isExpired ? 'text-red-500' : 'text-green-500'}`}>
                    {status}
                </div>
            </div>
        </div>
    );
};

export default ExpiryStatus;
