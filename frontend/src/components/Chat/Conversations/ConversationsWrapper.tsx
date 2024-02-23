import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "@/src/util/types";

interface IConversationWrapper {
  session: Session;
}

const ConversationWrapper: React.FunctionComponent<IConversationWrapper> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading
  } = useQuery<ConversationsData, any>(ConversationOperations.Queries.conversations);

  console.log("HERE IS DATA", conversationsData);
  
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
