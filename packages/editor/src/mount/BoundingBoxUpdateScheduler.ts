import { action, makeObservable } from "mobx";
import { VariantMount } from "./VariantMount";

export class BoundingBoxUpdateScheduler {
  constructor() {
    makeObservable(this);
  }

  schedule(mount: VariantMount): void {
    this.mounts.add(mount);

    if (!this.scheduled) {
      this.scheduled = true;
      queueMicrotask(() => this.updateAll());
    }
  }

  @action private updateAll(): void {
    for (const mount of this.mounts) {
      mount.updateBoundingBox();
    }
    this.mounts.clear();
    this.scheduled = false;
  }

  private readonly mounts = new Set<VariantMount>();
  private scheduled = false;
}
