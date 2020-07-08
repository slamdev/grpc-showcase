import logging
import signal
import time
from dataclasses import dataclass, field
from logging import Logger
from typing import List, Callable


@dataclass
class SigtermHandler:
    handler: Callable[[], None]
    signals: List[int] = field(default_factory=lambda: [signal.SIGINT, signal.SIGTERM])
    logger: Logger = logging.getLogger('SigtermHandler')
    interrupted: bool = False

    def __post_init__(self):
        for s in self.signals:
            signal.signal(s, self._handle_exit)

    def _handle_exit(self, signum, frame):
        self.logger.info('captured signal %d' % signum)
        self.handler()
        self.interrupted = True

    def wait(self):
        while not self.interrupted:
            time.sleep(1)
