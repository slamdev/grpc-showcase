import App from "./App";

const app = new App();
app.start().then(() => ['SIGTERM', 'SIGINT'].forEach(s => process.on(s, () => app.stop())));
