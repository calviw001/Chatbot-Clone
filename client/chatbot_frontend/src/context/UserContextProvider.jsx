import { useEffect, useState } from "react";
import axios from "axios";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds data of the logged in user
  const [isLoading, setIsLoading] = useState(true); // Used to check whether the 'auth/user' route is done running or not

  useEffect(() => {
    // Check whether there is a valid session or not by calling the 'auth/user' route
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/user", {
          withCredentials: true,
        });
        // If there is no error, then user data was found
        // Set 'user' to the provided user data
        setUser(response.data);
      } catch (error) {
        // If there is any error. then no user data was returned
        // Set 'user' to null to indicate there being no one logged in
        setUser(null);
      } finally {
        // The route is finished now, so 'isLoading' is set to false
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    // Make these three variables avaliable to any component wrapped inside of it
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
