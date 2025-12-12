import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const MovieSearch = ({ onMovieSelect }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceGn = setTimeout(() => {
            if (query.length > 2) {
                setLoading(true);
                UserService.searchMovies(query).then(
                    (response) => {
                        setLoading(false);
                        if (response.data && response.data.Search) {
                            setSuggestions(response.data.Search);
                        } else {
                            setSuggestions([]);
                        }
                    },
                    (error) => {
                        setLoading(false);
                        console.error(error);
                    }
                );
            } else {
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceGn);
    }, [query]);

    const handleSelect = (movie) => {
        // Map OMDb fields to our Favorite model fields
        const favorite = {
            imdbId: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster
        };
        onMovieSelect(favorite);
        setQuery("");
        setSuggestions([]);
    };

    return (
        <div className="mb-4 position-relative">
            <input
                type="text"
                className="form-control"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {loading && <div className="text-secondary mt-1">Loading...</div>}
            {suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                    {suggestions.map((movie) => (
                        <li
                            key={movie.imdbID}
                            className="list-group-item list-group-item-action cursor-pointer"
                            onClick={() => handleSelect(movie)}
                            style={{ cursor: "pointer" }}
                        >
                            <img src={movie.Poster} alt={movie.Title} height="30" className="me-2" />
                            {movie.Title} ({movie.Year})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MovieSearch;
