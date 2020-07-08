package com.github.slamdev.grpcshowcase.shelvesmanager;

import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@GrpcService
public class ShelvesManager extends ShelvesManagerGrpc.ShelvesManagerImplBase {

    private static final Logger LOGGER = LoggerFactory.getLogger(ShelvesManager.class);

    @Override
    public void listShelves(Empty request, StreamObserver<ListShelvesResponse> responseObserver) {
        LOGGER.info("{} called with {}", "listShelves", request);

        var shelf = Shelf.newBuilder()
                .setId(1)
                .setTheme("something black")
                .build();

        var response = ListShelvesResponse.newBuilder()
                .addShelves(shelf)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void createShelf(CreateShelfRequest request, StreamObserver<Shelf> responseObserver) {
        LOGGER.info("{} called with {}", "createShelf", request);

        var shelf = Shelf.newBuilder()
                .setId(1)
                .setTheme("something black")
                .build();

        responseObserver.onNext(shelf);
        responseObserver.onCompleted();
    }

    @Override
    public void getShelf(GetShelfRequest request, StreamObserver<Shelf> responseObserver) {
        LOGGER.info("{} called with {}", "getShelf", request);

        var shelf = Shelf.newBuilder()
                .setId(1)
                .setTheme("something black")
                .build();

        responseObserver.onNext(shelf);
        responseObserver.onCompleted();
    }

    @Override
    public void deleteShelf(DeleteShelfRequest request, StreamObserver<Empty> responseObserver) {
        LOGGER.info("{} called with {}", "deleteShelf", request);

        var shelf = Shelf.newBuilder()
                .setId(1)
                .setTheme("something black")
                .build();

        responseObserver.onCompleted();
    }
}
