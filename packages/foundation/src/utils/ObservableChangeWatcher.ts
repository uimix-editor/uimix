/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  intercept,
  isObservableProp,
  IValueDidChange,
  IValueWillChange,
  observe,
} from "mobx";

export class ObservableChangeWatcher<T extends object> {
  constructor(
    target: T,
    onWillChange: (key: keyof T, change: IValueWillChange<any>) => void,
    onDidChange: (key: keyof T, change: IValueDidChange<any>) => void
  ) {
    for (const key in target) {
      if (isObservableProp(target, key)) {
        intercept(target, key, (change) => {
          onWillChange(key, change);
          return change;
        });
        observe(target, key, (change) => {
          onDidChange(key, change);
        });
      }
    }
  }
}
