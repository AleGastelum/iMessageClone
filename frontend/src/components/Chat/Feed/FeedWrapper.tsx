import { Session } from "next-auth";

interface IFeedWrapper {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<IFeedWrapper> = ({ session }) => {
  return (
    <div>Feed Wrapper</div>
  );
};

export default FeedWrapper;
