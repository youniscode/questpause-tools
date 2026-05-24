import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash.jsx";

const ToolsIndex = lazy(() => import("./pages/tools/ToolsIndex.jsx"));

const MinecraftWhitelistCommandGenerator = lazy(
  () =>
    import("./pages/tools/minecraft/MinecraftWhitelistCommandGenerator.jsx"),
);
const MinecraftServerRulesGenerator = lazy(
  () => import("./pages/tools/minecraft/MinecraftServerRulesGenerator.jsx"),
);
const MinecraftLfgPostGenerator = lazy(
  () => import("./pages/tools/minecraft/MinecraftLfgPostGenerator.jsx"),
);
const MinecraftMOTDGenerator = lazy(
  () => import("./pages/tools/minecraft/MinecraftMOTDGenerator.jsx"),
);
const MinecraftWhitelistApplicationGenerator = lazy(
  () =>
    import("./pages/tools/minecraft/MinecraftWhitelistApplicationGenerator.jsx"),
);
const MinecraftServerPropertiesGenerator = lazy(
  () =>
    import("./pages/tools/minecraft/MinecraftServerPropertiesGenerator.jsx"),
);
const MinecraftCommandGenerator = lazy(
  () => import("./pages/tools/minecraft/MinecraftCommandGenerator.jsx"),
);

const DiscordAnnouncementGenerator = lazy(
  () => import("./pages/tools/discord/DiscordAnnouncementGenerator.jsx"),
);
const DiscordRulesGenerator = lazy(
  () => import("./pages/tools/discord/DiscordRulesGenerator.jsx"),
);
const DiscordWelcomeMessageGenerator = lazy(
  () => import("./pages/tools/discord/DiscordWelcomeMessageGenerator.jsx"),
);

const ServerMaintenanceMessageGenerator = lazy(
  () =>
    import("./pages/tools/server-admin/ServerMaintenanceMessageGenerator.jsx"),
);
const ServerStatusMessageGenerator = lazy(
  () => import("./pages/tools/server-admin/ServerStatusMessageGenerator.jsx"),
);

const ProjectZomboidModListFormatter = lazy(
  () =>
    import("./pages/tools/project-zomboid/ProjectZomboidModListFormatter.jsx"),
);
const ProjectZomboidAdminMessageGenerator = lazy(
  () =>
    import("./pages/tools/project-zomboid/ProjectZomboidAdminMessageGenerator.jsx"),
);
const ProjectZomboidServerSettingsHelper = lazy(
  () =>
    import("./pages/tools/project-zomboid/ProjectZomboidServerSettingsHelper.jsx"),
);
const ProjectZomboidSafehouseRulesGenerator = lazy(
  () =>
    import("./pages/tools/project-zomboid/ProjectZomboidSafehouseRulesGenerator.jsx"),
);

const ValheimAdminCommandHelper = lazy(
  () => import("./pages/tools/valheim/ValheimAdminCommandHelper.jsx"),
);
const ValheimServerRulesGenerator = lazy(
  () => import("./pages/tools/valheim/ValheimServerRulesGenerator.jsx"),
);
const ValheimEventAnnouncementGenerator = lazy(
  () => import("./pages/tools/valheim/ValheimEventAnnouncementGenerator.jsx"),
);

const ICARUSServerRulesGenerator = lazy(
  () => import("./pages/tools/icarus/ICARUSServerRulesGenerator.jsx"),
);
const SevenDaysToDieServerRulesGenerator = lazy(
  () =>
    import("./pages/tools/7-days-to-die/SevenDaysToDieServerRulesGenerator.jsx"),
);

const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
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
          path="/tools/minecraft-command-generator"
          element={<MinecraftCommandGenerator />}
        />
        <Route
          path="/tools/discord-announcement-generator"
          element={<DiscordAnnouncementGenerator />}
        />
        <Route
          path="/tools/discord-welcome-message-generator"
          element={<DiscordWelcomeMessageGenerator />}
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
          path="/tools/valheim-event-announcement-generator"
          element={<ValheimEventAnnouncementGenerator />}
        />
        <Route
          path="/tools/project-zomboid-server-settings-helper"
          element={<ProjectZomboidServerSettingsHelper />}
        />
        <Route
          path="/tools/project-zomboid-safehouse-rules-generator"
          element={<ProjectZomboidSafehouseRulesGenerator />}
        />
        <Route
          path="/tools/icarus-server-rules-generator"
          element={<ICARUSServerRulesGenerator />}
        />
        <Route
          path="/tools/7-days-to-die-server-rules-generator"
          element={<SevenDaysToDieServerRulesGenerator />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
