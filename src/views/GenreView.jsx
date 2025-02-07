import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GenreView.css";
import { useStoreContext } from "../context";

function GenreView() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const { cart, setCart, user, prevPurchases } = useStoreContext();

  useEffect(() => {
    (async function getGenre() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${params.id}&page=${page}`
      );
      setMovies(response.data.results);
      setMaxPage(response.data.total_pages);
    })();
  }, [page]);

  useEffect(() => {
    setPage(1);
    (async function getGenre() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${params.id}&page=${page}`
      );
      setMovies(response.data.results);
      setMaxPage(response.data.total_pages);
    })();
  }, [params.id]);

  function previousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function nextPage() {
    if (page < maxPage) {
      setPage(page + 1);
    }
  }

  const addCart = (id, title, poster) => {
    if (prevPurchases.has(id + "")) {
      return;
    }

    if (cart.has(id + "")) {
      return;
    }

    setCart((prevCart) => {
      const cart = prevCart.set(id + "", { title: title, url: poster });
      localStorage.setItem(user.email, JSON.stringify(cart.toJS()));
      return cart;
    });
  }

  function status(id) {
    if (prevPurchases.has(id + "")) {
      return "Purchased";
    } else if (cart.has(id + "")) {
      return "Added";
    } else {
      return "Buy";
    }
  }

  return (
    <div className="movie-container">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img
              className="movie-image"
              height={"300px"}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/movies/detail/${movie.id}`)}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <button
              className="buy-button"
              onClick={() => addCart(movie.id, movie.original_title, movie.poster_path)}
            >{status(movie.id)}
            </button>
          </div>
        ))
      ) : (
        <p>Loading content...</p>
      )}
      <div className="pagination-container">
        <button className="page-button" onClick={previousPage}>
          Previous Page
        </button>
        <button className="page-button" onClick={nextPage}>
          Next Page
        </button>
      </div>
      <p id="page-count">
        Page: {page}/{maxPage}
      </p>
    </div>
  );
}

export default GenreView;
