pragma solidity 0.5.8;

contract Network {

    struct Point{
        string text;
        address[] pendingVerifiers;
        address[] approvedVerifiers;
        bool exist;
    }

    struct PointVerification{
        address owner;
        uint pointId;
    }

    struct User{
        string name;
        uint pointId;
        bool exist;
        uint[] pointsIdList;
        mapping(uint => Point) points;
        PointVerification[] pendingVerifications;
    }

    mapping(address => User) public users;
    event votedEvent (
        uint indexed _candidateId
    );

    constructor () public {
        // addCandidate("Candidate 1");
        // addCandidate("Candidate 2");
    }

    function addUser(string memory name) public {
        // User storage user = users[msg.sender];
        users[msg.sender].name = name;
        users[msg.sender].pointId = 0;
        users[msg.sender].exist = true;
        // users[msg.sender] = user;
    }

    function addPoint(string memory text) public {
        require(users[msg.sender].exist);
        Point memory p;
        p.text = text;
        p.exist = true;
        users[msg.sender].pointId = users[msg.sender].pointId + 1;
        users[msg.sender].pointsIdList.push(users[msg.sender].pointId);
        users[msg.sender].points[users[msg.sender].pointId] = p;
    }

    function getPointsLength() public 
    returns (uint) {
        require(users[msg.sender].exist);
        return users[msg.sender].pointsIdList.length;
    }

    //returns pointId, text
    function getPointByIndex(uint index) public
    returns (uint, string) {
        require(users[msg.sender].exist);
        require(index < users[msg.sender].pointsIdList.length);
        uint pointId = users[msg.sender].pointsIdList[index];
        return (pointId, users[msg.sender].points[pointId].text);
    }

    function getpendingVerificationsLength() public 
    returns (uint) {
        require(users[msg.sender].exist);
        return users[msg.sender].pendingVerifications.length;
    }

    //returns owner address, pointId, text
    function getpendingVerificationByIndex(uint index) public
    returns (address, uint, string) {
        require(users[msg.sender].exist);
        require(index < users[msg.sender].pendingVerifications.length);
        PointVerification pv = users[msg.sender].pendingVerifications[index];
        Point p = users[pv.owner].points(pv.pointId);
        return (pv.owner, pv.pointId, p.text);
    }


    function deletePoint(uint pointId) public {
        require(users[msg.sender].exist);
        require(users[msg.sender].points[pointId].exist);
        address[] memory pendingVerifiers = users[msg.sender].points[pointId].pendingVerifiers;
        for (uint i=0 ; i< pendingVerifiers.length; i++){
            address verifier = pendingVerifiers[i];
            uint length = users[verifier].pendingVerifications.length;
            bool found = false;
            for(uint j=0; j< length; j++){
                if (users[verifier].pendingVerifications[j].owner == msg.sender
                    && users[verifier].pendingVerifications[j].pointId == pointId){
                    found = true;
                }
                if (found && j < length-1){
                    users[verifier].pendingVerifications[j] = users[verifier].pendingVerifications[j+1];
                }
            }
            delete users[verifier].pendingVerifications[length-1];
            users[verifier].pendingVerifications.length--;
        }
        delete users[msg.sender].points[pointId];
    }

    function addVerifier(uint pointId, address verifierAddress) public {
        require(users[msg.sender].exist);
        require(users[verifierAddress].exist);
        require(users[msg.sender].points[pointId].exist);
        bool found = false;
        address[] memory pendingVerifiers = users[msg.sender].points[pointId].pendingVerifiers;
        for(uint i=0; i< pendingVerifiers.length; i++){
            if(pendingVerifiers[i] == verifierAddress){
                found = true;
            }
        }
        if (found == false)
            users[msg.sender].points[pointId].pendingVerifiers.push(verifierAddress);
        PointVerification memory v;
        v.owner = msg.sender;
        v.pointId = pointId;
        users[verifierAddress].pendingVerifications.push(v);
    }

    function respondPoint(uint index, bool response) public {
        require(users[msg.sender].exist);
        require(index < users[msg.sender].pendingVerifications.length);
        PointVerification memory p = users[msg.sender].pendingVerifications[index];
        if (response){
            users[p.owner].points[p.pointId].approvedVerifiers.push(msg.sender);
        }

        //delete one element of pendingVerifiers of point owner
        uint length = users[p.owner].points[p.pointId].pendingVerifiers.length;
        bool found = false;
        for (uint i = 0; i<length; i++){
            if (users[p.owner].points[p.pointId].pendingVerifiers[i] == msg.sender){
                found = true;
            }
            if(found && i<length-1){
                users[p.owner].points[p.pointId].pendingVerifiers[i] = users[p.owner].points[p.pointId].pendingVerifiers[i+1];
            }
        }
        delete users[p.owner].points[p.pointId].pendingVerifiers[length-1];
        users[p.owner].points[p.pointId].pendingVerifiers.length--;

        //delete pendingVerifications of msg.sender
        length = users[msg.sender].pendingVerifications.length;
        for (uint i = index; i<length-1; i++){
            users[msg.sender].pendingVerifications[i] = users[msg.sender].pendingVerifications[i+1];
        }
        delete users[msg.sender].pendingVerifications[length-1];
        users[msg.sender].pendingVerifications.length--;      
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