package com.github.slamdev.grpcshowcase.shelvesmanager;

import io.grpc.Channel;
import io.grpc.health.v1.HealthCheckRequest;
import io.grpc.health.v1.HealthCheckResponse;
import io.grpc.health.v1.HealthGrpc;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@GrpcTest
class ApplicationTest {

    @Autowired
    private WebTestClient webClient;

    @Autowired
    private Channel channel;

    @Test
    void should_run_http_application() {
        webClient.get().uri("/actuator/health")
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void should_run_grpc_application() {
        var health = HealthGrpc.newBlockingStub(channel);
        var response = health.check(HealthCheckRequest.newBuilder().build());
        var status = response.getStatus();
        assertEquals(HealthCheckResponse.ServingStatus.SERVING, status);
    }
}
