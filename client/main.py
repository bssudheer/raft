import grpc
import random
import time
import raft_pb2
import raft_pb2_grpc

class RaftClient:
    def __init__(self, server_address, client_id):
        self.channel = grpc.insecure_channel(server_address)
        self.stub = raft_pb2_grpc.RaftStub(self.channel)
        self.client_id = client_id

    def request_vote(self):
        term = random.randint(150, 300)
        response = self.stub.RequestVote(raft_pb2.RequestVoteRequest(term=term, candidateId=str(self.client_id)))
        print(f"Process {self.client_id} received vote: {response.voteGranted}")

def main():
    server_address = "localhost:50051"  # Adjust as necessary
    num_clients = 5  # Total number of clients to run one at a time

    for client_id in range(1, num_clients + 1):
        raft_client = RaftClient(server_address, client_id)
        raft_client.request_vote()
        time.sleep(5)  # Wait for a while before the next client runs

if __name__ == "__main__":
    main()
