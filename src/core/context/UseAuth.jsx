




// import { useEffect, useState, useContext, createContext } from "react";
// import {
//   apiClient,
//   addTokenToLocalStorage,
//   getTokenFromLocalStorage,
// } from "../utils/apiClient";
// import { Endpoints } from "../utils/endpoints";

// const AuthContext = createContext();
// export const UseAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const login = async ({ email, password }) => {
//     try {
//       const response = await apiClient.post(Endpoints.login, {
//         email,
//         password,
//       });

//       const { token, user_info } = response.data;

//       addTokenToLocalStorage(token);

//       localStorage.setItem("user", JSON.stringify(user_info));

//       setUser(user_info);
//     } catch (error) {
//       throw error.response?.data ?? error;
//     }
//   };

//   const checkAuth = async () => {
//     try {
//       setIsLoading(true);
//       const token = getTokenFromLocalStorage();

//       if (!token) {
//         setIsLoading(false);
//         return;
//       }

//       // لو فيه يوزر محفوظ في localStorage هستخدمه
//       const savedUser = localStorage.getItem("user");
//       if (savedUser) {
//         setUser(JSON.parse(savedUser));
//       }
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     delete apiClient.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { useEffect, useState, useContext, createContext } from "react";
import {
  apiClient,
  addTokenToLocalStorage,
  getTokenFromLocalStorage,
} from "../utils/apiClient";
import { Endpoints } from "../utils/endpoints";

const AuthContext = createContext();
const UseAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await apiClient.post(Endpoints.login, {
        email,
        password,
      });

      const { token, user_info } = response.data;

      // خزّن التوكين
      addTokenToLocalStorage(token);

      // خزّن بيانات اليوزر
      localStorage.setItem("user", JSON.stringify(user_info));

      setUser(user_info);
    } catch (error) {
      throw error.response?.data ?? error;
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = getTokenFromLocalStorage();

      if (!token) {
        setIsLoading(false);
        return;
      }

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role, // ✅ ضيفناها هنا عشان تبقى متاحة في أي مكان
        setUser,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default UseAuth;