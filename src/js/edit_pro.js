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
		var loader = $("#loader");
		var content = $("#mainContent");
		content.hide();
		loader.show();

		var user = await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.users(App.account);
		});
		$("#name").val(user[1]);
		$("#email").val(user[2]);
		$("#image").val(user[3]);
		$("#bio").text(user[4]);

		var pointsDiv = $("#pointSections");
		pointsDiv.empty();
		// Load account data
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
		loader.hide();
		content.show();
	},
	//index, bool
	//respondPoint
	addPoint: async function() {
		console.log("adding point")
		var pointHeading = $('#inputHeading').val();
		var pointSection = $('#inputSection').val();
		var pointDate = $('#inputDate').val();
		var pointText = $('#inputText').val();
		var pointToBeAdded = $('#pointstr').val();
		await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.addPoint(pointHeading, pointSection, pointText, pointDate, { from: App.account});
		});
		console.log("Added a point to " + App.account)
		App.render()
	},
	//index, bool
	//respondPoint
	addVerifier: async function(pointId) {
		console.log("adding a verifier" + pointId);
		var vId = "#verifierToAdd-" + pointId;
		var vVal = $(vId).val();
		await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.addVerifier(pointId, vVal, { from: App.account});
		})
		console.log("Added a verifier to " + pointId);
		App.render();
		// $("#content").hide();
		// $("#loader").show();
		// window.location.reload();
	},

	deletePoint: async function(pointId) {
		console.log("deleting the point" + pointId);
		await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.deletePoint(pointId, { from: App.account});
		});
		console.log("Deleted the point " + pointId)
		App.render();
		// $("#content").hide();
		// $("#loader").show();
		// window.location.reload();
	},

	editProfile: async function() {
		var name = $("#name").val();
		var email = $("#email").val();
		var pic = $("#image").val();
		var bio = $("#bio").val();
		console.log("hi", name);
		App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.editUser(name, email, pic, bio, { from: App.account});
		});
		console.log("edited profile");
		App.render();
	}
};

$(function() {
	$(window).load(function() {
		App.init();
	});
}); 