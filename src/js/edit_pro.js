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

	render: function() {
		var loader = $("#loader");
		var content = $("#content");
		loader.show();
		content.hide();
		var pointsDiv = $("#pointSections");
		pointsDiv.empty();
		// Load account data
		App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.getPointsLength({ from: App.account});
		}).then(function(userPointsCount) {
			console.log("displaying points");
			for (var i = 0; i < userPointsCount; i++) {
				networkInstance.getPointByIndex(i, { from: App.account}).then(function(point) {
					pointId = point[0];
					var pointSection = point[2];
					var sectionToAdd = $('section:' + pointSection);
					if (!sectionToAdd) {
						pointsDiv.append(addSectionString(pointSection));
						sectionToAdd = $('sectionBody:' + pointSection);
						var assert = require('assert');
						assert(sectionToAdd, "Section not added properly");
					}
					sectionToAdd.append(getPointEntryString(point));
					return networkInstance.getApprovedVerifiersLength(pointId, {from: App.account});
				}).then(function(approvedVerifiersLength) {
					console.log(approvedVerifiersLength);
					console.log(pointId);
				});
			}
		}).catch(function(error) {
			console.error(error);
		});
		// get Points to verify
		App.contracts.Network.deployed().then(function(instance) {
				 networkInstance = instance;
				 return networkInstance.getPendingVerificationsLength();   //TODO: Make this function
		}).then(function(verifyPointsCount) {
			var verifyPoints = $("#verifyPointsContent");
			verifyPoints.empty();
			console.log("verifying");
			for (var i = 0; i < verifyPointsCount; i++) {
				console.log("hello verify");
			}
			for (var i = 0; i < verifyPointsCount; i++) {
				networkInstance.getPendingVerificationByIndex(i, { from: App.account}).then(function(point) {
					var owner = point[0]
					var pointId = point[1]
					var pointText = point[2]
					var pointEntry = "<p>" + owner + ": " + pointText + "\t <button class=\"btn btn-primary\" onclick=\"verify(" + i + "," + 1 + ")\">Verify</button> <button type=\"submit\" class=\"btn btn-primary\" onclick=\"verify(" + i + "," + 0 + ")\">Reject</button></p>"
					verifyPoints.append(pointEntry);
				})   //TODO: Make this function
			}
		}).catch(function(error) {
			console.error(error);
		});
		loader.hide();
		content.show();
	},
	//index, bool
	//respondPoint
	addPoint: function() {
		console.log("adding point")
		var pointHeading = $('#inputHeading').val();
		var pointSection = $('#inputSection').val();
		var pointDate = $('#inputDate').val();
		var pointText = $('#inputText').val();
		var pointToBeAdded = $('#pointstr').val();
		App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.addPoint(pointHeading, pointSection, pointText, pointDate, { from: App.account});
		}).then(function(result) {
			console.log(result);
			console.log("Added a point to " + App.account)
			// $("#content").hide();
			// $("#loader").show();
			window.location.reload();
		}).catch(function(err) {
			console.error(err);
		});
	},
	//index, bool
	//respondPoint
	addVerifier: function(pointId) {
		console.log("adding a verifier" + pointId);
		var paraId = "#pointPara" + pointId;
		var para = $(paraId);
		console.log(paraId);
		console.log(para);
		var textId = "#pointText" + pointId;
		var text = $(textId).val();
		console.log(textId);
		console.log(text);
		// console.log("adding point")
		// // console.log("defaultAccount = " + web3.eth.defaultAccount)
		// var pointToBeAdded = $('#pointstr').val();
		App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.addVerifier(pointId, text, { from: App.account});
		}).then(function(result) {
			console.log("Added a point to " + App.account)
			$("#content").hide();
			$("#loader").show();
			console.log(result);
			window.location.reload();
		}).catch(function(err) {
			console.error(err);
		});
	},

	editProfile: function() {
		var paraId = "#pointPara" + pointId;
		var name = $("name");
		var email = $("email");
		var pic = $("pic-url");
		var bio = $("bio");
		App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.respondPoint(name, email, pic, bio, { from: App.account});
		}).then(function(result) {
			$("#content").hide();
			$("#loader").show();
			console.log(result);
			window.location.reload();
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