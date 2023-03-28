import {React, useState} from "react";
import {Link} from "react-router-dom";
import MovieCard from "./MovieCard";

function Search() {
  const [formData, setFormData] = useState("");
  const [movieIDs, setMovieIDs] = useState([]);
  const [showMovies, setShowMovies] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // get user input -start-
  function handleChange(event) {
    const {value} = event.target;
    setFormData(value);
  }
  
  const searchInput = document.getElementById("searchInput");

  function handleSubmit(event) {
    event.preventDefault()
    getMovieId(formData);
    searchInput.value = "";
    setFormData("");
  }
  // get user input -end-

    // search movie titles -end-
  const getMovieId = value => {
  fetch(`https://www.omdbapi.com/?s=${value}&apikey=e9610482`)
    .then(res => res.json())
    .then(data => {
      const {Search: movieArray, Response} = data;

      if(Response === "False") {
        setShowMovies(false);
        setShowWarning(true);

      } else if(Response === "True") {
        movieArray.forEach(movie => {
          setMovieIDs(prevMovieIDs => [...prevMovieIDs, movie.imdbID])
        })
        setShowMovies(true);
        setShowWarning(false);
      }
    })
    .catch(err => console.error(err))
  }
  // search movie titles -end-



  return (
    <div className="container">
      <div className="bg-container"></div>
      <div className="content">
        <header>
          <div className="title-container">
            <h1>Find Your Film</h1>
            <Link to="/watchlist">My Wathclist</Link>
          </div>

          <form className="search-form" id="searchForm" onSubmit={handleSubmit}>
            <img className="search-logo" src="./images/search.svg" alt="search logo" />
            <input 
              type="text"
              id="searchInput"
              placeholder="Search for a Movie"
              onChange={handleChange}
              name="movieTitle"
              value={formData}
            />
            <button id="searchBtn">Search</button>
          </form>
        </header>
        
        <main>
          {!showMovies &&
            <div>
              {!showWarning && 
                <div className="placeholder-container" id="placeholderDivSearch">
                  <img src="./images/filmstrip.png" alt="logo"/>
                  <p>START EXPLORING</p>
                </div>
              }

              {showWarning && 
                <div className="placeholder-container warning-text" id="placeholderWarnDiv">
                  <p>Unable to find what you're looking for. Please try another search.</p>
                </div>
              }
            </div>
          }
          
          {showMovies && 
            <div className="movie-list-container" id="searchedMovieListContainer">
              <MovieCard movieIDs={movieIDs} />
            </div>
          }

        </main>
      </div>
    </div>
  );
}

export default Search;