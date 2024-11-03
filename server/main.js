const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { RaftServer } = require('./raft');

const PROTO_PATH = './raft.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const raftProto = grpc.loadPackageDefinition(packageDefinition).raft;

const server = new grpc.Server();
const raftServer = new RaftServer();

// Define the service implementation
server.addService(raftProto.Raft.service, {
    RequestVote: raftServer.RequestVote.bind(raftServer),
    AppendEntries: raftServer.AppendEntries.bind(raftServer),
});

const PORT = process.env.PORT || 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    server.start();
});
