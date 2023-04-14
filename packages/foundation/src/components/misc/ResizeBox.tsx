import React, { useId, useState } from "react";
import { Vec2, Rect, EdgeOffsets } from "paintvec";
import colors from "../../colors.js";
import { usePointerStroke } from "../hooks/usePointerStroke.js";

const handleSize = 8;
const handleHitSize = 16;
const minEdgeLength = 16;

// Prepare clip path for hit test area to make center area not consume events
// (center area should always be draggable regardless the rectangle is small)
const HitClipPath = (props: { rect: Rect }) => {
  const { rect } = props;

  const dragAreaSize = Vec2.min(
    Vec2.max(rect.size.sub(new Vec2(handleHitSize)), new Vec2(16)),
    rect.size
  );
  const dragAreaRect = Rect.from({
    topLeft: rect.center.sub(dragAreaSize.mul(0.5)),
    size: dragAreaSize,
  });
  const wholeAreaRect = rect.inset(EdgeOffsets.from(-handleHitSize / 2));

  return (
    <>
      <rect
        x={wholeAreaRect.left}
        y={wholeAreaRect.top}
        width={dragAreaRect.left - wholeAreaRect.left}
        height={wholeAreaRect.height}
        fill="red"
      />
      <rect
        x={wholeAreaRect.left}
        y={wholeAreaRect.top}
        width={wholeAreaRect.width}
        height={dragAreaRect.top - wholeAreaRect.top}
        fill="red"
      />
      <rect
        x={dragAreaRect.right}
        y={wholeAreaRect.top}
        width={dragAreaRect.left - wholeAreaRect.left}
        height={wholeAreaRect.height}
        fill="red"
      />
      <rect
        x={wholeAreaRect.left}
        y={dragAreaRect.bottom}
        width={wholeAreaRect.width}
        height={dragAreaRect.top - wholeAreaRect.top}
        fill="red"
      />
    </>
  );
};

export const ResizeBox: React.FC<{
  p0: Vec2;
  p1: Vec2;
  stroke?: string;
  snap: (p: Vec2, axes: { x?: boolean; y?: boolean }) => Vec2;
  onChangeBegin: (axes: { x?: boolean; y?: boolean }) => void;
  onChange: (p0: Vec2, p1: Vec2, axes: { x?: boolean; y?: boolean }) => void;
  onChangeEnd: () => void;
}> = (props) => {
  const clipPathID = useId();

  const rect = Rect.boundingRect([props.p0, props.p1]);

  const corners = [
    { placement: { x: 0, y: 0 }, cursor: "nwse-resize" },
    { placement: { x: 0, y: 1 }, cursor: "nesw-resize" },
    { placement: { x: 1, y: 0 }, cursor: "nesw-resize" },
    { placement: { x: 1, y: 1 }, cursor: "nwse-resize" },
  ] as const;

  const edges = [
    { axis: "x", placement: 0, cursor: "ew-resize	" },
    { axis: "x", placement: 1, cursor: "ew-resize	" },
    { axis: "y", placement: 0, cursor: "ns-resize	" },
    { axis: "y", placement: 1, cursor: "ns-resize	" },
  ] as const;

  return (
    <>
      <rect
        x={rect.left}
        y={rect.top}
        width={rect.width}
        height={rect.height}
        fill="none"
        stroke={props.stroke ?? colors.active}
      />
      <clipPath id={clipPathID}>
        <HitClipPath rect={rect} />
      </clipPath>

      {corners.map((corner, i) => (
        <ResizeCornerHandle
          p0={props.p0}
          p1={props.p1}
          snap={props.snap}
          onChangeBegin={() => props.onChangeBegin({ x: true, y: true })}
          onChange={(p0, p1) => props.onChange(p0, p1, { x: true, y: true })}
          onChangeEnd={props.onChangeEnd}
          placement={corner.placement}
          cursor={corner.cursor}
          stroke={props.stroke}
          clipPathID={clipPathID}
          key={i + edges.length}
        />
      ))}
      {edges.map((edge, i) => (
        <ResizeEdgeHandle
          p0={props.p0}
          p1={props.p1}
          snap={props.snap}
          onChangeBegin={() => props.onChangeBegin({ [edge.axis]: true })}
          onChange={(p0, p1) => props.onChange(p0, p1, { [edge.axis]: true })}
          onChangeEnd={props.onChangeEnd}
          axis={edge.axis}
          placement={edge.placement}
          cursor={edge.cursor}
          clipPathID={clipPathID}
          key={i}
        />
      ))}
    </>
  );
};

interface ResizeEdgeHandleProps {
  p0: Vec2;
  p1: Vec2;
  snap: (p: Vec2, axes: { x?: boolean; y?: boolean }) => Vec2;
  onChangeBegin: () => void;
  onChange: (p0: Vec2, p1: Vec2) => void;
  onChangeEnd: () => void;
  axis: "x" | "y";
  placement: 0 | 1;
  cursor: string;
  clipPathID: string;
}

const ResizeEdgeHandle = (props: ResizeEdgeHandleProps) => {
  let rect: Rect;

  if (props.axis === "x") {
    const x = [props.p0, props.p1][props.placement].x;

    const height = Math.max(
      Math.abs(props.p0.y - props.p1.y) - handleHitSize,
      minEdgeLength
    );
    const ycenter = (props.p0.y + props.p1.y) / 2;
    const y0 = ycenter - height / 2;
    const y1 = ycenter + height / 2;
    rect = Rect.from({
      left: x - handleHitSize / 2,
      top: y0,
      width: handleHitSize,
      height: y1 - y0,
    });
  } else {
    const y = [props.p0, props.p1][props.placement].y;

    const width = Math.max(
      Math.abs(props.p0.x - props.p1.x) - handleHitSize,
      minEdgeLength
    );
    const xcenter = (props.p0.x + props.p1.x) / 2;
    const x0 = xcenter - width / 2;
    const x1 = xcenter + width / 2;

    rect = Rect.from({
      left: x0,
      top: y - handleHitSize / 2,
      width: x1 - x0,
      height: handleHitSize,
    });
  }

  const [state] = useState(() => ({
    dragStartMousePos: new Vec2(0),
    dragStartPoints: [new Vec2(0), new Vec2(0)],
  }));

  const pointerProps = usePointerStroke({
    onBegin: (e: React.PointerEvent) => {
      state.dragStartMousePos = new Vec2(e.clientX, e.clientY);
      state.dragStartPoints = [props.p0, props.p1];
      props.onChangeBegin();
    },
    onMove: (e: React.PointerEvent) => {
      const mousePos = new Vec2(e.clientX, e.clientY);
      const offset = mousePos.sub(state.dragStartMousePos);

      // TODO: snapping

      const points = state.dragStartPoints.map((p) => new Vec2(p.x, p.y));
      points[props.placement][props.axis] += offset[props.axis];
      points[props.placement] = props.snap(points[props.placement], {
        [props.axis]: true,
      });
      props.onChange(points[0], points[1]);
    },
    onEnd: () => {
      props.onChangeEnd();
    },
  });

  return (
    <rect
      x={rect.left}
      y={rect.top}
      width={rect.width}
      height={rect.height}
      clipPath={`url(#${props.clipPathID})`}
      fill="transparent"
      cursor={props.cursor}
      pointerEvents="all"
      {...pointerProps}
    />
  );
};

interface ResizeCornerHandleProps {
  p0: Vec2;
  p1: Vec2;
  snap: (p: Vec2, axes: { x?: boolean; y?: boolean }) => Vec2;
  onChangeBegin: () => void;
  onChange: (p0: Vec2, p1: Vec2) => void;
  onChangeEnd: () => void;
  placement: { x: 0 | 1; y: 0 | 1 };
  cursor: string;
  clipPathID: string;
  stroke?: string;
}

const ResizeCornerHandle = (props: ResizeCornerHandleProps) => {
  const [state] = useState(() => ({
    dragStartMousePos: new Vec2(0),
    dragStartPoints: [new Vec2(0), new Vec2(0)],
  }));

  const { p0, p1, placement: corner } = props;
  const x = [p0.x, p1.x][corner.x];
  const y = [p0.y, p1.y][corner.y];

  const pointerProps = usePointerStroke({
    onBegin: (e: React.PointerEvent<SVGElement>) => {
      state.dragStartMousePos = new Vec2(e.clientX, e.clientY);
      state.dragStartPoints = [props.p0, props.p1];
      props.onChangeBegin();
    },
    onMove: (e: React.PointerEvent<SVGElement>) => {
      const mousePos = new Vec2(e.clientX, e.clientY);
      const offset = mousePos.sub(state.dragStartMousePos);

      const [p0, p1] = state.dragStartPoints;
      const { placement } = props;
      const xs = [p0.x, p1.x];
      const ys = [p0.y, p1.y];
      const pos = new Vec2(xs[placement.x], ys[placement.y]).add(offset);
      const snapped = props.snap(pos, { x: true, y: true });
      xs[placement.x] = snapped.x;
      ys[placement.y] = snapped.y;

      props.onChange(new Vec2(xs[0], ys[0]), new Vec2(xs[1], ys[1]));
    },
    onEnd: () => {
      props.onChangeEnd();
    },
  });

  return (
    <>
      <ellipse
        cx={x}
        cy={y}
        rx={handleSize / 2}
        ry={handleSize / 2}
        stroke={props.stroke ?? colors.active}
        fill="white"
      />
      <rect
        x={x - handleHitSize / 2}
        y={y - handleHitSize / 2}
        width={handleHitSize}
        height={handleHitSize}
        clipPath={`url(#${props.clipPathID})`}
        fill="transparent"
        cursor={props.cursor}
        pointerEvents="all"
        {...pointerProps}
      />
    </>
  );
};
