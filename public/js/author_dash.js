// public/js/author_dash.js      
// Show the "Create Blog" form when the button is clicked
document.getElementById('create-blog-button').addEventListener('click', function () {
	document.getElementById('create-blog-form').style.display = 'block';
});

// Handle blog creation
document.getElementById('create-blog-form').addEventListener('submit', function (event) {
	event.preventDefault();

	const title = document.getElementById('blog-title').value;
	const content = document.getElementById('blog-content').value;

	fetch('/blog/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ title, content })
	})
	.then(response => {
		if (response.ok) {
			alert('Blog created successfully');
			window.location.reload();
		} else {
			alert('Error creating blog');
		}
	});
});

function loadBlogs() {
	fetch('/blog/all')
		.then(response => response.json())
		.then(blogs => {
			const blogsList = document.getElementById('blogs-list');
			blogs.forEach(blog => {
				const blogElement = document.createElement('div');
				blogElement.innerHTML = `<h3>${blog.title}</h3><p>${blog.content}</p>`;
				
				// Add a click event listener to navigate to the blog detail page
				blogElement.addEventListener('click', () => {
					window.location.href = `/blog/${blog.id}`;  // Navigate to the blog detail page
				});
				
				blogsList.appendChild(blogElement);
			});
		});
}

loadBlogs();