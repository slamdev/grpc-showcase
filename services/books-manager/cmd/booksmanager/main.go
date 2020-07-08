package main

import (
	"booksmanager/internal"
	"booksmanager/pkg"
)

func main() {
	app, err := internal.NewApp()
	if err != nil {
		panic(err)
	}

	if err := app.Start(); err != nil {
		panic(err)
	}

	if err := pkg.WaitForShutdown(app.Stop); err != nil {
		panic(err)
	}
}
