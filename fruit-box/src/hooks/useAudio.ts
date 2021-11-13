import { createStatefulContext } from "@frasermcc/stateful-context";

const [useAudioSettings, AudioSettingsContextProvider] = createStatefulContext({
  playAudio: localStorage.getItem("playAudio") === "true",
});

export { useAudioSettings, AudioSettingsContextProvider };
