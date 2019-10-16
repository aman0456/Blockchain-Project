App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	hasVoted: false,

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
				var sectionToAdd = $('[id=\"section-' + pointSection + '\"]');
				if (!sectionToAdd.length) {
					console.log("adding section" + pointSection);
					pointsDiv.append(addSectionString(pointSection));
				}
				sectionToAdd = $('[id=\"sectionBody-' + pointSection + '\"]');
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
			$('#loader').hide();
			$('#mainContent').show();
		});
	}
};

$(function() {
	$(window).load(function() {
		init();
	});
}); 