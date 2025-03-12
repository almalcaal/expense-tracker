import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from "./user.typeDefs.js";
import transactionTypeDef from "./transaction.typeDef.js";

const fusedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default fusedTypeDefs;
