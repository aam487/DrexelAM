// Extract blog ID from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');

// Fetch and display blog details
function loadBlogDetails() {
	fetch(`/blog/${blogId}`)
		.then(response => response.json())
		.then(blog => {
			document.getElementById('blog-title').textContent = blog.title;
			document.getElementById('blog-content').textContent = blog.content;
			loadComments();
		})
		.catch(err => console.error('Error loading blog:', err));
}

// Fetch and display comments
function loadComments() {
	fetch(`/blog/${blogId}/comments`)
		.then(response => response.json())
		.then(comments => {
			const commentsList = document.getElementById('comments-list');
			commentsList.innerHTML = comments.map(comment => `
				<div class="comment-card">
					<p>${comment.content}</p>
					<small>Posted on ${new Date(comment.created_at).toLocaleDateString()} by User ${comment.user_id}</small>
				</div>
			`).join('');
		})
		.catch(err => console.error('Error loading comments:', err));
}

// Add new comment
document.getElementById('add-comment-form').addEventListener('submit', function (event) {
	event.preventDefault();

	const content = document.getElementById('comment-content').value;

	fetch('/blog/comment', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ blog_id: blogId, content })
	})
	.then(response => {
		if (response.ok) {
			alert('Comment added successfully!');
			loadComments(); // Reload comments
			window.location.reload();
		} else {
			alert('Failed to add comment.');
		}
	})
	.catch(err => console.error('Error:', err));
});

loadBlogDetails();
loadComments();
