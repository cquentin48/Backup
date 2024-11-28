FROM python:3.10

WORKDIR /app

COPY ./ /app

RUN make install

RUN apt update -y
RUN apt install iputils-ping -y

EXPOSE 8000

RUN chmod +x database_prepare.sh
RUN ./database_prepare.sh

RUN make make_migrations
RUN make migrate

CMD [ "make", "run" ]