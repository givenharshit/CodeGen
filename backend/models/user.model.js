import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            min: [6, "Too short, min is 6 characters"],
            max: [255, "Too long, max is 255 characters"],

        },
        password: {
            type: String,
            required: true,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

const User = mongoose.model("User", userSchema);

export default User;