const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');

const PROTO_PATH = './raft.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const raftProto = grpc.loadPackageDefinition(packageDefinition).raft;

class RaftServer {
    constructor() {
        this.state = 'follower';
        this.term = 0;
        this.id = uuidv4();
        this.votesReceived = 0;
        this.log = [];
        this.clients = [];
    }

    startElection() {
        this.state = 'candidate';
        this.term += 1;
        this.votesReceived = 1;
        console.log(`Process ${this.id} becomes candidate for term ${this.term}`);

        // Request votes from other nodes
        this.clients.forEach(client => {
            client.RequestVote({ term: this.term, candidateId: this.id }, (error, response) => {
                if (!error && response.voteGranted) {
                    this.votesReceived += 1;
                    console.log(`Process ${this.id} received vote from ${client.id}`);
                    if (this.votesReceived > Math.floor(this.clients.length / 2)) {
                        this.state = 'leader';
                        console.log(`Process ${this.id} becomes leader`);
                        this.sendHeartbeats();
                    }
                }
            });
        });
    }

    sendHeartbeats() {
        // Send heartbeats to followers
        if (this.state === 'leader') {
            this.clients.forEach(client => {
                client.AppendEntries({ term: this.term, leaderId: this.id, log: this.log }, (error, response) => {
                    if (!error) {
                        console.log(`Process ${this.id} sends heartbeat to ${client.id}`);
                    }
                });
            });
            setTimeout(() => this.sendHeartbeats(), 100); // Heartbeat interval
        }
    }

    // gRPC service methods
    RequestVote(call, callback) {
        console.log(`Process ${this.id} receives RequestVote from ${call.request.candidateId}`);
        if (call.request.term > this.term) {
            this.term = call.request.term;
            this.state = 'follower';
            callback(null, { voteGranted: true });
        } else {
            callback(null, { voteGranted: false });
        }
    }

    AppendEntries(call, callback) {
        console.log(`Process ${this.id} receives AppendEntries from ${call.request.leaderId}`);
        // Append entries logic here...
        callback(null, { success: true });
    }
}

module.exports = { RaftServer, raftProto };
