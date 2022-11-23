<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">impler.io</h3>

  <p align="center">
    Open source infrastructure for data import
    <br />
    <a href="https://github.com/knovator/impler.io"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/knovator/impler.io">View Demo</a>
    ·
    <a href="https://github.com/knovator/impler.io/issues">Report Bug</a>
    ·
    <a href="https://github.com/knovator/impler.io/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

All projects need to give some kind of data import facility, so that their users can import data in application through files like `.csv`, `.xls`, `.xlsx`, etc.

At first it looks like just importing file and inserting in database, but as the app grows facilities like validating data, data mapping, becomes must. `impler` provides infrastructure to applications, so that they don't have to write code for data import.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [Nestjs](https://nestjs.com/)
* [Typescript](https://www.typescriptlang.org/)
* [Nx](https://nx.dev/)
* [Pnpm](https://pnpm.io/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Setup
To set up `impler.io` locally, you need the following things installed in your computer.
1. `pnpm`
2. `localstack`
3. `mongodb`

Follow these steps to setup the project locally,
1. Clone the repo, `git clone https://github.com/knovator/impler.io`.
2. Install the dependencies, `pnpm install`.
3. Do setups for projects by running, `pnpm setup:project`.
4. Start the application, `pnpm start:dev`.
5. Start interacting with API by visiting `http://localhost:3000/api` or see demo on `http://localhost:5173`.

### Add Import Schema

After doing setup, you can easily make call to the `impler` through **Swagger UI** provided at `http://localhost:3000/api`, 
1. Create `project` by calling `/v1/project` API, and Copy `_id` from the response.
2. Create `template` by calling `/v1/template/{projectId}` API, and Copy `_id` from the response.
3. Update `columns` for template by calling `/v1/column/{templateId}` API.

### See Demo

If you're running `impler` locally, after [adding-schema](#add-import-schema) you can start interacting with import widget from `http://localhost:5173`.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Knovator - [@knovator](https://twitter.com/knovator)

Project Link: [https://github.com/knovator/impler.io](https://github.com/knovator/impler.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/knovator/impler.io.svg?style=for-the-badge
[contributors-url]: https://github.com/knovator/impler.io/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/knovator/impler.io.svg?style=for-the-badge
[forks-url]: https://github.com/knovator/impler.io/network/members
[stars-shield]: https://img.shields.io/github/stars/knovator/impler.io.svg?style=for-the-badge
[stars-url]: https://github.com/knovator/impler.io/stargazers
[issues-shield]: https://img.shields.io/github/issues/knovator/impler.io.svg?style=for-the-badge
[issues-url]: https://github.com/knovator/impler.io/issues
[license-shield]: https://img.shields.io/github/license/knovator/impler.io.svg?style=for-the-badge
[license-url]: https://github.com/knovator/impler.io/blob/master/LICENSE.txt
