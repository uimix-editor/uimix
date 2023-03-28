import { observable, computed, makeObservable } from "mobx";
import { Vec2, Transform, Rect } from "paintvec";
import { snapThreshold } from "../views/viewport/constants";

export class ScrollState {
  constructor() {
    makeObservable(this);
  }

  @observable private _translation = new Vec2();
  @observable private _scale = 1;

  get translation(): Vec2 {
    return this._translation;
  }

  get scale(): number {
    return this._scale;
  }

  setTranslation(translation: Vec2): void {
    this._translation = translation.round;
  }

  setScale(scale: number): void {
    // Round to 1/1024 to minimize floating point error
    this._scale = Math.round(scale * 1024) / 1024;
  }

  // Set by Viewport
  @observable viewportDOMClientRect = Rect.from({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  @computed get viewportSize(): Vec2 {
    return this.viewportDOMClientRect.size;
  }

  @computed get viewportRect(): Rect {
    return new Rect(new Vec2(), this.viewportSize);
  }

  @computed get viewportRectInDocument(): Rect {
    return this.viewportRect.transform(this.viewportToDocument);
  }

  @computed get viewportToDocument(): Transform {
    return Transform.translate(this.translation.neg).scale(
      new Vec2(1 / this.scale)
    );
  }
  @computed get documentToViewport(): Transform {
    return Transform.scale(new Vec2(this.scale)).translate(this.translation);
  }

  zoomAround(viewportPos: Vec2, scale: number): void {
    const ratio = scale / this.scale;
    this.setScale(scale);

    this.setTranslation(
      this.translation.sub(viewportPos).mulScalar(ratio).add(viewportPos).round
    );
  }

  zoomAroundCenter(scale: number): void {
    this.zoomAround(this.viewportSize.mulScalar(0.5), scale);
  }

  zoomIn(): void {
    this.stepZoom(1);
  }

  zoomOut(): void {
    this.stepZoom(-1);
  }

  zoomToFit(rectInDocument: Rect): void {
    const margin = 20;

    const size = Math.max(rectInDocument.width, rectInDocument.height);
    const square = Rect.from({
      topLeft: rectInDocument.center.sub(new Vec2(size / 2)),
      size: new Vec2(size),
    });

    this.setScale(
      Math.max(
        Math.min(
          (this.viewportSize.x - margin * 2) / square.width,
          (this.viewportSize.y - margin * 2) / square.height
        ),
        0.01
      )
    );
    this.setTranslation(
      square.topLeft.neg.mulScalar(this.scale).add(new Vec2(margin))
    );
  }

  resetZoom(): void {
    this.zoomAroundCenter(1);
  }

  stepZoom(step: number): void {
    const log2 = Math.log2(this.scale);
    const nextLog2 = Math.round(log2 * 2) * 0.5 + 0.5 * step;
    const nextScale = Math.pow(2, nextLog2);

    this.zoomAroundCenter(nextScale);
  }

  revealRect(rectInDocument: Rect): void {
    const margin = 48;
    const rect = rectInDocument
      .transform(this.documentToViewport)
      .inflate(margin);

    if (
      this.viewportRect.includes(rect.topLeft) &&
      this.viewportRect.includes(rect.bottomRight)
    ) {
      return;
    }

    this.setTranslation(
      this.translation.sub(rect.center).add(this.viewportSize.mulScalar(0.5))
    );
  }

  documentPosForClientPos(clientPos: Vec2): Vec2 {
    return clientPos
      .sub(this.viewportDOMClientRect.topLeft)
      .transform(this.viewportToDocument).round;
  }

  get snapThreshold(): number {
    return snapThreshold / this.scale;
  }
}

export const scrollState = new ScrollState();
