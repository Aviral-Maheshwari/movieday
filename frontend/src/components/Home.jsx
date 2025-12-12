import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import MovieSearch from "./MovieSearch";
import FavoritesList from "./FavoritesList";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [favorites, setFavorites] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate("/login");
            return;
        }
        loadFavorites();
    }, [navigate]);

    const loadFavorites = () => {
        UserService.getFavorites().then(
            (response) => {
                setFavorites(response.data);
            },
            (error) => {
                console.error("Error loading favorites", error);
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    navigate("/login");
                }
            }
        );
    };

    const handleMovieSelect = (movie) => {
        UserService.addFavorite(movie).then(
            () => {
                setMessage("Movie added to favorites!");
                setTimeout(() => setMessage(""), 3000);
                loadFavorites();
            },
            (error) => {
                console.error("Error adding favorite", error);
                setMessage("Failed to add favorite.");
            }
        );
    };

    const handleDeleteFavorite = (id) => {
        UserService.deleteFavorite(id).then(
            () => {
                setMessage("Favorite deleted successfully!");
                setTimeout(() => setMessage(""), 3000);
                loadFavorites();
            },
            (error) => {
                console.error("Error deleting favorite", error);
                setMessage("Failed to delete favorite.");
            }
        );
    };

    const handleUpdateDate = (id, date) => {
        UserService.updateFavorite(id, { watchDate: date }).then(
            () => {
                // Optimistic update locally or reload
                setFavorites(favorites.map(fav =>
                    fav.id === id ? { ...fav, watchDate: date } : fav
                ));
            },
            (error) => {
                console.error("Error updating date", error);
                setMessage("Failed to update date.");
            }
        );
    };

    return (
        <div className="container">
            <header className="jumbotron my-4">
                <h3>My Movie Dashboard</h3>
            </header>

            {message && <div className="alert alert-success">{message}</div>}

            <div className="row">
                <div className="col-md-12">
                    <h4>Search Movies</h4>
                    <MovieSearch onMovieSelect={handleMovieSelect} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-12">
                    <h4>My Favorites</h4>
                    <FavoritesList
                        favorites={favorites}
                        onDelete={handleDeleteFavorite}
                        onUpdateDate={handleUpdateDate}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
