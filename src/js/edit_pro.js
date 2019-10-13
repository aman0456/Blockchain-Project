App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	hasVoted: false,

	init: function() {
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
		init();
	});
}); 