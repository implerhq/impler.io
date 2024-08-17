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

- Node.js version v20.13.1
  - pnpm version 8.9.0
- MongoDB
- Localstack or AWS S3 credentials (for storing files)
- RabbitMQ for microservices to interact with each other

> Using docker is the easiest way to set up MongoDB, LocalStack, and RabbitMQ services.


## Setting Up the Project Locally

### To set up the project locally, follow these steps:

1. **Fork the Repository:**  
   Start by forking the repository to your own GitHub account. This creates a copy of the repository under your account, allowing you to freely make changes without affecting the original project.

2. **Clone the Repository:**  
   Once forked, clone the repository to your local machine using the following command:

   ```bash
   git clone git@github.com:your-username/repository-name.git
   
Replace your-username with your GitHub username and repository-name with the name of the repository you forked. This command will create a local copy of the project on your machine, enabling you to work on it offline.

After cloning your fork, follow these steps to set up the project locally,

3. **Install the dependencies by running:**
      ```bash
      pnpm install
4. **Do setup for projects by running:** 
      ```bash
      pnpm setup:project
5. **In a terminal, start the dependencies (rabbitmq, mongodb and minio) as Docker containers by running the following command:**
      ```bash
      docker compose -f docker/dependencies.compose.yml up -d
      ```

### Start the application by running the following commands.
5. **Start backend API:**
      ```bash
      pnpm start:api
6. **Start web portal:**
      ```bash
      pnpm start:web
7. **Start embed script:**
      ```bash
      pnpm start:embed
8. **Start import widget:**
      ```bash
      pnpm start:widget
9. **Start queue-manager:**
      ```bash
      pnpm start:queue-manager
10. **Start interacting with web UI by visiting:**
      ```bash
      http://localhost:4200

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
