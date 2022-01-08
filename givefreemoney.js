const ethers = require("ethers");
require('dotenv').config()

const fs = require('fs');

const filename = "addresses.txt";
let eachEthAmount = 0.01;
if (process.argv.length > 2) {
	eachEthAmount = parseFloat(process.argv[2]);
}

const { PRIVATE_KEY, PUBLIC_KEY, API_KEY } = process.env;

const main = async () => {

	// provider
	const network = "rinkeby";
	const provider = ethers.getDefaultProvider(network, {
			etherscan: API_KEY,
	});

	const balance = await provider.getBalance("ethers.eth");
	// console.log("Provider balance: ", balance);

	// signer
	const wallet = new ethers.Wallet(PRIVATE_KEY);
	const signer = wallet.connect(provider);

	const account = await signer.getAddress();
	// console.log("Signer account:", account);

	// contract
	const contractAddress = "0x9C5e3fC0F0430eB449e5cc529257B47C9E2066A0";
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
	fs.readFile(filename, 'utf8', async (err, data) => {
		if (err) throw err;
		const addressesRaw = data.split("\n");
		// console.log("Total ETH to airdrop:", addresses.length * eachAmount);
		// console.log(addresses);
		const addresses = addressesRaw.map((address) => String(address.trim())).filter(e => e);
		const overrides = {
			value: eachEthAmount * 1000000000000000000 * addresses.length, // wei -> 0.0001 eth
		}
		// const airDropAddrs = [String("0xEBcFba9f74a34f7118D1D2C078fCff4719D6518D"), String("0x06CcfaB8c54e64BBFEc51c86027b471d4A600923")];
		const airDropAddrs = addresses;

		// send transaction
		console.log("sending...");
		const tx = await contract_rw.airDrop(airDropAddrs, overrides);
		
		// const fakeDebug = tx;
		// fakeDebug.alecPrivateKey = "0xyeahyoureallythoughtSnd2bG5heWF3ZHd5anBrdFE0dEhRZWhkc1RhNlZtQzl4cTdzSmRNejU5eWhyRnNhMHkySVJRUjI0anRXME9PNg"
		// console.log(tx);
		// console.log(fakeDebug);
		console.log("sent!");
		console.log("confirming transaction...");
		console.log("prolly gonna take like 15 seconds");

		await tx.wait();

		console.log("confirmed!")
		console.log("check ur wallet for a surprise ;)");
		// console.log("Done! Hash: ", tx.hash);
		});
		

}

main();
