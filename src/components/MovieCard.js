import {React, useState, useEffect} from "react";

function MovieCard({movieIDs}) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    movieIDs.forEach(id => {
      fetch(`https://www.omdbapi.com/?i=${id}&apikey=e9610482`)
        .then(res => res.json())
        .then(data => setMovies(prevMovies => [...prevMovies, data]))
        .catch(err => console.error(err))
      })
  }, [movieIDs])

  const movieEl = movies.map(movie => {
    const movieIdArray = JSON.parse(localStorage.getItem("movieIdArray"));
    const alreadyAdded = (movieIdArray && movieIdArray.includes(movie.imdbID)) ? true : false;

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

            {!alreadyAdded && 
              <button className="btn" onClick={addWatchlist}
              data-movie-id={imdbID}>
                <img src="./images/plus.png" alt="logo"/>
                  Add
              </button>
            }

            {alreadyAdded && 
              <button className="btn disabled" data-movie-id={imdbID}>
                <img src="./images/added.png" alt="logo"/>
                  Added
              </button>
            }
            
          </div>

          <p>{Plot}</p>
        </div>
      </div>
    )
  })

  function addWatchlist(event) {
    let element = event.target;
    element.innerHTML = `<img src="./images/added.png" alt="logo"/>Added`;
    element.classList.add("disabled");
    const elementId = element.getAttribute("data-movie-id");
    const movieIdArray = JSON.parse(localStorage.getItem("movieIdArray"));
    let newMovieIdArray = movieIdArray ? [...movieIdArray, elementId] : [elementId];
    localStorage.setItem("movieIdArray", JSON.stringify(newMovieIdArray));
  }


  return (
    <div>
      {movieEl}
    </div>
  );
}

export default MovieCard;