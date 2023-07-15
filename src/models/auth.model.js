const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CustomError = require("../config/errors/CustomError");

// Pull in Environment variables
const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
};
const RESET_PASSWORD_TOKEN = {
    expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};
const AuthSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token:{
        type: String,
    },
    roles: {
        ADMIN:{
            type: Number,
        },
        GLV:{
            default: 1984,
            type: Number
        },
        TN:Number
    },
    refreshToken: [String],
    glv:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Glv"
    }
});

AuthSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.tokens;
        return ret;
    },
});
AuthSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});



AuthSchema.statics.findByCredentials = async (username, password) => {
    const user = await AuthModel.findOne({ username });
    if (!user)
        throw new CustomError(
            "Wrong credentials!",
            400,
            "Email or password is wrong!"
        );
    const passwdMatch = await bcrypt.compare(password, user.password);
    if (!passwdMatch)
    throw new CustomError(
        "Wrong credentials!!",
        400,
        "Email or password is wrong!"
    );
    return user;
};

AuthSchema.methods.generateAccessToken = function () {
    const user = this;
    const roles = Object.values(user.roles).filter(Boolean);
    // Create signed access token
    const accessToken = jwt.sign(
        {
            _id: user._id.toString(),
            username: user.username,
            roles,
        },
        ACCESS_TOKEN.secret,
        {
            expiresIn: ACCESS_TOKEN.expiry,
        }
    );

    return accessToken;
};

AuthSchema.methods.generateRefreshToken = async function () {
    const user = this;

    // Create signed refresh token
    const refreshToken = jwt.sign(
        {
            _id: user._id.toString(),
        },
        REFRESH_TOKEN.secret,
        {
            expiresIn: REFRESH_TOKEN.expiry,
        }
    );

    // // Create a 'refresh token hash' from 'refresh token'
    // const rTknHash = crypto
    //     .createHmac("sha256", REFRESH_TOKEN.secret)
    //     .update(refreshToken)
    //     .digest("hex");

    // // Save 'refresh token hash' to database
    user.token=refreshToken;
    await user.save();

    return refreshToken;
};

AuthSchema.methods.generateResetToken = async function () {
    const resetTokenValue = crypto.randomBytes(20).toString("base64url");
    const resetTokenSecret = crypto.randomBytes(10).toString("hex");
    const user = this;

    // Separator of `+` because generated base64url characters doesn't include this character
    const resetToken = `${resetTokenValue}+${resetTokenSecret}`;

    // Create a hash
    const resetTokenHash = crypto
        .createHmac("sha256", resetTokenSecret)
        .update(resetTokenValue)
        .digest("hex");

    user.resetpasswordtoken = resetTokenHash;
    user.resetpasswordtokenexpiry =
        Date.now() + (RESET_PASSWORD_TOKEN.expiry || 5) * 60 * 1000; // Sets expiration age

    await user.save();

    return resetToken;
};

const AuthModel = mongoose.model("Auth", AuthSchema);
module.exports = AuthModel; 