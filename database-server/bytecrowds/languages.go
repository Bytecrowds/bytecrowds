package bytecrowds

import (
	"bytecrowds-database-server/database"
	"bytecrowds-database-server/database/models"

	"go.mongodb.org/mongo-driver/bson"

	"net/http"

	"github.com/gin-gonic/gin"

	"context"
)

var languages = database.Languages

type Language = models.Language

func GetLanguage(ginContext *gin.Context) {
	bytecrowdName := ginContext.Param("bytecrowd")
	filter := bson.D{{"bytecrowd", bytecrowdName}}

	var result Language
	languages.FindOne(context.TODO(), filter).Decode(&result)

	if result.Language != "" {
		ginContext.String(http.StatusOK, result.Language)
	} else {
		ginContext.String(http.StatusOK, "")
	}
}

func EditLanguage(ginContext *gin.Context) {
	var data, result Language
	ginContext.BindJSON(&data)

	language := bson.D{{"bytecrowd", data.Bytecrowd}, {"language", data.Language}}
	modifiedLanguage := bson.D{{"$set", bson.D{{"language", data.Language}}}}
	filter := bson.D{{"bytecrowd", data.Bytecrowd}}

	languages.FindOne(context.TODO(), filter).Decode(&result)

	if result.Bytecrowd != "" {
		languages.UpdateOne(context.TODO(), filter, modifiedLanguage)
		ginContext.String(http.StatusOK, "language updated!")
	} else {
		result, _ := languages.InsertOne(context.TODO(), language)
		if result != nil {
			ginContext.String(http.StatusOK, "language inserted!")
		}
	}
}
