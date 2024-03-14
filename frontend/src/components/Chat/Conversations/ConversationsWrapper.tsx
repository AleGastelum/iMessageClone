import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "@/src/util/types";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import { useEffect } from "react";

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

  console.log("QUERY DATA", conversationsData);

  const subscribeToMoreConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.convesationCreated,
      updateQuery: (
        prev,
        { subscriptionData } : { subscriptionData: { data: { conversationCreated: ConversationPopulated } } }
      ) => {

        if (!subscriptionData.data) return prev;

        console.log("HERE IS SUBSCRIPTION DATA", subscriptionData);

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
    subscribeToMoreConversations();
  }, []);
  
  return (
    <Box
      width={{ base: "100%", md: '400px' }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
    >
      {/* Sekeleton Loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
      />
    </Box>
  );
};

export default ConversationWrapper;
