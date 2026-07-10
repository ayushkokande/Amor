import { Link } from "react-router-dom";

export default function MatchReveal({ match, onDismiss }) {
  if (!match) return null;

  return (
    <div className="matchRevealOverlay">
      <div className="matchRevealCard">
        <p className="matchRevealEyebrow">It&apos;s a match!</p>
        <img
          src={match.images?.[0]}
          alt={`${match.f_name} ${match.l_name}`}
          className="matchRevealPhoto"
        />
        <h2>
          {match.f_name} {match.l_name}
        </h2>
        <p className="matchRevealBio">{match.bio}</p>
        <p className="matchRevealAlgo">
          Paired by Gale–Shapley stable matching — no two people would both
          prefer each other over you.
        </p>
        <div className="matchRevealActions">
          <Link to="/chat" className="btn btn-primary">
            Start chatting
          </Link>
          <button type="button" className="btn btn-secondary" onClick={onDismiss}>
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}
