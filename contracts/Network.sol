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
        string id;
        string name;
        uint pointId;
        bool exist;
        uint[] pointsIdList;
        mapping(uint => Point) points;
        PointVerification[] pendingVerifications;
    }

    mapping(string => address) public idAddress;
    mapping(address => string) public addressId;
    mapping(address => User) public users;

    event addUserEvent();
    event addPointEvent();
    event deletePointEvent();
    event addVerifierEvent();
    event respondPointEvent();

    constructor () public {
        // addCandidate("Candidate 1");
        // addCandidate("Candidate 2");
    }

    function addUser(string memory id, string memory name) public {
        require(!users[msg.sender].exist);
        require(!users[idAddress[id]].exist);
        users[msg.sender].id = id;
        idAddress[id] = msg.sender;
        addressId[msg.sender] = id;
        users[msg.sender].name = name;
        users[msg.sender].pointId = 0;
        users[msg.sender].exist = true;
        emit addUserEvent();
    }

    function addPoint(string memory text) public {
        require(users[msg.sender].exist);
        Point memory p;
        p.text = text;
        p.exist = true;
        users[msg.sender].pointId = users[msg.sender].pointId + 1;
        users[msg.sender].pointsIdList.push(users[msg.sender].pointId);
        users[msg.sender].points[users[msg.sender].pointId] = p;
        emit addPointEvent();
    }

    function getPointsLength() public view
    returns (uint) {
        require(users[msg.sender].exist);
        return users[msg.sender].pointsIdList.length;
    }

    //returns pointId, text
    function getPointByIndex(uint index) public view
    returns (uint, string memory) {
        require(users[msg.sender].exist);
        require(index < users[msg.sender].pointsIdList.length);
        uint pointId = users[msg.sender].pointsIdList[index];
        return (pointId, users[msg.sender].points[pointId].text);
    }

    function getPendingVerificationsLength() public view
    returns (uint) {
        require(users[msg.sender].exist);
        return users[msg.sender].pendingVerifications.length;
    }

    //returns owner id, pointId, text
    function getPendingVerificationByIndex(uint index) public view
    returns (string memory, uint, string memory) {
        require(users[msg.sender].exist);
        require(index < users[msg.sender].pendingVerifications.length);
        PointVerification memory pv = users[msg.sender].pendingVerifications[index];
        Point memory p = users[pv.owner].points[pv.pointId];
        return (addressId[pv.owner], pv.pointId, p.text);
    }

    function getPendingVerifiersLength(uint pointId) public view
    returns (uint){
        require(users[msg.sender].exist);
        require(users[msg.sender].points[pointId].exist);
        return users[msg.sender].points[pointId].pendingVerifiers.length;
    }

    function getApprovedVerifiersLength(uint pointId) public view
    returns (uint){
        require(users[msg.sender].exist);
        require(users[msg.sender].points[pointId].exist);
        return users[msg.sender].points[pointId].approvedVerifiers.length;
    }

    function getPendingVerifiersByIndex(uint pointId, uint index) public view
    returns (string memory){
        require(users[msg.sender].exist);
        require(users[msg.sender].points[pointId].exist);
        Point memory p = users[msg.sender].points[pointId];
        require(index < p.pendingVerifiers.length);
        return addressId[p.pendingVerifiers[index]];
    }

    function getApprovedVerifiersByIndex(uint pointId, uint index) public view
    returns (string memory){
        require(users[msg.sender].exist);
        require(users[msg.sender].points[pointId].exist);
        Point memory p = users[msg.sender].points[pointId];
        require(index < p.approvedVerifiers.length);
        return addressId[p.approvedVerifiers[index]];
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
        emit deletePointEvent();
    }

    function addVerifier(uint pointId, string memory verifierId) public {
        require(users[msg.sender].exist);
        address verifierAddress = idAddress[verifierId];
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
        emit addVerifierEvent();
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
        emit respondPointEvent();
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