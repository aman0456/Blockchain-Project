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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
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

      App.listenForEvents();
      // $('#pointssTable').append("<tr> <td> Achieved this </td> <td> not verified </td> </tr>");
    
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Network.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance. votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var networkInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.hide();
    content.show();

    // Load account data
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
    // App.contracts.Network.deployed().then(function(instance) {
    //      networkInstance = instance;
    //      return networkInstance.getPointsCount();   //TODO: Make this function
    // }).then(function(userPointsCount) {
    //   var userPoints = $("#userPoints");
    //   userPoints.empty();

    //   for (var i = 1; i <= userPointsCount; i++) {
    //     electionInstance.getPoint(i).then(function(point) {
    //       userPoints.append(point);
    //     })   //TODO: Make this function
    //   }
    //   loader.hide();
    //   content.show();
    // }).catch(function(error) {
    //   console.warn(error);
    // });
    // Load contract data
    App.contracts.Network.deployed().then(function(instance) {
      networkInstance = instance;
      console.log(networkInstance)
      // return networkInstance.users(App.account);
    }).then(function() {
      var addedPoints = $("#pointsTable");
      addedPoints.empty();

      var toVerifyPoints = $('#verifyPointsTable');
      toVerifyPoints.empty();
      console.log(App.account);
      networkInstance.users(App.account).then(function(user) {
        console.log(user.points);
      })
      // var pointsCount = user.points;
      // console.log(userPoints);
      // console.log(pointsCount);
    });
  },

  addPoint: function() {
    var pointToBeAdded = $('#pointstr').val();
    App.contracts.Network.deployed().then(function(instance) {
      return instance.addPoint(pointToBeAdded, { from: 1 });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
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