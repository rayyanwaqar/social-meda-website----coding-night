// Function to switch between Login/Signup/Feed screens
function switchScreen(screenId) {
    document.querySelectorAll('.auth-screen, #feed-screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');

    // If switching to feed, update the header text
    if (screenId === 'feed-screen') {
        document.querySelector('h2').textContent = 'Social Feed';
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
    postsContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h4>@${post.user}</h4>
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image">` : ''}
            <div class="post-actions">
                <button class="like-btn" onclick="toggleLike(${post.id})">Like (${post.likes})</button>
                <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        postsContainer.prepend(postElement); // Add new post to the top
    });
}

// Function to handle post submission
document.getElementById('post-btn').addEventListener('click', () => {
    const content = document.getElementById('post-input').value.trim();
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
        document.getElementById('post-input').value = '';
        document.getElementById('image-input').value = '';
    } else {
        alert('Please write something before posting!');
    }
});

// Function to toggle theme
document.getElementById('theme-toggle').addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('light')) {
        body.classList.replace('light', 'dark');
    } else {
        body.classList.replace('dark', 'light');
    }
});

// Mock Login Action
document.getElementById('login-btn').addEventListener('click', () => {
    // In a real app, you would check credentials here
    switchScreen('feed-screen');
    renderPosts(); // Load posts after successful login
});

// Mock Logout Action
document.getElementById('logout-btn').addEventListener('click', () => {
    switchScreen('login-screen');
});

// Initial load
switchScreen('login-screen');
