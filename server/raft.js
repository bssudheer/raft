const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './raft.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const raftProto = grpc.loadPackageDefinition(packageDefinition).raft;

class RaftServer {
    constructor(id) {
        this.id = id;
        this.term = 0;
        this.votedFor = null;
        this.votesReceived = 0;
        this.state = 'follower';
        this.clients = [];
        this.log = [];
    }

    RequestVote(call, callback) {
        const { term, candidateId } = call.request;
        console.log(`Process ${this.id} receives RequestVote from ${candidateId} with term ${term}`);

        if (term > this.term) {
            this.term = term;
            this.state = 'follower';
            this.votedFor = null;
            this.votesReceived = 0;
            console.log(`Process ${this.id} steps down to follower`);
        }

        if (this.state === 'follower' && term === this.term && this.votedFor === null) {
            this.votedFor = candidateId;
            this.votesReceived += 1;
            console.log(`Process ${this.id} grants vote to ${candidateId}`);
            callback(null, { voteGranted: true });
        } else {
            console.log(`Process ${this.id} denies vote to ${candidateId}`);
            callback(null, { voteGranted: false });
        }
    }

    AppendEntries(call, callback) {
        const { term, leaderId, log } = call.request;
        console.log(`Process ${this.id} receives AppendEntries from ${leaderId} with term ${term}`);

        if (term > this.term) {
            this.term = term;
            this.state = 'follower';
            this.votesReceived = 0;
            console.log(`Process ${this.id} steps down to follower`);
        }

        if (term >= this.term && this.state === 'leader') {
            this.log.push(...log);
            console.log(`Process ${this.id} accepted log entries from ${leaderId}`);
            callback(null, { success: true });
        } else {
            console.log(`Process ${this.id} rejected AppendEntries from ${leaderId}`);
            callback(null, { success: false });
        }
    }
}

module.exports = RaftServer;
