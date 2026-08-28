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

async function editUser(data) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/users`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        });
        if (request.ok) {
            const messages = await request.json();
            return messages;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function sendUserPicture(data) {
    try {
        const formData = new FormData();
        formData.append("picture", data.picture);
        const token = localStorage.getItem("token");
        const result = await fetch("http://localhost:3000/users/picture/", {

            method: 'Post',
            body: formData,

            headers: {
                Authorization: token,
            },
        })
        const resultData = await result.json();
        return resultData;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function fetchUserPicture(userId) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch("http://localhost:3000/users/picture/" + userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const picture = await request.json();
            return picture;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function sendUserBackground(data) {
    try {
        const formData = new FormData();
        formData.append("background", data.background);
        const token = localStorage.getItem("token");
        const result = await fetch("http://localhost:3000/users/background/", {

            method: 'Post',
            body: formData,

            headers: {
                Authorization: token,
            },
        })
        const resultData = await result.json();
        return resultData;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function fetchUserBackground(userId) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch("http://localhost:3000/users/background/" + userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const background = await request.json();
            return background;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function fetchAllUsers() {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/users`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const background = await request.json();
            return background;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function fetchUserByUsername(username) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/users/find/${username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const result = await request.json();
            return result;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function searchUsers(searchParam) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch('http://localhost:3000/users/search?q=' + searchParam, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const result = await request.json();
            return result;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function followUser(userId) {
    console.log("follow user")

    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/users/${userId}/follows`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const result = await request.json();
            return result;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function unfollowUser(userId) {
    console.log("unfollow user")
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/users/${userId}/follows`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const background = await request.json();
            return background;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}
















async function makePost(postData) {
    console.log("makingpost")
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: postData
        });

        if (rawResponse.status == 200) {
            const response = await rawResponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function fetchAllPosts() {
    const token = localStorage.getItem("token");
    const rawResponse = await fetch('http://localhost:3000/posts?onFeed=true', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawResponse.status == 200) {
        const response = await rawResponse.json();
        if (response && response.success) {
            return response;
        }
    } else {
        return null;
    }
}

async function fetchPostsByUserId(userId) {
    const token = localStorage.getItem("token");
    const rawResponse = await fetch('http://localhost:3000/posts?onFeed=false&userId=' + userId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawResponse.ok) {
        const response = await rawResponse.json();
        if (response && response.success) {
            return response;
        }
    } else {
        return null;
    }
}

//CHECK IF BEING USED, IF NOT, REMOVE ==========================================================================
async function fetchMyPosts() {
    const token = localStorage.getItem("token");
    const rawResponse = await fetch('http://localhost:3000/posts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawResponse.ok) {
        const response = await rawResponse.json();
        if (response && response.success) {
            return response;
        }
    } else {
        return null;
    }
}

async function fetchPostById(postId) {
    console.log("getting post", postId)
    const token = localStorage.getItem("token");
    const rawResponse = await fetch('http://localhost:3000/posts/' + postId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawResponse.ok) {
        const response = await rawResponse.json();
        if (response && response.success) {
            return response;
        }
    } else {
        return null;
    }
}

async function searchPosts(searchParam) {
    const token = localStorage.getItem("token");
    const rawResponse = await fetch('http://localhost:3000/posts/search?q=' + searchParam, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (rawResponse.ok) {
        const response = await rawResponse.json();
        if (response && response.success) {
            return response;
        }
    } else {
        return null;
    }
}


async function fetchPostMidia(postId) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/posts/${postId}/midia`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (request.ok) {
            const midia = await request.json();
            return midia;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}





















async function fetchRepliesByUserId(userId) {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch('http://localhost:3000/posts/replies?userId=' + userId, {
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
            return response;
        }
    } else {
        return null;
    }
}

//CHECK IF BEING USED, IF NOT, REMOVE ==========================================================================
async function fetchMyReplies() {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch(`http://localhost:3000/posts/replies`, {
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
            return response;
        }
    } else {
        return null;
    }
}

async function makeReply(data, postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}/replies`, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: data
        });

        if (rawResponse.ok) {
            const response = await rawResponse.json();
            if (response && response.success) {
                return response;
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function fetchRepliesOfPost(postId) {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch(`http://localhost:3000/posts/${postId}/replies`, {
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
            return response;
        }
    } else {
        return null;
    }
}














async function fetchLikedPostsByUserId(userId) {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch('http://localhost:3000/posts/likes?userId=' + userId, {
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
            return response;
        }
    } else {
        return null;
    }
}

//CHECK IF BEING USED, IF NOT, REMOVE ==========================================================================
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





















async function fetchSharedPostsByUserId(userId) {
    const token = localStorage.getItem("token");
    const rawReponse = await fetch('http://localhost:3000/posts/shares?userId=' + userId, {
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
            return response;
        }
    } else {
        return null;
    }
}

async function sharePost(postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}/shares`, {
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

async function unsharePost(postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}/shares`, {
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
    editUser,
    sendUserPicture,
    fetchUserPicture,
    sendUserBackground,
    fetchUserBackground,
    fetchAllUsers,
    fetchUserByUsername,
    searchUsers,
    fetchPostMidia,

    followUser,
    unfollowUser,

    makePost,
    fetchAllPosts,
    fetchPostsByUserId,
    fetchMyPosts,
    fetchPostById,
    searchPosts,

    fetchRepliesByUserId,
    fetchMyReplies,
    makeReply,
    fetchRepliesOfPost,

    fetchLikedPostsByUserId,
    fetchLikedPosts,
    likePost,
    dislikePost,

    fetchSharedPostsByUserId,
    sharePost,
    unsharePost,

    fetchBookmarkedPosts,
    bookmarkPost,
    removeBookmarkPost
}