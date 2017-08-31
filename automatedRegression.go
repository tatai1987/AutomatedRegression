package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
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
	database = "testcontrol"
	//username   = "admin"
	//password   = "youPassword"
	//collection = "messages"
)

type Login struct {
	Email    string
	Password string
}

func main() {

	http.HandleFunc("/", redirect)
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = DEFAULT_PORT
	}
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

//Handles redirection logic
func redirect(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("signup") == "signup" {
		if signup(w, r) == http.StatusOK {
			http.ServeFile(w, r, r.URL.Path[1:])
			http.Redirect(w, r, "/", http.StatusMovedPermanently)
		} else if signup(w, r) == http.StatusNotFound {
			http.Redirect(w, r, "http://localhost:8080/register.view.html", http.StatusSeeOther)
		}
	} else if r.FormValue("login") == "login" {
		if login(w, r) == http.StatusOK {
			http.Redirect(w, r, "http://localhost:8080/home.html", http.StatusSeeOther)
		} else if login(w, r) == http.StatusUnauthorized {
			http.ServeFile(w, r, r.URL.Path[1:])
			http.Redirect(w, r, "/", http.StatusMovedPermanently)
		}

	} else {
		http.ServeFile(w, r, r.URL.Path[1:])
		http.Redirect(w, r, "/", 301)
	}

}

//Handles login
func login(w http.ResponseWriter, r *http.Request) int {
	var email = r.FormValue("uname")
	var pwd = r.FormValue("psw")

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

	c := session.DB(database).C("login")
	result := Login{}
	err = c.Find(bson.M{"email": email}).One(&result)
	if err != nil {
		fmt.Println("failed")
	}

	if pwd == result.Password {
		return http.StatusOK

	}
	return http.StatusUnauthorized
}

//create profile for user.
func signup(w http.ResponseWriter, r *http.Request) int {
	var email = r.FormValue("email")
	var pwd = r.FormValue("psw")

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

	c := session.DB(database).C("login")
	err = c.Insert(&Login{email, pwd})

	if err != nil {
		log.Fatal(err)
		return http.StatusNotFound
	} else {
		return http.StatusOK
	}
}
