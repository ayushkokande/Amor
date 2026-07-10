import { v4 } from "uuid";

/** Empty preference slot — filled slots use ProfileSelect with the real image. */
export default function ({ number }) {
  return (
    <div key={v4()} className="listTemp">
      <p key={v4()}>{number}</p>
    </div>
  );
}
