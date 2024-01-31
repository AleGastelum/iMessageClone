import { gql } from "apollo-server-core";

const typeDefs = gql`
  type User {
    id: String
    usernname: String
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }

  type Query {
    searchUsers(usernname: String): [User]
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }
`;

export default typeDefs;
