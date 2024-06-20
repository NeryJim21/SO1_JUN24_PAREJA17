package Model

type Data struct {
	Percent int `bson:"percent"`
}

type ProcessData struct {
	PID    int    `bson:"pid"`
	Name   string `bson:"name"`
	Status int    `bson:"status"`
}
