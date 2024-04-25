import axios from "axios";
import UserContext from "src/store/UserContext";


const uploadMusicAPI = 'http://3.26.210.47/api/music/inactive-music/';
const loginAPI = 'http://3.26.210.47/api/user/api/login/';
const registerAPI = 'http://3.26.210.47/api/user/register/';
const verifyAPI = 'http://3.26.210.47/api/user/password-reset/verify/';
const sendCodeAPI = 'http://3.26.210.47/api/user/password-reset/request/';
const resendEmailAPI = 'http://3.26.210.47/api/user/resend-email/';
const sendCodeRegisterAPI = 'http://3.26.210.47/api/user/email-send/';
const searchAPI = 'http://3.26.210.47/api/search/search/?q={}';
const userAPI = "http://3.26.210.47/api/user/get-user-id/"

const approveAPI = "http://3.26.210.47/api/music/set-music-active/";
const deleteSongAPI = "http://3.26.210.47/api/music/delete/";
const postAPI = "http://3.26.210.47/api/homepage_poster/upload_poster/";
const albumAPI = "http://3.26.210.47/api/album/top-albums/";



const followUserAPI = `http://3.26.210.47/api/user/follow/`;
const unfollowUserAPI = 'http://3.26.210.47/api/user/unfollow/';
const addMusicAPI = "http://3.26.210.47/api/playlist/add_music/";

const musicianAPI = 'http://3.26.210.47/api/musician/non-musician-users/';
const rankingAPI = "http://3.26.210.47/api/music/top-music/";
const approveMusicianAPI = 'http://3.26.210.47/api/musician/update-status/';


export const login = async (email: string, password: string) => {
    try {
        const response = await fetch(loginAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return data;
    } catch (error) {
        throw error;
    }
};

export const register = async (email: string, username: string, password: string, verification_code: string, gender:string) => {
    try {
        const response = await fetch(registerAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                username,
                password,
                verification_code,
                gender
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = '';

            if (data.email && data.email.includes("custom user with this email already exists.")) {
                errorMessage += "Email already exists. ";
            }
            if (data.username && data.username.includes("custom user with this username already exists.")) {
                errorMessage += "Username already exists. ";
            }

            // If no specific errors from API, use a generic message
            if (!errorMessage) {
                errorMessage = 'Register failed';
            }
            throw new Error(errorMessage);
        }
        return data;
    } catch (error) {
        throw error;
    }
};

export const verifyEmail = async (email: string, new_password: string, verification_code:string)=> {
    try {
        const response = await fetch(verifyAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                new_password,
                verification_code
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Reset failed');
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export const sendCode = async (email: string) => {
    try {
        const response = await fetch(sendCodeAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            }),
        });

        if (!response.ok) {
            const responseBody = await response.json();  // try to get any error details
            console.error("API Error Response:", responseBody);
            throw new Error('Verification failed');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};


export const sendEmailForRegister = async(email: string) => {
    try {
        const response = await fetch(sendCodeRegisterAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            }),
        });

        if (!response.ok) {
            await response.json();  // try to get any error details
            throw new Error('Email failed to send');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const resendEmailForRegister = async(email: string) => {
    try {
        const response = await fetch(resendEmailAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            }),
        });

        if (!response.ok) {
            await response.json();  // try to get any error details
            throw new Error('Email failed to send');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};



export const searchKeyWord = async(searchTerm : string) => {
    try {
        const searchAPI = `http://3.26.210.47/api/search/search/?q=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(searchAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            await response.json();  // try to get any error details
            throw new Error('Search API Response Not OK');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}



export const getUserDetails = async (authHeaders: Record<string, string>) => {
    try {
        const response = await fetch(userAPI, {
            method: 'GET',
            headers: {
                ...authHeaders,
                'Content-Type': 'application/json',

            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error('Failed to fetch user details: ' + (errorDetails.message || 'Unknown error'));
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const getUploadMusic = async(token: string | null) => {
    try {
        const response = await fetch(uploadMusicAPI, {
            method: 'GET',
            headers: {
                "Authorization": `token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("ERROR");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return ;
    }
}

export const getAlbum = async(token: string | null) => {
    try {
        const response = await fetch(albumAPI, {
            method: 'GET',
            headers: {
                // "Authorization": `token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("ERROR");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export const approveMusic = async(id: number, token: string | null) => {
    try {
        const response = await fetch(approveAPI+`${id}/`, {
            method: 'PUT',
            headers: {
                "Authorization": `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id
            }),
        });

        if (!response.ok) {
            throw new Error("ERROR");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}

export const deleteMusic = async(id: number) => {
    try {
        const response = await fetch(deleteSongAPI+`${id}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": `token ${UserContext.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id
            }),
        });

        if (!response.ok) {
            throw new Error("ERROR");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}

export const uploadPost = async(imageName: FormData | null, token: string | null) => {
    try {
        const response = await axios.post(postAPI, imageName, {
            headers: {
                'Authorization': `token ${token}`,
            },
        });
        console.log('Upload successful:', response.data);
    } catch (error) {
        throw error;
    }
}

export const ranking = async(token: string | null) => {
    try {
        const response = await fetch(rankingAPI, {
            method: 'GET',
            headers: {
                // 'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error("ERROR");
        }
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}

export const followUserSearch = async (userID:string)=>{
    try {
        const response = await fetch(followUserAPI + `${userID}/`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${UserContext.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("Successfully followed the user");
        } else {
            console.error("Failed to follow the user");
            const data = await response.json();
            console.error(data); // This will give you more details about the error
        }

        return await response.json();
    } catch (error) {
        console.error("There was an error while making the request:", error);
    }
}

export const unfollowUserSearch = async (userID:string)=>{
    try {
        const response = await fetch(unfollowUserAPI + `${userID}/`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${UserContext.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("Successfully unfollowed the user");
        } else {
            console.error("Failed to unfollow the user");
            const data = await response.json();
            console.error(data); // This will give you more details about the error
        }

        return await response.json();
    } catch (error) {
        console.error("There was an error while making the request:", error);
    }
}

export const addMusicToPlaylist = async (music_id: string | null, user_id: string | null,playList_ID: string | null) => {

    const response = await fetch(addMusicAPI, {
        method: 'POST',
        headers: {
            'Authorization': `token ${UserContext.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            music_id: music_id,
            user_id: user_id,
            playlist_id: playList_ID,
        })
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to add music to playlist');
    }
}

export const getMusician = async () => {
    const response = await fetch(musicianAPI, {
        method: 'GET',
        headers: {
            'Authorization': `token ${UserContext.token}`,
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to add music to playlist');
    }
}

export const approveMusician = async(id: number, token: string | null) => {
    try {
        const response = await fetch(approveMusicianAPI+`${id}/`, {
            method: 'PATCH',
            headers: {
                "Authorization": `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id
            }),
        });

        if (!response.ok) {
            throw new Error("ERROR");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
}
