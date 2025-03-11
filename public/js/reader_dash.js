// public/js/reader_dash.js
// Fetch and display blogs
function loadBlogs() {
	fetch('/blog/all')
		.then(response => response.json())
		.then(blogs => {
			const blogsList = document.getElementById('blogs-list');
			blogs.forEach(blog => {
				const blogElement = document.createElement('div');
                blogElement.className = 'blog-card'; // Add class for consistent styling
				blogElement.innerHTML = `
				<div class="blog-content">
                        <h3>${blog.title}</h3>
                        <p>${blog.content.substring(0, 150)}...</p>
						<button onclick="showCommentForm(${blog.id})">Add Comment</button> 
                        <button class="read-more-btn" onclick="window.location.href='/blog/${blog.id}'">Read More</button>
                    </div>` ;
				blogsList.appendChild(blogElement);
			});
		});
}

        function showCommentForm(blogId) {
            document.getElementById('comment-form').style.display = 'block';
            document.getElementById('add-comment-form').setAttribute('data-blog-id', blogId);
        }

		document.getElementById('add-comment-form')?.addEventListener('submit', function (event) {
			event.preventDefault();
		
			const content = document.getElementById('comment-content').value;
			const blogId = document.getElementById('add-comment-form').getAttribute('data-blog-id');
		
			// Check if content or blogId is invalid
			if (!content || !blogId) {
				alert('Please provide valid content and blog ID');
				return;
			}
		
			fetch('/blog/comment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content, blogId })
			})
			.then(response => {
				if (response.ok) {
					alert('Comment created successfully');
					window.location.reload();
				} else {
					alert('Error creating comment');
				}
			})
			.catch(error => {
				console.error('Error:', error);
				alert('Failed to create comment. Please try again later.');
			});
		});

loadBlogs();
