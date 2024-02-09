import { Box } from "@chakra-ui/react";
import { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Auth from "../components/Auth/Auth";
import Chat from "../components/Chat/Chat";
import { Session } from "next-auth";

const Home: NextPage = () => {
  const { data: session } = useSession();

  console.log('Here is session', session);
  
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };
  
  return (
    <Box>
      {session?.user.username}
      {session?.user?.username ? (
        <Chat />
      ) : (
        <Auth
          session={session}
          reloadSession={reloadSession}
        />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  };
}

export default Home;
