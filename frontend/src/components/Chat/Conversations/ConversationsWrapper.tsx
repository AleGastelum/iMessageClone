import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationUpdatedData, ConversationsData } from "@/src/util/types";
import { ConversationPopulated, ParticipantPopulated } from "../../../../../backend/src/util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";

interface IConversationWrapper {
  session: Session;
}

const ConversationWrapper: React.FunctionComponent<IConversationWrapper> = ({ session }) => {
  const router = useRouter();
  const {
    query: { conversationId }
  } = router;
  const {
    user: { id: userId }
  } = session;
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore
  } = useQuery<ConversationsData, any>(ConversationOperations.Queries.conversations);

  const [ markConversationAsRead ] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData, null>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const {
          data: subscriptionData
        } = data;

        console.log("ON DATA FIRING", subscriptionData);
        
        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation: updatedConversation }
        } = subscriptionData;

        const currentlyVieweingConversation = updatedConversation.id === conversationId;

        if (currentlyVieweingConversation) {
          onViewConversation(conversationId, false);
        }
      }
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => {
    /**
     * 1. Push the conversationId to the router query params
     */
    router.push({
      query: {
        conversationId
      }
    });

    /**
     * 2. Mark the conversation as read
     */
    if (hasSeenLatestMessage) return;

    // markConversatioonAsRead mutation
    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId
        },
        optimisticResponse: {
          markConversationAsRead: true
        },
        update: (cache) => {
          /**
           * Get conversation participants from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: ParticipantPopulated[];
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(p => p.user.id === userId);

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update participant to show latest message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants
            }
          });
        }
      });
    } catch (error: any) {
      console.log("onViewConversation error", error);
    }
  };
  
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData } : { subscriptionData: { data: { conversationCreated: ConversationPopulated } } }
      ) => {

        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [
            newConversation,
            ...prev.conversations
          ]
        });
      }
    });
  };

  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);
  
  return (
    <Box
      display={{
        base: conversationId ? "none" : "flex",
        md: "flex"
      }}
      width={{ base: "100%", md: '400px' }}
      flexDirection="column"
      bg="whiteAlpha.50"
      gap={4}
      py={6}
      px={3}
    >
      {conversationsLoading ? (
          <SkeletonLoader
            count={7}
            height="80px"
          />
        ) : (
          <ConversationList
            session={session}
            conversations={conversationsData?.conversations || []}
            onViewConversation={onViewConversation}
          />
        )
      }
    </Box>
  );
};

export default ConversationWrapper;
