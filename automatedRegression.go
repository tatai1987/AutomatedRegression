package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/tealeg/xlsx"
)

var target string

const (
	DEFAULT_PORT = "8080"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		writeToExcel()
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

func writeToExcel() {

	excelFileName := "/Automation/MDF.xlsx"
	xlFile, err := xlsx.OpenFile(excelFileName)

	if err != nil {
		fmt.Println("Error")
	}
	for _, sheet := range xlFile.Sheets {
		for _, row := range sheet.Rows {
			row.Cells[3].Value = "No"
		}
	}

	for _, sheet := range xlFile.Sheets {
		for _, row := range sheet.Rows {

			for _, cell := range row.Cells {
				text := cell.String()
				if text == "PTE" {
					row.Cells[3].Value = "Yes"

				}

			}
		}
	}

	err = xlFile.Save("/Automation/MDF.xlsx")
	if err != nil {
		fmt.Printf(err.Error())
	}
}
