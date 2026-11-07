import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteShell } from './components/SiteShell';
import { siteBase } from './siteBase';

const HomePage = lazy(() => import('./pages/HomePage'));
const WorkshopPage = lazy(() => import('./pages/WorkshopPage'));
const CreationsPage = lazy(() => import('./pages/CreationsPage'));
const CreationDetailPage = lazy(() => import('./pages/CreationDetailPage'));
const MakePage = lazy(() => import('./pages/MakePage'));
const ScrapbookPage = lazy(() => import('./pages/ScrapbookPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const basename = siteBase === '/'
  ? undefined
  : siteBase.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Suspense fallback={<div className="route-loading">Just moving a few things around...</div>}>
        <Routes>
          <Route element={<SiteShell />}>
            <Route index element={<HomePage />} />
            <Route path="workshop" element={<WorkshopPage />} />
            <Route path="creations" element={<CreationsPage />} />
            <Route path="creations/:slug" element={<CreationDetailPage />} />
            <Route path="make" element={<MakePage />} />
            <Route path="scrapbook" element={<ScrapbookPage />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}