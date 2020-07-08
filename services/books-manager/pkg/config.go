package pkg

import (
	"fmt"
	"github.com/markbates/pkger"
	"go.uber.org/config"
	"os"
)

func Populate(target interface{}) error {
	cfgDir, err := pkger.Open("/configs")
	if err != nil {
		return fmt.Errorf("failed to open configs folder; %w", err)
	}
	//noinspection GoUnhandledErrorResult
	defer cfgDir.Close()

	appCfg, err := cfgDir.Open("/application.yaml")
	if err != nil {
		return fmt.Errorf("failed to open application.yaml; %w", err)
	}

	yamlConfig, err := config.NewYAML(config.Source(appCfg), config.Expand(os.LookupEnv))
	if err != nil {
		return fmt.Errorf("failed to parse application.yaml; %w", err)
	}

	if err := yamlConfig.Get("").Populate(target); err != nil {
		return fmt.Errorf("failed to populate target struct; %w", err)
	}

	return nil
}
