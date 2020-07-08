FROM python:3.7-stretch AS build

RUN pip install pipenv \
 && echo 'done'

WORKDIR /opt/app

COPY Pipfile* Makefile ./

RUN PIPENV_VENV_IN_PROJECT=1 make pipenv \
 && echo 'done'

COPY api/ ./api/
COPY app/ ./app/
COPY configs/ ./configs/
COPY tests/ ./tests/
COPY main.py ./

RUN mkdir generated \
 && make build test \
 && echo 'done'

FROM python:3.7-stretch AS run

WORKDIR /opt/app

COPY --from=build /opt/app/.venv ./.venv
COPY --from=build /opt/app/api ./api
COPY --from=build /opt/app/app ./app
COPY --from=build /opt/app/configs ./configs
COPY --from=build /opt/app/generated ./generated
COPY --from=build /opt/app/main.py ./

ENTRYPOINT ["./.venv/bin/python", "main.py"]
