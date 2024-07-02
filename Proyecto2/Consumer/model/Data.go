package model

import "time"

type Data struct {
	Texto     string    `json:"texto"`
	Pais      string    `json:"pais"`
	Timestamp time.Time `bson:"timestamp"`
}
