import React, { useEffect } from "react";
import { ControlledSettings } from "../../common/ControlledSettings";
import { useIO } from "../../hooks/useIO";
import useLobby from "../../hooks/useLobby";

interface Props {
  readonly: boolean;
}

const OwnerSettings: React.FC<Props> = ({ readonly }) => {
  const { settings, setLobbyContext } = useLobby();
  const io = useIO();

  useEffect(() => {
    io?.on("settingsUpdate", ({ settings }) => {
      setLobbyContext((old) => ({ ...old, settings }));
    });

    return () => {
      io?.removeAllListeners("settingsUpdate");
    };
  }, [io, setLobbyContext]);

  const updateSettings = (settings: ControlledSettings) => {
    io?.emit("requestSettingsUpdate", { settings });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-center items-center gap-x-4">
        <div>Duration:</div>
        <input
          className="form-input dark:bg-dark-600 w-20 dark:read-only:text-gray-500"
          readOnly={readonly}
          type="number"
          max={180}
          onChange={(e) => {
            updateSettings({
              ...settings,
              gameDuration: parseInt(e.target.value),
            });
            setLobbyContext((old) => ({
              ...old,
              settings: {
                ...old.settings,
                gameDuration: parseInt(e.target.value),
              },
            }));
          }}
          value={settings.gameDuration}
        />
      </div>
      <div className="flex justify-center items-center gap-x-4">
        <div>Regenerate apples every (seconds):</div>
        <input
          className="form-input dark:bg-dark-600 w-20 dark:read-only:text-gray-500"
          readOnly={readonly}
          type="number"
          max={180}
          onChange={(e) => {
            updateSettings({
              ...settings,
              regenerationTime: parseInt(e.target.value),
            });
            setLobbyContext((old) => ({
              ...old,
              settings: {
                ...old.settings,
                regenerationTime: parseInt(e.target.value),
              },
            }));
          }}
          value={settings.regenerationTime}
        />
      </div>
    </div>
  );
};

export default OwnerSettings;
