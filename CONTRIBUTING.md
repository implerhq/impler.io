# Contributing to Impler

Thank you for showing an interest in contributing to `Impler`! All kinds of contributions are valuable to us. In this guide, we will cover how you can quickly onboard and make your first contribution.

## Submitting an issue

Before submitting a new issue, please search the [issues](https://github.com/implerhq/impler.io/issues) and [discussion](https://github.com/implerhq/impler.io/discussions) tabs. Maybe an issue or discussion already exists and might inform you of workarounds. Otherwise, you can give new information.

While we want to fix all the [issues](https://github.com/implerhq/impler.io/issues), before fixing a bug we need to be able to reproduce and confirm it. Please provide us with a minimal reproduction scenario using a repository or [Gist](https://gist.github.com/). Having a live, reproducible scenario gives us the information without asking questions back & forth with additional questions like:

- What is failing or not working?
- Idea about context like `Self-Hosted`/`React`/`Iframe-embed` environment
- Steps to reproduce

You can open a new issue from [here](https://github.com/implerhq/impler.io/issues/new).

## Projects setup and Architecture

### Requirements

- Node.js version v18.13.0
  - pnpm version 7.9.4
- MongoDB
- Localstack or AWS S3 credentials (for storing files)
- RabbitMQ for microservices to interact with each other

> Using docker is the easiest way to set up MongoDB, LocalStack, and RabbitMQ services.

#### Developers are following this way to setup 

### Setup the project

The project is a monorepo, meaning that it is a collection of multiple packages managed in the same repository.

Fork the repository and clone the repo. Example cloning the Impler repo `git clone git@github.com:implerhq/impler.io.git`.

After cloning your fork, follow these steps to set up the project locally,

1. Install the dependencies by running, `pnpm install`.
2. Do setup for projects by running, `pnpm setup:project`.
3. Start the application by running the following commands.
    1. Start backend API `pnpm start:api`.
    2. Start web portal `pnpm start:web`.
    3. Start embed script `pnpm start:embed`.
    4. Start import widget `pnpm start:widget`.
    5. Start queue-manager `pnpm start:queue-manager`.
5. Start interacting with web UI by visiting `http://localhost:4200`.

## Missing a Feature or Facing an Issue?

If a feature is missing or you're experiencing an issue, you can report it [here](https://github.com/implerhq/impler.io/issues/new). 

## Coding guidelines

To ensure consistency throughout the source code, please keep these rules in mind as you are working:

- All features or bug fixes must be tested.
- We use [Eslint default rule guide](https://eslint.org/docs/rules/), with minor changes. An automated formatter is available using prettier.

## Need help? Questions and suggestions

Questions, suggestions, and thoughts are most welcome. Feel free to open a [GitHub Discussion](https://github.com/implerhq/impler.io/discussions). 
We can also be reached on our [Discord Server](https://discord.impler.io).

## Ways to contribute

- Use a platform and try importing files and share your thoughts
- Help with open [issues](https://github.com/implerhq/impler.io/issues) or [create your own](https://github.com/implerhq/impler.io/issues/new)
- Share your thoughts and suggestions with us over [discord](https://discord.impler.io)
- Help create tutorials and blog posts
- Request a feature by submitting a proposal
- Report a bug
- **Improve documentation** - fix incomplete or missing [docs](https://docs.impler.io/), bad wording, examples or explanations.
