import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/Modal";
import { useState } from "react";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";

interface IConversationList {
  session: Session;
  conversations: ConversationPopulated[];
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => void;
}

const ConversationList: React.FunctionComponent<IConversationList> = ({
  session,
  conversations,
  onViewConversation
}) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const router = useRouter();
  const { user: { id: userId } } = session;

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  
  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text
          textAlign="center"
          color="whiteAlpha.800"
          fontWeight={500}
        >
          Find or start a conversation
        </Text>
      </Box>
      <ConversationModal
        isOpen={isOpen}
        onClose={onClose}
        session={session}
      />
      {conversations.map(conversation => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );
        
        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() => onViewConversation(
              conversation.id, participant?.hasSeenLatestMessage || false
            )}
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            isSelected={conversation.id === router.query.conversationId}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
