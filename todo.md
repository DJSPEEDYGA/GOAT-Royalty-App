# GOAT Royalty App — Systems Audit & Optimization
## Resumed from previous session

## Phase 1: Commit Pending Fix
- [x] axiom-ui.js window.* exports fix (12 exports added)
- [ ] Commit and push the axiom-ui.js fix to GitHub

## Phase 2: Complete Security Audit
- [ ] CSP hardening — remove unsafe-inline, add nonce or move inline scripts
- [ ] innerHTML XSS audit — review all 71 instances for user-input injection risk
- [ ] browser-automation.js — decide: integrate or document as main-process-only

## Phase 3: Performance & Architecture Optimization
- [ ] Memory leak check — event listeners, intervals, DOM cleanup
- [ ] Lazy loading analysis — defer heavy modules
- [ ] Duplicate code detection and DRY refactoring opportunities
- [ ] Verify all IPC channels match between preload.js and main.js

## Phase 4: Enhancements (Architect's Choice)
- [ ] Add error boundary / global error handler for renderer
- [ ] Add app-wide notification/toast system
- [ ] Add keyboard shortcuts for tool switching
- [ ] Improve main.js with proper IPC security (validate channels)

## Phase 5: Final Push
- [ ] Run full syntax validation on all modules
- [ ] Commit all optimizations and push to GitHub
- [ ] Deliver final audit report to user