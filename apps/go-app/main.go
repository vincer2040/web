package main

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/", root_get)
	mux.HandleFunc("/hello", hello_get)

	err := http.ListenAndServe(":6969", mux)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Println("server closing")
	} else if err != nil {
		fmt.Printf("got error: %s\n", err)
		os.Exit(1)
	}
}

func root_get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("got / request")
	io.WriteString(w, "you have requested / from my server")
}

func hello_get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("got /hello request")
	io.WriteString(w, "hello!")
}
