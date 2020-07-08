expectations from a language agnostic grpc service:
- configuration management
  * yaml format
  * override any setting via env variable
  * different configuration profiles to run from local machine or in the cluster
- logs
  * stacktraces
  * json format when svc is running in the cluster
- http healthcheck
- expose prometheus endpoint and collect base metrics
- tracing integration
