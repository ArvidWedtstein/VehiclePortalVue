<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Version][version-shield]][version-url]
[![Update database types][workflow-shield]][workflow-url]

<br />
<div align="center">
  <a href="https://github.com/ArvidWedtstein/VehiclePortal">
    <img src="https://i.ebayimg.com/images/g/YQsAAOSw3wpk7wGo/s-l1200.webp" alt="Logo" width="160" height="80">
  </a>

  <h3 align="center">VehicleHub</h3>

  <p align="center">
    Website for storing services done on your vehicles
    <br />
    <a href="https://github.com/ArvidWedtstein/VehiclePortal"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ArvidWedtstein/VehiclePortal/issues">Report Bug</a>
    ·
    <a href="https://github.com/ArvidWedtstein/VehiclePortal/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#the-plan">The Plan</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Started as an idea about 1:30 am on 23.04.24.
<br>
Plan is to replace the excel spreadsheet that was used for this task until now.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### The Plan

<hr>

<b>Plan looks like this</b>:<br>

<ul>
  <li>Make DB <a href="https://drawsql.app/teams/arvid/diagrams/vehicledb">Schema</a></li>
  <li>Maketh Plan for UI</li>
</ul>

Rest of plan can be found: <a href="https://github.com/users/ArvidWedtstein/projects/13/views/2">here</a>

### Built With

This project will be mainly written in VueJS, together with these frameworks and libraries:

[![Supabase][Supabase]][Supabase-url]

<!-- https://supabase.com/docs/guides/getting-started/quickstarts/reactjs -->
<!-- https://codepen.io/knyttneve/pen/NWRWQeB -->

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

To run this project you'll need to have nodejs installed on your computer. You can download it [here](https://nodejs.org/en/download/)

Instructions TBA...

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ArvidWedtstein/VehiclePortal.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file in the root directory and add your environment variables. I used supabase postgres for this project, so you'll need to create a supabase account and add the url and key to your .env file. You can also use a different database, but you'll need to change the database url in the api/prisma/schema.prisma file.
   ```sh
    DATABASE_URL=postgresql://<user>:<pass>@db.<project>.supabase.co:<port>/postgres
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Deploying

Please don't

<!-- USAGE EXAMPLES -->

## Usage

Project can be used to keep track of your services done on your vehicles

### Testing

Testing is not in place yet, but will hopefully come later

<!-- ROADMAP -->

## Roadmap

- [x] Make a plan for the database schema
- [x] Make a UI design in figma
- [x] Decide on what framework / database to use
- [ ] Execute plan
- [ ] Testing
- [ ] Find place to deploy (preferably free)

See the [open issues](https://github.com/ArvidWedtstein/VehicleHub/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this project better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! <3

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

No license yet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

No contact info :)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Nothing to acknowledge yet :D

<!-- MARKDOWN LINKS & IMAGES -->

[workflow-shield]: https://github.com/ArvidWedtstein/VehicleHub/actions/workflows/update-types.yml/badge.svg
[workflow-url]: https://github.com/ArvidWedtstein/VehicleHub/actions/workflows/update-types.yml
[contributors-shield]: https://img.shields.io/github/contributors/ArvidWedtstein/VehicleHub.svg?style=for-the-badge
[contributors-url]: https://github.com/ArvidWedtstein/VehicleHub/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ArvidWedtstein/VehicleHub.svg?style=for-the-badge
[forks-url]: https://github.com/ArvidWedtstein/VehicleHub/network/members
[stars-shield]: https://img.shields.io/github/stars/ArvidWedtstein/VehicleHub.svg?style=for-the-badge
[stars-url]: https://github.com/ArvidWedtstein/VehicleHub/stargazers
[issues-shield]: https://img.shields.io/github/issues/ArvidWedtstein/VehicleHub.svg?style=for-the-badge
[issues-url]: https://github.com/ArvidWedtstein/VehicleHub/issues
[license-shield]: https://img.shields.io/github/license/ArvidWedtstein/VehicleHub.svg?style=for-the-badge
[license-url]: https://github.com/ArvidWedtstein/VehicleHub/blob/prod/LICENSE.txt
[version-shield]: https://img.shields.io/github/package-json/v/ArvidWedtstein/VehicleHub/dev?style=for-the-badge
[version-url]: https://github.com/ArvidWedtstein/VehicleHub
[react.js]: https://shields.io/badge/react-black?logo=react&style=for-the-badge
[react-url]: https://react.dev/
[supabase]: https://shields.io/badge/supabase-black?logo=supabase&style=for-the-badge
[supabase-url]: https://supabase.com/
[material-ui]: https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[materialui-url]: https://mui.com/

<!--
Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This%20starter%20configures%20Supabase%20Auth%20to%20use%20cookies%2C%20making%20the%20user's%20session%20available%20throughout%20the%20entire%20Next.js%20app%20-%20Client%20Components%2C%20Server%20Components%2C%20Route%20Handlers%2C%20Server%20Actions%20and%20Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6)
-->
