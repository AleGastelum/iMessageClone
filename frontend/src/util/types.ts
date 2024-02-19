export interface ICreateUsernameData {
  createUsername: {
    success: boolean,
    error: string;
  }
}

export interface ICreateUsernameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: SearchedUser[]
}

export interface SearchedUser {
  id: string;
  username: string;
}
