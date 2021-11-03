# air-drop

### Context
Basic airdrop utility function to send testnet eth to people during events.

Deployed airdrop.sol through Remix so there's no hardhat environment.

### How to use this
#### Etherscan
[See the contract here.](https://rinkeby.etherscan.io/address/0x9C5e3fC0F0430eB449e5cc529257B47C9E2066A0#code)
Note: address input should be in the form `["addr1", "addr2"]`, and amount input should be in the form
`[number1,number2]`, with no spaces and where number1 and number2's units are in wei.

#### Locally
Create a `.env` file with the following keys:
- PRIVATE_KEY
- PUBLIC_KEY
- API_KEY - get from etherscan

Set your public key to be approved by calling the contract's `setApproved` function.
I realized just as I'm writing this I did not include `require(ApprovedAddresses[msg.sender])`
in this function so that system is useless until a deploy a new contract fixing it..

Make sure `contractAddress` is what you want.

Go into `index.js` and modify how much eth/wei you want to airdrop by
editing `overrides.value`.

Modify what addresses you want to airdrop to by editing `airDropAddrs`.

Run `node index.js`.

### Next steps
- Redeploy contract restricting setApproved to only approved addresses
- Make script for adding approved addresses
- Make value a command line argument
- Have an easy way of piping in list of addresses - read from file?

