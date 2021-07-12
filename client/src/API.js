const url = 'http://localhost:3000';


/* AUTH */
async function login(credentials) {
    let response = await fetch(url + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logout() {
    await fetch(url + '/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
}

/* MEMES */
async function getMemes() {
    const response = await fetch(url + '/api/memes');
    const memes = await response.json();
    if (response.ok) {
        return memes;
    } else return { 'err': 'GET error while retrieving memes' };
}

async function deleteMeme(id) {
    const response = await fetch('/api/memes/'+id, {
        method: 'DELETE'
    });
    if (response.ok) {
        return null;
    } else return { 'err': 'DELETE error' };
}

async function createMeme(meme){
    const response = await fetch(url + '/api/new_meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meme)
    });
    if (response.ok) {
        return null;
    } else return { 'err': 'POST error while creating meme' };
}

const API = { login, logout, getUserInfo, getMemes, deleteMeme, createMeme};
export default API;