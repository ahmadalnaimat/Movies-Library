const express = require("express");
const axios = require('axios');
const moviesdata= require('./Movie Data/data.json');
const pg = require('pg');
const cors = require('cors');
require('dotenv').config();
const ApiKey=process.env.Key;
const client = new pg.Client('postgresql://localhost:5432/labs')
const port = 8080;
const app = express();
app.use(cors());
app.use(express.json());

app.get('/',Homehandler)
app.get('/favorite',Favoritehandler)
app.get('/trending',trendinghandler)
app.get('/search',searchhandler)
app.get('/toprated',topRated)
app.get('/nowplaying',nowplaying)
app.get('/getmovies',getmoviehandler)
app.post('/getmovies',addmoviehandler)


app.use(serverErrorHandler)
app.use(pageErrorHandler)

function getmoviehandler(req,res) {
    const sql = 'SELECT * from movies;'
    client.query(sql)
    .then(data=> {
        res.send(data.rows)
    })
    .catch(serverErrorHandler)
}

function addmoviehandler(req,res) {
    const addmovies=req.body;
    // const sql = 'INSERT INTO movies(id,title,release_date,poster_path,overview) VALUES (693134, Dune: Part Two, 2024-02-27, /1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg, Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family Facing a choice between the love of his life and the fate of the known universe Paul endeavors to prevent a terrible future only he can foresee) RETURNING *;'
    const sql = 'INSERT INTO movies(title,release_date,poster_path,overview) VALUES ($1, $2, $3, $4) RETURNING *;'
    const values = [addmovies.title , addmovies.release_date , addmovies.poster_path , addmovies.overview]
    client.query(sql,values)
    .then(data=>{
        res.send("you data was added")
    })
    .catch(serverErrorHandler)}

function Homehandler(req,res) {
    let newMovies = new Movies(moviesdata.title,moviesdata.poster_path,moviesdata.overview)
    res.send(newMovies)
}

function Favoritehandler(req,res) {
    res.send("Welcome to Favorite Page")
}
function trendinghandler(req,res){
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${ApiKey}&language=en-US`)
    .then(Mdata => {
        const trending = Mdata.data.results.map(movie => {
            return new Movies(
                movie.id, 
                movie.title, 
                movie.release_date, 
                movie.poster_path, 
                movie.overview
            )
        })
        res.json(trending);
    })
    .catch(serverErrorHandler)
}
function searchhandler(req,res) {
    //let should be const
    let query = req.query.query;
    query = "the"
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${ApiKey}&language=en-US&query=${query}&page=2`)
    .then(Sresult=>{
        res.json(Sresult.data.results)
    })
    .catch(serverErrorHandler)
}
function topRated(req,res) {
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${ApiKey}&language=en-US&page=1`)
    .then(Mdata=>{
        const toprated= Mdata.data.results.map(movie=>{
            return new RatingMovies(
            movie.id,
            movie.title,
            movie.release_date,
            movie.vote_average,
            movie.poster_path,
            movie.overview
            )
        })
        res.json(toprated)
    })
    .catch(serverErrorHandler)
}
function nowplaying(req,res) {
    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${ApiKey}&language=en-US&page=1`)
    .then(Mdata=>{
        const nowplaying= Mdata.data.results.map(movie=>{
            return new RatingMovies(
            movie.id,
            movie.title,
            movie.release_date,
            movie.vote_average,
            movie.poster_path,
            movie.overview
            )
        })
        res.json(nowplaying)
    })
    .catch(serverErrorHandler)
}

function Movies(id,title,release_date,poster_path,overview) {
    this.id= id
    this.title= title
    this.release_date= release_date
    this.poster_path= poster_path
    this.overview= overview
    
}
function RatingMovies(id,title,release_date,vote_average,poster_path,overview) {
    this.id= id
    this.title= title
    this.release_date= release_date
    this.rating= vote_average
    this.poster_path= poster_path
    this.overview= overview
    
}

function serverErrorHandler(error,req,res,next) {
    res.status(500).json({
        Status: 500,
        ResponseText: "something went wrong with server"
    })
}
function pageErrorHandler(err,req,res,next) {
    res.status(404).json({
        Status: 404,
        ResponseText: "something went wrong with page"
    })
}

client.connect()
.then(()=>{
    app.listen(port,()=>{
    console.log(`server is running ${port}`)
})
})

