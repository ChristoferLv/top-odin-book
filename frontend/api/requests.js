async function register(data) {
    try {
        const request = await fetch(`http://localhost:3000/auth/signup`, {
            method: 'Post',
            body: data,
        });
        return request;
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function logOut() {
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
        return null;
    }
}

async function getMe() {
    try {
        const token = localStorage.getItem("token");
        const meResponse = await fetch('http://localhost:3000/auth/me', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        return meResponse;
    } catch (e) {
        console.log(e);
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
        return null;
    }
}

async function sendUserPicture(formData) {
    try {
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
        return null;
    }
}

async function removePicture() {
    try {
        const token = localStorage.getItem("token");
        const result = await fetch("http://localhost:3000/users/picture/", {
            method: 'DELETE',

            headers: {
                Authorization: token,
            },
        })
        if (result.ok) {
            const resultData = await result.json();
            return resultData;
        } else {
            return null;
        }
    } catch (e) {
        console.log(e);
        return null;
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
        return null;
    }
}

async function sendUserBackground(formData) {
    try {
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
        return null;
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
        return null;
    }
}

async function removeBackground() {
    try {
        const token = localStorage.getItem("token");
        const result = await fetch("http://localhost:3000/users/background/", {
            method: 'DELETE',

            headers: {
                Authorization: token,
            },
        })
        if (result.ok) {
            const resultData = await result.json();
            return resultData;
        } else {
            return null;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function fetchAllUsers(signal, page) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/users?page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (request.ok) {
            const background = await request.json();
            return background;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
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
        return null;
    }
}

async function searchUsers(searchArgs, page, signal) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/users/search?page=${page}&${searchArgs}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (request.ok) {
            const result = await request.json();
            return result;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
    }
}

async function followUser(userId) {
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
        return null;
    }
}

async function unfollowUser(userId) {
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
            const result = await request.json();
            return result;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function deleteFollower(userId) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/follows/remove/${userId}`, {
            method: 'DELETE',
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
        return null;
    }
}

async function getFollowSuggestions() {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch('http://localhost:3000/follows', {
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
        return null;
    }
}

async function fetchFollowersOfUser(username, signal) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/follows/${username}/followers`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (request.ok) {
            const result = await request.json();
            return result;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
    }
}

async function fetchWhoUserIsFollowing(username, signal) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/follows/${username}/following`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (request.ok) {
            const result = await request.json();
            return result;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
    }
}


















async function makePost(postData) {
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
        return null;
    }
}

async function fetchAllPosts(page, signal, getUpToPage) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts?onFeed=true&page=${page}${getUpToPage ? "&upto" : ""}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (rawResponse.status == 200) {
            const response = await rawResponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
    }
}

async function fetchPostsByUserId(userId, signal, page) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts?onFeed=false&userId=${userId}&page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }, signal: signal
        });
        if (rawResponse.ok) {
            const response = await rawResponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (e) {
        if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
    }
}

async function fetchPostById(postId) {
    try {
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
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function deletePost(postId) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            },
        });

        return rawResponse;
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function searchPosts(searchArgs, page, signal) {
    try {
        const token = localStorage.getItem("token");
        const rawResponse = await fetch(`http://localhost:3000/posts/search?page=${page}&${searchArgs}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (rawResponse.ok) {
            const response = await rawResponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (e) {
        if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
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
        return null;
    }
}

async function fetchTrendingPosts() {
    try {
        const token = localStorage.getItem("token");
        const rawReponse = await fetch('http://localhost:3000/posts/trending', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (rawReponse.ok) {
            const response = await rawReponse.json();
            return response;
        } else {
            return null;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}





















async function fetchNotificationsCount() {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/notifications/count`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        });
        if (request.ok) {
            const midia = await request.json();
            return midia;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function fetchNotifications() {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/notifications`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        });
        if (request.ok) {
            const midia = await request.json();
            return midia;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function markNotificationsAsRead(signal) {
    try {
        const token = localStorage.getItem("token");
        const request = await fetch(`http://localhost:3000/notifications`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (request.ok) {
            const midia = await request.json();
            return midia;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
    }
}



























async function fetchRepliesByUserId(userId, signal, page) {
    try {
        const token = localStorage.getItem("token");
        const rawReponse = await fetch(`http://localhost:3000/posts/replies?userId=${userId}${page ? ('&page=' + page) : ""}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (rawReponse.ok) {
            const response = await rawReponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
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
        return null;
    }
}

async function fetchRepliesOfPost(postId, signal, page) {
    try {
        const token = localStorage.getItem("token");
        const rawReponse = await fetch(`http://localhost:3000/posts/${postId}/replies?page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (rawReponse.ok) {
            const response = await rawReponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
        return null;
    }
}














async function fetchLikedPostsByUserId(userId, signal, page) {
    try {
        const token = localStorage.getItem("token");
        const rawReponse = await fetch(`http://localhost:3000/posts/likes?userId=${userId}${page ? ('&page=' + page) : ""}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (rawReponse.ok) {
            const response = await rawReponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
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
        return null;
    } catch (error) {
        console.log(error);
        return null;
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
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}





















async function fetchSharedPostsByUserId(userId, signal, page) {
    try {
        const token = localStorage.getItem("token");
        const rawReponse = await fetch(`http://localhost:3000/posts/shares?userId=${userId}${page ? ('&page=' + page) : ""}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            signal: signal
        });
        if (rawReponse.ok) {
            const response = await rawReponse.json();
            if (response && response.success) {
                return response;
            }
        } else {
            return null;
        }
    } catch (e) {
          if (e.name === 'AbortError') {
            // Safely ignore or log the cancellation
            return;
        }
        console.log(e);
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
        return null;
    } catch (error) {
        console.log(error);
        return null;
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
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}














async function fetchBookmarkedPosts() {
    try {
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
    } catch (e) {
        console.log(e);
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
        return null;
    } catch (error) {
        console.log(error);
        return null;
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
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}









export {
    register,
    login,
    logOut,
    getMe,
    editUser,
    sendUserPicture,
    removePicture,
    fetchUserPicture,
    sendUserBackground,
    fetchUserBackground,
    removeBackground,
    fetchAllUsers,
    fetchUserByUsername,
    searchUsers,

    followUser,
    unfollowUser,
    deleteFollower,
    getFollowSuggestions,
    fetchFollowersOfUser,
    fetchWhoUserIsFollowing,

    makePost,
    fetchAllPosts,
    fetchPostsByUserId,
    fetchPostById,
    deletePost,
    searchPosts,
    fetchPostMidia,
    fetchTrendingPosts,

    fetchNotificationsCount,
    fetchNotifications,
    markNotificationsAsRead,

    fetchRepliesByUserId,
    makeReply,
    fetchRepliesOfPost,

    fetchLikedPostsByUserId,
    likePost,
    dislikePost,

    fetchSharedPostsByUserId,
    sharePost,
    unsharePost,

    fetchBookmarkedPosts,
    bookmarkPost,
    removeBookmarkPost
}