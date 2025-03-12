// public/js/reader_dash.js
// Fetch and display blogs, blogs are clickable to expand the view in new page
// Function to load blogs with a given sort option
function loadBlogs(sortOption = 'date') {
    fetch('/blog/all?sort=' + sortOption)
        .then(response => response.json())
        .then(blogs => {
            const blogsList = document.getElementById('blogs-list');
            blogsList.innerHTML = ""; // Clear existing blogs
            blogs.forEach(blog => {
                const blogElement = document.createElement('div');
                blogElement.className = 'blog-card'; 
                blogElement.innerHTML = `
                    <div class="blog-content">
                        <h3>${blog.title}</h3>
                        <p>By: ${blog.author_name}</p>
                        <p>Posted on: ${new Date(blog.created_at).toLocaleDateString()}</p>
                        <p>${blog.content.substring(0, 150)}...</p>
                        <button class="read-more-btn" onclick="window.location.href='/blog.html?id=${blog.id}'">Read More</button>
                    </div>`;
                blogsList.appendChild(blogElement);
            });
        })
        .catch(err => {
            console.error('Error loading blogs:', err);
            alert('Error loading blogs: ' + err.message);
        });
}

// Set the initial sort option
let currentSort = 'date';

// Load blogs initially with sort by date
loadBlogs(currentSort);

// Add event listener for the dynamic toggle button
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




// add a comment to the blog
function showCommentForm(blog_id) {
	document.getElementById('comment-form').style.display = 'block';
	document.getElementById('add-comment-form').setAttribute('data-blog-id', blog_id);
}

// add listener for creating a comment
document.getElementById('add-comment-form')?.addEventListener('submit', function (event) {
	event.preventDefault();
	
	// get the content and blog id
	const content = document.getElementById('comment-content').value;
	const blog_id = document.getElementById('add-comment-form').getAttribute('data-blog-id');

	// Check if content or blogId is invalid
	if (!content || !blog_id) {
		alert('Please provide valid content and blog ID');
		return;
	}

	// post comment through comment blog route
	fetch('/blog/comment', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ blog_id, content })
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

// logout button
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", (e) => {
e.preventDefault();
window.location.href = "/auth/logout";
});

document.getElementById('cancel-comment')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('comment-content').value = "";
    // Optionally hide the comment form if that is desired:
    document.getElementById('comment-form').style.display = 'none';
});
document.getElementById('sort-date').addEventListener('click', function() {
    loadBlogs('date'); // This will sort by creation date (default ordering)
});

document.getElementById('sort-comments').addEventListener('click', function() {
    loadBlogs('comments'); // This will sort by comment count descending
});


// load the blogs on reader dashboard
loadBlogs('date');
