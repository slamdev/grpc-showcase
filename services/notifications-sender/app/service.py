import logging
from dataclasses import dataclass, field
from logging import Logger

from generated import api_pb2_grpc


@dataclass
class NotificationsSender(api_pb2_grpc.NotificationsSenderServicer):
    logger: Logger = field(init=False, repr=False, default=logging.getLogger(__name__))

    def SendNotification(self, request, context):
        self.logger.info("SendNotification is called with" + str(request))
