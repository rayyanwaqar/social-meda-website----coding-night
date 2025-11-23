
console.log("JavaScript is running ====>");

var themeToggle = document.querySelector("#theme-toggle");
var savedTheme = localStorage.getItem("theme") || "light";
document.body.className = savedTheme;

themeToggle.addEventListener("click", function() {
    if (document.body.className === "light") {
        document.body.className = "dark";
        localStorage.setItem("theme", "dark");
    } else {
        document.body.className = "light";
        localStorage.setItem("theme", "light");
    }
});

var signupScreen = document.querySelector("#signup-screen");
var loginScreen = document.querySelector("#login-screen");
var feedScreen = document.querySelector("#feed-screen");

var signupName = document.querySelector("#signup-name");
var signupEmail = document.querySelector("#signup-email");
var signupPassword = document.querySelector("#signup-password");
var signupBtn = document.querySelector("#signup-btn");
var gotoLogin = document.querySelector("#goto-login");

var loginEmail = document.querySelector("#login-email");
var loginPassword = document.querySelector("#login-password");
var loginBtn = document.querySelector("#login-btn");
var gotoSignup = document.querySelector("#goto-signup");
var welcomeUser = document.querySelector("#welcome-user");

var postText = document.querySelector("#post-text");
var postImage = document.querySelector("#post-image");
var postBtn = document.querySelector("#post-btn");
var postsContainer = document.querySelector("#posts");

var logoutBtn = document.querySelector("#logout-btn");

var searchInput = document.querySelector("#search");
var sortSelect = document.querySelector("#sort");

var imageFileInput = document.querySelector("#image-file-input");
var imageUploadBtn = document.querySelector("#image-upload-btn");

var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUser) {
    signupScreen.style.display = "none";
    loginScreen.style.display = "none";
    feedScreen.style.display = "block";
    welcomeUser.textContent = "Welcome, " + loggedInUser.name;
    renderPosts();
}

gotoLogin.addEventListener("click", function() {
    signupScreen.style.display = "none";
    loginScreen.style.display = "block";
});
gotoSignup.addEventListener("click", function() {
    loginScreen.style.display = "none";
    signupScreen.style.display = "block";
});

signupBtn.addEventListener("click", function() {
    var name = signupName.value.trim();
    var email = signupEmail.value.trim();
    var password = signupPassword.value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    var users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(function(u){ return u.email === email; })) {
        alert("Email already registered");
        return;
    }

    var user = { name: name, email: email, password: password };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful!");
    signupScreen.style.display = "none";
    loginScreen.style.display = "block";
});

loginBtn.addEventListener("click", function() {
    var email = loginEmail.value.trim();
    var password = loginPassword.value.trim();

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    var users = JSON.parse(localStorage.getItem("users")) || [];
    var user = users.find(function(u){ return u.email === email && u.password === password; });

    if (user) {
        alert("Login successful!");
        loginScreen.style.display = "none";
        feedScreen.style.display = "block";
        welcomeUser.textContent = "Welcome, " + user.name;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        loggedInUser = user;
        renderPosts();
    } else {
        alert("Invalid email or password");
    }
});

logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("loggedInUser");
    feedScreen.style.display = "none";
    loginScreen.style.display = "block";

    loginEmail.value = "";
    loginPassword.value = "";
});

function renderPosts() {
    postsContainer.innerHTML = "";

    var users = JSON.parse(localStorage.getItem("users")) || [];
    var allPosts = [];

    users.forEach(function(user){
        var postsKey = "posts_" + user.email;
        var posts = JSON.parse(localStorage.getItem(postsKey)) || [];
        posts.forEach(function(p){
            p.userName = user.name;
            p.userEmail = user.email;
            allPosts.push(p);
        });
    });

    allPosts = searchPosts(allPosts);
    allPosts = sortPosts(allPosts);

    allPosts.forEach(function(p){
        var postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.setAttribute("data-id", p.id);
        postDiv.setAttribute("data-email", p.userEmail);

        var imgHTML = p.image ? '<img src="' + p.image + '">' : '';

        var actionsHTML = '<button class="like-btn">Like (' + p.likes + ')</button>';

        if (loggedInUser && loggedInUser.email === p.userEmail) {
            actionsHTML += '<button class="edit-btn">Edit</button>';
            actionsHTML += '<button class="delete-btn">Delete</button>';
        }

        postDiv.innerHTML = 
            '<div class="post-header">' +
                '<span class="post-name">' + p.userName + '</span>' +
                '<span class="post-date">' + p.date + '</span>' +
            '</div>' +
            '<p>' + p.text + '</p>' +
            imgHTML +
            '<div class="post-actions">' +
                actionsHTML +
            '</div>';

        postsContainer.appendChild(postDiv);
    });
}

postBtn.addEventListener("click", function() {
    var text = postText.value.trim();
    var image = postImage.value.trim();

    if (!text) {
        alert("Post cannot be empty");
        return;
    }

    var user = JSON.parse(localStorage.getItem("loggedInUser"));
    var postsKey = "posts_" + user.email;
    var posts = JSON.parse(localStorage.getItem(postsKey)) || [];

    var newPost = {
        id: Date.now(),
        text: text,
        image: image,
        likes: 0,
        date: new Date().toLocaleString()
    };

    posts.unshift(newPost);
    localStorage.setItem(postsKey, JSON.stringify(posts));

    postText.value = "";
    postImage.value = "";

    renderPosts();
});

postsContainer.addEventListener("click", function(e) {
    var target = e.target;
    var postDiv = target.closest(".post");
    if (!postDiv) return;

    var postId = Number(postDiv.getAttribute("data-id"));
    var postOwnerEmail = postDiv.getAttribute("data-email");

    var postsKey = "posts_" + postOwnerEmail;
    var posts = JSON.parse(localStorage.getItem(postsKey)) || [];

    if (target.classList.contains("like-btn")) {
        posts.forEach(function(p){
            if (p.id === postId) {
                p.likes = p.likes === 0 ? 1 : 0;
            }
        });
        localStorage.setItem(postsKey, JSON.stringify(posts));
        renderPosts();
    }

    if (target.classList.contains("delete-btn")) {
        if (loggedInUser.email === postOwnerEmail) {
            if (confirm("Are you sure you want to delete this post?")) {
                posts = posts.filter(function(p){ return p.id !== postId; });
                localStorage.setItem(postsKey, JSON.stringify(posts));
                renderPosts();
            }
        }
    }

    if (target.classList.contains("edit-btn")) {
        if (loggedInUser.email === postOwnerEmail) {
            posts.forEach(function(p){
                if (p.id === postId) {
                    var newText = prompt("Update your post:", p.text);
                    if (newText !== null) {
                        p.text = newText;
                    }
                }
            });
            localStorage.setItem(postsKey, JSON.stringify(posts));
            renderPosts();
        }
    }
});

searchInput.addEventListener("input", function(){ renderPosts(); });
sortSelect.addEventListener("change", function(){ renderPosts(); });

function searchPosts(posts) {
    var term = searchInput.value.toLowerCase();
    return posts.filter(function(p){ return p.text.toLowerCase().includes(term); });
}

function sortPosts(posts) {
    if (sortSelect.value === "latest") return posts.sort(function(a,b){ return b.id - a.id; });
    if (sortSelect.value === "oldest") return posts.sort(function(a,b){ return a.id - b.id; });
    if (sortSelect.value === "liked") return posts.sort(function(a,b){ return b.likes - a.likes; });
    return posts;
}

imageUploadBtn.addEventListener("click", function() {
    imageFileInput.click();
});

imageFileInput.addEventListener("change", function(e){
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(event) {
        postImage.value = event.target.result;
    }
    reader.readAsDataURL(file);
});
