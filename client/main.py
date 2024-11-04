import grpc
import raft_pb2
import raft_pb2_grpc
import time

class RaftClient:
    def __init__(self, server_address, client_id):
        self.server_address = server_address
        self.client_id = client_id
        self.channel = grpc.insecure_channel(server_address)
        self.stub = raft_pb2_grpc.RaftStub(self.channel)

    def request_vote(self, term):
        response = self.stub.RequestVote(raft_pb2.RequestVoteRequest(term=term, candidateId=str(self.client_id)))
        print(f"Process {self.client_id} with term {term} received vote: {response.voteGranted}")

def main():
    server_address = '127.0.0.1:50051'
    num_clients = 5

    for client_id in range(1, num_clients + 1):
        term = client_id * 100  # Increment terms for demonstration
        raft_client = RaftClient(server_address, client_id)
        raft_client.request_vote(term=term)
        time.sleep(2)  # Sleep for visibility in output

if __name__ == '__main__':
    main()
