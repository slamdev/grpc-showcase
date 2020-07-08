pipenv:
ifeq (, $(shell which pipenv))
	$(error "No pipenv in $(PATH), consider installing it from https://github.com/protocolbuffers/protobuf#protocol-compiler-installation")
endif
	pipenv install --dev

protoc:
ifeq (, $(shell [ -d 'generated/google' ] && echo 1))
	wget https://github.com/googleapis/api-common-protos/archive/1.50.0.zip -O api-common-protos.zip
	unzip api-common-protos.zip
	mkdir -p generated
	mv api-common-protos-*/google generated/
	rm -rf api-common-protos*
endif
	pipenv run python -m grpc_tools.protoc --proto_path=generated --proto_path=api --python_out=generated --grpc_python_out=generated api/*.proto
	# use this hack until https://github.com/protocolbuffers/protobuf/pull/7470 is merged
	find generated -type f -name *_pb2*.py -exec sed -i.bak 's/^\(import.*_pb2\)/from . \1/' {} \;

build: protoc

test: protoc
	pipenv run python -m unittest
