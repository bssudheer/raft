# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: raft.proto
# Protobuf Python Version: 5.27.2
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    27,
    2,
    '',
    'raft.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\nraft.proto\x12\x04raft\"7\n\x12RequestVoteRequest\x12\x0c\n\x04term\x18\x01 \x01(\x05\x12\x13\n\x0b\x63\x61ndidateId\x18\x02 \x01(\t\"*\n\x13RequestVoteResponse\x12\x13\n\x0bvoteGranted\x18\x01 \x01(\x08\"S\n\x14\x41ppendEntriesRequest\x12\x0c\n\x04term\x18\x01 \x01(\x05\x12\x10\n\x08leaderId\x18\x02 \x01(\t\x12\x1b\n\x03log\x18\x03 \x03(\x0b\x32\x0e.raft.LogEntry\"(\n\x15\x41ppendEntriesResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\":\n\x08LogEntry\x12\x11\n\toperation\x18\x01 \x01(\t\x12\x0c\n\x04term\x18\x02 \x01(\x05\x12\r\n\x05index\x18\x03 \x01(\x05\x32\x94\x01\n\x04Raft\x12\x42\n\x0bRequestVote\x12\x18.raft.RequestVoteRequest\x1a\x19.raft.RequestVoteResponse\x12H\n\rAppendEntries\x12\x1a.raft.AppendEntriesRequest\x1a\x1b.raft.AppendEntriesResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'raft_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_REQUESTVOTEREQUEST']._serialized_start=20
  _globals['_REQUESTVOTEREQUEST']._serialized_end=75
  _globals['_REQUESTVOTERESPONSE']._serialized_start=77
  _globals['_REQUESTVOTERESPONSE']._serialized_end=119
  _globals['_APPENDENTRIESREQUEST']._serialized_start=121
  _globals['_APPENDENTRIESREQUEST']._serialized_end=204
  _globals['_APPENDENTRIESRESPONSE']._serialized_start=206
  _globals['_APPENDENTRIESRESPONSE']._serialized_end=246
  _globals['_LOGENTRY']._serialized_start=248
  _globals['_LOGENTRY']._serialized_end=306
  _globals['_RAFT']._serialized_start=309
  _globals['_RAFT']._serialized_end=457
# @@protoc_insertion_point(module_scope)
