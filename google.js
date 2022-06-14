import {google} from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/presentations'];
const TOKEN_PATH = 'token.json';

const credentials = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI
};

const googleApi = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uri);

const getAuthUrl = async () => {
    const authUrl = googleApi.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES
    });
    return authUrl;
};

const getNewToken = async code => {
    googleApi.getToken(code, async (err, token) => {
        if (err) {
            console.log('Error retrieving token ', err);
        }
        else {
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                if (err) return console.error(error);
                console.log(`Token stored in file ${TOKEN_PATH}`)
            })
            return token;
        }
    })
}

const createSlide = async (
    token, 
    title,
    name,
    jobTitle,
    company,
    date,
    url) => {
        googleApi.setCredentials(token)

        const slidesApi = google.slides({ version: 'v1', auth: googleApi });

        return slidesApi.presentations.create({
            title: 'Title Slide'
        })
            .then(presentation => {
                const presentationId = presentation.data.presentationId;
                console.log(`Created presentation with ID: ${presentationId}`)

                const requests = [
                    {
                        insertText: {
                            objectId: 'i0',
                            text: title
                        }
                    },
                    {
                        insertText: {
                            objectId: 'i1',
                            text: `${name} - ${jobTitle}\n${company}\n${date}`
                        }
                    },
                    {
                        createImage: {
                            objectId: 'companyLogo',
                            url: `https://logo.clearbit.com/${url}`,
                            elementProperties: {
                                pageObjectId: 'p'
                            }
                        }
                    }
                ];

                slidesApi.presentations.batchUpdate({
                    presentationId, 
                    resource: {
                        requests: requests
                    }
                })
                return presentationId;
            })
            .catch(error => console.log(error));
}

export {
    createSlide,
    getAuthUrl,
    getNewToken
}