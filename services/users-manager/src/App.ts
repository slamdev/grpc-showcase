import * as api_grpc_pb from "../generated/api_grpc_pb";
import UsersManager from "./UsersManager";
import GrpcServer from "./GrpcServer";
import HttpServer from "./HttpServer";
import {safeLoad} from "js-yaml";
import convict = require("convict");


export default class App {

    private readonly grpcServer: GrpcServer
    private readonly httpServer: HttpServer
    private readonly config: convict.Config<any>

    constructor() {
        this.config = App.loadConfig()
        this.grpcServer = new GrpcServer(this.config.get('grpc.port'), [
            // @ts-ignore
            srv => srv.addService(api_grpc_pb["usersmanager.UsersManager"], new UsersManager()),
        ]);
        this.httpServer = new HttpServer(this.config.get('http.port'));
    }

    start() {
        const now = new Date();
        return Promise.all([this.grpcServer.start(), this.httpServer.start()]).then(() => {
            const timeDiff = new Date().getTime() - now.getTime();
            const seconds = Math.abs(timeDiff / 1000);
            console.log(`application started in ${seconds} seconds`)
        })
    }

    stop() {
        return Promise.all([this.grpcServer.stop(), this.httpServer.stop()]);
    }

    private static loadConfig() {
        const applicationConfigSchema = require('../configs/application-schema.json')
        convict.addParser({extension: ['yml', 'yaml'], parse: safeLoad})
        const config = convict(applicationConfigSchema)
        config.loadFile('configs/application.yaml')
        return config;
    }
}
