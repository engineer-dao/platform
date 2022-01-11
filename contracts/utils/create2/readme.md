# Task Definition
`Ethereum` `Deploy Bytecode` `Solidity CREATE / CREATE2`

| ps: I like giving people a sense of purpose by providing context for the task. Here is an example:

# Why ? and Use Cases:
Having made mistakes in the past that lead to errors, we have seen a big need of upgradability for our contracts
We want to create the so-called - UpgradeProxy that lets us change our business logic if need be.
Your part is very important - The FirewallFactory contract.
As you may guess from the name it does 2 main things
- it deployes contracts given the bytecode as input.
- it serves as a firewall, allowing only whitelisted bytecode to be deployed.

## Spec:
- only the owner can add to whitelist.
- Please see the diagram for the desired flow & if any questions, feel free to ping me.

Tips:
* use CREATE for simplicity
