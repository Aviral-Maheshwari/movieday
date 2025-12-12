import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/movies/";

const searchMovies = (title) => {
    return axios.get(API_URL + "search", { headers: authHeader(), params: { title } });
};

const getFavorites = () => {
    return axios.get(API_URL + "favorites", { headers: authHeader() });
};

const addFavorite = (movie) => {
    return axios.post(API_URL + "favorites", movie, { headers: authHeader() });
};

const deleteFavorite = (id) => {
    return axios.delete(API_URL + "favorites/" + id, { headers: authHeader() });
};

const updateFavorite = (id, favorite) => {
    return axios.put(API_URL + "favorites/" + id, favorite, { headers: authHeader() });
};

const UserService = {
    searchMovies,
    getFavorites,
    addFavorite,
    deleteFavorite,
    updateFavorite,
};

export default UserService;
