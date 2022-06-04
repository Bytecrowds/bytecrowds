package models

type Request struct {
	IP        string
	Continent string
	Page      string
}

type IPstat struct {
	IP    string
	Hits  int
	Pages []string
}

type DayStat struct {
	Day       string
	Hits      int
	Addresses []string
}
