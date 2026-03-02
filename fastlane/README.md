fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build Android AAB (release)

### android playstore

```sh
[bundle exec] fastlane android playstore
```

Upload AAB to Google Play Store

### android build_and_deploy

```sh
[bundle exec] fastlane android build_and_deploy
```

Build and upload to Play Store

### android deploy

```sh
[bundle exec] fastlane android deploy
```

Alias for playstore (upload only)

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
