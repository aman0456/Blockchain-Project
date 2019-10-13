
var address = null;
var userid = null;
App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	hasVoted: false,

	render: async function() {
		var loader = $("#loader");
		var content = $("#mainContent");
		content.hide();
		loader.show();
		var pointsDiv = $("#pointSections");
		pointsDiv.empty();
		address = await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.idAddress(userid);
		});
		console.log("userid", userid, address);
		var result = await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.users(address);
		});

		$(document).prop('title', result[1]);
		$("#id").text("@" + result[0]);
		$("#name").text(result[1]);
		$("#email").text(result[2]);
		$("#image").attr("src", result[3]);
		$("#bio").text(result[4]);

		await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.getPointsLength({ from: address});
		}).then(async function(userPointsCount) {
			console.log("displaying points");
			for (var i = 0; i < userPointsCount; i++) {
				console.log("adding point " + i);
				var point = await networkInstance.getPointByIndex(i, { from: address});
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
				var approvedLength = await networkInstance.getApprovedVerifiersLength(pointId, {from: address});
				for (var j = 0; j < approvedLength; j++) {
					console.log("adding approved verifier " + j);
					var curVerifier = await networkInstance.getApprovedVerifiersByIndex(pointId, j, { from: address});
					verifierElem.append(getVerifier(curVerifier, 1));
				}
				var pendingLength = await networkInstance.getPendingVerifiersLength(pointId, {from: address});
				for (var j = 0; j < pendingLength; j++) {
					console.log("adding pending verifier " + j);
					var curVerifier = await networkInstance.getPendingVerifiersByIndex(pointId, j, { from: address});
					verifierElem.append(getVerifier(curVerifier, 0));
				}
			}
		});
		loader.hide();
		content.show();
	}
};
$(function() {
	$(window).load(function() {
		let searchParams = new URLSearchParams(window.location.search);
		searchParams.has('user');
		userid = searchParams.get('user');
		init();
	});
}); 