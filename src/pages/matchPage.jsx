import "./matchStyles.css";
import MatchSec from "../components/matchComp/matchSection";
import Navbar from "../components/matchComp/navbar";
import ProfileModal from "../components/matchComp/profileModal";
import MatchProgress from "../components/matchComp/MatchProgress";
import MatchReveal from "../components/matchComp/MatchReveal";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import store from "../store/store";
import {
  USE_MOCK_DATA,
  getMockGroup,
  getMockGroupState,
} from "../data/mockDogs";
import { GROUP_SIZE, TOTAL_GROUP } from "../matching/config";
import { fetchGroup, fetchGroupStatus } from "../api/groups";

function applyGroupResponse(res, uid, setProfile, setGroup, setOg, setSubmissionCount) {
  store.dispatch({ type: "groupMatch", group: res.done });
  setSubmissionCount(res.submissionCount ?? res.done?.cnt ?? 0);

  if (!res.done || (Array.isArray(res.done) && res.done.length === 0)) {
    setGroup([]);
    return;
  }

  const opposite = res.sex === "Male" ? res.done.Female : res.done.Male;
  const same = res.sex === "Male" ? res.done.Male : res.done.Female;

  setProfile(opposite[0]);
  setGroup(opposite.map((p, i) => ({ ...p, idx: i })));

  let foundIdx = 0;
  for (let i = 0; i < GROUP_SIZE; i++) {
    if (same[i]?.uid === uid) {
      foundIdx = i;
      break;
    }
  }
  setOg({ idx: foundIdx, sex: res.sex });
}

export default function MatchPage() {
  const uid = useSelector((state) => state.user.id);
  const userData = useSelector((state) => state.user.data);
  const fullGroup = useSelector((state) => state.group.group);

  const [idx, setIdx] = useState(0);
  const [group, setGroup] = useState(null);
  const [profile, setProfile] = useState(null);
  const [pref, setPref] = useState([]);
  const [og, setOg] = useState(null);
  const [getdata, setGetData] = useState(1);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [revealedMatch, setRevealedMatch] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const loadGroup = () => {
    const viewerSex = userData?.sex || "Male";

    if (USE_MOCK_DATA) {
      const mockRes = getMockGroup(viewerSex);
      applyGroupResponse(
        {
          done: mockRes.done,
          sex: mockRes.sex,
          submissionCount: getMockGroupState()?.cnt ?? 0,
        },
        uid,
        setProfile,
        setGroup,
        setOg,
        setSubmissionCount
      );
      return;
    }

    fetchGroup(uid)
      .then((res) => {
        applyGroupResponse(
          res.data,
          uid,
          setProfile,
          setGroup,
          setOg,
          setSubmissionCount
        );
      })
      .catch(() => {
        const mockRes = getMockGroup(viewerSex);
        applyGroupResponse(
          {
            done: mockRes.done,
            sex: mockRes.sex,
            submissionCount: 0,
          },
          uid,
          setProfile,
          setGroup,
          setOg,
          setSubmissionCount
        );
      });
  };

  useEffect(() => {
    loadGroup();
  }, [getdata, uid, userData]);

  useEffect(() => {
    if (group !== null && group[idx] !== undefined) setProfile(group[idx]);
    else if (group !== null && idx !== 0) {
      setProfile(group[idx - 1]);
      setIdx(idx - 1);
    }
  }, [group, idx]);

  useEffect(() => {
    if (!fullGroup?.id || USE_MOCK_DATA) return undefined;

    const poll = () => {
      fetchGroupStatus(fullGroup.id, uid)
        .then((res) => setSubmissionCount(res.data.submissionCount ?? 0))
        .catch(() => {});
    };

    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, [fullGroup?.id, uid, getdata]);

  const handleMatchComplete = (matchProfile) => {
    setSubmitted(true);
    if (matchProfile) setRevealedMatch(matchProfile);
    if (USE_MOCK_DATA) {
      setSubmissionCount(TOTAL_GROUP);
    }
  };

  return (
    <div
      className="MatchContainer"
      style={{ backgroundImage: `url(/images/halftone.png)` }}
    >
      {USE_MOCK_DATA && (
        <div className="demoBanner">Demo mode — matching uses mock dog profiles</div>
      )}

      <ProfileModal profile={profile} user={group ? group[idx] : null} />
      <Navbar />
      <h3 className="matchHeading">Mark your preferences!</h3>

      {fullGroup?.id && !Array.isArray(fullGroup) && (
        <MatchProgress submitted={submissionCount} total={TOTAL_GROUP} />
      )}

      {submitted && submissionCount < TOTAL_GROUP && !USE_MOCK_DATA && (
        <p className="matchWaitingMsg">
          Preferences saved. Waiting for the rest of your group to submit…
        </p>
      )}

      <MatchSec
        profile={profile}
        setProfile={setProfile}
        idx={idx}
        setIdx={setIdx}
        group={group}
        setGroup={setGroup}
        pref={pref}
        setPref={setPref}
        setGetData={setGetData}
        og={og}
        onMatchComplete={handleMatchComplete}
      />

      {revealedMatch && (
        <MatchReveal
          match={revealedMatch}
          onDismiss={() => setRevealedMatch(null)}
        />
      )}
    </div>
  );
}
