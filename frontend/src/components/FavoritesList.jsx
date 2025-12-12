import React from "react";

const FavoritesList = ({ favorites, onDelete, onUpdateDate }) => {
    if (!favorites || favorites.length === 0) {
        return <div className="alert alert-info">No favorites yet. Search and add some!</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Poster</th>
                        <th>Title</th>
                        <th>IMDb ID</th>
                        <th>Watch Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.map((fav) => (
                        <tr key={fav.id}>
                            <td>
                                <img src={fav.poster} alt={fav.title} height="80" />
                            </td>
                            <td>{fav.title}</td>
                            <td>{fav.imdbId}</td>
                            <td>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fav.watchDate || ""}
                                    onChange={(e) => onUpdateDate(fav.id, e.target.value)}
                                />
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => onDelete(fav.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FavoritesList;
