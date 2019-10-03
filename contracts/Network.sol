pragma solidity 0.5.8;

contract Network {
    // Model a Candidate
    struct Point{
        string text;
        address[] verifiers;
    }

    struct User{
        string name;
        Point[] points;
        bool exist;
        // pendingVerifications;
    }

    mapping(address => User) public users;
    // event votedEvent (
    //     uint indexed _candidateId
    // );

    constructor () public {
        // addCandidate("Candidate 1");
        // addCandidate("Candidate 2");
    }

    function addUser(string memory name) public {
        users[msg.sender].name = name;
        users[msg.sender].exist = true;
    }

    function addPoint(string memory text) public {
        require(users[msg.sender].exist);
        Point memory p;
        p.text = text;
        users[msg.sender].points.push(p);
    }
    function addVerifier(uint pointIndex, address verifierAddress) public {
        require(users[msg.sender].exist);
        require(users[verifierAddress].exist);
        users[msg.sender].points[pointIndex].verifiers.push(verifierAddress);
    }

    // function getUser() constant
    // returns (User){
    //     return users[msg.sender];
    // }
    // function getPoint(uint index)  constant
    // returns (Point){
    //     return users[msg.sender].points[index];
    // }
    // function getVerifier(uint index1, uint index2)
    // constant
    // returns (address){
    //     return users[msg.sender].points[index1].verifiers[index2];
    // }

    // function addCandidate (string memory _name) public {
    //     candidatesCount ++;
    //     candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    // }

    // function vote (uint _candidateId) public {
    //     // require that they haven't voted before
    //     require(!voters[msg.sender]);

    //     // require a valid candidate
    //     require(_candidateId > 0 && _candidateId <= candidatesCount);

    //     // record that voter has voted
    //     voters[msg.sender] = true;

    //     // update candidate vote Count
    //     candidates[_candidateId].voteCount ++;

    //     // trigger voted event
    //     emit votedEvent(_candidateId);
    // }
}