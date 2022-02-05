# EngineerDAO Platform contributing guide

🎈 We are so happy to have you!

Todo

## Workflow for Pull Requests

🚨 Todo

## Development Quick Start

### Dependencies

You'll need the following:

* [Git](https://git-scm.com/downloads)
* [NodeJS](https://nodejs.org/en/download/)
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
