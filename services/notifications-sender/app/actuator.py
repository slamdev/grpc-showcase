import logging
import threading
from dataclasses import dataclass, field
from logging import Logger
from wsgiref.simple_server import make_server, WSGIServer

from prometheus_client.exposition import make_wsgi_app, ThreadingWSGIServer


@dataclass
class ActuatorServer:
    port: int
    srv: WSGIServer = field(init=False, repr=False, compare=False)
    logger: Logger = field(init=False, repr=False, default=logging.getLogger(__name__))

    def __post_init__(self):
        self.srv = make_server('', self.port, self._handle_req, ThreadingWSGIServer)

    def start(self):
        t = threading.Thread(target=self.srv.serve_forever)
        t.daemon = True
        self.logger.info('starting actuator server on ' + str(self.port))
        t.start()

    def stop(self):
        self.srv.shutdown()
        self.srv.server_close()

    @staticmethod
    def _handle_req(environ, start_response):
        if environ['PATH_INFO'] == '/health':
            return ActuatorServer._handle_health_req(environ, start_response)
        elif environ['PATH_INFO'] == '/metrics':
            return make_wsgi_app()(environ, start_response)
        start_response('404 Not Found', [])
        return []

    @staticmethod
    def _handle_health_req(environ, start_response):
        status = '200 OK'
        headers = [('Content-type', 'application/json; charset=utf-8')]
        body = '{"status": "OK"}'.encode('utf-8')
        start_response(status, headers)
        return [body]
