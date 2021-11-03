const ethers = require("ethers");
require('dotenv').config()

const { PRIVATE_KEY, PUBLIC_KEY, API_KEY } = process.env;

const main = async () => {

	// provider
	const network = "rinkeby";
	const provider = ethers.getDefaultProvider(network, {
			etherscan: API_KEY,
	});

	const balance = await provider.getBalance("ethers.eth");
	console.log("Provider balance: ", balance);

	// signer
	const wallet = new ethers.Wallet(PRIVATE_KEY);
	const signer = wallet.connect(provider);

	const account = await signer.getAddress();
	console.log("Signer account:", account);

	// contract
	const contractAddress = "0x9C5e3fC0F0430eB449e5cc529257B47C9E2066A0";
	// const abi = [
  //   "constructor(address originalApproved)",
  //   "function getApproved(address _addr) public view returns (bool)",
  //   "function setApproved(address _addr) public",
  //   "function getBalance() public view returns (uint)",
  //   "function airDrop(address payable[] memory _addrs) public payable",
	// ];
	const abi = [{"inputs":[{"internalType":"address payable[]","name":"_addrs","type":"address[]"}],"name":"airDrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable[]","name":"_addrs","type":"address[]"},{"internalType":"uint256[]","name":"_amnts","type":"uint256[]"}],"name":"airDropAmounts","outputs":[],"stateMutability":"payable","type":"function"}]
	const contract = new ethers.Contract(contractAddress, abi, provider);
	const contract_rw = contract.connect(signer);
	// const contract_rw = new ethers.Contract(contractAddress, abi, signer);


	// transaction
	// const tx = {
	// 	from: PUBLIC_KEY,
	// 	to: , // contract
	// 	value: 100, // wei
	// 	nonce: provider.getTransactionCount(PUBLIC_KEY, "latest"),
	// 	// gasLimit: ethers.utils.hexlify(gas_limit), // 100000
	// 	// gasPrice: gas_price,
	// }
	const overrides = {
		value: 100000000000000, // wei -> 0.0001 eth
	}
	const airDropAddrs = [String("0xEBcFba9f74a34f7118D1D2C078fCff4719D6518D"), String("0x06CcfaB8c54e64BBFEc51c86027b471d4A600923")];

	// send transaction
	console.log("Sending...");
	// signer.sendTransaction(tx).then((transaction) => {
	// contractWithSigner.airDrop(airDropAddrs).then((transaction) => {
	const tx = await contract_rw.airDrop(airDropAddrs, overrides);
	console.log(tx);
	console.log("Successfully sent!");
	console.log("Waiting...");
	await tx.wait();
	console.log("Done! Hash: ", tx.hash);

}

main();