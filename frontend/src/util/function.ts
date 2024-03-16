import { ParticipantPopulated } from "../../../backend/src/util/types";

export const formatUsernames = (
  participants: ParticipantPopulated[],
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

    return usernames.join(", ");
};
