import WelcomeComponent from "./components/WelcomeComponent"
export const metadata = {
  title: 'Patient Portal - MedSched',
  description: 'Patient portal for managing appointments and viewing medical history',
  keywords: 'healthcare, appointments, medical history, patient portal',
  author: 'MedSched',  
}
const HomePage = () => {
  return (
    <WelcomeComponent />
  );
};

export default HomePage;
