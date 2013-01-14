.PHONY: all clean-all install clean-install force-install test clean-test lint

TEST_CMD:= NODE_PATH="`pwd`:$(NODE_PATH)" ./node_modules/.bin/mocha
TEST_RESULTS_ROOT:=test/results
TEST_LOGFILE:=$(TEST_RESULTS_ROOT)/tests.log

all: install lint test

clean-all: clean-test clean-install

install:
	npm install

clean-install:
	rm -rf node_modules

force-install: clean-install install

test:
	@mkdir -p $(TEST_RESULTS_ROOT)
	$(TEST_CMD) test/specs | tee $(TEST_LOGFILE)

clean-test:
	rm -rf $(TEST_RESULTS_ROOT) *.log

lint:
	./node_modules/.bin/jshint --config jshint.json index.js api
