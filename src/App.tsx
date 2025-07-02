
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "./components/ui/sonner";

// Import our pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import KarmaWithBackButton from "./pages/KarmaWithBackButton";
import { GitaReading } from "./pages/GitaReading";
import SignIn from "./pages/SignIn";
import EditProfile from "./pages/EditProfile";
import Navbar from "@/components/Navbar";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <main className="container mx-auto px-4 pb-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/profile" element={
                    <AuthenticatedRoute>
                      <Profile />
                    </AuthenticatedRoute>
                  } />
                  <Route path="/edit-profile" element={
                    <AuthenticatedRoute>
                      <EditProfile />
                    </AuthenticatedRoute>
                  } />
                  <Route path="/chat" element={
                    <AuthenticatedRoute>
                      <Chat />
                    </AuthenticatedRoute>
                  } />
                  <Route path="/karma-detailed" element={
                    <AuthenticatedRoute>
                      <KarmaWithBackButton />
                    </AuthenticatedRoute>
                  } />
                  <Route path="/gita-reading" element={
                    <AuthenticatedRoute>
                      <GitaReading />
                    </AuthenticatedRoute>
                  } />
                </Routes>
              </main>
              <Navbar />
            </div>
            <Toaster 
              position="top-center"
              expand={false}
              richColors
              closeButton
            />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
