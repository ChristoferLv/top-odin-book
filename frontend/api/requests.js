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

async function getAllPosts() {
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


export {
    register,
    login,
    logOut,
    getMe,
    makePost,
    getAllPosts
}