// import Onboarding from '../components/Onboarding';
// import TermsAndConditions from '../components/TermsAndConditions';
// import ExpandableText from '../components/ExpandableText';
// import SearchBox from '../components/SearchBox';

import { Toaster } from 'react-hot-toast';
import ToastDemo from '../components/ToastDemo';

const PlaygroundPage = () => {
  return (
    <>
      <ToastDemo />
      <Toaster />
    </>
  );
};

// const PlaygroundPage = () => {
//   return <SearchBox onChange={(text) => console.log(text)} />;
// };

// const PlaygroundPage = () => {
//   return <ExpandableText text="Hello" />;
// };

export default PlaygroundPage;
