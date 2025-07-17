import createChatDelegator from "./ChatDelegator";
import { isLoggedIn, ofRandom } from "./Util";

const createChatAgent = () => {
  const CS571_WITAI_ACCESS_TOKEN = "R6Q65ZAQ62G34LLHSQXL4EIQMXMTQX3L"; // Put your CLIENT access token here.

  const delegator = createChatDelegator();

  let chatrooms = [];

  const handleInitialize = async () => {
    const resp = await fetch(
      "https://cs571api.cs.wisc.edu/rest/f24/hw11/chatrooms",
      {
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    );
    const data = await resp.json();
    chatrooms = data;

    return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
  };

  const handleReceive = async (prompt) => {
    if (delegator.hasDelegate()) {
      return delegator.handleDelegation(prompt);
    }
    const resp = await fetch(
      `https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`,
      {
        headers: {
          Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
        },
      }
    );
    const data = await resp.json();
    if (data.intents.length > 0) {
      switch (data.intents[0].name) {
        case "get_help":
          return handleGetHelp();
        case "get_chatrooms":
          return handleGetChatrooms();
        case "get_messages":
          return handleGetMessages(data);
        case "login":
          return handleLogin();
        case "register":
          return handleRegister();
        case "create_message":
          return handleCreateMessage(data);
        case "logout":
          return handleLogout();
        case "whoami":
          return handleWhoAmI();
      }
    }
    return "Sorry, I didn't get that. Type 'help' to see what you can do!";
  };

  const handleGetHelp = async () => {
    return ofRandom([
      "Try asking 'give me a list of chatrooms', or ask for more help!",
      "Try asking 'register for an account', or ask for more help!",
      "Try asking 'what chatrooms are there' or ask for more help!",
      "Login and you can create posts! or ask for more help",
    ]);
  };

  const handleGetChatrooms = async () => {
    const resp = await fetch(
      `https://cs571api.cs.wisc.edu/rest/f24/hw11/chatrooms`,
      {
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    );
    const chatroomNames = await resp.json();
    return `Of course, there are ${
      chatroomNames.length
    } chatrooms: ${chatroomNames.join(", ")}`;
  };

  const handleGetMessages = async (data) => {
    const chatroomNameEntity = Object.values(data.entities)
      .flat()
      .find((entity) => isNaN(Number(entity.value)));

    const chatroomName = chatroomNameEntity?.value;

    const numEntity = Object.values(data.entities)
      .flat()
      .find((entity) => !isNaN(Number(entity.value)));

    let num = numEntity?.value;

    if (num === undefined) {
      num = 1;
    }

    let s = ``;

    if (chatroomName === undefined) {
      s = `num=${num}`;
    } else {
      s = `chatroom=${chatroomName}&num=${num}`;
    }

    const resp = await fetch(
      `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?${s}`,
      {
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    );

    const messageData = await resp.json();

    const messages = messageData.messages;

    return messages.map(
      (msg) =>
        `In ${msg.chatroom}, ${msg.poster} created a post titled '${msg.title}' saying '${msg.content}'`
    );
  };

  const handleLogin = async () => {
    return await delegator.beginDelegation("LOGIN");
  };

  const handleRegister = async () => {
    return await delegator.beginDelegation("REGISTER");
  };

  const handleCreateMessage = async (data) => {
    return await delegator.beginDelegation("CREATE", data);
  };

  const handleLogout = async () => {
    const isLogged = await isLoggedIn();
    if (!isLogged) {
      return { emote: "error", msg: `You are not logged in!` };
    } else {
      const resp = await fetch(
        "https://cs571api.cs.wisc.edu/rest/f24/hw11/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CS571-ID": CS571.getBadgerId(),
          },
        }
      );
      if (resp.status === 200) {
        return { emote: "SUCCESS", msg: `You have been logged out` };
      } else {
        const errData = await resp.json();
        return { emote: "error", msg: `${errData}` };
      }
    }
  };

  const handleWhoAmI = async () => {
    const resp = await fetch(
      "https://cs571api.cs.wisc.edu/rest/f24/hw11/whoami",
      {
        credentials: "include",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    );

    const body = await resp.json();

    if (body.isLoggedIn) {
      return {
        emote: "SUCCESS",
        msg: `You are currently logged in as ${body?.user?.username}`,
      };
    } else {
      return { emote: "error", msg: `Sorry, you are not logged in!` };
    }
  };

  return {
    handleInitialize,
    handleReceive,
  };
};

export default createChatAgent;
