import { observer } from "mobx-react-lite";
import { Transform, Vec2 } from "paintvec";
import {
  PointSnapping,
  SameMarginSnapping,
} from "@uimix/foundation/src/utils/Snapping";
import colors from "@uimix/foundation/src/colors";
import { XDistanceIndicator, YDistanceIndicator } from "./DistanceIndicator";
import { snapper } from "../../../state/Snapper";
import { projectState } from "../../../state/ProjectState";

const SnapLine = (props: {
  snapping: PointSnapping<"x" | "y">;
  transform: Transform;
}) => {
  const { snapping } = props;
  let p1: Vec2;
  let p2: Vec2;

  if (snapping.axis === "x") {
    const x = snapping.target.x;
    const y1 = snapping.target.y;
    const y2 = snapping.point.y;
    p1 = new Vec2(x, y1);
    p2 = new Vec2(x, y2);
  } else {
    const y = snapping.target.y;
    const x1 = snapping.target.x;
    const x2 = snapping.point.x;
    p1 = new Vec2(x1, y);
    p2 = new Vec2(x2, y);
  }

  p1 = p1.transform(props.transform);
  p2 = p2.transform(props.transform);

  return <line stroke={colors.red} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
};

const SameMarginIndicator = ({
  snapping,
  transform,
}: {
  snapping: SameMarginSnapping<"x" | "y">;
  transform: Transform;
}) => {
  return (
    <>
      {snapping.axis === "x"
        ? snapping.pairs.map(([rect1, rect2], i) => {
            const x1 = rect1.right;
            const x2 = rect2.left;
            const y = (rect1.center.y + rect2.center.y) / 2;

            return (
              <XDistanceIndicator
                key={i}
                y={y}
                x1={x1}
                x2={x2}
                transform={transform}
                color={colors.red}
              />
            );
          })
        : snapping.pairs.map(([rect1, rect2], i) => {
            const y1 = rect1.bottom;
            const y2 = rect2.top;
            const x = (rect1.center.x + rect2.center.x) / 2;

            return (
              <YDistanceIndicator
                key={i}
                x={x}
                y1={y1}
                y2={y2}
                transform={transform}
                color={colors.red}
              />
            );
          })}
    </>
  );
};

export const SnapIndicators = observer(function SnapIndicator() {
  const transform = projectState.scroll.documentToViewport;
  const snappings = snapper.snappings;

  return (
    <>
      {snappings.map((s, i) => {
        if (s.type === "point") {
          return <SnapLine snapping={s} transform={transform} key={i} />;
        }
      })}
      {snappings.map((s, i) => {
        if (s.type === "sameMargin") {
          return (
            <SameMarginIndicator snapping={s} transform={transform} key={i} />
          );
        }
      })}
    </>
  );
});
