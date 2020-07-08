protoc:
ifeq (, $(shell which protoc))
	$(error "No protoc in $(PATH), consider installing it from https://github.com/protocolbuffers/protobuf#protocol-compiler-installation")
endif
ifeq (, $(shell which protoc-gen-go))
	go install google.golang.org/protobuf/cmd/protoc-gen-go
endif
ifeq (, $(shell which protoc-gen-go-grpc))
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc
endif
ifeq (, $(shell [ -d 'generated/api/google' ] && echo 1))
	wget https://github.com/googleapis/api-common-protos/archive/1.50.0.zip -O api-common-protos.zip
	unzip api-common-protos.zip
	mkdir -p generated/api
	mv api-common-protos-*/google generated/api/
	rm -rf api-common-protos*
endif
	protoc --proto_path=generated/api --go_out=generated/api --go-grpc_out=generated/api --proto_path=api api/*.proto

pack:
ifeq (, $(shell which pkger))
	go install github.com/markbates/pkger/cmd/pkger
endif
	pkger -o generated

mod:
	go mod tidy
	go mod verify

build: protoc pack
	go build -o bin/booksmanager ./cmd/booksmanager

test: protoc
	go test -v ./internal/...
