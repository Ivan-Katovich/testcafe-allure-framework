# Project Name

Complex solution for Docketing portal Automation using Testcafe Tool

## Preconditions

node version: 10+

## Installation

npm install - to pull all the npm packages

## Usage

Run this sample framework to validate the docketing portal functionality.


## Execute Automation Framework

npm test

## Available parameters:
#### --report=allure 
to switch between different reporters

possible options: allure, spec; 

default: allure;

#### --clean=all
to clean different report items

possible options: all, html, logs, screenshots and their combinations divided by '/'

default: false

#### --env=atqa
to switch between different environments

possible options: atqa, atdv, d491, q491; 

default: atdv;

#### --database=DP49Automation
to switch between different databases

possible options: DP49Automation; 

default: DP49Automation;

#### --user=test
to switch between different users

possible options: my, test; 

default: test;

#### --suite=smoke
to run different test suites

possible options: smoke, docketing, administration, all and their combinations divided by '/'

default: smoke;

#### --test="test_name"
to run a test with a specific name

#### --fixture="fixture_name"
to run all tests from fixture with a specific name

#### --category="category_name"
to run tests from a specific category
can be used with "-" to except the category from the run (--category="-category_name")

#### --browser=chrome
to run tests through different browsers

possible options: chrome, ie, firefox, edge;

default: chrome;

#### --port=1337
to run tests through different ports

possible options: any number

default: 1335;

#### --authtype=enterprise
switch between hosted and enterprise environments

possible options: hosted, enterprise

default: hosted;

### Parameters usage example
npm test --report=allure --clean=all


## Available flags:
#### --quarantine 
to switch one Quarantine mod (watch TestCafe documentation)

default: false;

#### --monochrome 
to switch between colorized and monochrome console output

default: false;

#### --headless 
to switch to headless mode

default: false;

#### --brief 
to switch to brief execution (reduced TC amount, works with regression only)

default: false;

# Parallelization

npm run parallel

## Available parameters:
#### --threads=3 
available other numbers

#### --users and --suites 
parameters can be different for each thread 

example: --users=test1,test2 --suite=def/ch,cp/cb (separator - ',')

#### --exception="Display Configuration"
excepts the category from parallel threads 
and add it to separated thread at the end of the parallel run

#### other parameters the same as for single threaded run

# Reporting

#### Logs 
reports/logs

#### HTML report
reports/allure

#### Screenshots
reports/screenshots

### Allure hosting
in additional terminal execute:
##### npm run allure-host
report will be available on http://localhost:1234 or through network on port 1234


