import { Octokit } from "@octokit/rest";
import { Socket } from "socket.io";

const isValidToken = async (token: string): Promise<boolean> => {
  // ! Validate and verify the access token
  try {
    const octokit = new Octokit({ auth: token });
    const authenticatedUser =
      await octokit.users.listEmailsForAuthenticatedUser();
    var emailId = "";
    authenticatedUser.data.forEach((email: any) => {
      if (email.primary) {
        emailId = email.email;
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};

const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;
  if (await isValidToken(token)) {
    next();
  } else {
    const err = new Error("Invalid token");
    next(err);
  }
};

export { authenticateSocket };
