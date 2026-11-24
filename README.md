# faculty-flow-client

Front-end for **Faculty Flow**, an app for managing faculty room reservations.

## Tech stack

| Library                                 | Purpose                                  |
|-----------------------------------------|------------------------------------------|
| Angular 21                              | Framework                                |
| NgRx (Store, Effects, Store DevTools)   | State management                         |
| PrimeNG, PrimeFlex, Bootstrap           | UI components and layout                 |
| Syncfusion Schedule                     | Reservation schedule / calendar view     |
| ngx-translate                           | Translations (English and Serbian)       |
| tsParticles                             | Animated background                      |
| Vitest                                  | Unit tests                               |

## Requirements

- Node.js 24 (see `.nvmrc`; run `nvm use` if you use [nvm](https://github.com/nvm-sh/nvm))
- npm
- A running back-end (see the `faculty-flow-server` project), reachable at `http://localhost:9000`
- Docker (optional, for building the production image)

## Running

### Development mode

Start the back-end in development mode first (`bash run.sh dev` in `faculty-flow-server`), then:

```bash
npm install      # Install dependencies
ng serve   # Start the dev server at http://localhost:4200
```

### Production mode

The production image is built and pushed to GitHub Container Registry
(`ghcr.io/uros-gavrilovic/faculty-flow-frontend:latest`) on every push to `main`.
It is started automatically by `bash run.sh prod` in `faculty-flow-server`.

To build and run the image locally instead:

```bash
docker build -t faculty-flow-frontend .
docker run -p 4200:80 faculty-flow-frontend
```

The image serves the compiled app with nginx on port 80.

## Configuration

Back-end URLs are set in `src/environment/environment.ts` (development) and
`src/environment/environment.prod.ts` (production). Both point to the API gateway at
`http://localhost:9000` by default:

| Key              | Default                                   |
|------------------|-------------------------------------------|
| `authApi`        | `http://localhost:9000/api/auth`          |
| `userApi`        | `http://localhost:9000/api/user`          |
| `roomApi`        | `http://localhost:9000/api/room`          |
| `reservationApi` | `http://localhost:9000/api/reservation`   |

## License

See [LICENSE](LICENSE).
