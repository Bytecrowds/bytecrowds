package bytecrowds

import (
	"bytecrowds-database-server/database"
	"bytecrowds-database-server/database/models"

	"go.mongodb.org/mongo-driver/bson"

	"net/http"

	"github.com/gin-gonic/gin"

	"context"
)

var bytecrowds = database.Bytecrowds

type StoredBytecrowd = models.StoredBytecrowd

func GetBytecrowd(ginContext *gin.Context) {
	bytecrowdName := ginContext.Param("bytecrowd")
	filter := bson.D{{"name", bytecrowdName}}

	var result StoredBytecrowd
	bytecrowds.FindOne(context.TODO(), filter).Decode(&result)

	if result.Text != "" {
		ginContext.String(http.StatusOK, result.Text)
	} else {
		ginContext.String(http.StatusOK, "")
	}
}

func EditBytecrowd(ginContext *gin.Context) {
	var data models.Bytecrowd
	ginContext.BindJSON(&data)

	bytecrowd := bson.D{{"name", data.Room}, {"text", data.Data.BytecrowdText.Content}}
	modifiedBytecrowd := bson.D{{"$set", bson.D{{"text", data.Data.BytecrowdText.Content}}}}
	filter := bson.D{{"name", data.Room}}

	var result StoredBytecrowd
	bytecrowds.FindOne(context.TODO(), filter).Decode(&result)

	if result.Name != "" {
		bytecrowds.UpdateOne(context.TODO(), filter, modifiedBytecrowd)
		ginContext.String(http.StatusOK, "bytecrowd updated!")
	} else {
		result, _ := bytecrowds.InsertOne(context.TODO(), bytecrowd)
		if result != nil {
			ginContext.String(http.StatusOK, "bytecrowd inserted!")
		}
	}
}
