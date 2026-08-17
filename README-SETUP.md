# TGG $5 Off Modal + Mailchimp

## Files
- `netlify/functions/subscribe.js`  → drop at that exact path in the repo root
- `PASTE-INTO-index.html`           → paste contents before `</body>` in index.html,
                                       and DELETE the old auto-dismissing Oct 3 modal

## Netlify environment variables
Site configuration → Environment variables → Add

| Key | Value | Where to find it |
|---|---|---|
| `MAILCHIMP_API_KEY` | your key, ends in `-us##` | Mailchimp → Profile → Extras → API keys |
| `MAILCHIMP_LIST_ID` | Audience ID | Mailchimp → Audience → Settings → Audience name and defaults |
| `MAILCHIMP_STATUS` | `subscribed` or `pending` | use `pending` only if the audience is double opt-in |
| `MAILCHIMP_TAGS` | `giving5-modal,crawl-2026` | optional, this is the default |

Do NOT put the API key in the repo. Environment variables only.

## Deploy
Commit both files, push. Netlify auto-detects `netlify/functions/`.
No netlify.toml needed. No npm install needed. Node 18+ has global fetch.

## Test
1. Visit the site, enter a real address you control
2. Check Mailchimp Audience for the contact, tagged `giving5-modal`
3. Click Buy Tickets, confirm the cart shows $5 off per ticket
4. If nothing lands in Mailchimp: Netlify → Logs → Functions → subscribe

## Notes
- Emails go straight into the audience. No Netlify Forms, no Zapier.
- Repeat signups upsert cleanly, they do not error.
- Someone who previously unsubscribed is skipped silently, which is required by Mailchimp.
- If Mailchimp is down the person still gets their code. We never trap a buyer behind a broken form.
