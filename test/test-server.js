// Server Test

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('should return all blog posts on GET request', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.should.length(3)			
			res.body.forEach(function(item){
				item.should.be.a('object');
				item.should.include.keys('id', 'title', 'author', 'content', 'publishDate');
			});
		});
	});

	it('should should add a blog entry on POST request', function(){
		const testPost = {
			author: 'Some Guy',
			title: 'Some Title',
			content: 'Some Content'
		}
		return chai.request(app)
		.post('/blog-posts')
		.send(testPost)
		.then(function(res){
			res.should.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys('author', 'title', 'content');
			res.body.author.should.equal(testPost.author);
		});
	});

	it('should update blog post on PUT request', function(){
		const updatePost = {
			author: 'Matt',
			title: 'Another Title',
			content: 'New Content'
		};

		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			updatePost.id = res.body[0].id;

			return chai.request(app)
			.put(`/blog-posts/${updatePost.id}`)
			.send(updatePost)
		})
		.then(function(res){
			res.should.have.status(204);
			res.body.should.be.a('object');

			//res.body.author.should.equal(updatePost.author)
			//res.should.be.json;			
			//res.body.should.include.keys('author', 'title', 'content');
			//res.body.author.should.equal(updatedPost.author);
			//res.body.id.should.equal(updatedPost.id);
		})
	})

	it('should delete selected post on DELETE request', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			return chai.request(app)
			.delete(`/blog-posts/${res.body[0].id}`)
		})
		.then(function(res){
			res.should.have.status(204);
		})
	})
})
