import logging
import os
from dataclasses import dataclass, field
from logging import Logger

from dynaconf import Dynaconf

from app.actuator import ActuatorServer
from app.grpc_srv import GrpcServer
from app.service import NotificationsSender
from generated import api_pb2_grpc


@dataclass
class App:
    logger: Logger = field(init=False, repr=False, default=logging.getLogger(__name__))
    env: Dynaconf = field(init=False, repr=False, default_factory=lambda: Dynaconf(
        settings_files=[os.path.dirname(__file__) + '/../configs/application.yaml']))
    grpc: GrpcServer = field(init=False, repr=False)
    actuator: ActuatorServer = field(init=False, repr=False)

    def __post_init__(self):
        logging.basicConfig(level=logging.INFO)

        self.actuator = ActuatorServer(int(self.env['http.port']))

        svc = NotificationsSender()
        self.grpc = GrpcServer(int(self.env['grpc.port']), [
            lambda srv: api_pb2_grpc.add_NotificationsSenderServicer_to_server(svc, srv)
        ])

    def start(self):
        self.actuator.start()
        self.grpc.start()

    def stop(self):
        self.actuator.stop()
        self.grpc.stop()
