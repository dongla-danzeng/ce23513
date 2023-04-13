import { useState, useEffect, useMemo, HTMLProps } from "react";

import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";

import styles from "./settings.module.scss";

import ResetIcon from "../icons/reload.svg";
import CloseIcon from "../icons/close.svg";
import ClearIcon from "../icons/clear.svg";
import EditIcon from "../icons/edit.svg";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";

import { List, ListItem, Popover, showToast } from "./ui-lib";

import { IconButton } from "./button";
import {
  SubmitKey,
  useChatStore,
  Theme,
  ALL_MODELS,
  useUpdateStore,
  useAccessStore,
  ModalConfigValidator,
} from "../store";
import { Avatar } from "./chat";

import Locale, { AllLangs, changeLang, getLang } from "../locales";
import { getEmojiUrl } from "../utils";
import Link from "next/link";
import { UPDATE_URL } from "../constant";
import { SearchService, usePromptStore } from "../store/prompt";
import { requestUsage } from "../requests";
import { ErrorBoundary } from "./error";
import { InputRange } from "./input-range";

function SettingItem(props: {
  title: string;
  subTitle?: string;
  children: JSX.Element;
}) {
  return (
    <ListItem>
      <div className={styles["settings-title"]}>
        <div>{props.title}</div>
        {props.subTitle && (
          <div className={styles["settings-sub-title"]}>{props.subTitle}</div>
        )}
      </div>
      {props.children}
    </ListItem>
  );
}

function PasswordInput(props: HTMLProps<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  function changeVisibility() {
    setVisible(!visible);
  }

  return (
    <div className={styles["password-input-container"]}>
      <IconButton
        icon={visible ? <EyeIcon /> : <EyeOffIcon />}
        onClick={changeVisibility}
        className={styles["password-eye"]}
      />
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={styles["password-input"]}
      />
    </div>
  );
}

export function Settings(props: { closeSettings: () => void }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [config, updateConfig, resetConfig, clearAllData, clearSessions] =
    useChatStore((state) => [
      state.config,
      state.updateConfig,
      state.resetConfig,
      state.clearAllData,
      state.clearSessions,
    ]);

  const updateStore = useUpdateStore();
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const currentVersion = updateStore.version;
  const remoteId = updateStore.remoteVersion;
  const hasNewVersion = currentVersion !== remoteId;

  function checkUpdate(force = false) {
    setCheckingUpdate(true);
    updateStore.getLatestVersion(force).then(() => {
      setCheckingUpdate(false);
    });
  }

  const [usage, setUsage] = useState<{
    used?: number;
    subscription?: number;
  }>();
  const [loadingUsage, setLoadingUsage] = useState(false);
  function checkUsage() {
    setLoadingUsage(true);
    requestUsage()
      .then((res) => setUsage(res))
      .finally(() => {
        setLoadingUsage(false);
      });
  }

  const accessStore = useAccessStore();
  const enabledAccessControl = useMemo(
    () => accessStore.enabledAccessControl(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const promptStore = usePromptStore();
  const builtinCount = SearchService.count.builtin;
  const customCount = promptStore.prompts.size ?? 0;

  const showUsage = accessStore.isAuthorized();
  useEffect(() => {
    checkUpdate();
    showUsage && checkUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.closeSettings();
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div className={styles["window-header-main-title"]}>
            {Locale.Settings.Title}
          </div>
          <div className={styles["window-header-sub-title"]}>
            {Locale.Settings.SubTitle}
          </div>
        </div>
        <div className={styles["window-actions"]}>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<ClearIcon />}
              onClick={() => {
                const confirmed = window.confirm(
                  `${Locale.Settings.Actions.ConfirmClearAll.Confirm}`,
                );
                if (confirmed) {
                  clearSessions();
                }
              }}
              bordered
              title={Locale.Settings.Actions.ClearAll}
            />
          </div>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<ResetIcon />}
              onClick={() => {
                const confirmed = window.confirm(
                  `${Locale.Settings.Actions.ConfirmResetAll.Confirm}`,
                );
                if (confirmed) {
                  resetConfig();
                }
              }}
              bordered
              title={Locale.Settings.Actions.ResetAll}
            />
          </div>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<CloseIcon />}
              onClick={props.closeSettings}
              bordered
              title={Locale.Settings.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["settings"]}>


        <List>
          {enabledAccessControl ? (
            <SettingItem
              title={Locale.Settings.AccessCode.Title}
              subTitle={Locale.Settings.AccessCode.SubTitle}
            >
              <PasswordInput
                value={accessStore.accessCode}
                type="text"
                placeholder={Locale.Settings.AccessCode.Placeholder}
                onChange={(e) => {
                  accessStore.updateCode(e.currentTarget.value);
                }}
              />
            </SettingItem>
          ) : (
            <></>
          )}


        </List>

        
      </div>
    </ErrorBoundary>
  );
}
