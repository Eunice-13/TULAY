# Acceptance checklist ΓÇö not executed yet

Record date, tester, expected/actual result and pass/fail. These tests become automated where practical.

- [ ] Signup/login and logout work; state persists across reload.
- [ ] Matching accepts normalized fictional inputs; mismatches reveal no registry details.
- [ ] Duplicate claim of the same registry beneficiary is blocked.
- [ ] New mock enrollee selects clinic; existing member only confirms assigned clinic.
- [ ] Match/QR scan does not activate; pending account cannot call protected APIs directly.
- [ ] Assigned clinic staff explicitly activates; other clinic/doctor/pharmacy cannot.
- [ ] Active assigned patient receives doctor's prescription; other-clinic doctor is denied.
- [ ] Patient cannot see another patient's prescriptions.
- [ ] UPSC is backend-generated and unique; invalid lookup fails safely.
- [ ] Pharmacy can look up a prescription but cannot browse the registry or issue prescriptions.
- [ ] Lookup does not consume the UPSC or authorize automatic release.
- [ ] Provider can update only own availability; no quantity tracking exists.
- [ ] Out of Stock -> Available triggers one alert; repeated Available saves do not duplicate it.
- [ ] In-app/simulated SMS is labeled honestly; real SMS delivery is not claimed.
- [ ] Phone/tablet/desktop layouts, keyboard access, labels, errors and zoom pass.
- [ ] Build, type checks, lint and relevant automated tests pass once framework exists.
- [ ] Deployed demo works using separate role accounts; no secrets appear in browser/static files.
- [ ] Optional offline: only intended public content cached, stale timestamp shown, private actions online, first visit needs network.


