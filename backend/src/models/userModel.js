import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        fbId: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, username: this.username }, process.env.ACCESS_TOKEN_SECRET || "secret", {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id, username: this.username }, process.env.REFRESH_TOKEN_SECRET || "secret", {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

export const User = mongoose.model("User", userSchema);