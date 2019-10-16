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
		var userConnectionCount = await App.contracts.Network.deployed().then(function(instance) {
			networkInstance = instance;
			return networkInstance.getConnectionsLength({ from: App.account});
		});

		var connections = $("#connectionsRow");
		console.log("emptying");
		$("#connectionsRow").empty();
		for (var i = 0; i < userConnectionCount; i++) {
			console.log("hereeee");
			var connAddress = await networkInstance.getConnectionsByIndex(i, { from: App.account});
			var connUser = await networkInstance.users(connAddress);
			var entry = verificationHTML(connUser[0], connUser[1], connUser[3]);
			if (i == 1) entry = verificationHTML2(connUser[0], connUser[1], connUser[3]);
			connections.append(entry);
		}
		console.log("Added all the connection");
		loader.hide();
		content.show();
		console.log("done");
	},
};

function verificationHTML(id, name, imageId){

	var myvar = 
	"<div class=\"col-lg-5 floatcard select\">\n" + 
				"              <img src=\"\" class=\"img-responsive center-block\" id=\"image\" onerror=\"this.src='" + imageId + "';\" style=\"width:150px;height:150px;border-radius: 50%\">\n" + 
				"                <!-- <img src=\"\" id=\"image\" class=\"img-responsive center-block\" alt=\"profile pic\" style=\"width:150px;height:150px\"> -->\n" + 
				"                <p>\n" + 
				"                  <h3 class=\"text-center\" id=\"name\">" + name + "</h3>\n" + 
				"                  <h3 class=\"text-center\" id=\"id\">" + id + "</h3>\n" + 
				"                </p>\n" + 
				"            </div>\n" + 
				"            <div class=\"col-lg-1\"></div>";
	return myvar;
}

function verificationHTML2(id, name, imageId){
	var myvar = 
	"<div class=\"col-lg-5 floatcard select\">\n" + 
				"              <img src=\"\" class=\"img-responsive center-block\" id=\"image\" onerror=\"this.src='" + imageId + "';\" style=\"width:150px;height:150px;border-radius: 50%\">\n" + 
				"                <!-- <img src=\"\" id=\"image\" class=\"img-responsive center-block\" alt=\"profile pic\" style=\"width:150px;height:150px\"> -->\n" + 
				"                <p>\n" + 
				"                  <h3 class=\"text-center\" id=\"name\">" + name + "</h3>\n" + 
				"                  <h3 class=\"text-center\" id=\"id\">" + id + "</h3>\n" + 
				"                </p>\n" + 
				"            </div>\n";
	return myvar;
}

$(function() {
	$(window).load(function() {
		init();
	});
}); 