import logging
from concurrent import futures
from dataclasses import dataclass, field
from logging import Logger
from typing import Callable, List

import grpc
# noinspection PyProtectedMember
from grpc._server import _Server as Server
from grpc_health.v1 import health_pb2
from grpc_health.v1 import health_pb2_grpc
from py_grpc_prometheus.prometheus_server_interceptor import PromServerInterceptor


@dataclass
class GrpcServer:
    srv: Server = field(init=False, repr=False, compare=False)
    port: int
    registrators: List[Callable[[Server], None]]
    logger: Logger = field(init=False, repr=False, default=logging.getLogger(__name__))

    def __post_init__(self):
        self.srv = grpc.server(futures.ThreadPoolExecutor(), interceptors=[PromServerInterceptor()])
        self.srv.add_insecure_port('[::]:' + str(self.port))
        for r in self.registrators:
            r(self.srv)
        health_pb2_grpc.add_HealthServicer_to_server(Health(), self.srv)

    def start(self) -> None:
        self.logger.info('starting grpc server on ' + str(self.port))
        self.srv.start()

    def stop(self) -> None:
        self.srv.stop(grace=5)


@dataclass
class Health(health_pb2_grpc.HealthServicer):
    logger: Logger = field(init=False, repr=False, default=logging.getLogger(__name__))

    def Check(self, request, context):
        return health_pb2.HealthCheckResponse(status=health_pb2.HealthCheckResponse.SERVING)

    def Watch(self, request, context):
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        return health_pb2.HealthCheckResponse()
