import { isLoggedIn } from "../Util";

const createLoginSubAgent = (end) => {
  let stage;
  let username, pin;

  const handleInitialize = async (promptData) => {
    if (await isLoggedIn()) {
      return {
        emote: "error",
        msg: end(
          `You're already logged in! To login in again please log out first!`
        ),
      };
    } else {
      stage = "FOLLOWUP_USERNAME";
      return `Got it! What is your username?`;
    }
  };

  const handleReceive = async (prompt) => {
    switch (stage) {
      case "FOLLOWUP_USERNAME":
        return await handleFollowupUsername(prompt);
      case "FOLLOWUP_PASSWORD":
        return await handleFollowupPassword(prompt);
    }
  };

  const handleFollowupUsername = async (prompt) => {
    username = prompt;
    stage = "FOLLOWUP_PASSWORD";
    return { nextIsSensitive: true, msg: "Got it! What is your pin?" };
  };

  const handleFollowupPassword = async (prompt) => {
    pin = prompt;
    const resp = await fetch(
      "https://cs571api.cs.wisc.edu/rest/f24/hw11/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          pin: pin,
        }),
      }
    );

    if (resp.status === 200) {
      return { emote: "SUCCESS", msg: end(`Logged in! Welcome ${username}`) };
    } else {
        const errData = await resp.json();
        return { emote: "error", msg: end(`${errData.msg}`) };
    }
  };

  return {
    handleInitialize,
    handleReceive,
  };
};

export default createLoginSubAgent;
