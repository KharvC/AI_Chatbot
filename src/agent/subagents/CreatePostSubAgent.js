import { isLoggedIn } from "../Util";

const createPostSubAgent = (end) => {
  const CS571_WITAI_ACCESS_TOKEN = "R6Q65ZAQ62G34LLHSQXL4EIQMXMTQX3L";
  let stage;
  let chatroomName, title, content, confirmation;

  const handleInitialize = async (promptData) => {
    if (await isLoggedIn()) {
      stage = "FOLLOWUP_TITLE";
      const chatroomNameEntity = Object.values(promptData.entities)
        .flat()
        .find((entity) => isNaN(Number(entity.value)));

      chatroomName = chatroomNameEntity?.value;

      if (!chatroomName) {
        return {
          emote: "error",
          msg: end(
            `Please include the name of chatroom you would like to post to!`
          ),
        };
      } else {
        return `Great! What should be the title of your post?`;
      }
    } else {
      return {
        emote: "error",
        msg: end("You need to login to create a post!"),
      };
    }
  };

  const handleReceive = async (prompt) => {
    switch (stage) {
      case "FOLLOWUP_TITLE":
        return await handleFollowupTitle(prompt);
      case "FOLLOWUP_CONTENT":
        return await handleFollowupContent(prompt);
      case "FOLLOWUP_CONFIRM":
        return await handleFollowupConfirm(prompt);
    }
  };

  const handleFollowupTitle = async (prompt) => {
    title = prompt;
    stage = "FOLLOWUP_CONTENT";
    return `Alright, and what should be the content of your post?`;
  };

  const handleFollowupContent = async (prompt) => {
    content = prompt;
    stage = "FOLLOWUP_CONFIRM";
    return `Excellent! To confirm you want to create this post titled '${title}' in ${chatroomName}?`;
  };

  const handleFollowupConfirm = async (prompt) => {
    confirmation = prompt;
    const resp = await fetch(
      `https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`,
      {
        headers: {
          Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
        },
      }
    );
    const data = await resp.json();
    if (data.intents.length > 0 && data.intents[0].name === "confirmation") {
      const res = await fetch(
        `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroomName}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CS571-ID": CS571.getBadgerId(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
          }),
        }
      );
      if (res.status === 200) {
        return {
          emote: "SUCCESS",
          msg: end(`All set! Your post has been made in ${chatroomName}`),
        };
      } else {
        const errData = await res.json();
        return { emote: "error", msg: end(`${errData.msg}`) };
      }
    } else {
      return end(
        `Your post has not been posted! You can post again whenever you want.`
      );
    }
  };

  return {
    handleInitialize,
    handleReceive,
  };
};

export default createPostSubAgent;
