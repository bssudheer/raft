import grpc
import random
import time
import raft_pb2
import raft_pb2_grpc

class RaftClient:
    def __init__(self, server_address):
        self.channel = grpc.insecure_channel(server_address)
        self.stub = raft_pb2_grpc.RaftStub(self.channel)

    def request_vote(self, candidate_id, term):
        response = self.stub.RequestVote(raft_pb2.RequestVoteRequest(term=term, candidateId=candidate_id))
        print(f"Process {candidate_id} received vote: {response.voteGranted}")

    def append_entries(self, leader_id, log):
        response = self.stub.AppendEntries(raft_pb2.AppendEntriesRequest(term=1, leaderId=leader_id, log=log))
        print(f"Process {leader_id} append entries result: {response.success}")

def main():
    server_address = "localhost:50051"  # Adjust as necessary
    client_id = random.randint(1, 100)  # Unique identifier for client

    raft_client = RaftClient(server_address)

    while True:
        term = random.randint(150, 300)
        raft_client.request_vote(client_id, term)
        time.sleep(5)  # Wait before sending the next request

if __name__ == "__main__":
    main()
