const API = process.env.REACT_APP_API_URL;

interface GetUsernameParams {
  username: string;
}

const GetUsername = async ({ username }: GetUsernameParams): Promise<any> => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API}/receivers/?username=`+username,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();        
        return data;
      } else {
        throw new Error(`HTTP status ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default GetUsername;