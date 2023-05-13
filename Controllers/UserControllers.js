import User from "../modal/User.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";



export const getAllUsers = async (req, res) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return console.log(error);
  }

  if (!users) {
    return res.status(500).json({ message: "unexected Error occurred" });
  }

  return res.status(200).json({ users });
};

export const getUserById = async (req, res) => {
  let user;
  const id = req.params.id;
  try {
    user = await User.findById(id);
  } catch (error) {
    return console.log(error);
  }
  if (!user) {
    return res.status(500).json({ message: "unexected Error occurred" });
  }

  return res.status(200).json({ user });
};


//user signup

export const signup = async (req, res, next) => {
  const {
    firstname,
    lastname,
    username,
    gender,
    bdate,
    picture,
    email,
    password,
  } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User Already Exists! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    firstname,
    lastname,
    username,
    gender,
    bdate,
    picture,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user });
};

//user login

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.length < 6) {
    return res.status(422).json({ message: "Inavalid Data" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "No user found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  // //token
  const token = await JWT.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.status(200).send({
    success: true,
    message: "login successfully",
    user: {
      _id: existingUser._id,
      firstname: existingUser.firstname,
      lastname: existingUser.lastname,
      username: existingUser.username,
      email: existingUser.email,
      password: existingUser.password,
      gender: existingUser.gender,
      bdate: existingUser.bdate,
      picture:existingUser.picture,
      status:existingUser.status,
      posts:existingUser.posts
    },
    token,
  });
};

