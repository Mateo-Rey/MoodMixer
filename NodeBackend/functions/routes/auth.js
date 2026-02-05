import crypto from "crypto";

function generateState() {
  return crypto.randomBytes(16).toString("hex");
}

const spotifyLogin = async (req, res) => {
    const state = generateState();

    res.cookie("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    });

    const scope = [
        "user-top-read",
        "user-read-recently-played",
        "user-library-read"
    ].join(" ");

    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        scope,
        state: state
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
}

const callback = async (req, res) => {
  const { code, state } = req.query;
    const storedState = req.cookies.spotify_auth_state;

    if (!state || state !== storedState) {
      return res.status(403).json({ error: "Invalid state" });
    }

    res.clearCookie("spotify_auth_state");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    });

    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json(tokenData);
    }

    /* ───── Fetch Spotify Profile ───── */
    const profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await profileRes.json();

    /* ───── Store Refresh Token ───── */
    await db.collection("spotifyTokens").doc(profile.id).set({
      refreshToken: tokenData.refresh_token,
      updatedAt: new Date(),
    });

    /* ───── Create Session JWT ───── */
    const jwtToken = signSession({
      userId: profile.id,
      spotifyUserId: profile.id,
    });

    /* ───── Redirect to React ───── */
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${jwtToken}`
    );
};

export const authFunctions = {
    spotifyLogin,
    callback
}