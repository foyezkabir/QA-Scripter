# User Messaging - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/messaging)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-messaging.baseline.json`.

Spec file: `user-messaging.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, against the user's own assistant **Asta**.

Setup: none. The page is read-only in these tests: no switch is toggled, nothing is connected, disconnected or saved, and no model is chosen. Which channels are connected, the bot name, the stored tokens and the model prices are the assistant's live configuration and are never asserted by value. Plain-text messages have no ARIA role. The four channel switches and the two model selects have no accessible name, so they are found by role and counted.

## Messaging page

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Messaging | populated | the page shows the heading Messaging, the text "Talk to your agent from anywhere. Connect a channel to start sending and receiving messages.", and the headings Connected channels and Model per channel | TC-01 | @smoke |
| Messaging | populated | the four channel cards are described: WhatsApp "Receive and respond to customer messages via your own WhatsApp number.", Telegram "Chat with customers via Telegram bot.", Microsoft Teams "Receive @-mentions and DMs via a registered Azure Bot (Bot Framework)." and Slack "Receive @-mentions and DMs via a Slack app in Socket Mode." | TC-02 | @regression |
| Messaging | connected | Telegram and Slack show a Connected status and a Disconnect button each | TC-03 | @regression |
| Messaging | disconnected | WhatsApp and Microsoft Teams show a Disconnected status and no credential fields | TC-04 | @regression |
| Messaging | populated | there are four channel switches, two checked (Telegram, Slack) and two unchecked (WhatsApp, Microsoft Teams) | TC-05 | @regression |
| Telegram card | connected | the card has the Bot token and "Allowed Telegram user IDs (comma-separated)" fields and the hint "Numeric Telegram user IDs only - the bot ignores everyone else. Leave empty to lock to you automatically once you first message the bot." | TC-06 | @regression |
| Slack card | connected | the card has the "Bot token (xoxb-…)", "App-level token (xapp-…)" and "Allowed Slack user IDs (comma-separated)" fields, the hint "Slack user IDs only - the bot ignores everyone else. Leave empty to lock to you automatically once you first message the bot." and the setup instructions with the Slack app link | TC-07 | @regression |
| Telegram and Slack cards | connected | the three token fields hide their stored value as password inputs | TC-08 | @critical |
| Model per channel | populated | the section explains "Each channel replies on a fast model by default so responses stay snappy..." and offers one model select for Telegram and one for Slack, each listing Fast (recommended), Primary, Coder and Fast | TC-09 | @regression |
| Model per channel | populated | the Slack model select carries the hint "slower replies" | TC-10 | @regression |
| Agent sections | populated | the Messaging link in Agent sections opens /chat/<assistant id>/messaging from the chat page | TC-11 | @regression |

## Out of scope (recorded, not tested)

- The four switches **WhatsApp channel switch**, **Telegram channel switch**, **Microsoft Teams channel switch** and **Slack channel switch**, and both **Disconnect** buttons turn a live channel on or off; they are counted and never clicked. The form shown when a disconnected channel is switched on (its Connect button and fields) is not reached.
- Choosing a model in the **Telegram model** or **Slack model** select changes the channel's model; the options are read only.
- The **Slack app** link goes to external documentation and is not followed. The setup text ends "Click Connect to save" while only Disconnect is shown (a finding, see findings/user.txt).
- The empty, loading, error and disabled states are recorded as not reached in the baseline: they need every channel disconnected, a bad token, or a Connect attempt.
- A signed-out visit redirects to /auth/signin; the sign-in module covers the redirect.
- The sidebar controls **Back**, **Collapse sidebar**, **New Chat**, **Open command palette**, **All**, **Chats**, **Projects**, **CRM**, **Filter chats by time**, **Team Spaces**, **Recents**, **View all**, **More options**, **Switch agent**, **Notifications**, **Settings** and **Search in chat** belong to the chat and shell modules.
