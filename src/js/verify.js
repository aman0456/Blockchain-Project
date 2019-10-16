App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	hasVoted: false,

	render: async function() {
		console.log("rendering")
		var networkInstance;
		var loader = $("#loader"); //TODO: add loader 
		var content = $("#mainContent");
		content.hide();
		loader.show();
		var userPointsCount = await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.getPendingVerificationsLength({ from: App.account});
		})
		var verifications = $("#verifications");
		console.log("emptying");
		$("#verifications").empty();
		for (var i = 0; i < userPointsCount; i++) {
			var point = await networkInstance.getPendingVerificationByIndex(i, { from: App.account});
			var id = point[0];
			var name = point[1];
			var pointId = point[2];
			var heading = point[3];
			var section = point[4];
			var text = point[5];
			var date = point[6];
			var entry = verificationHTML(id, name, pointId, heading, section, text, date, i);
			verifications.append(entry);
		}
		loader.hide();
		content.show();
	},

	respondPoint: async function(index, response) {
		// var hash = await web3.personal.sign(web3.fromUtf8("dinosaur"), web3.eth.coinbase, function(error, hash) {
		// 	if (error == null) {
		// 		return hash;
		// 	}
		// 	else {
		// 		console.log(error);
		// 		return null;
		// 	}
		// });
		await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.respondPoint(index, response, { from: App.account});
		});
		console.log("Added a point to " + App.account)
		$("#content").hide();
		$("#loader").show();
		App.render();
	}
};

function verificationHTML(id, name, pointId, heading, section, text, date, index){

	var myvar = 
	'     <div class="hovhighlight" id="verify-' + index + '" >'+
	'        <div class="container">'+
	'          <div class="row">'+
	'            <div class="col-lg-6">'+
	'            <h3 id="vn1"><strong> <a href="user.html?user="' + name + '"> ' + name + '</a></strong></h3>'+
	'            </div>'+
	'          </div>'+
	'          <div class="row">'+
	'            <div class="col-lg-6">'+
	'              <h4 id="vh2"><strong>' + heading + '</strong></h4>'+
	'            </div>'+
	'            <div class="col-lg-6">'+
	'              <h5 class="text-right">' + date + '</h5>'+
	'            </div>'+
	'          </div>  '+
	'          <div class="row">'+
	'            <div class="col-lg-12">'+
	'              <p>'+
	'                ' + text +
	'              </p>'+
	'            </div>'+
	'          </div>    '+
	'          <br/>'+
	'        </div>'+
	'        <div class="container">'+
	'          <div class="row">'+
	'            <div class="col-lg-2">'+
	'            <button type="button" class="btn btn-success btn-block" onclick="App.respondPoint(' + index + ',' + true + ')">Verify</button>'+
	'            </div>'+
	'            <div class="col-lg-2">'+
	'            <button type="button" class="btn btn-danger btn-block" onclick="App.respondPoint(' + index + ',' + false + ')">Decline</button>'+
	'            </div>'+
	'          </div>'+
	'        </div>'+
	'        <br/>'+
	'      </div>';
	return myvar
}

$(function() {
	$(window).load(function() {
		init();
	});
}); 