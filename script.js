// Utility functions for managing cookies
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// State initialization
let likeCount = parseInt(getCookie("likes")) || 0;
let dislikeCount = parseInt(getCookie("dislikes")) || 0;
let comments = JSON.parse(getCookie("comments") || "[]");
let userChoice = getCookie("userChoice");
let userCommented = getCookie("userCommented") === "true"; // Tracks if the user has commented

// Update the UI
function updateUI() {
    document.getElementById("like-count").textContent = likeCount;
    document.getElementById("dislike-count").textContent = dislikeCount;

    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";
    comments.forEach(comment => {
        const li = document.createElement("li");
        li.textContent = comment;
        commentsList.appendChild(li);
    });

    // Enable/Disable Like/Dislike buttons based on userChoice
    document.getElementById("like-button").disabled = userChoice === "like" || userChoice === "dislike";
    document.getElementById("dislike-button").disabled = userChoice === "like" || userChoice === "dislike";

    // Enable/Disable comment input and button based on userCommented
    document.getElementById("submit-comment").disabled = userCommented;
    document.getElementById("comment-input").disabled = userCommented;
}

// Like button
document.getElementById("like-button").addEventListener("click", () => {
    if (!userChoice || userChoice === "reset") {
        likeCount++;
        setCookie("likes", likeCount, 7);
        setCookie("userChoice", "like", 7);
        userChoice = "like";
        updateUI();
    }
});

// Dislike button
document.getElementById("dislike-button").addEventListener("click", () => {
    if (!userChoice || userChoice === "reset") {
        dislikeCount++;
        setCookie("dislikes", dislikeCount, 7);
        setCookie("userChoice", "dislike", 7);
        userChoice = "dislike";
        updateUI();
    }
});

// Submit comment
document.getElementById("submit-comment").addEventListener("click", () => {
    const commentInput = document.getElementById("comment-input");
    const comment = commentInput.value.trim();

    if (comment && !userCommented) {
        comments.push(comment);
        setCookie("comments", JSON.stringify(comments), 7);
        setCookie("userCommented", "true", 7); // Mark that the user has commented
        userCommented = true;
        commentInput.value = "";
        updateUI();
    }
});

// Reset button
document.getElementById("reset-button").addEventListener("click", () => {
    deleteCookie("likes");
    deleteCookie("dislikes");
    deleteCookie("comments");
    deleteCookie("userChoice");
    deleteCookie("userCommented");

    likeCount = 0;
    dislikeCount = 0;
    comments = [];
    userChoice = "reset";
    userCommented = false;

    updateUI();
});

// Initialize the page
updateUI();
