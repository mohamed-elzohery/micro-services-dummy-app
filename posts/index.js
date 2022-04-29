const express = require('express');
const {randomBytes} = require('crypto');
const cors = require('cors');
const {default: axios} = require('axios');


const app = express();

app.use(express.json());
app.use(cors()); 

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    posts[id] = {
        id,
        title
    }

    // Emitting Event To Bus
    try{
        const {data} = await axios.post('http://localhost:4005/events', {
            type: 'CREATE POST',
            data: {id, title}
        });
        console.log(data);
    }catch(err){
        console.log(err.message);
        console.log("Error is here");
    }
    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log(req.body.type);
    res.send({})
});

app.listen(4000, () => console.log('posts service is running on port 4000'))