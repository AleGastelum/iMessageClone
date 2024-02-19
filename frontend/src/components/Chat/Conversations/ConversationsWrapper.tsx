import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

interface IConversationWrapper {
  session: Session;
}

const ConversationWrapper: React.FunctionComponent<IConversationWrapper> = ({ session }) => {
  return (
    <Box
      width={{ base: "100%", md: '400px' }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
    >
      {/* Sekeleton Loader */}
      <ConversationList session={session} />
    </Box>
  );
};

export default ConversationWrapper;
