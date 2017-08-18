package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

var target string

const (
	DEFAULT_PORT = "8080"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	
		var urlvalue = r.URL.Path[1:]
		if strings.Compare(urlvalue, "confirmation.html") == 0 {
			if len(target) > 0 {
				w.Header().Set("Content-Type", "applicaiton/zip")
				w.Header().Set("Content-Disposition", "attachment; filename=files.zip")
				http.ServeFile(w, r, target)
			}

		} else {
			http.ServeFile(w, r, r.URL.Path[1:])
		}

	})
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = DEFAULT_PORT
	}
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

}
