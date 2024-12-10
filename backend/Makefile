help: ## Show the commands and the associated description
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install requirements from 'requirements.txt' file
	pip install -r requirements.txt

shell: ## Activate venv shell
	pipenv shell

make_migrations: ## Generates migrations
	./manage.py makemigrations

migrate: ## Migrate model data
	./manage.py migrate

super_user: ## Creates a root user
	./manage.py createsuperuser

app_shell: ## Launch django app shell
	./manage.py shell

generate_static: ## Generates static files
	./manage.py collectstatic

generate_static_auto: ## Generates static files
	./manage.py collectstatic --noinput

run: ## Run the server
	daphne server.asgi:application -b 0.0.0.0

create_super_user: ## Create super user
	./manage.py createsuperuser

lint: ## Check lint
	pylint --rcfile .pylintrc --load-plugins pylint_django --django-settings-module=server.settings apps_tests data server tools

tests: ## Run test suite
	./manage.py test

coverage_gen: ## Launch the unit test for later coverage
	coverage run --source='.' ./manage.py test

coverage_shell: ## Display unit test coverage result (in a shell format)
	coverage report

coverage_html: ## Display unit test coverage result (in a web page)
	coverage html