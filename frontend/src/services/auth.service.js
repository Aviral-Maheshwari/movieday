import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, password) => {
    return axios.post(API_URL + "signup", {
        username,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + "signin", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

import authHeader from "./auth-header";

const logout = () => {
    return axios.post(API_URL + "signout", {}, { headers: authHeader() })
        .then(() => {
            localStorage.removeItem("user");
        })
        .catch(() => {
            // Force logout even if API fails (e.g. token expired)
            localStorage.removeItem("user");
        });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
