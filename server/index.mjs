// Load environment variables
import "./loadEnvironment.mjs";

import express from "express"; // npm install express
import path from "path";
import favicon from "serve-favicon"; // npm install serve-favicon
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;

app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, "public",
        req.url === "/" ? "index.html" : req.url
    ));
});


app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, "public",
        req.url === "/" ? "schedular.html" : req.url
    ));
});




app.listen(port, () => console.info(`Listening on port ${port}`));

// npm install dot-env
// npm install i -g nodemon