import user from "../models/user.model.js";

//! Create a User
export const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }
  const hashPassword = await user.hashPassword(password);
  return await user.create({ email, password: hashPassword });
};

//! Get all Users
export const getAllUsersById = async ({ userId }) => {
  const users = await user.find({
    _id: {
      $ne: userId,
    },
  });
  return users;
};
