// Extract blog ID from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');

// Fetch and display blog details
function loadBlogDetails() {
	fetch(`/blog/${blogId}`)
		.then(response => response.json())
		.then(blog => {
      document.getElementById('blog-title').textContent = blog.title;
      document.getElementById('blog-author').textContent = "By: " + blog.author_name;
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
          commentsList.innerHTML = comments.map(comment => {
              let actions = "";
              // Check if the logged-in user (currentUserId) is the owner of this comment
              if (window.currentUserId && comment.user_id === window.currentUserId) {
                  actions = `<button class="button edit-comment" data-id="${comment.id}">Edit</button>
                             <button class="button button1 delete-comment" data-id="${comment.id}">Delete</button>`;
              }
              return `
                  <div class="comment-card">
                      <p>${comment.content}</p>
                      <small>Posted on ${new Date(comment.created_at).toLocaleDateString()} by User ${comment.user_id}</small>
                      ${actions}
                  </div>
              `;
          }).join('');
          
          // Attach event listeners for editing comments
          document.querySelectorAll('.edit-comment').forEach(button => {
              button.addEventListener('click', (e) => {
                  const commentId = e.target.getAttribute('data-id');
                  const newContent = prompt("Enter new content for your comment:");
                  if(newContent) {
                      fetch(`/blog/comment/edit/${commentId}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ content: newContent }),
                          credentials: 'same-origin'
                      })
                      .then(response => {
                          if(response.ok) {
                              alert('Comment updated successfully!');
                              loadComments();
                          } else {
                              response.text().then(text => alert('Error updating comment: ' + text));
                          }
                      });
                  }
              });
          });
          
          // Attach event listeners for deleting comments
          document.querySelectorAll('.delete-comment').forEach(button => {
              button.addEventListener('click', (e) => {
                  const commentId = e.target.getAttribute('data-id');
                  if(confirm("Are you sure you want to delete this comment?")) {
                      fetch(`/blog/comment/delete/${commentId}`, {
                          method: 'POST',
                          credentials: 'same-origin'
                      })
                      .then(response => {
                          if(response.ok) {
                              alert('Comment deleted successfully!');
                              loadComments();
                          } else {
                              response.text().then(text => alert('Error deleting comment: ' + text));
                          }
                      });
                  }
              });
          });
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
document.getElementById('cancel-comment').addEventListener('click', (e) => {
  e.preventDefault();
  // Clear the textarea; if you want to hide the form, you can also set its display to 'none'
  document.getElementById('comment-content').value = "";
});


loadBlogDetails();
loadComments();
