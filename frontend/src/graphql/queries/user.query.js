import { gql } from "@apollo/client";

// only the "authUser" needs to match the query found in user.resolver.js
// the "query GetAuthenticatedUser" can be named literally anything, just used a descriptive name here
export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authUser {
      _id
      username
      name
      profilePicture
    }
  }
`;
