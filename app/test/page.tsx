import RateLimited from "../share/[base62Id]/components/RateLimited";

const TestPage = () => {
  return <RateLimited remainingSeconds={10} />;
};

export default TestPage;
