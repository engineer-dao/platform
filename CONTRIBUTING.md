# EngineerDAO Platform contributing guide

🎈 We are so happy to have you!

We're trying to create a new way of decentralized work!

There are many ways to contribute, including:
1. Get involved in the protocol design decisions [Joining Discord](https://discord.gg/FGw97wHZJJ) !
2. [Grab an Issue](https://github.com/engineer-dao/platform/issues)

## Workflow for Pull Requests

🚨 Fork; new branch; rebase; PR

In order to contribute `create a new branch in the main repo` that includes your changes and open a PR to `main`.

Additionally, if you are writing a new feature, please ensure you add appropriate test cases.

Follow the [Development Quick Start](#development-quick-start) to set up your local development environment.

We recommend using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format on commit messages.

### Rebasing

We use the `git rebase` command to keep our commit history tidy.
Rebasing is an easy way to make sure that each PR includes a series of clean commits with descriptive commit messages
See [this tutorial](https://docs.gitlab.com/ee/topics/git/git_rebase.html) for a detailed explanation of `git rebase` and how you should use it to maintain a clean commit history.


## Development Quick Start

### Dependencies

You'll need the following:

* [Git](https://git-scm.com/downloads)
* [NodeJS](https://nodejs.org/en/download/) v16.5.0
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Setup

Clone the repository, open it, and install nodejs packages with `yarn`:

```bash
git clone https://github.com/engineer-dao/platform.git
cd platform
yarn install
```

#### Setup Env variables

TODO

### Starting the Platform

```bash
yarn start
```

### Running tests

Run unit tests for all packages in parallel via:

```bash
yarn test
```

To run unit tests for a specific package:

```bash
cd package-to-test
yarn test
```

### Running contract static analysis

We perform static analysis with [`slither`](https://github.com/crytic/slither). You must have Python 3.x installed to
run `slither`. To run `slither` locally, do:

```bash
cd packages/contracts
pip3 install slither-analyzer
yarn test:slither
```
