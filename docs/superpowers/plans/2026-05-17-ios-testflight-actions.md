# iOS TestFlight Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Actions workflow that deploys the iOS app to TestFlight through the existing Fastlane lane.

**Architecture:** Add one isolated workflow file under `.github/workflows/`. The workflow owns CI setup and environment wiring only; the actual iOS prebuild, signing, archive, and TestFlight upload remain inside `fastlane ios deploy_testflight`.

**Tech Stack:** GitHub Actions, Expo, npm, Ruby/Bundler, Fastlane, Apple App Store Connect API, Fastlane Match.

---

## File Structure

- Create: `.github/workflows/ios-testflight-fastlane.yml`
  - Responsibility: Trigger iOS TestFlight deployment on `ios-release-*` tags or manual dispatch, set up CI dependencies, generate Expo `.env`, and call Fastlane.
- Verify only: `.github/workflows/android-playstore-fastlane.yml`
  - Responsibility: Existing Android deployment workflow. It must remain unchanged.

## Task 1: Add iOS TestFlight Workflow

**Files:**
- Create: `.github/workflows/ios-testflight-fastlane.yml`
- Verify only: `.github/workflows/android-playstore-fastlane.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/ios-testflight-fastlane.yml` with this exact content:

```yaml
name: iOS TestFlight Deploy (Fastlane)

on:
  push:
    tags:
      - "ios-release-*"
  workflow_dispatch:

jobs:
  deploy-ios:
    runs-on: macos-latest
    environment: production
    env:
      CI: true
      RELEASE_TAG: ${{ github.ref_name }}
      EXPO_PUBLIC_DOMAIN: ${{ vars.EXPO_PUBLIC_DOMAIN }}
      EXPO_PUBLIC_API_URL: ${{ vars.EXPO_PUBLIC_API_URL }}
      EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN: ${{ vars.EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN }}
      EXPO_PUBLIC_DEBUG_INBOX: ${{ vars.EXPO_PUBLIC_DEBUG_INBOX }}
      EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: ${{ secrets.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID }}
      APP_STORE_CONNECT_API_KEY_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_KEY_ID }}
      APP_STORE_CONNECT_API_KEY_ISSUER_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ISSUER_ID }}
      APP_STORE_CONNECT_API_KEY_CONTENT: ${{ secrets.APP_STORE_CONNECT_API_KEY_CONTENT }}
      MATCH_GIT_URL: ${{ secrets.MATCH_GIT_URL }}
      MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
      IOS_SCHEME: ${{ secrets.IOS_SCHEME }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: package-lock.json

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.2"
          bundler-cache: true

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "17"

      - name: Install JS dependencies
        run: npm ci

      - name: Generate .env for Expo
        run: node -e "const fs=require('fs'); const lines=[`EXPO_PUBLIC_DOMAIN=${process.env.EXPO_PUBLIC_DOMAIN||''}`,`EXPO_PUBLIC_API_URL=${process.env.EXPO_PUBLIC_API_URL||''}`,`EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN=${process.env.EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN||''}`,`EXPO_PUBLIC_DEBUG_INBOX=${process.env.EXPO_PUBLIC_DEBUG_INBOX||''}`,`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=${process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID||''}`].join('\n')+'\n'; fs.writeFileSync('.env', lines); console.log('wrote .env');"

      - name: Deploy to TestFlight
        run: bundle exec fastlane ios deploy_testflight
```

- [ ] **Step 2: Validate the workflow exists and has the intended trigger**

The workflow intentionally does not set optional Fastlane values such as `IOS_APP_IDENTIFIER`, `APPLE_TEAM_ID`, `APP_STORE_CONNECT_TEAM_ID`, `MATCH_TYPE`, or `MATCH_READONLY`. If an optional GitHub secret is absent, GitHub Actions can expose it as an empty string, which would override Fastlane defaults like `com.teamdolink.dolink`, `appstore`, and readonly signing.

Run:

```bash
rg -n 'ios-release-\*|workflow_dispatch|bundle exec fastlane ios deploy_testflight' .github/workflows/ios-testflight-fastlane.yml
```

Expected output includes:

```text
6:      - "ios-release-*"
7:  workflow_dispatch:
57:        run: bundle exec fastlane ios deploy_testflight
```

The exact line number for the deploy step may differ if GitHub Actions expression formatting changes, but all three strings must be present.

- [ ] **Step 3: Validate YAML syntax with Ruby**

Run:

```bash
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/ios-testflight-fastlane.yml'); puts 'valid yaml'"
```

Expected output:

```text
valid yaml
```

- [ ] **Step 4: Confirm Android workflow was not modified**

Run:

```bash
git diff -- .github/workflows/android-playstore-fastlane.yml
```

Expected output: no output.

- [ ] **Step 5: Review the final diff**

Run:

```bash
git diff --no-index -- /dev/null .github/workflows/ios-testflight-fastlane.yml || true
```

Expected: the diff only adds `.github/workflows/ios-testflight-fastlane.yml`.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git add .github/workflows/ios-testflight-fastlane.yml docs/superpowers/plans/2026-05-17-ios-testflight-actions.md
git commit -m "ci: add ios testflight deploy workflow"
```

Expected: a commit containing the iOS workflow and this implementation plan.
