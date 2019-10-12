App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	hasVoted: false,

	init: function() {
		return App.initWeb3();
	},

	initWeb3: function() {
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
		return App.initContract();
	},

	initContract: function() {
		$.getJSON("Network.json", function(network) {
			// Instantiate a new truffle contract from the artifact
			App.contracts.Network = TruffleContract(network);
			// Connect provider to interact with contract
			App.contracts.Network.setProvider(App.web3Provider);
			web3.eth.defaultAccount = web3.eth.accounts[0]
			web3.eth.getCoinbase(function(err, account) {
				if (err === null) {
					if (account == null) {
						console.log('getting null account');
						App.account = 1;
					}
					else {
						App.account = account;
					}
					$("#accountAddress").html("Your Account: " + account);
				}
			});
		});
	},
	validateForm: function(){
	  var id = document.getElementById("id").value;
	  var name = document.getElementById("name").value;
	  // if(id.length == 0){
	  //   document.getElementById("error").style.color = "red";
	  //   document.getElementById("error").innerHTML = "ID is required";
	  //   return;
	  // }
	  // if(password.length == 0){
	  //   document.getElementById("error").style.color = "red";
	  //   document.getElementById("error").innerHTML = "Password is required";
	  //   return;
	  // }
	  console.log("adding user");
	  App.contracts.Network.deployed().then(function(instance) {
	  	networkInstance = instance;
	  	return networkInstance.addUser(id, name, { from: App.account});
	  }).then(function(result) {
	  	console.log(result);
	  	window.location.replace("index.html");
	  }).catch(function(err) {
	  	console.error(err);
	  });
	}
};

$(function() {
	$(window).load(function() {
		App.init();
	});
}); 