const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './raft.proto'; // Adjust the path if necessary

// Load protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const raftProto = grpc.loadPackageDefinition(packageDefinition).raft;

// RaftServer class to manage state, terms, and votes
class RaftServer {
    constructor(id) {
        this.id = id; // Unique identifier for the server
        this.term = 0; // Current term
        this.votedFor = null; // Candidate voted for in the current term
        this.votesReceived = 0; // Votes received during the election
        this.state = 'follower'; // Current state: follower, candidate, or leader
        this.clients = []; // Clients (other Raft nodes) to send requests to
        this.log = []; // Log entries for the Raft server
    }

    // Handle RequestVote RPC call
    RequestVote(call, callback) {
        const { term, candidateId } = call.request;
        console.log(`Process ${this.id} receives RequestVote from ${candidateId} with term ${term}`);

        // If the term is greater, step down to follower
        if (term > this.term) {
            this.term = term;
            this.state = 'follower';
            this.votedFor = null; // Reset vote
            this.votesReceived = 0; // Reset received votes
            console.log(`Process ${this.id} steps down to follower`);
        }

        // Grant vote only if in follower state
        if (this.state === 'follower' && term === this.term && this.votedFor === null) {
            this.votedFor = candidateId; // Grant vote
            this.votesReceived += 1; // Count the received vote
            console.log(`Process ${this.id} grants vote to ${candidateId}`);
            callback(null, { voteGranted: true });
        } else {
            console.log(`Process ${this.id} denies vote to ${candidateId}`);
            callback(null, { voteGranted: false });
        }

        // Check for leader election
        if (this.votesReceived > Math.floor(this.clients.length / 2) && this.state === 'follower') {
            this.state = 'leader'; // Become leader
            console.log(`Process ${this.id} becomes leader for term ${this.term}`);
            this.sendHeartbeats(); // Start sending heartbeats to followers
        }
    }

    // Handle AppendEntries RPC call
    AppendEntries(call, callback) {
        const { term, leaderId, log } = call.request;
        console.log(`Process ${this.id} receives AppendEntries from ${leaderId} with term ${term}`);

        // If the term is greater, step down to follower
        if (term > this.term) {
            this.term = term;
            this.state = 'follower';
            this.votesReceived = 0; // Reset received votes
            console.log(`Process ${this.id} steps down to follower`);
        }

        // Accept log entries if the leader's term is equal or higher
        if (term >= this.term && this.state === 'leader') {
            this.log.push(...log); // Append the new log entries
            console.log(`Process ${this.id} accepted log entries from ${leaderId}`);
            callback(null, { success: true });
        } else {
            console.log(`Process ${this.id} rejected AppendEntries from ${leaderId}`);
            callback(null, { success: false });
        }
    }

    // Send heartbeats to followers
    sendHeartbeats() {
        if (this.state === 'leader') {
            console.log(`Process ${this.id} sending heartbeats to followers...`);
            this.clients.forEach(client => {
                client.Heartbeat({ term: this.term, leaderId: this.id }, (error, response) => {
                    if (error) {
                        console.error(`Error sending heartbeat to client ${client.id}:`, error);
                    } else {
                        console.log(`Heartbeat sent to client ${client.id}`);
                    }
                });
            });
            setTimeout(() => this.sendHeartbeats(), 3000); // Repeat heartbeats every 3 seconds
        }
    }

    // Register clients (other Raft nodes)
    addClient(client) {
        this.clients.push(client);
    }
}

module.exports = RaftServer; // Export the RaftServer class
