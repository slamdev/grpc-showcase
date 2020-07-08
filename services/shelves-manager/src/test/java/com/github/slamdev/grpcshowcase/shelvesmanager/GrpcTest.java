package com.github.slamdev.grpcshowcase.shelvesmanager;

import io.grpc.Channel;
import io.grpc.ManagedChannelBuilder;
import net.devh.boot.grpc.server.serverfactory.GrpcServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Import(GrpcTest.ChannelConfiguration.class)
@TestPropertySource(properties = "grpc.server.port=0")
public @interface GrpcTest {

    class ChannelConfiguration {

        @Bean
        public Channel channel(GrpcServerFactory factory) {
            return ManagedChannelBuilder
                    .forAddress("localhost", factory.getPort())
                    .usePlaintext()
                    .build();
        }
    }
}
