import os
import socket
from contextlib import closing
from unittest import TestCase

import grpc
import requests
from grpc_health.v1 import health_pb2_grpc, health_pb2

from app.app import App


class TestApp(TestCase):
    def test_should_start_http_server(self):
        app = self.prepare_app()

        r = requests.get('http://localhost:' + os.environ["HTTP_PORT"] + '/health')

        self.assertEqual(200, r.status_code)
        self.assertEqual('{"status": "OK"}', r.text)

        app.stop()

    def test_should_start_grpc_server(self):
        app = self.prepare_app()

        channel = grpc.insecure_channel('localhost:' + os.environ["GRPC_PORT"])
        stub = health_pb2_grpc.HealthStub(channel)
        r = stub.Check(health_pb2.HealthCheckRequest())

        self.assertEqual(health_pb2.HealthCheckResponse.SERVING, r.status)

        app.stop()

    @staticmethod
    def prepare_app() -> App:
        os.environ["HTTP_PORT"] = str(TestApp.find_free_port())
        os.environ["GRPC_PORT"] = str(TestApp.find_free_port())
        app = App()
        app.start()
        return app

    @staticmethod
    def find_free_port():
        with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
            s.bind(('', 0))
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            return s.getsockname()[1]
