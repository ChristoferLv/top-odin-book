async function register(data) {
    try {
        const request = await fetch(`http://localhost:3000/auth/signup`, {
            method: 'Post',
            body: data,
        });
        return request;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function logOut() {
    const token = localStorage.getItem("token");
    try {
        const rawResponse = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        });
    } catch (error) {
        console.log(error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.pathname = "/login";
}

async function login(credentials) {
    try {
        const rawResponse = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        return rawResponse;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getMe() {
    const token = localStorage.getItem("token");
    const meResponse = await fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (meResponse.status == 200) {
        const meContent = await meResponse.json();
        if (meContent && meContent.success) {
            return meContent;
        }
    } else {
        return null;
    }
}

async function makePost(postData) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: postData
        });

        return rawResponse;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function fetchAllPosts() {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch('http://localhost:3000/posts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawReponse.status == 200) {
        const response = await rawReponse.json();
        if (response && response.success) {
            console.log(response)
            return response;
        }
    } else {
        return null;
    }
}

async function fetchMyPosts() {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch('http://localhost:3000/posts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawReponse.ok) {
        const response = await rawReponse.json();
        if (response && response.success) {
            console.log(response)
            return response;
        }
    } else {
        return null;
    }
}






async function fetchLikedPosts() {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch('http://localhost:3000/posts/likes', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawReponse.ok) {
        const response = await rawReponse.json();
        if (response && response.success) {
            console.log(response)
            return response;
        }
    } else {
        return null;
    }
}

async function likePost(postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}/likes`, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
        });

        if (rawResponse.ok) {
            const result = await rawResponse.json();
            return result;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function dislikePost(postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}/likes`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            },
        });

        if (rawResponse.ok) {
            const result = await rawResponse.json();
            return result;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}


async function fetchBookmarkedPosts() {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch('http://localhost:3000/posts/bookmarks', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawReponse.ok) {
        const response = await rawReponse.json();
        if (response && response.success) {
            console.log(response)
            return response;
        }
    } else {
        return null;
    }
}


async function bookmarkPost(postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}/bookmarks`, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
        });

        if (rawResponse.ok) {
            const result = await rawResponse.json();
            return result;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function removeBookmarkPost(postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}/bookmarks`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            },
        });

        if (rawResponse.ok) {
            const result = await rawResponse.json();
            return result;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export {
    register,
    login,
    logOut,
    getMe,
    makePost,
    fetchAllPosts,
    fetchMyPosts,

    fetchLikedPosts,
    likePost,
    dislikePost,

    fetchBookmarkedPosts,
    bookmarkPost,
    removeBookmarkPost
}