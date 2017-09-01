package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	mgo "AutomatedRegression/gopkg.in/mgo.v2"
	"AutomatedRegression/gopkg.in/mgo.v2/bson"
)

var target string

const (
	DEFAULT_PORT = "8080"
)

const (
	hosts    = "ds163613.mlab.com:63613"
	database = "testcontrol"
	username = "subhadeep"
	password = "subhadeep"
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
	fmt.Println("inside redirect")
	if r.FormValue("signup") == "signup" {
		fmt.Println("inside signup")
		if signup(w, r) == http.StatusOK {
			fmt.Println("inside signup 1")
			http.ServeFile(w, r, r.URL.Path[1:])
			http.Redirect(w, r, "/", http.StatusMovedPermanently)
		} else if signup(w, r) == http.StatusNotFound {
			http.Redirect(w, r, "/registration.html", http.StatusSeeOther)
		}
	} else if r.FormValue("login") == "login" {
		fmt.Println("login")
		if login(w, r) == http.StatusOK {
			fmt.Println("inside login 1")
			http.Redirect(w, r, "/home.html", http.StatusSeeOther)
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
		Username: username,
		Password: password,
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
		Timeout:  30 * time.Second,
		Database: database,
		Username: username,
		Password: password,
	}

	fmt.Println("Connection Established")
	session, err := mgo.DialWithInfo(info)
	if err != nil {
		panic(err)
	}

	defer session.Close()

	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	c := session.DB(database).C("login")
	fmt.Println("Table Created")
	err = c.Insert(&Login{email, pwd})
	fmt.Println("Record Inserted")
	if err != nil {
		fmt.Println("ERROR IS THERE")
		log.Fatal(err)
		return http.StatusNotFound
	} else {
		fmt.Println("SUCCESS")
		return http.StatusOK
	}
}
