import { SearchedUser } from "@/src/util/types";
import { Text, Stack, Flex, Avatar, Button } from "@chakra-ui/react";

interface UserSearchListPops {
  users: SearchedUser[];
  addParticipant: (user: SearchedUser) => void
};

const UserSearchList: React.FC<UserSearchListPops> = ({ users, addParticipant }) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map(user => (
            <Stack
              key={user.id}
              direction="row"
              align="center"
              spacing={4}
              py={2}
              px={4}
              borderRadius={4}
              _hover={{
                bg: "whiteAlpha.200"
              }}
            >
              <Avatar />
              <Flex justify="space-between" align="center" width="100%">
                <Text color="whiteAlpha.700">
                {user.username}
                </Text>
                <Button
                  bg="brand.100"
                  _hover={{
                    bg: "brand.100"
                  }}
                  onClick={() => addParticipant(user)}
                >
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserSearchList;
