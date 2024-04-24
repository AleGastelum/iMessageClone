import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/Modal";
import { useState } from "react";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { BooleanValueNode } from "graphql";
import toast from "react-hot-toast";

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
  const [ deleteConversation ] = useMutation<{
    deleteConversation: boolean;
    conversationId: string;
  }>(ConversationOperations.Mutations.deleteConversation);
  const router = useRouter();
  const { user: { id: userId } } = session;

  const sortedConversations = [...conversations].toSorted((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf());

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(typeof process.env.NEXTAUTH_URL === "string" ? process.env.NEXTAUTH_URL : "")
          }
        }),
        {
          loading: "Deleteing conversation",
          success: "Conversation deleted",
          error: "Failed to delete conversation"
        }
      );
    } catch (error) {
      console.log("onDeleteConversation error", error);
    }
  }
  
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
      {sortedConversations.map(conversation => {
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
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
