import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "@/src/util/types";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface IConversationWrapper {
  session: Session;
}

const ConversationWrapper: React.FunctionComponent<IConversationWrapper> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore
  } = useQuery<ConversationsData, any>(ConversationOperations.Queries.conversations);
  const router = useRouter();
  const { query: { conversationId } } = router;

  console.log("QUERY DATA", conversationsData);

  const onViewConversation = async (conversationId: string) => {
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
  };
  
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.convesationCreated,
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
      bg="whiteAlpha.50"
      py={6}
      px={3}
    >
      {/* Sekeleton Loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};

export default ConversationWrapper;
