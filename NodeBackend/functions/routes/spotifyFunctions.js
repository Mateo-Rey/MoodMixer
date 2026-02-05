import { db } from "../db/firebase.js";
import { spotifyFetch, refreshAccessToken } from "../services/spotify.service.js";

const searchSpotify = async (req, res) => {
    try {
        // 1. Get JWT from cookie or Authorization header
        const token = req.cookies.session
        if (!token) return res.status(401).json({ error: "Not logged in" });
    
        const session = verifySession(token);
        const userId = session.spotifyUserId;
    
        // 2. Lookup refresh token in Firebase
        const doc = await db.collection("spotifyTokens").doc(userId).get();
        if (!doc.exists) return res.status(401).json({ error: "No refresh token" });
        const refreshToken = doc.data().refreshToken;
    
        // 3. Refresh access token
        const accessToken = await refreshAccessToken(refreshToken);

        // 4. Call Spotify API
        const data = await spotifyFetch(`/search?${req.body.query}`, accessToken)

        res.json(data)

    } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

const getUserTracks = async (req, res) => {
    try {
    // 1. Get JWT from cookie or Authorization header
    const token = req.cookies.session || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Not logged in" });

    const session = verifySession(token);
    const userId = session.spotifyUserId;

    // 2. Lookup refresh token in Firebase
    const doc = await db.collection("spotifyTokens").doc(userId).get();
    if (!doc.exists) return res.status(401).json({ error: "No refresh token" });
    const refreshToken = doc.data().refreshToken;

    // 3. Refresh access token
    const accessToken = await refreshAccessToken(refreshToken);

    // 4. Call Spotify API
    const profile = await spotifyFetch("/me", accessToken);

    res.json(profile);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}


export const spotifyFunctions = {
    searchSpotify,
    getUserTracks
}