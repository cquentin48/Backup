FROM python:3.10

WORKDIR /app

COPY ./ /app

RUN make install

RUN make make_migrations

RUN make migrate

RUN make generate_static_auto

EXPOSE 8000

CMD [ "make", "run" ]