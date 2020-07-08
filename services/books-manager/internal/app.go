package internal

import (
	_ "booksmanager/generated"
	"booksmanager/generated/api"
	"booksmanager/pkg"
	"context"
	"fmt"
	"github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
)

type App interface {
	Start() error
	Stop() error
}

type app struct {
	config         Config
	actuatorServer pkg.ActuatorServer
	grpcServer     pkg.GrpcServer
}

func NewApp() (App, error) {
	app := app{}
	if err := pkg.Populate(&app.config); err != nil {
		return nil, fmt.Errorf("failed to populate config; %w", err)
	}

	logrus.Infof("%+v", app.config)

	app.actuatorServer = pkg.NewActuatorServer(app.config.Http.Port)

	svc := NewBooksManagerService()
	app.grpcServer = pkg.NewGrpcServer(app.config.Grpc.Port, func(s *grpc.Server) { api.RegisterBooksManagerServer(s, svc) })
	return &app, nil
}

func (a *app) Start() error {
	if err := a.actuatorServer.Start(); err != nil {
		return fmt.Errorf("failed to start actuator server; %w", err)
	}
	if err := a.grpcServer.Start(); err != nil {
		return fmt.Errorf("failed to grpc server; %w", err)
	}
	return nil
}

func (a *app) Stop() error {
	wg, _ := errgroup.WithContext(context.TODO())
	wg.Go(a.grpcServer.Stop)
	wg.Go(a.actuatorServer.Stop)
	return wg.Wait()
}

type Config struct {
	Http struct {
		Port int32
	}
	Grpc struct {
		Port int32
	}
}
