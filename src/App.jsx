import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash.jsx";
import ToolsIndex from "./pages/tools/ToolsIndex.jsx";
import MinecraftWhitelistCommandGenerator from "./pages/tools/minecraft/MinecraftWhitelistCommandGenerator.jsx";
import MinecraftServerRulesGenerator from "./pages/tools/minecraft/MinecraftServerRulesGenerator.jsx";
import MinecraftLfgPostGenerator from "./pages/tools/minecraft/MinecraftLfgPostGenerator.jsx";
import MinecraftMOTDGenerator from "./pages/tools/minecraft/MinecraftMOTDGenerator.jsx";
import MinecraftWhitelistApplicationGenerator from "./pages/tools/minecraft/MinecraftWhitelistApplicationGenerator.jsx";
import MinecraftServerPropertiesGenerator from "./pages/tools/minecraft/MinecraftServerPropertiesGenerator.jsx";
import DiscordAnnouncementGenerator from "./pages/tools/discord/DiscordAnnouncementGenerator.jsx";
import DiscordRulesGenerator from "./pages/tools/discord/DiscordRulesGenerator.jsx";
import ServerMaintenanceMessageGenerator from "./pages/tools/server-admin/ServerMaintenanceMessageGenerator.jsx";
import ServerStatusMessageGenerator from "./pages/tools/server-admin/ServerStatusMessageGenerator.jsx";
import ProjectZomboidModListFormatter from "./pages/tools/project-zomboid/ProjectZomboidModListFormatter.jsx";
import ProjectZomboidAdminMessageGenerator from "./pages/tools/project-zomboid/ProjectZomboidAdminMessageGenerator.jsx";
import ValheimAdminCommandHelper from "./pages/tools/valheim/ValheimAdminCommandHelper.jsx";
import ValheimServerRulesGenerator from "./pages/tools/valheim/ValheimServerRulesGenerator.jsx";
import ProjectZomboidServerSettingsHelper from "./pages/tools/project-zomboid/ProjectZomboidServerSettingsHelper.jsx";
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy.jsx"));
const TermsOfUse = lazy(() => import("./pages/legal/TermsOfUse.jsx"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Navigate to="/tools" replace />} />
        <Route path="/tools" element={<ToolsIndex />} />
        <Route
          path="/tools/minecraft-whitelist-command-generator"
          element={<MinecraftWhitelistCommandGenerator />}
        />
        <Route
          path="/tools/minecraft-whitelist-application-generator"
          element={<MinecraftWhitelistApplicationGenerator />}
        />
        <Route
          path="/tools/discord-rules-generator"
          element={<DiscordRulesGenerator />}
        />
        <Route
          path="/tools/minecraft-server-rules-generator"
          element={<MinecraftServerRulesGenerator />}
        />
        <Route
          path="/tools/minecraft-lfg-post-generator"
          element={<MinecraftLfgPostGenerator />}
        />
        <Route
          path="/tools/minecraft-motd-generator"
          element={<MinecraftMOTDGenerator />}
        />
        <Route
          path="/tools/minecraft-server-properties-generator"
          element={<MinecraftServerPropertiesGenerator />}
        />
        <Route
          path="/tools/discord-announcement-generator"
          element={<DiscordAnnouncementGenerator />}
        />
        <Route
          path="/tools/server-maintenance-message-generator"
          element={<ServerMaintenanceMessageGenerator />}
        />
        <Route
          path="/tools/server-status-message-generator"
          element={<ServerStatusMessageGenerator />}
        />
        <Route
          path="/tools/project-zomboid-admin-message-generator"
          element={<ProjectZomboidAdminMessageGenerator />}
        />
        <Route
          path="/tools/project-zomboid-mod-list-formatter"
          element={<ProjectZomboidModListFormatter />}
        />
        <Route
          path="/tools/valheim-server-rules-generator"
          element={<ValheimServerRulesGenerator />}
        />
        <Route
          path="/tools/valheim-admin-command-helper"
          element={<ValheimAdminCommandHelper />}
        />
        <Route
          path="/tools/project-zomboid-server-settings-helper"
          element={<ProjectZomboidServerSettingsHelper />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
      </Routes>
    </Suspense>
  );
}
