import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers'
import hre from 'hardhat'
import chai from 'chai'
import { solidity } from 'ethereum-waffle'

chai.use(solidity)
const { expect } = chai

const WETH_ADDRESS1
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

describe.only('>>> Example <<<', function() {
    let owner: SignerWithAddress
    let gasPrice: any
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress

    // let addrR1: SignerWithAddress;
    // let addrR2: SignerWithAddress;
    // let addrR3: SignerWithAddress;
    // let addrR4: SignerWithAddress;
    // let addrR5: SignerWithAddress;

    beforeEach(async function() {
        // deploy
    })

    afterEach(async function() {
        await hre.network.provider.request({
            method: 'hardhat_reset',
            params: [
                {
                    forking: {
                        jsonRpcUrl: ``,
                    },
                },
            ],
        })

        await new Promise((resolve) => setTimeout(resolve, 5000))
    })

    it('Should be X', async function() {
    })

