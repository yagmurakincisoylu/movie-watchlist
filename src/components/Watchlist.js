import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Watchlist() {
  const [movieList, setMovieList] = useState([]);
  const [showMovieList, setShowMovieList] = useState(false);

  useEffect(() => {
    getMovieList();
  }, [])

  function getMovieList() {
    const movieIdArray = JSON.parse(localStorage.getItem("movieIdArray"));
    setMovieList([]);


    if(movieIdArray.length) {

      movieIdArray.forEach(movieId => {
        fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=e9610482`)
          .then(res => res.json())
          .then(data => {

            const alreadyAdded = (movieList && movieList.includes(data.imdbID)) ? true : false;

            if(!alreadyAdded) {
              setMovieList(prevMovieList => [...prevMovieList, data]);
            }

            setShowMovieList(true);
            

          })
          .catch(err => console.error(err))
      })
    } else {
      setShowMovieList(false);
    }
    renderMovieList();
  }

  

  function renderMovieList() {
    console.log(movieList);
    const movieEl = movieList.map(movie => {
    const {Title, imdbRating, RunTime, Genre, Plot, Poster, imdbID} = movie;

      return (
        <div className="movie-container" key={imdbID}>
          <img src={Poster} alt={`${Title} poster`}/>      
            
          <div className="movie-info">
            <div className="movie-title">
              <h3>{Title}</h3>
              <img src="./images/star.png" alt="star logo"/>
              <span>{imdbRating}</span>
            </div>

            <div className="movie-category">
              <p>{RunTime} {Genre}</p>
              <button className="btn" data-movie-id={imdbID} onClick={removeWatchlist}>
                <img src="./images/minus.png" alt="logo"/>
                  Remove
              </button>
            </div>

            <p>{Plot}</p>
          </div>
        </div>
      )
    })

    return movieEl;
  }

  function removeWatchlist(event) {
    let element = event.target;
    let elementId = element.getAttribute("data-movie-id");
    const movieIdArray = JSON.parse(localStorage.getItem("movieIdArray"));
    let indexOfElement = movieIdArray.indexOf(elementId);
    movieIdArray.splice(indexOfElement, 1);
    localStorage.setItem("movieIdArray", JSON.stringify(movieIdArray));
    getMovieList();
  }


  return (
    <div className="container">
      <div className="bg-container"></div>
      <div className="content">
        <header>
          <div className="title-container">
            <h1>My Watchlist</h1>
            <Link to="/">Search for movies</Link>
          </div>

          <form className="search-form" id="searchForm"></form>
        </header>
        
        <main>
          {!showMovieList &&
            <div className="placeholder-container" id="placeholderDivWatchlist">
            <p>Your watchlist is looking a little empty...</p>
            
              <Link to="/" className="btn">
                <img src="./images/plus.png" alt="logo"/>
                Let's add some movies!
              </Link>
            </div>
          }
          
          {showMovieList && 
            <div className="movie-list-container" id="savedMovieListContainer">
              {renderMovieList()}
            </div>
          }
        </main>
      </div>
    </div>
  );
}

export default Watchlist;