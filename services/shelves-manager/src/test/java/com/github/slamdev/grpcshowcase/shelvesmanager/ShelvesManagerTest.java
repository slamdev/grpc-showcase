package com.github.slamdev.grpcshowcase.shelvesmanager;

import io.grpc.internal.testing.StreamRecorder;
import org.junit.jupiter.api.Test;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

class ShelvesManagerTest {

    @Test
    void sample_test() throws Exception {
        var manager = new ShelvesManager();
        var responseObserver = StreamRecorder.<Shelf>create();
        var shelf = Shelf.newBuilder()
                .setId(1)
                .setTheme("something black")
                .build();
        var request = CreateShelfRequest.newBuilder()
                .setShelf(shelf)
                .build();

        manager.createShelf(request, responseObserver);

        if (!responseObserver.awaitCompletion(5, TimeUnit.SECONDS)) {
            fail("cannot complete request withing timeout");
        }
        assertNull(responseObserver.getError());
        var results = responseObserver.getValues();
        assertEquals(1, results.size());
        assertEquals(shelf, results.get(0));
    }
}
