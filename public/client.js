const state = {
	posts: [],
	newPost: {
		title: '',
		author: '',
		content: ''
	}
};



const postTemplate =   
  `<article class="post" id="">
    <p class="post-info-title"> Title: <span class="js-post-title"></span></p>
    <p class="post-info-author"> Author: <span class="js-post-author"></span></p>
    <p class="js-post-content"></p>
    <button class="btn-delete-post">Delete</button>
    <button class="btn-put-post">Edit</button>
  </article>`;

// HTTP Requests
function GETposts(){
	state.posts = [];
	$.getJSON('/blog-posts', function(posts){			
			stateGETposts(posts);
		});
};

function sendPOST(){	
	$.ajax({
		method: 'POST',
		url: '/blog-posts',
		data: JSON.stringify(state.newPost),
		succes: POSTtimer(),
		dataType: 'json',
		contentType: 'application/json'
	})
}

function POSTtimer(){
	console.log('sdf')
	setTimeout(GETposts, 400);
}


function DELETEpost(id){		
	console.log(`/blog-posts/${id}`)
	$.ajax({		
		method: 'DELETE',
		url: '/blog-posts/' + id,
		success: POSTtimer()
	});
};

function PUTpost(id){
	$.ajax({
		method: 'PUT',
		url: url: '/blog-posts/' + id,
		success: POSTtimer()
	})
}

// State Functions
function stateGETposts(posts){	
	state.posts = [];
	posts.forEach(post => {
		state.posts.push(post);
	});	
	$('.blog-post-wrapper.view').empty();
	showAllPosts(state, postTemplate);
};

function statePOSTnew(title, author, content){
	state.newPost = {};
	let post = state.newPost;
	post.title = title;
	post.author = author;
	post.content = content;
	sendPOST();
};


// Parse & View Functions
function showAllPosts(state, postTemplate){		
	state.posts.forEach((post) => {
		var pTemp = $(postTemplate);
		pTemp.find('.js-post-title').text(post.title);
		pTemp.find('.js-post-author').text(post.author);
		pTemp.find('.js-post-content').text(post.content);
		pTemp.closest('.post').attr('id', post.id);
		$('.blog-post-wrapper').append(pTemp);
		
	})
}



// Handlers
function handleGETallPosts(){
	state.posts.length = 0;
	$('.btn-show-posts').click(function(e){		
		GETposts();
	})
}; 

function handleNewPOST(){
	$('.create-post-form').submit(function(event){		
		event.preventDefault();
		var title = $('.create-post-title').val();
		var author = $('.create-post-author').val();
		var content = $('.create-post-content').val();
		statePOSTnew(title, author, content);		
	})
}

function handleDeleteEvent(){
	$(document).on('click', '.btn-delete-post', function(e){
		e.preventDefault();
		let article = e.target.closest('article');				
		let id = article.getAttribute('id');
		DELETEpost(id);
	})
}

function handlePUT(){
	$(document).on('click', '.btn-put-post', function(e){
		e.preventDefault();
		let article = e.target.closest('article');
		let id = article.getAttribute('id');
		PUTpost(id);
	});
}


$(function(){
	handleGETallPosts();
	handleNewPOST();
	handleDeleteEvent();
	handlePUT();
});