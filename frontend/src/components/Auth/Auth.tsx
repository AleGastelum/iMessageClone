import { useMutation } from "@apollo/client";
import { Button, Center, Stack, Text, Image, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { ICreateUsernameData, ICreateUsernameVariables } from "@/src/util/types";
import toast from "react-hot-toast";

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

  const onSubmit = async () => {
    if (!username) {
      return;
    }
    
    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: {
            error
          }
        } = data;

        throw new Error(error);
      }

      toast.success("Username successfully created");

      // Reload session to obtain new username
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
      console.log('onSubmit error', error);
      
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
              isLoading={loading}
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
