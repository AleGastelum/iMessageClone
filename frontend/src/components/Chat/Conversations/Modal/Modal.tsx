import { useLazyQuery } from '@apollo/client';
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
import { SearchUsersData, SearchUsersInput } from '@/src/util/types';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const [ username, setUsername ] = useState("");
  const [ searchUsers, { data, loading, error } ] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
  };

  console.log("HERE IS SEARCH DATA", data)
  
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
