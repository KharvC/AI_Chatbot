**Note:** The application won't work if you don't have a BadgerId

# BadgerChat Voice Interface

Welcome to **BadgerChat**, your friendly chat assistant for exploring and interacting with UW–Madison chatrooms via natural language. Use voice or text—BadgerChat understands your commands and handles everything from account management to posting messages. Here's what you can do:

---

## Core Capabilities

### 1. Get Help

* **Trigger:** “help”, “what can I do?”, “show commands”
* **What happens:** BadgerChat offers example queries and tips to guide your next action.

### 2. Browse Chatrooms

* **Trigger:** “list chatrooms”, “show chatrooms”, “what chatrooms are available?”
* **What happens:** Displays all active chatrooms you can join and explore.

### 3. Read Messages

* **Trigger Patterns:**

  * “show the latest message” (global or specific chatroom)
  * “give me the 4 latest posts in Witte Whispers”
* **What happens:** Fetches and reads out the most recent 1–10 messages from the specified room or across all rooms if none is specified.

### 4. Authentication

#### Login

* **Trigger:** “login”, “log me in”
* **Flow:** Prompts for username and 7-digit PIN (input is masked). On success, you see a 🎉 success emote; on failure, an error emote.

#### Register

* **Trigger:** “register”, “sign me up”
* **Flow:** Prompts for username and PIN twice (masked). Validates PIN length and uniqueness. Successful registration logs you in automatically with a success emote.

#### Check Current User

* **Trigger:** “who am I?”, “am I logged in?”
* **What happens:** Tells you whether you’re logged in and displays your username if you are.

#### Logout

* **Trigger:** “logout”, “log me out”
* **What happens:** Ends your session and confirms you’ve been logged out (or prompts that you weren’t logged in).

### 5. Create a Post

* **Trigger:** “post to Union South Socials”, “make a post in Picnic Point Pathfinders”
* **Flow:**

  1. Checks login state and prompts to log in if needed.
  2. Collects **title** and **content** of your post.
  3. Asks for final confirmation.
  4. On confirm, posts your message and shows a success emote; on cancel, aborts gracefully.

---

## Special Touches

* **Masked PINs:** Your PIN entries are replaced by “Sensitive information redacted!” in the chat log.
* **Emotes:** Success operations show a `bucki_success.png`; errors show `bucki_error.png`.
* **Natural Language:** Speak or type casually—BadgerChat understands variations and synonyms for chatroom names.

---

