# Amor

A group-based dating web application. Instead of swiping, users are placed into balanced groups with equal numbers of men and women and rank every member of the opposite group. Once everyone has submitted, the Gale–Shapley stable matching algorithm produces mutually stable pairs, who are then connected through private chat rooms.

Built with React (CRA), Redux, Express, Socket.IO, and Firebase (Auth + Firestore + Storage).

## Features

- **Email/password and Google OAuth sign-in** — OAuth users complete a short profile (age/sex/bio) once before entering the matching pool
- **Group matching** — groups of 6v6 rank preferences; server runs stable matching when all submissions are in
- **Live progress & reveal** — group submission progress bar and an animated match reveal
- **Chat** — Socket.IO-backed chat rooms between matched pairs
- **Demo mode** — mock dog profiles let you exercise the whole matching flow without real users

## Getting started

Requires **Node 16** (see `.nvmrc` — CRA 4 breaks on Node 17+):

```bash
nvm use
npm install          # also installs server deps via postinstall
cp .env.example .env # adjust if needed
npm run dev          # React app on :3000 + API server on :8080
```

| Variable | Default | Purpose |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:8080` | Express API base URL |
| `REACT_APP_SOCKET_URL` | `http://localhost:8080` | Socket.IO server |
| `REACT_APP_USE_MOCK` | `true` | Demo mode with mock dog profiles; set `false` for real data |
| `PORT` | `8080` | Server port |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | React dev server + API server together |
| `npm start` | React dev server only |
| `npm run server` | API server only (nodemon) |
| `npm test` | CRA test runner |
| `npm run test:matching` | Matching algorithm test suite |
| `npm run build` | Production build |

## Project structure

```
src/
├── lib/firebase.js        # Firebase app init (auth, firestore, storage)
├── api/                   # HTTP client for the Express API
├── components/
│   ├── common/            # shared components (SpinLoad)
│   ├── landing/           # landing page sections, navbar
│   ├── signup/            # signup form pages, OAuth CompleteProfile gate
│   ├── match/             # match dashboard, group list, reveal, progress
│   ├── chat/              # chat room
│   └── profile/           # profile page, view modal
├── pages/                 # route-level pages + page styles
├── store/                 # Redux store + reducers
├── matching/              # client-side matching config & helpers
├── hooks/  data/  assets/
server/
├── index.js               # Express API + Socket.IO
├── matching/              # Gale–Shapley implementation + tests
└── scripts/               # Firestore export & maintenance scripts
firestore.rules             # Firestore security rules
```

Components are PascalCase `.jsx`; utilities are camelCase `.js`.

## Firebase setup

1. **Auth providers**: enable Email/Password and Google in Firebase console → Authentication → Sign-in method.
2. **Server credentials**: download a service account key (Project settings → Service accounts → *Generate new private key*) and save it as `server/serviceAccountKey.json` (gitignored). The server then uses the Admin SDK; without it, it falls back to the client SDK, which only works while security rules are open.
3. **Security rules**: publish `firestore.rules` from the repo root in Firebase console → Firestore → Rules. **Do this only after step 2**, or the API loses database access.

### Firestore collections

| Collection | Contents |
|---|---|
| `profiles/{uid}` | user profile: name, email, age, sex, bio, images, group memberships |
| `groups/{id}` | a matching group: member snapshots (public fields only), preference matrices, submission count |
| `groupcount/{n}/users` | waiting pools of users queued for group formation |
| `rooms` | chat rooms (Socket.IO persistence) |

Profile data embedded in `groups` is restricted to a public-field whitelist (`uid, f_name, l_name, age, sex, bio, images`) — never copy raw profile documents into other collections, and never store passwords in Firestore (Firebase Auth owns credentials).

### Maintenance scripts

```bash
node server/scripts/exportFirestore.js        # full DB export (admin SDK, needs key)
node server/scripts/exportFirestoreClient.js  # fallback export (client SDK, open rules only)
node server/scripts/purgePasswords.js         # one-off legacy password purge (already run)
```

## Credits

Co-developed by Neejor Chakma and Ayush Kokande.
