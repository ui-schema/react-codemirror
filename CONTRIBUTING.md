# Contributing to UI-Schema

1. Fork/Clone repository **branch `develop`**
2. Install dependencies (like lerna, webpack): `npm i`
3. Start dev-server: `npm start`
    - (will clean-dist + start demo app)
4. Open browser on [localhost:4203](http://localhost:4203) for demo
5. Explore [packages](packages) and there [demo/src/pages](packages/demo/src/pages)
6. Code -> Commit -> Pull Request -> Being Awesome!

Changes from any package are reflected inside the demo package.

**Commands:**

- Developing test driven: `npm run tdd`
    - needs manual bootstrapping and update handling
    - `npm run tdd -- -u --testPathPattern=src/Validators`
        - with `-u|--update` for snapshot update testing
        - with `--testPathPattern` to run all tests in a specific folder / path
        - `npm run tdd -- --testPathPattern=PatternValidator -t patternValidator` for only one test and often only one file
- Testing: `npm test`
- Build: `npm run build`
- Clean node_modules and build dirs: `npm run clean`
- Clean build dirs: `npm run clean-dist`

## Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the [MIT License](LICENSE) attached to the repository and to adhere to the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md).

Questions? Feel free to open discussions or join the [discord channel](https://discord.gg/MAjgpwnm36)!
