# How to Publish `tf-ai`

This guide explains how to publish your CLI tool to the npm registry.

## Prerequisites
- You must have an [npm account](https://www.npmjs.com/signup).
- You must be logged in to npm in your terminal.

## Authentication
Check if you are logged in:
```bash
npm whoami
```
If not specific user, login:
```bash
npm login
```

## Publishing Steps

### 1. Update Version
Always bump the version before publishing. Semantic versioning (major.minor.patch) is recommended.

```bash
# For a patch release (e.g., 1.0.0 -> 1.0.1)
npm version patch

# For a minor release (e.g., 1.0.0 -> 1.1.0)
npm version minor

# For a major release (e.g., 1.0.0 -> 2.0.0)
npm version major
```
*Note: This command will automatically update `package.json` and create a git tag.*

### 2. Push Changes
Ensure your code and the new version tag are pushed to GitHub.
```bash
git push && git push --tags
```

### 3. Publish to NPM
Run the publish command. This will automatically run `pnpm build` first because of the `prepublishOnly` script.
```bash
npm publish
```
*If this is the very first publish, the package will be public by default unless you put `"private": true` (which we haven't).*

## Troubleshooting
- **OTP**: If you have 2FA enabled (recommended), `npm publish` will prompt you for a one-time password.
- **Access**: If the name `tf-ai` is taken by someone else, the publish will fail. You will need to choose a different name in `package.json`.
