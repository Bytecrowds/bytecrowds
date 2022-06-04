package database

import (
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"os"

	"context"
)

var database = os.Getenv("DATABASE")
var client, _ = mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("CONNECTION_STRING")))
var Bytecrowds = client.Database(database).Collection("bytecrowds")
var Languages = client.Database(database).Collection("languages")
var IPanalytics = client.Database(database).Collection("ipanalytics")
var DayAnalytics = client.Database(database).Collection("dayanalytics")
