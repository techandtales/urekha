import { getAISettings } from "./actions";
import AISettingsClient from "./ai-settings-client";

export default async function AdminAISettingsPage() {
  const { data: settingsData } = await getAISettings();
  const settings = settingsData || {
    id: 1,
    gemini_api_keys: [],
    gemini_models: [],
    openai_api_keys: [],
    openai_models: []
  };

  return <AISettingsClient initialSettings={settings} />;
}
