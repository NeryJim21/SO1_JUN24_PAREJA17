package Controller

import (
	"context"
	"log"
	"monitoreo-api/Instance"
	"monitoreo-api/Model"
)

func InsertData(nameCol string, dataParam int) error {
	collection := Instance.Mg.Db.Collection(nameCol)
	doc := Model.Data{Percent: dataParam}

	_, err := collection.InsertOne(context.TODO(), doc)
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

func InsertProcessData(nameCol string, dataParam Model.ProcessData) error {
	collection := Instance.Mg.Db.Collection(nameCol)

	_, err := collection.InsertOne(context.TODO(), dataParam)
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}
