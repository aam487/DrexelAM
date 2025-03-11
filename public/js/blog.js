// public/js/blog.js
(async function() {
  // Get the table body element for comments (used later)
  const commentsTableBody = document.getElementById("commentsTable");
  const commentTextarea = document.getElementById("comment");
  const submitCommentBtn = document.getElementById("submitComment");
  const viewProfileBtn = document.getElementById("viewProfile");
  const logoutBtn = document.getElementById("logout");

  // Function to load blog data (blog and its comments)
  async function loadBlogData(blogIdToLoad) {
    try {
      const response = await fetch(`/blog/${blogIdToLoad}`);
      if (!response.ok) {
        throw new Error("Failed to load blog data.");
      }
      const data = await response.json();

      // Populate comments table
      commentsTableBody.innerHTML = "";
      if (data.comments && data.comments.length > 0) {
        data.comments.forEach((comment) => {
          const row = document.createElement("tr");
          const cell = document.createElement("td");
          cell.textContent = comment.content;
          row.appendChild(cell);
          commentsTableBody.appendChild(row);
        });
      } else {
        commentsTableBody.innerHTML = "<tr><td>No comments yet.</td></tr>";
      }
    } catch (error) {
      console.error("Error loading blog data:", error);
      alert("Error loading blog data.");
    }
  }

 
  // Determine blogId from the URL and ensure it's a valid number
let pathParts = window.location.pathname.split("/");
let lastPart = pathParts[pathParts.length - 1];
let blogId = parseInt(lastPart, 10);
if (isNaN(blogId) || lastPart.toLowerCase().includes("blog")) {
  try {
    const response = await fetch('/blog/all?sort=date');
    if (!response.ok) {
      throw new Error("Failed to fetch blogs.");
    }
    const data = await response.json();
    if (data && data.length > 0) {
      // Use the id of the first blog as the default
      blogId = data[0].id;
      // Update the URL so that subsequent actions use the valid blog id
      window.history.replaceState({}, "", `/blog/${blogId}`);
      await loadBlogData(blogId);
    } else {
      commentsTableBody.innerHTML = "<tr><td>No blogs available.</td></tr>";
      // Disable the comment submission button when no blog exists
      submitCommentBtn.disabled = true;
    }
  } catch (error) {
    console.error("Error fetching default blog:", error);
    alert("Error fetching default blog.");
  }
} else {
  await loadBlogData(blogId);
}



  // Event listener for submitting a new comment
  submitCommentBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const content = commentTextarea.value.trim();
    if (!content) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const response = await fetch("/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'same-origin',
        body: JSON.stringify({ blog_id: blogId, content })
      });
      
      if (response.ok) {
        commentTextarea.value = "";
        await loadBlogData(blogId); // Refresh comments after posting
      } else {
        const errorText = await response.text();
        alert("Failed to post comment: " + errorText);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Error posting comment.");
    }
  });

  // Redirect to profile page
  viewProfileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/profile";
  });

  // Logout handler
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/auth/logout";
  });
})();
