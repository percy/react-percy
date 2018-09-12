# Releasing

1. Mike or Tim should do this until we have a process for doing this on a branch.
1. Run `npm whoami` to make sure you're signed in as percy-admin.
1. `git pull origin master`
1. `yarn test`
1. `yarn lerna:publish` - this will prompt for new versions of all packages that have changed, update the package.json files, will publish the non-private packages to npm, and will create git tags and push them to GitHub.
1. [Update the release notes](https://github.com/percy/react-percy/releases) on GitHub for the @percy/react vx.x.x tags
1. [Visit npm](https://www.npmjs.com/package/@percy/react) and see the new version is live
1. Announce the new release,
   making sure to say "thank you" to the contributors
   who helped shape this version!
