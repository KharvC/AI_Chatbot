import { isLoggedIn } from "../Util";

const createRegisterSubAgent = (end) => {
  let stage;
  let username, pin, pinc;

  const handleInitialize = async (promptData) => {
    if (await isLoggedIn()) {
      return {
        emote: "error",
        msg: end(`You're already logged in! To register please log out first!`),
      };
    } else {
      stage = "FOLLOWUP_USERNAME";
      return `Got it! What username would you like to use?`;
    }
  };

  const handleReceive = async (prompt) => {
    switch (stage) {
      case "FOLLOWUP_USERNAME":
        return await handleFollowupUsername(prompt);
      case "FOLLOWUP_PASSWORD":
        return await handleFollowupPassword(prompt);
      case "FOLLOWUP_PASSWORD_CONFIRM":
        return await handleFollowupPasswordConfirm(prompt);
    }
  };

  const handleFollowupUsername = async (prompt) => {
    username = prompt;
    stage = "FOLLOWUP_PASSWORD";
    return {
      nextIsSensitive: true,
      msg: `Thank you, what pin would you like to use? This must be 7 digits.`,
    };
  };

  const handleFollowupPassword = async (prompt) => {
    pin = prompt;
    stage = "FOLLOWUP_PASSWORD_CONFIRM";
    return { nextIsSensitive: true, msg: `Finally, please confirm your pin.` };
  };

  const handleFollowupPasswordConfirm = async (prompt) => {
    pinc = prompt;
    if (pin !== pinc) {
      return {
        emote: "error",
        msg: end(
          `Sorry, you entered the wrong confirmation pin. Cancelling your registration`
        ),
      };
    }
    const resp = await fetch(
      "https://cs571api.cs.wisc.edu/rest/f24/hw11/register",
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
      return {
        emote: "SUCCESS",
        msg: end(`Success! Welcome to BadgerChat, ${username}`),
      };
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

export default createRegisterSubAgent;
