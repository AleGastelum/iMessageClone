import userResolvers from "./user";
import merge from 'lodash.merge';
import conversationResolvers from "./conversation";
import messageResolvers from "./message";
import scalarResolveres from "./scalars";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers,
  scalarResolveres
);

export default resolvers;
