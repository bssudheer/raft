const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the protobuf
const PROTO_PATH = path.join(__dirname, 'raft.proto'); // Adjust the path as necessary
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const raftProto = grpc.loadPackageDefinition(packageDefinition).raft;

// Import RaftServer class from raft.js
const RaftServer = require('./raft'); // Adjust this path if needed

// Main function to start the server
function main() {
    const server = new grpc.Server();
    const raftServerInstance = new RaftServer('1'); // ID for this Raft server

    // Register the RequestVote and AppendEntries methods
    server.addService(raftProto.Raft.service, {
        RequestVote: raftServerInstance.RequestVote.bind(raftServerInstance),
        AppendEntries: raftServerInstance.AppendEntries.bind(raftServerInstance),
    });

    // Start the server on the specified address
    const serverAddress = '127.0.0.1:50051';
    server.bindAsync(serverAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            console.error(`Server could not bind: ${error}`);
            return;
        }
        console.log(`Server running at http://${serverAddress}`);
        server.start();
    });
}

// Run the main function
main();
