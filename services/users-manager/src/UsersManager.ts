import {IUsersManagerServer} from "../generated/api_grpc_pb";
import {sendUnaryData, ServerUnaryCall} from "@grpc/grpc-js";
import {CreateUserRequest, DeleteUserRequest, GetUserRequest, ListUsersResponse, User} from "../generated/api_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export default class UsersManager implements IUsersManagerServer {
    createUser(call: ServerUnaryCall<CreateUserRequest, User>, callback: sendUnaryData<User>): void {
    }

    deleteUser(call: ServerUnaryCall<DeleteUserRequest, Empty>, callback: sendUnaryData<Empty>): void {
    }

    getUser(call: ServerUnaryCall<GetUserRequest, User>, callback: sendUnaryData<User>): void {
    }

    listUsers(call: ServerUnaryCall<Empty, ListUsersResponse>, callback: sendUnaryData<ListUsersResponse>): void {
    }
}
