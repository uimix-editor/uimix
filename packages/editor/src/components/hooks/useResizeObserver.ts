import React from "react";

export function useResizeObserver(
  ref: React.RefObject<HTMLElement>
): [number, number] {
  const [size, setSize] = React.useState<[number, number]>([0, 0]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setSize([element.offsetWidth, element.offsetHeight]);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
}
