const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


// Create Some Blog Posts
BlogPosts.create("Blog 1", "Here is a blog post", "shakespeare");
BlogPosts.create("Blog 2", "Here is another blog post", "Some Poet");
BlogPosts.create("Blog 3", "Here is the final blog post", "Famous Writter");


router.get('/', (req, res)=> {
	console.log(`GET REQ: ${JSON.stringify(BlogPosts.get())}`)
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	console.log(req.body)
	const requiredFields = ['title', 'content', 'author'];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			console.error(`Missing ${field} in request body`);
			return res.status(400).send(`Missing ${field} in request body`);
		}	
	};
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});

router.delete('/:id', (req, res)=> {
	BlogPosts.delete(req.params.id);	
	console.log(`Deleteing post ${req.params.id}`);
	res.status(204).end();
});


router.put('/:id', jsonParser, (req, res) => {	
	const requiredFields = ['title', 'content', 'author'];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			console.error(`Missing ${field} in request body`);
			return res.status(400).send(`Missing ${field} in request body`);
		}
	}
	if(req.params.id !== req.body.id){
		const mess = (`Request path id: ${req.params.id} and request body id: ${req.body.id} must match`);
		console.error(mess);
		return res.status(400).send(mess);
	}
	console.log(`Updating blog post ${req.params.id}`);
	const updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	});
	console.log(updatedPost)
	res.status(204).json(updatedPost); 
});

module.exports = router;
