import { SearchedUser } from "@/src/util/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { IoCloseCircleOutline } from "react-icons/io5";

interface ParticipantsProps {
  participants: SearchedUser[];
  removeParticipant: (userID: string) => void;
};

const Participants: React.FC<ParticipantsProps> = ({ participants, removeParticipant }) => {
  return (
    <Flex
      mt={8}
      gap="10px"
      flexWrap="wrap"
    >
      {participants.map(participant => (
        <Stack
          key={participant.id}
          direction="row"
          align="center"
          bg="whiteAlpha.200"
          borderRadius={4}
          p={2}
        >
          <Text>{participant.username}</Text>
          <IoCloseCircleOutline
            size={20}
            cursor="pointer"
            onClick={() => removeParticipant(participant.id)}
          />
        </Stack>
      ))}
    </Flex>
  );
};

export default Participants;
