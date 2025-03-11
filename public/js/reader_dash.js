// public/js/reader_dash.js
// Fetch and display blogs
function loadBlogs() {
	fetch('/blog/all')
		.then(response => response.json())
		.then(blogs => {
			const blogsList = document.getElementById('blogs-list');
			blogs.forEach(blog => {
				const blogElement = document.createElement('div');
				blogElement.innerHTML = `<h3>${blog.title}</h3><p>${blog.content}</p><button onclick="showCommentForm(${blog.id})">Add Comment</button>`;
				blogsList.appendChild(blogElement);
			});
		});
}

loadBlogs();

// Need the code for posting a comment