import { gql } from "@apollo/client";

// the "$input" match on purpose, they can be named anything but the two of them in this file must match
// on another note, this may sound confusing, but the "input" parameter must match the actual ref to user.typeDefs.js signUp created in type Mutation as the parameter, i.e. signUp("input": SignUpInput!): User
export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      _id
      name
      username
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      username
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
