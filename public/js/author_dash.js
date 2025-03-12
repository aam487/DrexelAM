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
function loadBlogs() {
    fetch('/blog/all')
        .then(response => response.json())
        .then(blogs => {
            const blogsList = document.getElementById('blogs-list');
            blogs.forEach(blog => {
                const blogElement = document.createElement('div');
                blogElement.className = 'blog-card'; 
                blogElement.innerHTML = `
                    <div class="blog-content">
                        <h3>${blog.title}</h3>
                        <p>${blog.content.substring(0, 150)}...</p>
                        <button class="read-more-btn" onclick="window.location.href='/blog.html?id=${blog.id}'">Read More</button>
                    </div>`;
                blogsList.appendChild(blogElement);
            });
        });
}

// logout button
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", (e) => {
e.preventDefault();
window.location.href = "/auth/logout";
});

// load the blogs on dashboard
loadBlogs();
