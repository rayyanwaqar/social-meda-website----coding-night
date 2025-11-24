// Function to switch between Login/Signup/Feed screens
function switchScreen(screenId) {
    // Hide all main screens first
    document.querySelectorAll('#login-screen, #signup-screen, #feed-screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Show the requested screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // Set the body class for styling (if not already set)
    document.body.classList.add(document.body.classList.contains('dark') ? 'dark' : 'light');

    // If switching to feed, make sure posts are rendered
    if (screenId === 'feed-screen') {
        renderPosts();
    }
}

// Initial dummy posts (to show something on the feed)
let posts = [
    { id: 1, user: 'Ahmed K.', content: 'Just finished setting up my new workspace! Feeling motivated.', image: null, likes: 5 },
    { id: 2, user: 'Fatima Z.', content: 'Learning CSS Grid, it makes responsiveness so much easier!', image: 'https://images.unsplash.com/photo-1549692520-219cb8d99c4c?w=400&auto=format&fit=crop', likes: 12 }
];

// Function to render all posts
function renderPosts() {
    const postsContainer = document.getElementById('posts');
    if (!postsContainer) return; // Safety check

    postsContainer.innerHTML = ''; // Clear existing posts

    // Sort posts by ID (newest first)
    [...posts].sort((a, b) => b.id - a.id).forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h4>@${post.user}</h4>
            <p>${post.content}</p>
            ${post.image && post.image.trim() ? `<img src="${post.image.trim()}" alt="Post Image">` : ''}
            <div class="post-actions">
                <button class="like-btn" onclick="toggleLike(${post.id})">Like (${post.likes})</button>
                <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        postsContainer.appendChild(postElement); 
    });
}

// Global functions (needed because they are called directly from HTML 'onclick')

window.toggleLike = function(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        // Simple toggle logic (increase likes by 1)
        post.likes += 1; 
        renderPosts();
    }
};

window.deletePost = function(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        posts = posts.filter(p => p.id !== postId);
        renderPosts();
    }
};

// Function to handle post submission
document.getElementById('post-btn')?.addEventListener('click', () => {
    const content = document.querySelector('.create-post textarea').value.trim();
    const image = document.getElementById('image-input').value.trim();
    
    if (content) {
        const newPost = {
            id: Date.now(), // Unique ID
            user: 'CurrentUser', // Placeholder
            content: content,
            image: image || null,
            likes: 0
        };
        posts.push(newPost);
        renderPosts();
        document.querySelector('.create-post textarea').value = '';
        document.getElementById('image-input').value = '';
    } else {
        alert('Please write something before posting!');
    }
});

// Function to toggle theme
document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('light')) {
        body.classList.replace('light', 'dark');
        document.getElementById('theme-toggle').textContent = '🌙';
    } else {
        body.classList.replace('dark', 'light');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
});

// Mock Login Action
document.getElementById('login-btn')?.addEventListener('click', () => {
    // Placeholder for actual login logic
    console.log('Attempting login...');
    // After successful login:
    switchScreen('feed-screen');
});

// Mock Logout Action
document.getElementById('logout-btn')?.addEventListener('click', () => {
    switchScreen('login-screen');
});

// Mock Signup Action
document.getElementById('signup-btn')?.addEventListener('click', () => {
    // Placeholder for actual signup logic
    console.log('Attempting signup...');
    // After successful signup, redirect to feed or login:
    switchScreen('login-screen'); // Redirect to login page after signup
    alert('Account created! Please log in.');
});

// Initial load: Start on the login screen
switchScreen('login-screen');
document.getElementById('theme-toggle').textContent = '☀️'; // Set initial button icon
