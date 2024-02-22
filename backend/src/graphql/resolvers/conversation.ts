import { GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: {
        participantsIds: string[]
      },
      context: GraphQLContext
    ) => {
      console.log("INSIDE CREATE CONVERSATION", args);
    },
  },
};

export default resolvers;
