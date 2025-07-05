//consts
const apikey="da9b5a3cceaf914ab43b640d3f51f02e";
const apiendpoint ="https://api.themoviedb.org/3";
const apipaths={
     fetchAllCategories: `${apiendpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiendpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiendpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyANNgAYE-qH4LEwPPgDu7OuKevqrocMJIc`
}
const imgPath = "https://image.tmdb.org/t/p/original";



//boot up the app
function init(){
    fetchtrendingmovies();
fetchandbuildallsections();
}

function fetchtrendingmovies(){
    fetchandbuildMoviesection(apipaths.fetchTrending , 'Trending Now')
    .then(list =>{
        const randomIndex= parseInt( Math.random() * list.length );
        buildbannersection(list[randomIndex])})
    .catch(err => {
        console.error(err);
    })
}


function buildbannersection(movie) {
    const bannercont = document.getElementById('banner-section');
    
    // Make sure imgPath is defined globally or passed
    bannercont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

    const div = document.createElement('div');
    div.className = "banner-content container";

    div.innerHTML = `
        <h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">Trending in movies | Released - ${movie.release_date}</p>
        <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + '...' : movie.overview}</p>
        <div class="action-button-cont">
            <button class="action-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
                    <path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path>
                </svg>
                Play
            </button>
            <button class="action-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                        fill="currentColor"></path>
                </svg>
                More Info
            </button>
        </div>
    `;

    // Clear previous content before adding new
    bannercont.innerHTML = '';
    bannercont.appendChild(div);
}


function fetchandbuildallsections(){
    fetch(apipaths.fetchAllCategories)
.then(res => res.json())
.then(res => {
    const categories = res.genres;
    if(Array.isArray(categories) && categories.length ){
       categories.forEach(category => {
        fetchandbuildMoviesection(apipaths.fetchMoviesList(category.id)  ,category.name);
       })
    }
    // console.table(categories);
    
})
.catch(err => console.error(err));
}

function fetchandbuildMoviesection(fetchurl,categoryName){
    console.log(fetchurl,categoryName);
   return fetch(fetchurl)
    .then(res => res.json())
    .then(res => {//console.table(res.results)
        const movies=res.results;
        if(Array.isArray(movies) && movies.length){
            buildmoviesection(movies,categoryName);
        }
        return movies;
    })
    .catch(e => console.error(e))
    
    
}

function buildmoviesection(list , categoryName){
    const parent = document.getElementById('movies-cont')
     const moviesListHTML = list.map(item => {
        return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer(${item.title})" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    }).join('');

    const moviesSectionHTML = `
        <h2 class="movie-section-heading">${categoryName} <span class="Explore-Nudge">Explore All</span></span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML;

    // append html into movies container
    parent.append(div);
}

function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;

    fetch(apipaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
}




window.addEventListener('load',function(){
    init();
      window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })

})