const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './raft.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const raftProto = grpc.loadPackageDefinition(packageDefinition).raft;

const client = new raftProto.Raft('localhost:50051', grpc.credentials.createInsecure());

const term = Math.floor(Math.random() * (300 - 150 + 1) + 150);
const candidateId = Math.floor(Math.random() * 1000).toString(); // Random candidate ID

client.RequestVote({ term: term, candidateId: candidateId }, (error, response) => {
    if (!error) {
        console.log(`Client ${candidateId} received vote: ${response.voteGranted}`);
    } else {
        console.error(error);
    }
});
