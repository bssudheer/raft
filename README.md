# Raft Consensus Algorithm

This project implements a simplified version of the Raft consensus algorithm, featuring leader election and log replication. The implementation uses gRPC for communication between nodes.

## Components

1. **Leader Election**: Nodes start as followers and transition to candidates when they do not receive heartbeats. Candidates request votes from other nodes.
2. **Log Replication**: The leader maintains a log of operations and replicates it to followers. Clients send requests to the leader through any available node.

## Setup

### Node.js Server

1. Navigate to the `node-server` directory.
2. Install dependencies:
   ```bash
   npm install
