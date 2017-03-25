const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostsRouter = require('./blogPostsRouter');

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile('/views/index.html'));

app.use('/blog-posts', blogPostsRouter);


app.listen(process.env.PORT || 8080, ()=> console.log("Server Running"));



