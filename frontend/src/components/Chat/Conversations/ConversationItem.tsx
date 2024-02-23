import { Stack, Text } from "@chakra-ui/react";
import { ConversationPopulated } from "../../../../../backend/src/util/types";

interface IConversationItem {
  conversation: ConversationPopulated
}

const ConversationItem: React.FunctionComponent<IConversationItem> = ({ conversation }) => {
  
  return (
    <Stack
      _hover={{
        bg: 'whiteAlpha.200'
      }}
      p={4}
      borderRadius={4}
    >
      <Text>{conversation.id}</Text>
    </Stack>
  );
};

export default ConversationItem;
