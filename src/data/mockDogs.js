/**
 * Demo profiles for local development when Firebase/Heroku data is unavailable.
 * Images via placedog.net (stable per id).
 *
 * Enable:  REACT_APP_USE_MOCK=true  (default)
 * Disable: REACT_APP_USE_MOCK=false
 */

import {
  GROUP_SIZE,
  TOTAL_GROUP,
  createEmptyPreferences,
} from "../matching/config";
import { buildPreferenceMatrix } from "../matching/preferences";
import { stableSelection } from "../matching/algo";

export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK !== "false";

const dogImg = (id, w = 480, h = 640) =>
  `https://placedog.net/${w}/${h}?id=${id}`;

function makeDog({ uid, f_name, l_name, age, sex, bio, imageIds }) {
  return {
    uid,
    f_name,
    l_name,
    email: `${f_name.toLowerCase()}@amor.dogs`,
    age: String(age),
    sex,
    bio,
    images: imageIds.map((id) => dogImg(id)),
    groups: [],
  };
}

/** 6 male dogs — opposite-gender pool for female users */
export const maleDogs = [
  makeDog({
    uid: "mock-male-0",
    f_name: "Buddy",
    l_name: "Retriever",
    age: 3,
    sex: "Male",
    bio: "Golden boy who loves fetch, belly rubs, and long walks at golden hour.",
    imageIds: [1, 13, 25],
  }),
  makeDog({
    uid: "mock-male-1",
    f_name: "Max",
    l_name: "Shepherd",
    age: 4,
    sex: "Male",
    bio: "Loyal, alert, and always down for a hike. Treats appreciated.",
    imageIds: [2, 14, 26],
  }),
  makeDog({
    uid: "mock-male-2",
    f_name: "Charlie",
    l_name: "Beagle",
    age: 2,
    sex: "Male",
    bio: "Nose-first adventurer. Will trade cuddles for peanut butter.",
    imageIds: [3, 15, 27],
  }),
  makeDog({
    uid: "mock-male-3",
    f_name: "Rocky",
    l_name: "Boxer",
    age: 5,
    sex: "Male",
    bio: "Goofy athlete with a soft side. Looking for a park partner.",
    imageIds: [4, 16, 28],
  }),
  makeDog({
    uid: "mock-male-4",
    f_name: "Duke",
    l_name: "Labrador",
    age: 3,
    sex: "Male",
    bio: "Water dog. Swims first, asks questions later. Very good boy.",
    imageIds: [5, 17, 29],
  }),
  makeDog({
    uid: "mock-male-5",
    f_name: "Finn",
    l_name: "Husky",
    age: 4,
    sex: "Male",
    bio: "Talkative, dramatic, and photogenic. Needs snow or AC.",
    imageIds: [6, 18, 30],
  }),
];

/** 6 female dogs — opposite-gender pool for male users */
export const femaleDogs = [
  makeDog({
    uid: "mock-female-0",
    f_name: "Bella",
    l_name: "Poodle",
    age: 3,
    sex: "Female",
    bio: "Curly coat, sharp mind. Prefers fancy parks and quiet evenings.",
    imageIds: [7, 19, 31],
  }),
  makeDog({
    uid: "mock-female-1",
    f_name: "Luna",
    l_name: "Corgi",
    age: 2,
    sex: "Female",
    bio: "Short legs, big personality. Snack enthusiast and nap queen.",
    imageIds: [8, 20, 32],
  }),
  makeDog({
    uid: "mock-female-2",
    f_name: "Daisy",
    l_name: "Spaniel",
    age: 4,
    sex: "Female",
    bio: "Soft ears, softer heart. Looking for someone who loves rain walks.",
    imageIds: [9, 21, 33],
  }),
  makeDog({
    uid: "mock-female-3",
    f_name: "Molly",
    l_name: "Terrier",
    age: 5,
    sex: "Female",
    bio: "Feisty, funny, and fiercely loyal. Squirrels are the enemy.",
    imageIds: [10, 22, 34],
  }),
  makeDog({
    uid: "mock-female-4",
    f_name: "Sadie",
    l_name: "Collie",
    age: 3,
    sex: "Female",
    bio: "Smart herder seeking a human who can keep up. Agility optional.",
    imageIds: [11, 23, 35],
  }),
  makeDog({
    uid: "mock-female-5",
    f_name: "Rosie",
    l_name: "Bulldog",
    age: 4,
    sex: "Female",
    bio: "Couch potato with a snort of gold. Naps and nose boops welcome.",
    imageIds: [12, 24, 36],
  }),
];

/** In-memory mock group + match results for local demo */
let mockGroupState = null;
let mockMatchResults = [];

export function getMockGroupState() {
  return mockGroupState;
}

export function getMockMatchResults() {
  return mockMatchResults;
}

function makeRoomId(uidA, uidB) {
  return uidA.localeCompare(uidB) < 0 ? `${uidA}@${uidB}` : `${uidB}@${uidA}`;
}

function fillRemainingMockPreferences(group, viewerSex, viewerIdx, rankedIndices) {
  const n = group.size || GROUP_SIZE;
  const identity = Array.from({ length: n }, (_, i) => i);

  if (viewerSex === "Male") {
    group.m_pref[viewerIdx] = rankedIndices;
  } else {
    group.f_pref[viewerIdx] = rankedIndices;
  }

  group.m_pref = group.m_pref.map((pref) => pref ?? [...identity]);
  group.f_pref = group.f_pref.map((pref) => pref ?? [...identity]);
  group.cnt = TOTAL_GROUP;
}

/**
 * Run Gale–Shapley on the mock group and store chat-ready match results.
 * @param {{ Male: object[], Female: object[], size?: number }} group
 */
export function runMockMatching(group) {
  const n = group.size || GROUP_SIZE;
  const matrix = buildPreferenceMatrix(group, n);
  const result = stableSelection(matrix, n);

  mockMatchResults = result.map((maleIdx, femaleIdx) => {
    const male = group.Male[maleIdx];
    const female = group.Female[femaleIdx];
    return {
      maleIdx,
      femaleIdx,
      male,
      female,
      roomId: makeRoomId(male.uid, female.uid),
    };
  });

  return mockMatchResults;
}

/**
 * Save one user's prefs, auto-fill others for demo, then run matching.
 */
export function submitMockPreference(viewerSex, viewerIdx, rankedIndices) {
  if (!mockGroupState) {
    mockGroupState = getMockGroup(viewerSex).done;
  }

  fillRemainingMockPreferences(
    mockGroupState,
    viewerSex,
    viewerIdx,
    rankedIndices
  );

  const results = runMockMatching(mockGroupState);
  const mine = results.find((r) =>
    viewerSex === "Male" ? r.maleIdx === viewerIdx : r.femaleIdx === viewerIdx
  );

  if (!mine) return null;
  return viewerSex === "Male" ? mine.female : mine.male;
}

/** Empty-state / layout spacer image */
export const PLACEHOLDER_DOG = dogImg(50, 400, 400);

/** Empty chat panel background */
export const CHAT_EMPTY_BG = dogImg(42, 800, 600);

/**
 * Mock matching group shaped like the server GET /getGroup response.
 * @param {"Male"|"Female"} viewerSex
 */
export function getMockGroup(viewerSex = "Male") {
  const Male = maleDogs.slice(0, GROUP_SIZE).map((dog, i) => ({ ...dog, idx: i }));
  const Female = femaleDogs.slice(0, GROUP_SIZE).map((dog, i) => ({ ...dog, idx: i }));

  mockGroupState = {
    id: "mock-group-1",
    Male,
    Female,
    m_pref: createEmptyPreferences(),
    f_pref: createEmptyPreferences(),
    cnt: 0,
    size: GROUP_SIZE,
  };

  return {
    done: mockGroupState,
    sex: viewerSex,
  };
}

/**
 * Mock chat matches (opposite sex, first 3).
 * @param {"Male"|"Female"} viewerSex
 */
export function getMockMatches(viewerSex = "Male") {
  if (mockMatchResults.length > 0) {
    return mockMatchResults
      .map(({ male, female, roomId }) => {
        const match = viewerSex === "Male" ? female : male;
        return {
          ...match,
          id: match.uid,
          matchId: match.uid,
          roomId,
          lastMessage: "Woof! You're matched!",
          lastMessageAt: "14:30",
        };
      })
      .slice(0, 3);
  }

  const pool = viewerSex === "Male" ? femaleDogs : maleDogs;
  return pool.slice(0, 3).map((dog, i) => ({
    ...dog,
    id: dog.uid,
    matchId: dog.uid,
    roomId: `mock-room-${i}`,
    lastMessage:
      i === 0 ? "Woof! Want to go to the park?" : "Saw your profile — cute!",
    lastMessageAt: "14:30",
  }));
}

export function getMockMessages(roomId, viewerUid, otherUid) {
  return [
    {
      message: "Hey! Love your profile pics.",
      timestamp: Date.now() - 1000 * 60 * 60,
      senderUid: otherUid,
      roomId,
    },
    {
      message: "Thanks! Want to grab a walk this weekend?",
      timestamp: Date.now() - 1000 * 60 * 30,
      senderUid: viewerUid,
      roomId,
    },
    {
      message: "Park at 3? I'll bring the tennis ball.",
      timestamp: Date.now() - 1000 * 60 * 5,
      senderUid: otherUid,
      roomId,
    },
  ];
}
