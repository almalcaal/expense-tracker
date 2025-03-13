import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }

        const userId = context.getUser()._id;

        // had an issue earlier with having the amount be NULL which cause a major headache to debug, so lets remove all transactions with the value of null and then return, this is just a hack for now. i don't even know how that could've happened
        let transactions = await Transaction.find({ userId });
        transactions = transactions.filter((tx) => tx.amount !== null);
        return transactions;
      } catch (err) {
        console.log("Error in transactions transactionResolver:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);

        return transaction;
      } catch (err) {
        console.log("Error in transaction transactionResolver:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      // keep in mind to have the names line up, having it named "totalAmount" and "category" here as the actual values we're returning in the object is due to how we defined it in transaction.typeDef.js:
      // type categoryStatistics {
      //     category: String!
      //     totalAmount: Float!
      // }
      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.log("Error in createTransaction transactionResolver");
        throw new Error(err.message || "Internal server error");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );

        return updatedTransaction;
      } catch (err) {
        console.log("Error in updateTransaction transactionResolver");
        throw new Error(err.message || "Internal server error");
      }
    },

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const destroyTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return destroyTransaction;
      } catch (err) {
        console.log("Error in deleteTransaction transactionResolver");
        throw new Error(err.message || "Internal server error");
      }
    },
  },

  Transaction: {
    // the "parent" is Transaction in this context
    user: async (parent, _, __) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.log("Error getting user:", err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;
