## Install requirements from 'requirements.txt' file
install:
	pip install -r requirements.txt

## Activate venv shell
shell:
	pipenv shell

## Generates migrations
make_migrations:
	./manage.py makemigrations

## Migrate model data
migrate:
	./manage.py migrate

## Launch django app shell
app_shell:
	./manage.py shell

## Generates static files
generate_static:
	./manage.py collectstatic

## Generates static files
generate_static_auto:
	./manage.py collectstatic --noinput

## Run the server
run:
	daphne server.asgi:application -b 0.0.0.0

## Create super user
create_super_user:
	./manage.py createsuperuser

## Check lint
lint:
	pylint --load-plugins pylint_django --django-settings-module=server.settings apps_tests data server tools

## Run test suite:
tests:
	./manage.py test

## Generate coverage data from test suite
coverage_gen:
	coverage run ./manage.py test

## Display shell coverage
coverage_shell:
	coverage report

## Display html coverage
coverage_html:
	coverage html