import { TOTAL_GROUP } from "../../matching/config";

export default function MatchProgress({ submitted = 0, total = TOTAL_GROUP }) {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return (
    <div className="matchProgress">
      <div className="matchProgressLabel">
        Group submissions: {submitted}/{total}
      </div>
      <div className="matchProgressTrack">
        <div className="matchProgressFill" style={{ width: `${pct}%` }} />
      </div>
      {submitted < total && (
        <p className="matchProgressHint">
          Waiting for everyone to rank their preferences before matching runs.
        </p>
      )}
    </div>
  );
}
