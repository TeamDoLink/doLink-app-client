# iOS TestFlight GitHub Actions Design

## Context

The repository already has an Android Play Store workflow at `.github/workflows/android-playstore-fastlane.yml`. Android deploys on `release-*` tags and manual dispatch, sets up Node, Ruby, Java, Expo public environment values, restores Android-specific signing files, runs Expo prebuild, builds with Fastlane, and uploads to Google Play.

iOS deployment support already exists in Fastlane:

- `package.json` exposes `deploy:ios` as `bundle exec fastlane ios deploy_testflight`.
- `fastlane/Fastfile` defines `ios deploy_testflight`.
- The iOS lane regenerates the native iOS project with Expo prebuild, syncs signing through `match`, builds the app, and uploads it to TestFlight.

The missing piece is a GitHub Actions workflow that calls this existing iOS lane.

## Requirements

- Add a separate GitHub Actions workflow for iOS TestFlight deployment.
- Trigger iOS deployment with a separate tag pattern, not Android's `release-*` tag.
- Use `ios-release-*` as the iOS release tag pattern.
- Also support manual execution through `workflow_dispatch`.
- Use the existing Fastlane lane: `bundle exec fastlane ios deploy_testflight`.
- Use a macOS runner because iOS builds require Xcode.
- Keep Expo public values aligned with the existing Android workflow.
- Use GitHub Actions secrets for iOS-specific deployment credentials and configuration.
- Do not change Android deployment behavior.
- Do not modify generated API files or native iOS files as part of this workflow-only change.

## Workflow Design

Create `.github/workflows/ios-testflight-fastlane.yml`.

The workflow will have one job:

- Job name: `deploy-ios`
- Runner: `macos-latest`
- Environment: `production`
- Trigger:
  - `push.tags: ["ios-release-*"]`
  - `workflow_dispatch`

The job will:

1. Check out the repository.
2. Set up Node 20 with npm cache using `package-lock.json`.
3. Set up Ruby 3.2 with Bundler cache.
4. Install Java 17. This keeps Expo prebuild and React Native tooling consistent with Android CI, even though the final build is iOS.
5. Install JavaScript dependencies with `npm ci`.
6. Generate `.env` for Expo using the same public Expo values used by the Android workflow.
7. Run `bundle exec fastlane ios deploy_testflight`.

## Environment Variables

Expo public values should follow the existing Android workflow pattern:

- `EXPO_PUBLIC_DOMAIN`
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN`
- `EXPO_PUBLIC_DEBUG_INBOX`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

iOS-specific deployment values will come from GitHub Actions secrets:

- `APP_STORE_CONNECT_API_KEY_KEY_ID`
- `APP_STORE_CONNECT_API_KEY_ISSUER_ID`
- `APP_STORE_CONNECT_API_KEY_CONTENT`
- `MATCH_GIT_URL`
- `MATCH_PASSWORD`
- `IOS_SCHEME`

Optional iOS values can also be wired from secrets so Fastlane can use them when present:

- `IOS_APP_IDENTIFIER`
- `APPLE_TEAM_ID`
- `APP_STORE_CONNECT_TEAM_ID`
- `MATCH_TYPE`
- `MATCH_READONLY`

## Error Handling

Fastlane already performs required environment validation through `ensure_env_vars` for the mandatory iOS deployment values. The workflow should rely on that validation instead of duplicating a separate shell validation block.

The `.env` generation step should mirror the Android workflow so Expo receives predictable values during prebuild. Missing Expo values should become empty strings, matching the existing workflow behavior.

## Testing

Before considering the change complete:

- Validate the workflow YAML parses.
- Confirm the new workflow contains the intended `ios-release-*` tag trigger.
- Confirm the deploy step calls `bundle exec fastlane ios deploy_testflight`.
- Confirm no Android workflow behavior changed.

The actual TestFlight upload requires real GitHub Actions secrets, Apple credentials, Match repository access, and App Store Connect access, so it cannot be fully verified locally.
