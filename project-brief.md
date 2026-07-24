# Project Brief

## Project Name

The Giving Green (TGG)

## Project Type

Marketing and operations hybrid. Annual charity event with year-round preparation and a supporting product surface (website and Shopify store).

## Project Mode

Mixed. Software (website, Shopify store), design (brand system, share cards, product panels), marketing (sponsor decks, social content), operations (charity partnerships, sponsor onboarding), creative (deck design, event assets).

## Purpose

Second annual charity pub golf crawl. October 3, 2026, Soulard, St. Louis, 1 to 6 PM. Nine bars operate as nine holes with sponsored drinks tied to stroke reductions. $15 of every $45 ticket routes to the buyer's chosen charity team.

## Audience

- Attendees: St. Louis area, willing to spend on a charity plus party day.
- Charity partners: nine confirmed 2026 organizations.
- Sponsors: private-label alcohol brands (Title Partner), plus tiered category and hole partners.
- Venues: nine Soulard bars locked for the 2026 course.

## Success Criteria

- Scale attendance above Year One.
- Full sell-through on sponsored drinks.
- Meaningful per-team charity dollars raised.
- Sponsor slots filled at 2026 St. Louis pricing (Title Partner plus tiered ladder).

## Spec Inputs

- 2026 pricing locked.
- 2026 course locked.
- 2026 charity lineup locked.
- Brand voice locked: warm community builder, party and purpose equal, no em dashes or en dashes, tagline "Fore Good.", footer creed "Party Fore a Great Cause."

## Non-Goals

- Do not expand to multi-city or national tour for 2026.
- Do not name exact attendance figures publicly.
- Do not share per-charity fundraising breakdowns publicly.
- Do not position the event as party-first or preachy about charity. The two are equal.

## Constraints

- Basic Shopify plan. No Liquid or theme editor access. Product-level HTML only.
- All commits to the website repository are handled by the project owner. Agents deliver replacement files, do not push directly.
- Static HTML site on GitHub Pages, custom domain.
- No em dashes or en dashes anywhere in copy or content.

## Source Materials

- Website source: `github.com/TheGivingGreen/tgg-website` (main branch, GitHub Pages).
- Live site: `thegivinggreen.org`.
- Shopify store: `thegivinggreen.store`.
- AI operating framework: `github.com/TheGivingGreen/Ozzie-AI-Framework`.
- Brand book and voice master files live at the repository root.

## Context Memory

- Session logs live as standalone dated child pages in Notion under a single parent page dedicated to this project. Naming convention: `Session Wrap -- [Month DD YYYY] | [Topic]`.
- Durable operational state lives in the primary Notion workspace. A shared workspace exists as a secondary reference.
- Framework canonical rules live in the AI operating framework repository. Do not restate them here.

## Agent Notes

- Verify against the live site via HTTP fetch before calling any change complete. Do not trust "Done" confirmations from the human without a live verification pass.
- The sandbox network egress used by some agents does not include the Shopify storefront domain or the Shopify CDN. Use `raw.githubusercontent.com` for repository state. When a Shopify-hosted asset is the source of truth, ask the human to download and upload it directly.
- Distinguish state-document rewrites from event-log appends per `AGENT_PROTOCOL.md`.
- Draft all outbound communications for approval. Never send without explicit sign-off on the exact final text in the same turn.
- Product-specific state (charity lineup, pricing, course, brand rules, active build details) is durable and lives in Claude memory. Treat that as the source of truth for those facts. When any change overrides an earlier entry, replace the entry rather than append.
