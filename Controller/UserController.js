const UserSchema = require("../Model/User");
const defaultFeatures = [
  "66054d4151affa86e1bf95e2",
  "66054d4751affa86e1bf95e4",
  "66054d4d51affa86e1bf95e6",
];

const loginFunction = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email });

    if (user) {
      const hasAccess = await user.comparePassword(password);
      if (hasAccess) {
        const token = user.createJWT();

        return res.json({
          user,
          message: "Logged in",
          status: 200,
          token,
        });
      } else {
        return res.json({
          status: 401,
          message: "Invalid Credentials",
        });
      }
    } else {
      return res.json({
        message: "Invalid Credentials",
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};

const signupFunction = async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!name || !email || !password) {
    return res.json({
      status: 422,
      message: "Provide all the fields.",
    });
  } else {
    try {
      const newUser = await UserSchema.create({
        name,
        email,
        password,
        profilePicture,
        activeFeatures: defaultFeatures,
      });
      return res.json({
        user: newUser,
        message: "User Created",
        status: 200,
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.json({
          status: 422,
          message: "User with this email already exist.",
        });
      }
      if (error?.errors?.password?.kind === "minlength") {
        return res.json({
          status: 422,
          message: "Password should be atleast 8 digits.",
        });
      }

      return res.json({
        message: "Internal Server Error.",
        status: 500,
      });
    }
  }
};

const updatePassword = async (req, res) => {
  let { email, newPassword } = req.body;

  try {
    const user = await UserSchema.findOne({ email });

    if (!user) {
      return res.json({
        status: 404,
        message: "User not found.",
      });
    }

    const isSamePassword = await user.comparePassword(newPassword);
    console.log(isSamePassword);

    // console.log()
    if (isSamePassword) {
      return res.json({
        status: 500,
        message: "Password should not be same as previous password.",
      });
    }

    newPassword = await user.getHashed(newPassword);
    const updatedUser = await UserSchema.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true, runValidators: true }
    );

    if (updatedUser)
      return res.json({
        status: 200,
        message: "Details updated successfully",
        updatedUser,
      });
  } catch (error) {
    return res.json({
      message: error.message,
      status: 500,
    });
  }
};

const updateName = async (req, res) => {
  const { name, email, profilePicture } = req.body;

  try {
    const findUser = await UserSchema.findOne({ email });

    if (!findUser) {
      return res.json({
        status: 404,
        message: "No user found with given email.",
      });
    }

    const updatedUser = await UserSchema.findOneAndUpdate(
      { email },
      { name, profilePicture }
    );

    return res.json({
      status: 200,
      message: "Name updated Successfully.",
      updatedUser,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};

const deleteFunction = async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await UserSchema.findOne({ _id: id });

    if (!findUser) {
      return res.json({
        status: 404,
        message: "No user found.",
      });
    }

    const deletedUser = await UserSchema.findOneAndDelete({ _id: id });

    return res.json({
      status: 200,
      message: "User details deleted successfully.",
      deletedUser,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUser = await UserSchema.find();

    return res.json({
      nbUsers: allUser.length,
      allUser,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error while retrieving list of users.",
    });
  }
};

const getUserWithId = async (req, res) => {
  const { id } = req.params;

  const user = await UserSchema.findOne({ _id: id });

  try {
    if (!user) {
      return res.json({
        status: 404,
        message: "User Details not found.",
      });
    }

    return res.json({
      status: 200,
      user,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

const updateEmail = async (req, res) => {
  const { _id, newEmail } = req.body;

  try {
    const checkUserWithEmail = await UserSchema.findOne({ email: newEmail });

    if (checkUserWithEmail) {
      return res.json({
        status: 400,
        message: "Another user found with same email.",
      });
    }

    const updatedUserEmail = await UserSchema.findOneAndUpdate(
      { _id },
      { email: newEmail },
      { new: true }
    );
    return res.json({
      status: 200,
      message: "Email updated.",
      updatedUserEmail,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};

const updatewithId = async (req, res) => {
  const _id = req.params.id;
  const { name, email, profilePicture } = req.body;

  const searchUserWitEmail = await UserSchema.findOne({ email });

  if (searchUserWitEmail) {
    return res.json({
      status: 400,
      message: "Email associated with another user.",
    });
  }

  try {
    const updatedUser = await UserSchema.updateOne(
      { _id },
      { name, email, profilePicture },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.json({
        status: 404,
        message: "User not found.",
      });
    }

    return res.json({
      status: 200,
      message: "User updated.",
      updatedUser,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

const updateFeatures = async (req, res) => {
  const { userId } = req.params;
  const { features } = req.body;

  const findUser = await UserSchema.findOne({ _id: userId });
  if(!findUser) {
    return res.json({
        status:404,
        message:"No User Found"
    })
  }

  const updatedUser = await UserSchema.findOneAndUpdate({_id: userId}, {activeFeatures: features}, {new:true, runValidators:true});

  if(updatedUser) {
    return res.json({
        status:200,
        user: updatedUser
    })
  }
};

module.exports = {
  loginFunction,
  signupFunction,
  updatePassword,
  deleteFunction,
  updateName,
  getAllUsers,
  getUserWithId,
  updateEmail,
  updatewithId,
  updateFeatures
};
