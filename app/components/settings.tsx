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

          <SettingItem
            title={Locale.Settings.Token.Title}
            subTitle={Locale.Settings.Token.SubTitle}
          >
            <PasswordInput
              value={accessStore.token}
              type="text"
              placeholder={Locale.Settings.Token.Placeholder}
              onChange={(e) => {
                accessStore.updateToken(e.currentTarget.value);
              }}
            />
          </SettingItem>

          <SettingItem
            title={Locale.Settings.Usage.Title}
            subTitle={
              showUsage
                ? loadingUsage
                  ? Locale.Settings.Usage.IsChecking
                  : Locale.Settings.Usage.SubTitle(
                      usage?.used ?? "[?]",
                      usage?.subscription ?? "[?]",
                    )
                : Locale.Settings.Usage.NoAccess
            }
          >
            {!showUsage || loadingUsage ? (
              <div />
            ) : (
              <IconButton
                icon={<ResetIcon></ResetIcon>}
                text={Locale.Settings.Usage.Check}
                onClick={checkUsage}
              />
            )}
          </SettingItem>

          <SettingItem
            title={Locale.Settings.HistoryCount.Title}
            subTitle={Locale.Settings.HistoryCount.SubTitle}
          >
            <InputRange
              title={config.historyMessageCount.toString()}
              value={config.historyMessageCount}
              min="0"
              max="25"
              step="1"
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.historyMessageCount = e.target.valueAsNumber),
                )
              }
            ></InputRange>
          </SettingItem>

          <SettingItem
            title={Locale.Settings.CompressThreshold.Title}
            subTitle={Locale.Settings.CompressThreshold.SubTitle}
          >
            <input
              type="number"
              min={500}
              max={4000}
              value={config.compressMessageLengthThreshold}
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.compressMessageLengthThreshold =
                      e.currentTarget.valueAsNumber),
                )
              }
            ></input>
          </SettingItem>
        </List>
