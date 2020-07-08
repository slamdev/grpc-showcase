from app.app import App
from app.sigterm_handler import SigtermHandler

if __name__ == '__main__':
    app = App()
    app.start()

    sigterm = SigtermHandler(handler=app.stop)
    sigterm.wait()
