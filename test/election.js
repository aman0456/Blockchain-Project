var Network = artifacts.require("./Network.sol");

contract("Network", function(accounts) {
  var networkInstance;

  it("initializes", function() {
    return Network.deployed().then(function(instance) {
      // return instance.candidatesCount();
    });
  });

  // it("it initializes the candidates with the correct values", function() {
  //   return Network.deployed().then(function(instance) {
  //     networkInstance = instance;
  //     return networkInstance.candidates(1);
  //   }).then(function(candidate) {
  //     assert.equal(candidate[0], 1, "contains the correct id");
  //     assert.equal(candidate[1], "Candidate 1", "contains the correct name");
  //     assert.equal(candidate[2], 0, "contains the correct votes count");
  //     return networkInstance.candidates(2);
  //   }).then(function(candidate) {
  //     assert.equal(candidate[0], 2, "contains the correct id");
  //     assert.equal(candidate[1], "Candidate 2", "contains the correct name");
  //     assert.equal(candidate[2], 0, "contains the correct votes count");
  //   });
  // });

  it("it creates two users", function() {
    return Network.deployed().then(function(instance) {
      networkInstance = instance;
      networkInstance.addUser("user1", {from: accounts[0]});
      return networkInstance.users(accounts[0]);
    }).then(function(user1) {
      assert.equal(user1[0], "user1", "user1 name correct");
      assert.equal(user1[1], 0, "user1 pointId correct");
      assert.equal(user1[2], true, "user1 exist correct");
      networkInstance.addUser("user2", {from: accounts[1]});
      // networkInstance.addPoint("point1 user1", {from: accounts[0]});

      // assert.equal(receipt.logs.length, 1, "an event was triggered");
      // assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      // assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      // return networkInstance.voters(accounts[0]);
    }).then(function() {
      // assert(voted, "the voter was marked as voted");
      // return networkInstance.candidates(candidateId);
    }).then(function() {
      // var voteCount = candidate[2];
      // assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });
  // it("allows a voter to cast a vote", function() {
  //   return Network.deployed().then(function(instance) {
  //     networkInstance = instance;
  //     candidateId = 1;
  //     return networkInstance.vote(candidateId, { from: accounts[0] });
  //   }).then(function(receipt) {
  //     assert.equal(receipt.logs.length, 1, "an event was triggered");
  //     assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
  //     assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
  //     return networkInstance.voters(accounts[0]);
  //   }).then(function(voted) {
  //     assert(voted, "the voter was marked as voted");
  //     return networkInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[2];
  //     assert.equal(voteCount, 1, "increments the candidate's vote count");
  //   })
  // });

  // it("throws an exception for invalid candiates", function() {
  //   return Network.deployed().then(function(instance) {
  //     networkInstance = instance;
  //     return networkInstance.vote(99, { from: accounts[1] })
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return networkInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[2];
  //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
  //     return networkInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[2];
  //     assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
  //   });
  // });

  // it("throws an exception for double voting", function() {
  //   return Network.deployed().then(function(instance) {
  //     networkInstance = instance;
  //     candidateId = 2;
  //     networkInstance.vote(candidateId, { from: accounts[1] });
  //     return networkInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[2];
  //     assert.equal(voteCount, 1, "accepts first vote");
  //     // Try to vote again
  //     return networkInstance.vote(candidateId, { from: accounts[1] });
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return networkInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[2];
  //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
  //     return networkInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[2];
  //     assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
  //   });
  // });
});