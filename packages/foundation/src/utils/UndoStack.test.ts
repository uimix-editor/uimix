import { describe, it, expect, beforeEach } from "vitest";
import { UndoStack, UndoCommand } from "./UndoStack";

class ExampleCommand implements UndoCommand {
  static undoneCommand = "";
  static redoneCommand = "";

  constructor(title: string, canMerge = false) {
    this.title = title;
    this.canMerge = canMerge;
  }

  readonly title: string;
  readonly canMerge: boolean;

  undo() {
    ExampleCommand.undoneCommand = this.title;
  }
  redo() {
    ExampleCommand.redoneCommand = this.title;
  }
  merge(other: UndoCommand): UndoCommand | undefined {
    if (other instanceof ExampleCommand && this.canMerge) {
      return new ExampleCommand(other.title, true);
    }
  }
}

describe(UndoStack.name, () => {
  let undoStack: UndoStack;
  beforeEach(() => {
    undoStack = new UndoStack();
  });

  describe("#commandToUndo", () => {
    it("returns command to be undone", () => {
      undoStack.push(new ExampleCommand("foo"));
      undoStack.push(new ExampleCommand("bar"));
      expect(undoStack.commandToUndo?.title).toEqual("bar");
      undoStack.undo();
      undoStack.undo();
      expect(undoStack.commandToUndo).toEqual(undefined);
    });
  });

  describe("#commandToRedo", () => {
    it("returns command to be redone", () => {
      expect(undoStack.commandToRedo).toEqual(undefined);
      undoStack.push(new ExampleCommand("foo"));
      undoStack.push(new ExampleCommand("bar"));
      expect(undoStack.commandToRedo).toEqual(undefined);
      undoStack.undo();
      undoStack.undo();
      expect(undoStack.commandToRedo?.title).toEqual("foo");
      undoStack.push(new ExampleCommand("hoge"));
      expect(undoStack.commandToRedo).toEqual(undefined);
    });
  });

  describe("#canUndo", () => {
    it("returns if the stack can undo", () => {
      undoStack.push(new ExampleCommand("foo"));
      undoStack.push(new ExampleCommand("bar"));
      expect(undoStack.canUndo).toEqual(true);
      undoStack.undo();
      undoStack.undo();
      expect(undoStack.canUndo).toEqual(false);
    });
  });

  describe("#canRedo", () => {
    it("returns if the stack can redo", () => {
      expect(undoStack.canRedo).toEqual(false);
      undoStack.push(new ExampleCommand("foo"));
      undoStack.push(new ExampleCommand("bar"));
      expect(undoStack.canRedo).toEqual(false);
      undoStack.undo();
      undoStack.undo();
      expect(undoStack.canRedo).toEqual(true);
      undoStack.push(new ExampleCommand("hoge"));
      expect(undoStack.canRedo).toEqual(false);
    });
  });

  describe("#undo", () => {
    it("undos last command", () => {
      undoStack.push(new ExampleCommand("foo"));
      undoStack.push(new ExampleCommand("bar"));
      undoStack.undo();
      expect(ExampleCommand.undoneCommand).toEqual("bar");
      undoStack.undo();
      expect(ExampleCommand.undoneCommand).toEqual("foo");
      undoStack.redo();
      undoStack.redo();
      undoStack.undo();
      undoStack.redo();
      expect(ExampleCommand.undoneCommand).toEqual("bar");
    });
  });

  describe("#redo", () => {
    it("redos last undone command", () => {
      undoStack.push(new ExampleCommand("foo"));
      undoStack.push(new ExampleCommand("bar"));
      undoStack.undo();
      undoStack.undo();
      undoStack.redo();
      expect(ExampleCommand.redoneCommand).toEqual("foo");
      undoStack.redo();
      expect(ExampleCommand.redoneCommand).toEqual("bar");
      undoStack.push(new ExampleCommand("hoge"));
      undoStack.undo();
      undoStack.redo();
      expect(ExampleCommand.redoneCommand).toEqual("hoge");
    });
  });

  describe("#push", () => {
    it("merges mergable commands", () => {
      undoStack.push(new ExampleCommand("foo", true));
      undoStack.push(new ExampleCommand("bar"));
      expect(undoStack.commands.length).toEqual(1);
      undoStack.undo();
      expect(ExampleCommand.undoneCommand).toEqual("bar");
      undoStack.redo();
      expect(ExampleCommand.redoneCommand).toEqual("bar");
    });
  });
});
