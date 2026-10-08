# User Chat - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-chat.baseline.json`.

Spec file: `user-chat.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, against the user's own assistant **Asta** (approved for any test action; never deleted).

Setup: tests that need a conversation get one from the `sentChat` fixture (precondition built through the UI because the chat has no API seeding path): it sends a short QA-AUTO message ("... - reply with the single word OK") to Asta and waits for the reply. Teardown ladder rung 3 (UI): the fixture deletes every sidebar conversation that carries the QA-AUTO marker, even after a failure; a failed cleanup is attached to the test, never thrown. Each send spends a few cents of Asta's budget. If Asta is stopped or over budget the send tests fail for that reason, not because of the page. Existing conversations, notification counts and model prices are live data and are never asserted. Plain-text messages have no ARIA role.

## Composer and start screen

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Chat | empty | a fresh Asta chat shows the greeting "Good evening, Naiemul" (the first words change with the time of day: Good morning, Good afternoon, Good evening), the text "What would you like Asta to help you with today?", the Type a message… box, the buttons Add attachments, Fast, Speech to text and Send message, the sidebar box "Search in chat" and the hint "Enter to send, Shift+Enter for new line · Esc to leave, / to return or Drag and Drop your files here" | TC-01 | @smoke |
| Chat | disabled | Send message is disabled while the composer is empty and enabled once text is typed | TC-02 | @regression |
| Chat | empty | the suggestions What can you do for me?, How are my projects performing? and Draft an email to a client are offered | TC-03 | @regression |
| Chat | populated | the Agent sections navigation links Projects, Tasks, Workspace, Tools, Messaging, Skills, CRM and Settings are shown | TC-04 | @regression |
| Agent model dialog | populated | Fast opens "Agent model (applies to all conversations)" with the note "Switching will briefly reload the agent." and the models Primary, Coder and Fast | TC-05 | @regression |
| Switch Agent dialog | populated | Switch agent opens the Switch Agent dialog listing Asta and the Team Spaces | TC-06 | @regression |
| Filter chats by time menu | populated | Filter chats by time offers Recent, All chats and Pick a date | TC-07 | @regression |
| Sidebar | populated | the sidebar filter All is pressed by default and choosing Chats presses Chats | TC-08 | @regression |
| Sidebar | collapsed | Collapse sidebar becomes Expand sidebar and Expand sidebar restores it | TC-09 | @regression |
| Command palette | populated | Open command palette opens the Command palette dialog | TC-10 | @regression |

## Sending and managing a conversation

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Thread | populated | sending a message shows it in the thread, Asta replies, and the conversation is listed in the sidebar and the URL gains its id | TC-11 | @critical |
| Thread | populated | after a reply the message offers Copy, Edit and Regenerate response and the reply offers Copy, Retry, Read aloud, Like and Unlike | TC-12 | @regression |
| More options menu | populated | More options on a conversation offers Rename, Pin, Move to project and Delete chat | TC-13 | @regression |
| Delete this chat? dialog | populated | Delete chat asks "Delete this chat?" with "This will permanently remove this conversation and all its messages." and Keep it leaves the conversation in place | TC-14 | @regression |
| Delete this chat? dialog | terminal | Yes, delete removes the conversation from the sidebar | TC-15 | @critical |

## Out of scope (recorded, not tested)

- **Back**, **New Chat**, **CRM**, **Projects** (sidebar filters beyond Chats) and the Agent sections' pages belong to other modules or open other screens; only their presence is checked.
- The suggestion buttons **What can you do for me?**, **How are my projects performing?** and **Draft an email to a client** send a message and are only checked for presence.
- **Edit**, **Regenerate response**, **Retry**, **Read aloud**, **Like**, **Unlike** change or replay the reply and are only checked for presence.
- **Add attachments** opens a file chooser and **Speech to text** needs microphone permission; both are only checked for presence.
- Choosing a model in **Fast** reloads the agent and changes the model for all conversations; the dialog is opened and closed only. **Switch agent** choices are never selected.
- **Rename**, **Pin** and **Move to project** change a conversation and are only listed; **Pick a date** needs a calendar and is only listed.
- Typing in **Search in chat** filters live conversations and is not asserted.
- Error states (stopped or over-budget assistant) are driven by Asta's live budget and are not forced.
