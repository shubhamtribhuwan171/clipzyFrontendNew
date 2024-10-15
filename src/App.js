import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Dashboard from './Dashboardpages/Dashboard';
import { PaletteProvider } from './context/PaletteContext';
import Schedule from './Dashboardpages/Schedule';
import VideoCreationFlow from './components/VideoCreationFlow';
import GeneratedVideo from './Dashboardpages/GeneratedVideo';
import SupportPage from './Dashboardpages/SupportPage';
import { VideoProvider } from './context/VideoContext';
import Onboarding from './components/Onboarding';
import Contact from './pages/Contact';
import Affiliate from './pages/Affiliate';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import FAQ from './Dashboardpages/FAQ';
import AboutUs from './pages/AboutUs';
import ScrollToTop from './components/ScrollToTop';
import SubscriptionAndCredits from './Dashboardpages/SubscriptionAndCredits';
import BlogDetail from './pages/BlogDetail';
import Editor from './Dashboardpages/Editor';
import RedditStory from './Dashboardpages/RedditStory';
import FakeChatVideo from './Dashboardpages/FakeChatVideo';
import Quiz from './Dashboardpages/Quiz/Quiz';
import SplitScreen from './Dashboardpages/SplitScreen/SplitScreen';
import HomePage from './Dashboardpages/HomePage';
import WouldYouRather from './Dashboardpages/WYR/WouldYouRather';
import WouldYouRatherPy from './pages/WouldYouRatherPy.py'
import Timeline from './Dashboardpages/Timeline';
import BlogsInsights from './pages/BlogsInsights';
import AIVideoCreator from './Dashboardpages/AIVideoCreator';
import GenerateScripts from './Dashboardpages/GenerateScripts';
import GenerateVoiceovers from './Dashboardpages/GenerateVoiceovers';
import GenerateImages from './Dashboardpages/GenerateImages';
import GuessTheEmojiGenerator from './Dashboardpages/GuessTheEmoji/GuessTheEmojiGenerator';


export const UserContext = createContext();

function VideoCreationWrapper() {
  const navigate = useNavigate();

  const handleVideoGenerated = (videoId) => {
    navigate(`/generated-video/${videoId}`);
  };

  return <VideoCreationFlow onVideoGenerated={handleVideoGenerated} />;
}

function GeneratedVideoWrapper() {
  const { id } = useParams();
  return <GeneratedVideo videoId={id} />;
}

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get(
        'https://api.clipzy.ai/current',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      setUserInfo(response.data);
      localStorage.setItem('userId', response.data.userId.toString());
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, fetchUserInfo }}>
      <ChakraProvider theme={theme}>
        <PaletteProvider>
          <VideoProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/create-video" element={<VideoCreationWrapper />} />
                <Route path="/dashboard/generated-video/:videoId" element={<GeneratedVideo />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/blog" element={<BlogsInsights />} />
                <Route path="/blogDetails/:id" element={<BlogDetail />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/dashboard/support" element={<SupportPage />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/subscription-and-credits" element={<SubscriptionAndCredits />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/dashboard/editor" element={<Editor />} />
                <Route path="/reddit-story" element={<RedditStory />} />
                <Route path="/fake-chat-video" element={<FakeChatVideo />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/would-you-rather" element={<WouldYouRather />} />
                <Route path='/wyrpy' element={<WouldYouRatherPy />} />
                <Route path="/split-screen" element={<SplitScreen />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/timeline/:videoId" element={<Timeline />} />
                <Route path="/ai-video" element={<AIVideoCreator />} />
                <Route path="/ai-video-creation" element={<VideoCreationFlow />} />  
                <Route path="/generate-scripts" element={<GenerateScripts />} />
                <Route path="/generate-voiceovers" element={<GenerateVoiceovers />} />
                <Route path="/generate-images" element={<GenerateImages />} />
                <Route path="/guess-the-emoji" element={<GuessTheEmojiGenerator />} />



              </Routes>
            </Router>
          </VideoProvider>
        </PaletteProvider>
      </ChakraProvider>
    </UserContext.Provider>
  );
}

export default App;
