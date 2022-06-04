package configuration

import (
	"os"

	"github.com/joho/godotenv"
)

func init() {
	if os.Getenv("PRODUTION") != "1" && os.Getenv("PRODUCTION") != "true" {
		godotenv.Load()
	}
}
