const express = require("express");
const moviesdata= require('./Movie Data/data.json');
const port = 8080;
const app = express();

app.get('/',Homehandler)
app.get('/favorite',Favoritehandler)

app.use(serverErrorHandler)
app.use(pageErrorHandler)

function Homehandler(req,res) {
    let newMovies = new Movies(moviesdata.title,moviesdata.poster_path,moviesdata.overview)
    res.send(newMovies)
}

function Favoritehandler(req,res) {
    res.send("Welcome to Favorite Page")
}

function Movies(title,poster_path,overview) {
    this.title=title
    this.poster_path=poster_path
    this.overview=overview
}

function serverErrorHandler(error,req,res) {
    res.status(500).json({
        "Status": 500,
        "ResponseText": "something went wrong with server"
    })
}
function pageErrorHandler(error,req,res) {
    res.status(404).json({
        "Status": 404,
        "ResponseText": "something went wrong with page"
    })
}

app.listen(port,()=>{
    console.log("server is running")
})