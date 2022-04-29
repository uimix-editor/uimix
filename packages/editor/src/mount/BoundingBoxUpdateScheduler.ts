import { action, makeObservable } from "mobx";
import { ElementMount } from "./ElementMount";

export class BoundingBoxUpdateScheduler {
  constructor() {
    makeObservable(this);
  }

  schedule(elementMount: ElementMount): void {
    this.mounts.add(elementMount);

    if (!this.scheduled) {
      this.scheduled = true;
      setTimeout(() => this.updateAll(), 0);
    }
  }

  @action private updateAll(): void {
    for (const mount of this.mounts) {
      mount.updateBoundingBox();
    }
    this.mounts.clear();
    this.scheduled = false;
  }

  private readonly mounts = new Set<ElementMount>();
  private scheduled = false;
}
