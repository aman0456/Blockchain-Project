function init() {
	// TODO: refactor conditional
	if (typeof web3 !== 'undefined') {
		// If a web3 instance is already provided by Meta Mask.
		App.web3Provider = web3.currentProvider;
		web3 = new Web3(web3.currentProvider);
	} else {
		// Specify default instance if no web3 instance provided
		App.web3Provider = new Web3.providers.HttpProvider('http://10.42.0.139:7545');
		web3 = new Web3(App.web3Provider);
	}
	console.log("here");
	$.getJSON("Network.json", function(network) {
		// Instantiate a new truffle contract from the artifact
		console.log("defaultAccount = " + web3.eth.defaultAccount)
		App.contracts.Network = TruffleContract(network);
		// Connect provider to interact with contract
		window.ethereum.enable()
		App.contracts.Network.setProvider(App.web3Provider);
		web3.eth.defaultAccount = web3.eth.accounts[0]
		web3.eth.getCoinbase(function(err, account) {
			if (account === null) {
				console.log('getting null account');
			}
			App.account = account;
			console.log("Your Account: " + account);
		});
		// window.ethereum.autoRefreshOnNetworkChange = false;
		// web3.personal.unlockAccount(web3.eth.defaultAccount, "", 0)
		App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.existUser({ from: App.account})
		}).then(function(doesExist) {
			console.log(doesExist)
			if (!doesExist) {
				window.location.href = "login.html";
			}
			App.render();
		});
	});
}