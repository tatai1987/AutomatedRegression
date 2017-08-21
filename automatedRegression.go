package main

import (
	"fmt"
	"log"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var target string

const (
	DEFAULT_PORT = "8080"
)

//const MongoDb details
const (
	hosts    = "127.0.0.1:27017"
	database = "ikeasocialapp"
	//username   = "admin"
	//password   = "youPassword"
	//collection = "messages"
)

type Person struct {
	Name  string
	Phone string
}

func main() {
	/*http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

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
	log.Fatal(http.ListenAndServe(":"+port, nil))*/

	info := &mgo.DialInfo{
		Addrs:    []string{hosts},
		Timeout:  60 * time.Second,
		Database: database,
		//Username: username,
		//Password: password,
	}

	session, err := mgo.DialWithInfo(info)
	if err != nil {
		panic(err)
	}

	defer session.Close()

	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	c := session.DB(database).C("people")
	err = c.Insert(&Person{"Pragati", "+919535494382"},
		&Person{"Neha", "+919535038890"})
	if err != nil {
		log.Fatal(err)
	}

	result := Person{}
	err = c.Find(bson.M{"name": "Pragati"}).One(&result)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Phone:", result.Phone)

}
