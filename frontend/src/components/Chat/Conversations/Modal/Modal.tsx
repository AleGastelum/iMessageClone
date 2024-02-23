import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Stack,
  Input,
  Button
} from '@chakra-ui/react'
import { useState } from 'react';
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { CreateConversationData, CreateConversationInput, SearchUsersData, SearchUsersInput, SearchedUser } from '@/src/util/types';
import UserSearchList from './UserSearchList';
import Participants from './Participants';
import toast from 'react-hot-toast';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface IModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: React.FC<IModalProps> = ({ isOpen, onClose, session }) => {
  const { user: { id: userId } } = session;
  const router = useRouter();
  
  const [ username, setUsername ] = useState("");
  const [ participants, setParticipants ] = useState<SearchedUser[]>([]);
  const [ searchUsers, { data, loading, error } ] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers);
  const [ createConversation, { loading: createConversationLoading } ] = useMutation<CreateConversationData, CreateConversationInput>(ConversationOperations.Mutations.createConversation);
  
  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants(prev => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };

  const onCreateConversation = async () => {
    const participantsIds = [userId, ...participants.map(participant => participant.id)];
    
    try {
      // createConversation mutation
      const { data } = await createConversation({
        variables: {
          participantsIds,
        }
      });

      if (!data?.createConversation) {
        throw new Error("Failed to create conversation");
      }

      const {
        createConversation: { conversationId }
      } = data;

      router.push({ query: { conversationId } });

      /**
       * Clear state and close modal
       */
      setParticipants([]);
      setUsername("");
      onClose();

      console.log("HERE IS DATA", data)
    } catch (error: any) {
      console.log("onCreate Conversation error", error);
      toast.error(error?.message);
    }
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                />
                <Button type="submit" isDisabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{
                    bg: "brand.100"
                  }}
                  isLoading={createConversationLoading}
                  onClick={onCreateConversation}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
