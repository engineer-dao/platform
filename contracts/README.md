# EngineerDAO :: Contracts

To compile the contacts and run a local node, do this:

```shell
npx hardhat node
```

Set your Metamask network to localhost:8545 to use your local node.


# Copy contract code to front end

After changing the contract, deploy the updated contract ABI to the frontend code with this task

```shell
npx hardhat copy-compiled
```

# Tests

Try run tests:

```shell
npx hardhat test
```


# More info

See https://github.com/nomiclabs/hardhat and https://github.com/wighawag/hardhat-deploy for more help.
