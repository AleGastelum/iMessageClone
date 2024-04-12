import { ConversationPopulated, MessagePopulated } from "../../../backend/src/util/types";

/**
 * Users
 */
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

/**
 * Conversations
 */
export interface ConversationsData {
  conversations: ConversationPopulated[]
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string
  }
}

export interface CreateConversationInput {
  participantsIds: string[]
}

/**
 * Messages
 */
export interface MessagesData {
  messages: MessagePopulated[]
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    }
  }
}
