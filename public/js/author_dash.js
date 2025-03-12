// public/js/author_dash.js      
// Show the "Create Blog" form when the button is clicked
document.getElementById('create-blog-button').addEventListener('click', () => {
    const formDiv = document.getElementById('create-blog-container');
    formDiv.style.display = formDiv.style.display === 'none' ? 'block' : 'none';
});

// Handle blog creation through a form
document.getElementById('create-blog-form').addEventListener('submit', function (event) {
	event.preventDefault();
	// get the blog title and content
	const title = document.getElementById('blog-title').value;
	const content = document.getElementById('blog-content').value;
	// create the blog through create in blog route
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

// function to load the blogs on the author dashboard, blogs are clickable to expand view
function loadBlogs(sortOption = 'date') {
    fetch('/blog/author?sort=' + sortOption, { credentials: 'same-origin' })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(blogs => {
            // Check that blogs is an array
            if (!Array.isArray(blogs)) {
                throw new Error("Expected an array of blogs, but got: " + JSON.stringify(blogs));
            }
            const blogsList = document.getElementById('blogs-list');
            blogsList.innerHTML = ""; // Clear previous content
            blogs.forEach(blog => {
                const blogElement = document.createElement('div');
                blogElement.className = 'blog-card'; 
                blogElement.innerHTML = `
                    <div class="blog-content">
                        <h3>${blog.title}</h3>
                        <p>${blog.content.substring(0, 150)}...</p>
                        <p>Posted on: ${new Date(blog.created_at).toLocaleDateString()}</p>
                        <button class="read-more-btn" onclick="window.location.href='/blog.html?id=${blog.id}'">Read More</button>
                    </div>
                    <div class="blog-actions">
                        <button class="button edit-blog" data-id="${blog.id}">Edit</button>
                        <button class="button button1 delete-blog" data-id="${blog.id}">Delete</button>
                    </div>`;
                blogsList.appendChild(blogElement);
            });
            
            // Attach event listeners for Edit buttons
            document.querySelectorAll('.edit-blog').forEach(button => {
                button.addEventListener('click', (e) => {
                    const blogId = e.target.getAttribute('data-id');
                    const newTitle = prompt("Enter new title:");
                    const newContent = prompt("Enter new content:");
                    if (newTitle && newContent) {
                        fetch(`/blog/edit/${blogId}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: newTitle, content: newContent }),
                            credentials: 'same-origin'
                        })
                        .then(response => {
                            if (response.ok) {
                                alert('Blog updated successfully!');
                                loadBlogs(currentSort);
                            } else {
                                response.text().then(text => alert('Error updating blog: ' + text));
                            }
                        });
                    }
                });
            });
            
            // Attach event listeners for Delete buttons
            document.querySelectorAll('.delete-blog').forEach(button => {
                button.addEventListener('click', (e) => {
                    const blogId = e.target.getAttribute('data-id');
                    if (confirm("Are you sure you want to delete this blog?")) {
                        fetch(`/blog/delete/${blogId}`, {
                            method: 'POST',
                            credentials: 'same-origin'
                        })
                        .then(response => {
                            if (response.ok) {
                                alert('Blog deleted successfully!');
                                loadBlogs(currentSort);
                            } else {
                                response.text().then(text => alert('Error deleting blog: ' + text));
                            }
                        });
                    }
                });
            });
        })
        .catch(err => {
            console.error('Error loading blogs:', err);
            alert('Error loading blogs: ' + err.message);
        });
}





// logout button
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", (e) => {
e.preventDefault();
window.location.href = "/auth/logout";
});
document.getElementById('cancel-blog').addEventListener('click', () => {
    // Hide the blog creation form
    document.getElementById('create-blog-container').style.display = 'none';
});

// load the blogs on dashboard
// Set the initial sort option to 'date'
let currentSort = 'date';

// Load blogs initially with the default sort
loadBlogs(currentSort);

// Add event listener for the dynamic sort toggle button
document.getElementById('sort-toggle').addEventListener('click', function() {
    if (currentSort === 'date') {
        currentSort = 'comments';
        this.textContent = 'Sort by Date';
    } else {
        currentSort = 'date';
        this.textContent = 'Sort by Comments';
    }
    loadBlogs(currentSort);
});

