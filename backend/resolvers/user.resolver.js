import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Query: {
    // users: () => {
    //   return users;
    // },
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();

        return user;
      } catch (err) {
        console.log("Error in authUser userResolver:", err);
        throw new Error(err.message || "Error getting user");
      }
    },

    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.log("Error in user userResolver:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },

  // todo, add user/transaction relation
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          throw new Error("User with that username already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.log("Error in signUp userResolver:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) {
          throw new Error("All fields required");
        }
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (err) {
        console.log("Error in login userResolver:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    logout: async (_, __, context) => {
      try {
        await new Promise((resolve, reject) => {
          context.req.session.destroy((err) => {
            if (err) reject(err);
            resolve();
          });
        });

        context.res.clearCookie("connect.sid");

        return { message: "Logged out successfully" };
      } catch (err) {
        console.log("Error in logout userResolver:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },

  User: {
    // the "parent" is User in this context
    transactions: async (parent, _, __) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Error in User->transactions resolver:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};

export default userResolver;
