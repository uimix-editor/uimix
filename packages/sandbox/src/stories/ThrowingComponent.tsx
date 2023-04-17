export const ThrowingComponent: React.FC = () => {
  throw new Error("This is an error");
  return <div>ThrowingComponent</div>;
};
