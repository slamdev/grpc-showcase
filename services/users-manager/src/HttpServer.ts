import {Application, Request, Response} from "express";
import * as http from "http";
import {collectDefaultMetrics, register} from "prom-client";
import express = require('express');

export default class HttpServer {

    private readonly server: Application;
    private readonly port: number;
    private underlyingServer: http.Server | undefined;

    constructor(port: number) {
        this.port = port;
        this.server = express();
        this.server.get('/health', this.handleHealthRequest)
        this.server.get('/metrics', this.handleMetricsRequest)
        HttpServer.configureDefaultMetrics()
    }

    start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.underlyingServer = this.server.listen(this.port, () => {
                console.log(`http server listens on ${this.port} port`)
                resolve()
            })
        });
    }

    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.underlyingServer) {
                this.underlyingServer.close(err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        });
    }

    handleHealthRequest(req: Request, res: Response) {
        res.contentType('application/json')
        res.send('{"status": "SERVING"}')
    }

    handleMetricsRequest(req: Request, res: Response) {
        res.contentType(register.contentType)
        res.send(register.metrics())
    }

    private static configureDefaultMetrics() {
        // workaround to check if default metrics are registered already
        const m = register.getSingleMetric('nodejs_version_info')
        if (!m) {
            collectDefaultMetrics()
        }
    }
}
