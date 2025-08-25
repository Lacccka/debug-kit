.RECIPEPREFIX := >
.PHONY: install build test size all

install:
>    npm install

build:
>    npm run build

test:
>    npm test

size:
>    npm run size

all: install build test size