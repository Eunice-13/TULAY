# Build order ΓÇö 10-hour core, 2-hour buffer

- [ ] Hour 0ΓÇô1: scope/input contracts, Next.js initialization, Supabase project setup, private env configuration.
- [ ] Hour 1ΓÇô3.5: signup/login, private mock registry match, two clinic paths, pending lock and verification reference.
- [ ] Hour 3.5ΓÇô4.5: clinic-staff verification lookup and explicit activation; pre-created provider roles.
- [ ] Hour 4.5ΓÇô6.5: assigned-doctor prescription, random unique mock UPSC, own prescription view, pharmacy lookup.
- [ ] Hour 6.5ΓÇô7.5: care directory, medicine availability, subscriptions, deduplicated in-app/simulated-SMS alert.
- [ ] Hour 7.5ΓÇô9: integration, permission tests, phone/tablet/desktop tests, build/type/lint checks.
- [ ] Hour 9ΓÇô10: deployment, deployed-account checks, final slides, backup screen recording.
- [ ] Hour 10ΓÇô12 if available: critical fixes, rehearsals and submission. Optional offline public information/referral/maps only after core checks pass.

JJ documents/tests throughout; Eunice reviews scope throughout. Do not postpone integration until the end.

Demo: match -> confirm/select clinic -> pending -> walk-in staff activation -> doctor prescription -> patient view -> pharmacy lookup -> out-of-stock to available alert.

Manual slip reminder: if medicines are incomplete, ask dispensing staff for a manual note/slip. The app does not generate it or calculate remaining quantities.


