import React, { useState } from 'react';
import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';
import Home from './Home';
import CaptionStylesGenerator from '../components/CaptionStylesGenerator';
import Videos from './Videos';
import GeneratedVideo from './GeneratedVideo';
import Settings from './Settings';
import Schedule from './Schedule';
import ReferralProgram from './ReferralProgram';
import ExplorePage from './ExplorePage';
import SupportPage from './SupportPage';
import ChannelNichesPage from '../components/ChannelNichesPage';
import ScriptsPage from './ScriptsPage';
import SubscriptionAndCredits from './SubscriptionAndCredits';
import AddCredits from '../components/AddCredits';
import Subscription from './Subscription';
import Editor from './Editor';
import Generate from './Generate';
import HelpAndSupport from './HelpAndSupport'; // Import the new component
import ContentStudio from './ContentStudio';
import { useColorModeValue } from '@chakra-ui/react';

function Dashboard() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const bgColor = useColorModeValue('gray.50', '#121212');

  return (
    <Flex flexDirection="column" height="100vh">
      <Flex flex={1} overflow="hidden">
        {!isMobile && <Sidebar />}
        <Box flex={1} display="flex" flexDirection="column" bg={bgColor}>
          <Box flex={1} p={4} overflowY="auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="page2" element={<h1>Analytics</h1>} />
              <Route path="caption-styles" element={<CaptionStylesGenerator />} />
              <Route path="videos" element={<Videos />} />
              <Route path="generated-video/:videoId" element={<GeneratedVideo />} />
              <Route path="settings" element={<Settings />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="referral" element={<ReferralProgram />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="channel-niches" element={<ChannelNichesPage />} />
              <Route path="scripts" element={<ScriptsPage />} />
              <Route path="subscription-and-credits" element={<SubscriptionAndCredits />} />
              <Route path="content-studio" element={<ContentStudio />} />
              <Route path="add-credits" element={<AddCredits />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="editor" element={<Editor />} />
              <Route path="generate" element={<Generate />} />
              <Route path="help-and-support" element={<HelpAndSupport />} /> {/* New route */}
            </Routes>
          </Box>
        </Box>
      </Flex>
      {isMobile && <BottomTabBar />}
    </Flex>
  );
}

export default Dashboard;
