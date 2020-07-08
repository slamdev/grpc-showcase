import {sendUnaryData, Server, ServerCredentials, ServerUnaryCall, ServerWritableStream} from "@grpc/grpc-js";
import * as health_grpc_pb from "../generated/health_grpc_pb";
import {IHealthServer} from "../generated/health_grpc_pb";
import {HealthCheckRequest, HealthCheckResponse} from "../generated/health_pb";
import ServingStatus = HealthCheckResponse.ServingStatus;


export default class GrpcServer {

    private readonly server: Server;
    private readonly port: number;

    constructor(port: number, registrators: ((srv: Server) => void)[]) {
        this.server = new Server()
        this.port = port;
        registrators.forEach(r => r(this.server))
        // @ts-ignore
        this.server.addService(health_grpc_pb["grpc.health.v1.Health"], new HealthEndpoint())
    }

    start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.bindAsync('localhost:' + this.port, ServerCredentials.createInsecure(), (err, port) => {
                if (err) {
                    reject(err)
                } else {
                    this.server.start()
                    console.log(`grpc server listens on ${this.port} port`)
                    resolve()
                }
            })
        });
    }

    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.tryShutdown(err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        });
    }
}

class HealthEndpoint implements IHealthServer {
    check(call: ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>, callback: sendUnaryData<HealthCheckResponse>): void {
        const r = new HealthCheckResponse();
        r.setStatus(ServingStatus.SERVING);
        callback(null, r)
    }

    watch(call: ServerWritableStream<HealthCheckRequest, HealthCheckResponse>): void {
    }
}
