FROM python:3.10

# Installing the requirements
WORKDIR /backup
COPY requirements.txt ./
COPY Makefile ./
RUN make install
COPY ./ /backup/

# Exposing backend port
EXPOSE 8000

# Generates static and creating the migrations
RUN make make_migrations

CMD [ "make", "migrate" ]