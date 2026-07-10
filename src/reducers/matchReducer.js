import { GROUP_SIZE } from "../matching/config";

const emptySlots = () => Array(GROUP_SIZE).fill("");

const matchReducer = (state = { pImg: emptySlots() }, action) => {
  switch (action.type) {
    case "SET_PREF_SLOT": {
      const next = [...state.pImg];
      next[action.index] = action.img;
      return { pImg: next };
    }

    case "pDone":
      return { pImg: emptySlots() };

    default: {
      const legacy = action.type.match(/^p(\d+)$/);
      if (legacy) {
        const slot = parseInt(legacy[1], 10) - 1;
        if (slot >= 0 && slot < GROUP_SIZE) {
          const next = [...state.pImg];
          next[slot] = action.img;
          return { pImg: next };
        }
      }
      return state;
    }
  }
};

export default matchReducer;
