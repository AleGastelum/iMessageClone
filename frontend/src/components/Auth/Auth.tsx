import { useMutation } from "@apollo/client";
import { Button, Center, Stack, Text, Image, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { ICreateUsernameData, ICreateUsernameVariables } from "@/src/util/types";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({
  session,
  reloadSession
}) => {
  const [ username, setUsername ] = useState("");

  const [ createUsername, { data, loading, error } ] = useMutation<ICreateUsernameData, ICreateUsernameVariables>(UserOperations.Mutations.createUsername);

  console.log('HERE IS DATA', data, loading, error)

  const onSubmit = async () => {
    if (!username) {
      return;
    }
    
    try {
      await createUsername({ variables: { username } });
    } catch (e) {
      console.log('onSubmit error', e);
      
    }
  };
  
  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              width="100%"
              onClick={onSubmit}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">MessengerQL</Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={<Image height="20px" src="/images/googlelogo.png" />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
