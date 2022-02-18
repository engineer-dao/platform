# EngineerDAO :: Contracts

To compile the contacts and run a local node, do this:

```shell
npx hardhat node
```

Set your Metamask network to localhost:8545 to use your local node.

# Copy contract code to front end

After changing the contract, build and deploy the updated contract ABI to the frontend code with this task

```shell
npm run build
```

# Tests

Try run tests:

```shell
npx hardhat test
```

# Deploy to testnet

To deploy to Ropsten testnet:
```shell
ROPSTEN_DEPLOYER_PRIVATE_KEY=0xac0974bec39fffffffffffffffffffffffffffffffffffffffffffffffffff80 \
ROPSTEN_TREASURY_PRIVATE_KEY=0x59c6995e998fffffffffffffffffffffffffffffffffffffffffffffffff690d \
ROPSTEN_DR_RESOLVER_PRIVATE_KEY=0x5de4111afa1afffffffffffffffffffffffffffffffffffffffffffffffff365a \
ROPSTEN_RPC_URL="https://ropsten.infura.io/v3/2fffffffffffffffffffffffffffffe2" \
  npx hardhat deploy --network ropsten
```

#### Running contract static analysis

We perform static analysis with [`slither`](https://github.com/crytic/slither). You must have Python 3.x installed to
run `slither`. To run `slither` locally, do:

```bash
cd /contracts
pip3 install slither-analyzer
yarn test:slither
```

# More info

See https://github.com/nomiclabs/hardhat and https://github.com/wighawag/hardhat-deploy for more help.
