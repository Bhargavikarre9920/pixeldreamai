import { Fragment } from "react";
import { SV } from "../data/content.js";

export default function Marquee() {
  return (
    <div className="mq" aria-hidden="true">
      <div className="mt">
        {[0, 1].map((k) =>
          SV.map((s) => (
            <Fragment key={`${k}-${s.n}`}>
              <span>{s.n}</span>
              <i>✦</i>
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
