package com.github.slamdev.grpcshowcase.shelvesmanager;

import io.grpc.health.v1.HealthCheckRequest;
import io.grpc.health.v1.HealthCheckResponse;
import io.grpc.health.v1.HealthGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.health.Status;

import static io.grpc.Status.UNIMPLEMENTED;

@GrpcService
public class GrpcHealthEndpoint extends HealthGrpc.HealthImplBase {

    private final HealthEndpoint healthEndpoint;

    public GrpcHealthEndpoint(HealthEndpoint healthEndpoint) {
        super();
        this.healthEndpoint = healthEndpoint;
    }

    @Override
    public void check(HealthCheckRequest request, StreamObserver<HealthCheckResponse> responseObserver) {
        var actuatorStatus = healthEndpoint.health().getStatus();
        HealthCheckResponse.ServingStatus grpcStatus;
        if (actuatorStatus == Status.DOWN) {
            grpcStatus = HealthCheckResponse.ServingStatus.NOT_SERVING;
        } else if (actuatorStatus == Status.UP) {
            grpcStatus = HealthCheckResponse.ServingStatus.SERVING;
        } else {
            grpcStatus = HealthCheckResponse.ServingStatus.UNKNOWN;
        }

        var response = HealthCheckResponse.newBuilder()
                .setStatus(grpcStatus)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void watch(HealthCheckRequest request, StreamObserver<HealthCheckResponse> responseObserver) {
        responseObserver.onError(UNIMPLEMENTED.asException());
    }
}
