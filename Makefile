.PHONY: test

help:
	@echo "Development actions:"
	@echo "--------------------"
	@echo "clean:            Cleans the development environment"
	@echo "install:          Installs all of the packages"
	@echo "lint:             Runs the linter"
	@echo "test:             Runs all of the tests"
	@echo ""
	@echo "Build actions:"
	@echo "--------------"
	@echo "build:            Builds all of the codebase"
	@echo "compile:          Compiles all of the binaries"
	@echo ""
	@echo "Release actions:"
	@echo "----------------"
	@echo "release:          Tags and releases code to NPM"
	@echo ""

clean:
	grunt clean
	@echo "Run make install to install all of the packages"

install: clean
	@echo "Installing all of the packages needed"
	npm install

lint:
	@echo "Not implemented"

test:
	npm run test

build:
	grunt build

compile:
	grunt compile

release:
	@echo "Not implemented"


