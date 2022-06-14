import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';

import {
    getAuthUrl,
    getNewToken,
    createSlide
} from './google.js';

const app = express();
const port = 5000;

app.use(bodyParser.json())

const TOKEN_PATH = 'token.json';

const credentials = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI
};

app.get('/authorize', async (req, res) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            getAuthUrl()
                .then(authUrl => {
                    res.json(authUrl);
                    res.status(200);
                })
                .catch(error => console.log(error))
        }
        else {
            res.send(token);
            res.status(200);
        }
    })
});

app.get('/oauth_callback/', (req, res) => {
    const { code } = req.query; 
    
    getNewToken(code)

    res.redirect('http://localhost:3000')
    res.status(200)
});

app.post('/create-slide', async (req, res) => {
    return createSlide(
        req.body.token, 
        req.body.title,
        req.body.name,
        req.body.jobTitle,
        req.body.company,
        req.body.date,
        req.body.url
    ).then(presentationId => {
        res.json(presentationId);
        res.status(200);
    })
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});