
Docker is the easiest way to get started with self-hosted `Impler`.

## Before you begin

You need the following installed in your system:

- [Docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Quick Start

### Get the code

Clone the Impler repo and enter the docker directory locally:

```sh
# Get the code
git clone --depth 1 https://github.com/knovator/impler.io

# Go to the docker folder
cd impler.io/docker

# Copy the example env file
cp .env.example .env

# Start
docker-compose up
```

Now visit [http://localhost:3000/api](http://localhost:3000/api) to define the schema for your import.


## Secure your setup

While we provide you with some example secrets for getting started, you should NEVER deploy your Impler setup using the defaults provided.

### Update Secrets

Update the `.env` file with your own secrets. In particular, these are required:

- `ACCESS_KEY`: used by the API as a header to authenticate `API` requests.

## Configuration

To keep the setup simple, we made some choices that may not be optimal for production:

- the database is in the same machine as the servers
- the storage uses the S3 to store files

We strongly recommend that you decouple your database before deploying.

## Next steps

- Got a question? [Ask here](https://github.com/knovator/impler.io/discussions).
