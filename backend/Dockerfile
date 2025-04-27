FROM python:3.10

# Installing the requirements
WORKDIR /backend
COPY requirements.txt ./
COPY Makefile ./
RUN make install
COPY ./ /backend/

# Installing for pylint for the linter
RUN pip install pylint pylint-django

# Generatic static html page file (js, css, ...)
RUN make generate_static_auto

# Exposing backend port
# Exposing backend port
EXPOSE 8000

# Generates static and creating the migrations
RUN make make_migrations

# Downloads the fr_core_news_model
RUN python -m spacy download "fr_core_news_sm"

CMD [ "make", "migrate" ]

# Fix elastic search numpy2.0 incompatibility