# Launch readiness

Owner approval was supplied for the website content, contact address, and purchase details. This records approval, not an independently performed email-delivery, retailer-checkout, or physical-device test.

Production URL: https://comonline.vercel.app/

## Implemented safeguards

- Pull-request and main-branch CI: static build, semantic/metadata/link/image checks, JavaScript syntax, and static deployment packaging with source/docs/tooling/briefs excluded.
- Removed the unused GitHub Pages deployment workflow. Vercel remains the production publishing path.
- Added live production smoke checks for nine pages, four JavaScript/CSS resources, sitemap, robots, and a nested branded 404: 16 HTTP/content checks in total. Includes homepage canonical verification and one retry on transient failure.
- Scheduled these checks every six hours at minute 17 UTC (01:17, 07:17, 13:17, 19:17 in Lagos). They can also be run manually. GitHub workflow-failure notifications depend on the recipient's GitHub notification preferences. Scheduling can be delayed, and public-repository schedules can be disabled after inactivity; this is not continuous uptime monitoring.
- Local validation passed the build, 202 local link/asset checks, deployment packaging, and all 16 live checks. The earlier browser/accessibility/motion results remain documented in production-finish.md; no visual code changed in this safeguards pass.

## Owner actions requiring access unavailable in this session

### Main-branch protection

The connected GitHub account has push permission but no repository admin permission. Branch protection cannot be configured with this access. An administrator should open:

https://github.com/adeyejesuolaoluwa/comonline/settings/rules

Protect `main`, require pull requests, require `Build and validate` and the `Vercel` status check before merging, require the branch to be current, and block force pushes and branch deletion. Avoid bypassing checks for routine releases.

### Search Console

No authenticated Search Console connection or owner verification token was provided. Add a URL-prefix property for `https://comonline.vercel.app/` in the intended Google account, use HTML-tag verification, then provide the exact `google-site-verification` value for installation in the shared page head. After verification, submit `https://comonline.vercel.app/sitemap.xml` and request homepage indexing. A domain property is unnecessary for the Vercel subdomain because its parent DNS is not controlled here.

Official ownership instructions: https://support.google.com/webmasters/answer/9008080

### Manual launch review

Physical iPhone/Android checks and screen-reader checks remain unverified. Browser engine emulation is not a substitute. The existing mailbox and retailer details are owner-approved, but delivery and checkout have not been independently exercised by the agent. No messages, purchases, paid monitoring subscriptions, or custom-domain purchases were made.
