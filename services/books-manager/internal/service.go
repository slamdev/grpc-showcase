package internal

import (
	"booksmanager/generated/api"
	"context"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/sirupsen/logrus"
)

type service struct {
	api.UnimplementedBooksManagerServer
}

func NewBooksManagerService() api.BooksManagerServer {
	return &service{}
}

func (s *service) ListBooks(ctx context.Context, req *api.ListBooksRequest) (*api.ListBooksResponse, error) {
	logrus.Infof("%s called with %+v", "ListBooks", req)
	b := api.Book{
		Id:     1,
		Author: "Sam",
		Title:  "Book",
	}
	return &api.ListBooksResponse{Books: []*api.Book{&b}}, nil
}

func (s *service) CreateBook(ctx context.Context, req *api.CreateBookRequest) (*api.Book, error) {
	logrus.Infof("%s called with %+v", "CreateBook", req)
	b := api.Book{
		Id:     1,
		Author: "Sam",
		Title:  "Book",
	}
	return &b, nil
}

func (s *service) GetBook(ctx context.Context, req *api.GetBookRequest) (*api.Book, error) {
	logrus.Infof("%s called with %+v", "GetBook", req)
	b := api.Book{
		Id:     1,
		Author: "Sam",
		Title:  "Book",
	}
	return &b, nil
}

func (s *service) DeleteBook(ctx context.Context, req *api.DeleteBookRequest) (*empty.Empty, error) {
	logrus.Infof("%s called with %+v", "DeleteBook", req)
	return &empty.Empty{}, nil
}
