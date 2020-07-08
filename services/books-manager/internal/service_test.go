package internal

import (
	"booksmanager/generated/api"
	"context"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestService_should_get_book(t *testing.T) {
	s := NewBooksManagerService()

	r, err := s.GetBook(context.TODO(), &api.GetBookRequest{Shelf: 1, Book: 2})

	assert.NoError(t, err)
	assert.Equal(t, &api.Book{
		Id:     1,
		Author: "Sam",
		Title:  "Book",
	}, r)
}
