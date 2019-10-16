pragma solidity 0.5.8;

contract Network {

    struct Point{
        string heading;
        string section;
        string date;
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
        string email;
        string image;
        string bio;
        uint pointId;
        bool exist;
        uint[] pointsIdList;
        mapping(uint => Point) points;
        PointVerification[] pendingVerifications;
        address[] connections;
    }

    mapping(string => address) public idAddress;
    mapping(address => string) public addressId;
    mapping(address => User) public users;

    event addUserEvent ();
    event editUserEvent ();
    event addPointEvent();
    event deletePointEvent();
    event addVerifierEvent();
    event respondPointEvent();

    constructor () public {
        // addCandidate("Candidate 1");
        // addCandidate("Candidate 2");
    }

    function existUser() public view
    returns (bool){
        return users[msg.sender].exist;
    }

    function addUser(string memory id, string memory name, string memory email) public {
        require(!users[msg.sender].exist);
        require(!users[idAddress[id]].exist);
        users[msg.sender].id = id;
        idAddress[id] = msg.sender;
        addressId[msg.sender] = id;
        users[msg.sender].name = name;
        users[msg.sender].email = email;
        users[msg.sender].image = "images/user.png";
        users[msg.sender].bio = "";
        users[msg.sender].pointId = 0;
        users[msg.sender].exist = true;
        emit addUserEvent();
    }

    function editUser(string memory name, string memory email, string memory image, string memory bio) public {
        require(users[msg.sender].exist);
        users[msg.sender].name = name;
        users[msg.sender].email = email;
        users[msg.sender].image = image;
        users[msg.sender].bio = bio;
        emit editUserEvent();
    }

    function addPoint(string memory heading, string memory section, string memory text, string memory date) public {
        require(users[msg.sender].exist);
        Point memory p;
        p.heading = heading;
        p.section = section;
        p.text = text;
        p.date = date;
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

    //returns pointId, heading, section, text, date 
    function getPointByIndex(uint index) public view
    returns (uint, string memory, string memory, string memory, string memory) {
        require(users[msg.sender].exist);
        require(index < users[msg.sender].pointsIdList.length);
        uint pointId = users[msg.sender].pointsIdList[index];
        Point memory p = users[msg.sender].points[pointId];
        return (pointId, p.heading, p.section, p.text, p.date);
    }

    function getPendingVerificationsLength() public view
    returns (uint) {
        require(users[msg.sender].exist);
        return users[msg.sender].pendingVerifications.length;
    }

    //returns owner id, name, pointId, heading, section, text, date
    function getPendingVerificationByIndex(uint index) public view
    returns (string memory, string memory, uint, string memory, string memory, string memory, string memory) {
        require(users[msg.sender].exist);
        require(index < users[msg.sender].pendingVerifications.length);
        PointVerification memory pv = users[msg.sender].pendingVerifications[index];
        Point memory p = users[pv.owner].points[pv.pointId];
        return (addressId[pv.owner], users[pv.owner].name, pv.pointId, p.heading, p.section, p.text, p.date);
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
        uint length = users[msg.sender].pointsIdList.length;
        bool found = false;
        for(uint i=0; i< length; i++){
            if (users[msg.sender].pointsIdList[i] == pointId){
                found = true;
            }
            if (found && i < length-1){
                users[msg.sender].pointsIdList[i] = users[msg.sender].pointsIdList[i+1];
            }
        }
        delete users[msg.sender].pointsIdList[length-1];
        users[msg.sender].pointsIdList.length--;
        delete users[msg.sender].points[pointId];
        emit deletePointEvent();
    }

    function addVerifier(uint pointId, string memory verifierId) public {
        require(users[msg.sender].exist);
        address verifierAddress = idAddress[verifierId];
        require(users[verifierAddress].exist);
        require(users[msg.sender].points[pointId].exist);
        address[] memory pendingVerifiers = users[msg.sender].points[pointId].pendingVerifiers;
        for(uint i=0; i< pendingVerifiers.length; i++){
            if(pendingVerifiers[i] == verifierAddress){
                return;
            }
        }
        address[] memory approvedVerifiers = users[msg.sender].points[pointId].approvedVerifiers;
        for(uint i=0; i< approvedVerifiers.length; i++){
            if(approvedVerifiers[i] == verifierAddress){
                return;
            }
        }
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

    // function isConnection(address addr) public view
    // returns (bool){
    //     require(users[msg.sender].exist);
    //     require(users[addr].exist);
    //     uint length = users[msg.sender].connections.length;
    //     for (uint i = 0; i<length-1; i++){
    //         if(addr == users[msg.sender].connections[i]){
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    function addConnection(address addr) public {
        require(users[msg.sender].exist);
        require(users[addr].exist);
        // require(!isConnection(addressId[addr]));
        users[msg.sender].connections.push(addr);
    }

    // function removeConnection(address addr) public {
    //     require(users[msg.sender].exist);
    //     require(users[addr].exist);
    //     // require(isConnection(addressId[addr]));
    //     uint length = users[msg.sender].connections.length;
    //     bool found = false;
    //     for(uint i=0; i< length; i++){
    //         if (users[msg.sender].connections[i] == addr){
    //             found = true;
    //         }
    //         if (found && i < length-1){
    //             users[msg.sender].connections[i] = users[msg.sender].connections[i+1];
    //         }
    //     }
    //     delete users[msg.sender].connections[length-1];
    //     users[msg.sender].connections.length--;
    // }

    function getConnectionsLength() public view
    returns (uint){
        require(users[msg.sender].exist);
        return users[msg.sender].connections.length;
    }

    function getConnectionsByIndex(uint idx) public view
    returns (address){
        require(users[msg.sender].exist);
        require(idx < users[msg.sender].connections.length);
        // User memory u = users[users[msg.sender].connections[idx]];
        return users[msg.sender].connections[idx];
    }
}