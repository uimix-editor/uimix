import "material-symbols";
import { twMerge } from "tailwind-merge";

export const MaterialSymbol: React.FC<
  JSX.IntrinsicElements["span"] & {
    symbol: string;
  }
> = ({ symbol, className, ...props }) => {
  return (
    <span
      {...props}
      className={
        "material-symbols-rounded " +
        twMerge(className, "leading-none align-middle")
      }
    >
      {symbol}
    </span>
  );
};
