# Roadmap — Polaris Frontend

The Polaris frontend already provides public galleries plus authenticated project, dashboard, and selection views. The immediate focus is to finish the incomplete customer and photographer workflows and make them robust against API failures.

## 1. Complete the essential flows

- Connect profile editing and password changes to a real account API, then refresh the authenticated user state.
- Collect the client’s name and email in the public gallery before submitting a selection; validate and present a clear confirmation.
- Surface project photo-sync progress/results and selection counts in project and dashboard views.
- Let photographers manage gallery state, review client selections, and copy/share public gallery links from one clear place.

## 2. Improve gallery experience

- Add responsive image loading, loading/error placeholders, keyboard navigation, and accessible lightbox controls.
- Preserve selections locally during a session and handle closed, expired, or already-submitted galleries gracefully.
- Add clear package-limit and extra-photo pricing feedback before submission.

## 3. Strengthen client integration

- Standardize API error handling, authentication-expiry behavior, and request loading states across services/pages.
- Define typed contracts shared or generated from the backend to prevent drift in project, photo, and selection payloads.
- Add environment validation and a staging configuration for cross-origin cookie testing.

## 4. Quality and release

- Extend component and flow tests for profile updates, gallery submission, project sync, and protected routes.
- Add accessibility, responsive-layout, and production-build checks to CI.
- Document environment variables, deployment configuration, and the supported browser/image behavior.
