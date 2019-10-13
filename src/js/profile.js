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
			// window.ethereum.autoRefreshOnNetworkChange = false;
			// web3.personal.unlockAccount(web3.eth.defaultAccount, "", 0)
			window.ethereum.enable().then(function(instance) {
				console.log(instance);
				console.log("defaultAccount = " + web3.eth.defaultAccount)
				App.listenForEvents();
				App.contracts.Network.deployed().then(function(instance) {
					networkInstance = instance;
					return networkInstance.existUser({ from: App.account});
					// return networkInstance.addUser("temp1", "temp1", { from: App.account});   //TODO: Make this function
				}).then(function(doesExist) {
					console.log(doesExist)
					if (!doesExist) {
					window.location.href = "login.html";
					}
					else {
					var ad = networkInstance.idAddress("temp2");
					return ad;
					}
				}).then(function(didExist) {
					return networkInstance.existUser({from: didExist});
				}).then(function(didExist) {
					console.log(didExist);
					App.render();
				}).catch(function(error) {
					console.error(error);
				});
				// $('#pointssTable').append("<tr> <td> Achieved this </td> <td> not verified </td> </tr>");
			});
		});
	},

	// Listen for events emitted from the contract
	listenForEvents: function() {
		App.contracts.Network.deployed().then(function(instance) {
			// Restart Chrome if you are unable to receive this event
			// This is a known issue with Metamask
			// https://github.com/MetaMask/metamask-extension/issues/2393
			instance.addUserEvent({}, {
				fromBlock: 0,
				toBlock: 'latest'
			}).watch(function(error, event) {
				console.log("event triggered adduser", error, event)
				// Reload when a new vote is recorded
				// window.location.reload();
			});
			instance.addPointEvent({}, {
				fromBlock: 0,
				toBlock: 'latest'
			}).watch(function(error, event) {
				console.log("event triggered addpoint", event)
				// Reload when a new vote is recorded
				// App.render();
			});
			instance.deletePointEvent({}, {
				fromBlock: 0,
				toBlock: 'latest'
			}).watch(function(error, event) {
				console.log("event triggered delete point", event)
				// Reload when a new vote is recorded
				// App.render();
			});
			instance.addVerifierEvent({}, {
				fromBlock: 0,
				toBlock: 'latest'
			}).watch(function(error, event) {
				console.log("event triggered add verifier", event)
				// Reload when a new vote is recorded
				// App.render();
			});
			instance.respondPointEvent({}, {
				fromBlock: 0,
				toBlock: 'latest'
			}).watch(function(error, event) {
				console.log("event triggered respond point    ", event)
				// Reload when a new vote is recorded
				// App.render();
			});
		});
	},

	render: async function() {
		var pointsDiv = $("#pointSections");
		pointsDiv.empty();
		// Load account data

		var result = await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.users(App.account);
		});
		$("#id").text("@" + result[0]);
		$("#name").text(result[1]);
		$("#email").text(result[2]);
		$("#image").attr("src", result[3]);
		$("#bio").text(result[4]);

		await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.getPointsLength({ from: App.account});
		}).then(async function(userPointsCount) {
			console.log("displaying points");
			for (var i = 0; i < userPointsCount; i++) {
				console.log("adding point " + i);
				var point = await networkInstance.getPointByIndex(i, { from: App.account});
				var pointId = point[0];
				var pointSection = point[2];
				var sectionToAdd = $("#section-" + pointSection);
				if (!sectionToAdd.length) {
					console.log("adding section" + pointSection);
					pointsDiv.append(addSectionString(pointSection));
				}
				sectionToAdd = $('#sectionBody-' + pointSection);
				sectionToAdd.append(getPointEntryString(point));
				var verifierElem = $('#verifiers-' + pointId);
				verifierElem.empty();
				var approvedLength = await networkInstance.getApprovedVerifiersLength(pointId, {from: App.account});
				for (var j = 0; j < approvedLength; j++) {
					console.log("adding approved verifier " + j);
					var curVerifier = await networkInstance.getApprovedVerifiersByIndex(pointId, j, { from: App.account});
					verifierElem.append(getVerifier(curVerifier, 1));
				}
				var pendingLength = await networkInstance.getPendingVerifiersLength(pointId, {from: App.account});
				for (var j = 0; j < pendingLength; j++) {
					console.log("adding pending verifier " + j);
					var curVerifier = await networkInstance.getPendingVerifiersByIndex(pointId, j, { from: App.account});
					verifierElem.append(getVerifier(curVerifier, 0));
				}
			}
		});
	}
};

$(function() {
	$(window).load(function() {
		App.init();
	});
}); 