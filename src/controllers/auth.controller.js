const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Auth = require("../models/auth.model");
const AuthorizationError = require("../config/errors/AuthorizationError");

// Top-level constants
const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    cookie: {
        name: "refreshTkn",
        options: {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
    },
};
const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};
const RESET_PASSWORD_TOKEN = {
    expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};
/*
  1. LOGIN USER
*/
module.exports.login = async (req, res, next) => {
    try {
        

        const { username, password } = req.body;

        /* Custom methods on user are defined in User model */
        const user = await Auth.findByCredentials(username, password); // Identify and retrieve user by credentials
        const accessToken = await user.generateAccessToken(); // Create Access Token
        const refreshToken = await user.generateRefreshToken(); // Create Refresh Token

        // SET refresh Token cookie in response
        res.cookie(
            REFRESH_TOKEN.cookie.name,
            refreshToken,
            REFRESH_TOKEN.cookie.options
        );

        // Send Response on successful Login
        res.json({
            success: true,
            user,
            accessToken,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
/*
  2. SIGN UP USER 
*/
module.exports.signup = async (req, res, next) => {
    try {
        const newUser = new Auth(req.body);
        await newUser.save(); 
        const accessToken = await newUser.generateAccessToken(); 
        res.status(201).json({
            success: true,
            user: newUser,
            accessToken,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
/*
  3. LOGOUT USER
*/
module.exports.logout = async (req, res, next) => {
    try {
        // Authenticated user ID attached on `req` by authentication middleware
        const userId = req.userId;
        const user = await Auth.findById(userId);

        const cookies = req.cookies;
        // const authHeader = req.header("Authorization");
        const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
        // Create a access token hash
        user.token = ""
        await user.save();

        // Set cookie expiry to past date so it is destroyed
        const expireCookieOptions = Object.assign(
            {},
            REFRESH_TOKEN.cookie.options,
            {
                expires: new Date(1),
            }
        );

        // Destroy refresh token cookie
        res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
        res.status(205).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
/*
  4. LOGOUT USER FROM ALL DEVICES
*/

/*
  5. REGENERATE NEW ACCESS TOKEN
*/
module.exports.refreshAccessToken = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        // const authHeader = req.header("Authorization");

        if (!cookies[REFRESH_TOKEN.cookie.name]) {
            throw new AuthorizationError(
                "Authentication error!",
                "You are unauthenticated",
                {
                    realm: "reauth",
                    error: "no_rft",
                    error_description: "Refresh Token is missing!",
                }
            );
        }
        // if (!authHeader?.startsWith("Bearer ")) {
        //     throw new AuthorizationError(
        //         "Authentication Error",
        //         "You are unauthenticated!",
        //         {
        //             realm: "reauth",
        //             error: "invalid_access_token",
        //             error_description: "access token error",
        //         }
        //     );
        // }

        // const accessTokenParts = authHeader.split(" ");
        // const staleAccessTkn = accessTokenParts[1];
        // const decodedExpiredAccessTkn = jwt.verify(
        //     staleAccessTkn,
        //     ACCESS_TOKEN.secret,
        //     {
        //         ignoreExpiration: true,
        //     }
        // );

        const rfTkn = cookies[REFRESH_TOKEN.cookie.name];
        const decodedRefreshTkn = jwt.verify(rfTkn, REFRESH_TOKEN.secret);
        const userWithRefreshTkn = await Auth.findOne({
            _id: decodedRefreshTkn._id,
            token: rfTkn,
        });
        if (!userWithRefreshTkn) {
            throw new AuthorizationError(
                "Authentication Error",
                "You are unauthenticated!",
                {
                    realm: "reauth",
                }
            );
        }
        // Delete the stale access token
        // console.log(
        //     "Removing Stale access tkn from DB in refresh handler..."
        // );
        // userWithRefreshTkn.tokens = userWithRefreshTkn.tokens.filter(
        //     (tokenObj) => tokenObj.token !== staleAccessTkn
        // );
        // await userWithRefreshTkn.save();
        // console.log("...Tkn removED!");

        // GENERATE NEW ACCESSTOKEN
        const accessToken = await userWithRefreshTkn.generateAccessToken();

        // Send back new created accessToken
        res.status(201);
        res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });
        res.json({
            success: true,
            accessToken,
        });
    } catch (error) {
        console.log(error);
        if (error?.name === "JsonWebTokenError") {
            return next(
                new AuthorizationError(error, "You are unauthenticated", {
                    realm: "reauth",
                    error_description: "token error",
                })
            );
        }
        next(error);
    }
};
/*
  6. FORGOT PASSWORD
*/

/*
  7. RESET PASSWORD
*/  