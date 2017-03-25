const state = {
	posts: [],
	newPost: {
		title: '',
		author: '',
		content: ''
	},
	sendPOST: function(){
		console.log(this.newPost)
		$.ajax({
			method: 'POST',
			url: '/blog-posts',
			data: JSON.stringify(this.newPost),
			succes: GETposts(),
			dataType: 'json',
			contentType: 'application/json'
		})
	}
}



const postTemplate =   
  `<article class="post" id="">
    <p class="post-info-title"> Title: <span class="js-post-title"></span></p>
    <p class="post-info-author"> Author: <span class="js-post-author"></span></p>
    <p class="js-post-content"></p>
    <button>Delete</button>
  </article>`;

// HTTP Requests
function GETposts(){
	state.posts = [];
	$.getJSON('/blog-posts', function(posts){			
			stateGETposts(posts);
		});
};

// State Functions
function stateGETposts(posts){	
	posts.forEach(post => {
		state.posts.push(post);
	});	
	$('.blog-post-wrapper.view').empty();
	showAllPosts(state, postTemplate);
};

function statePOSTnew(title, author, content){
	let post = state.newPost;
	post.title = title;
	post.author = author;
	post.content = content;
	state.sendPOST();
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



$(function(){
	handleGETallPosts();
	handleNewPOST();
});