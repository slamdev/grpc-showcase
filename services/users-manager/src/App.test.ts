import App from "./App";
import * as health_grpc_pb from "../generated/health_grpc_pb";
import {HealthClient} from "../generated/health_grpc_pb";
import {ChannelCredentials, makeClientConstructor} from "@grpc/grpc-js";
import {HealthCheckRequest, HealthCheckResponse} from "../generated/health_pb";
import {getPortPromise} from 'portfinder'
import request = require("request");
import ServingStatus = HealthCheckResponse.ServingStatus;

function assignRandomPorts() {
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
    const httpPort = getPortPromise({port: random(8000, 65535)}).then(p => process.env.HTTP_PORT = p.toString())
    const grpcPort = getPortPromise({port: random(8000, 65535)}).then(p => process.env.GRPC_PORT = p.toString())
    return Promise.all([httpPort, grpcPort]).catch(err => console.error(err))
}

describe('App', () => {
    it('should run grpc server', done => {
        let app: App
        assignRandomPorts()
            .then(() => {
                app = new App();
                return app.start();
            })
            .then(() => {
                // @ts-ignore
                const HealthClient = makeClientConstructor(health_grpc_pb["grpc.health.v1.Health"], "Health");
                const client = new HealthClient(`localhost:${process.env.GRPC_PORT}`, ChannelCredentials.createInsecure()) as any as HealthClient;

                return new Promise<void>((resolve, reject) => {
                    client.check(new HealthCheckRequest(), (error, response) => {
                        if (error) {
                            reject(error);
                        } else {
                            expect(response.getStatus()).toEqual(ServingStatus.SERVING);
                            resolve()
                        }
                    });
                });
            })
            .then(() => app.stop())
            .catch(err => console.error(err))
            .then(() => done())
            .catch(err => app == null ? done(err) : app.stop().then(() => done(err)));
    })

    it('should run http server', done => {
        let app: App
        assignRandomPorts()
            .then(() => {
                app = new App();
                return app.start();
            })
            .then(() => {
                return new Promise<void>((resolve, reject) => {
                    request(`http://localhost:${process.env.HTTP_PORT}/health`, (err, res, body) => {
                        if (err) {
                            reject(err);
                        } else {
                            expect(body).toEqual('{"status": "SERVING"}')
                            resolve()
                        }
                    });
                })
            })
            .then(() => app.stop())
            .catch(err => console.error(err))
            .then(() => done())
            .catch(err => app == null ? done(err) : app.stop().then(() => done(err)));
    })
})
