import { ConversationPopulated, GraphQLContext } from "../../util/types";
import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<ConversationPopulated[]> => {
      console.log("CONVERSATIONS QUERY");

      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: {
          id: userId
        },
      } = session;
      
      try {
        /**
         * Find all conversations that user is part of
         */
        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: userId,
                }
              }
            }
          },
          include: conversationPopulated,
        });

        return conversations;
      } catch (error: any) {
        console.log("Conversations error: ", error);
        throw new GraphQLError(error?.message);
      }
    }
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: {
        participantsIds: string[]
      },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { session, prisma, pubsub } = context;
      const { participantsIds } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId }
      } = session;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantsIds.map(id => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                }))
              }
            }
          },
          include: conversationPopulated
        });

        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation
        })
        
        return {
          conversationId: conversation.id
        };
      } catch (error) {
        console.log("createConversation error", error);
        throw new GraphQLError("Error creating conversation");
      }
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['CONVERSATION_CREATED']);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _,
          context: GraphQLContext) => {
            const { session } = context;
            const { conversationCreated: { participants } } = payload;

            const userIsParticipant = !!participants.find(p => p.userId === session?.user?.id);

            return userIsParticipant;
        }
      )
    }
  }
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
  user: {
    select: {
      id: true,
      username: true,
    }
  }
});

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
  participants: {
    include: participantPopulated
  },
  latestMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        }
      }
    }
  }
});

export default resolvers;
