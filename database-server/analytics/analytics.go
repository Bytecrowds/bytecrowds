package analytics

import (
	"bytecrowds-database-server/database"
	"bytecrowds-database-server/database/models"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/gin-gonic/gin"

	"context"

	"strings"
	"time"
)

var IPanalytics = database.IPanalytics
var DayAnaytics = database.DayAnalytics

func InterceptRequest(ginContext *gin.Context) {
	var data models.Request
	ginContext.BindJSON(&data)

	filterIPstat := bson.D{{"ip", data.IP}}
	IPstat := bson.D{{"ip", data.IP}, {"hits", 1}, {"pages", []string{data.Page}}}

	filterDayStat := bson.D{
		{"day", strings.TrimSpace(time.Now().String()[:11])},
	}

	var searchIP models.IPstat
	IPanalytics.FindOne(context.TODO(), filterIPstat).Decode(&searchIP)

	var searchDay models.DayStat
	DayAnaytics.FindOne(context.TODO(), filterDayStat).Decode(&searchDay)

	if searchIP.IP == "" {
		IPanalytics.InsertOne(context.TODO(), IPstat)
	} else {
		var modifiedIPstat bson.D
		var found bool = false
		for _, page := range searchIP.Pages {
			if data.Page == page {
				found = true
				modifiedIPstat = bson.D{{"$set", bson.D{{"hits", searchIP.Hits + 1}}}}
				break
			}
		}
		if found == false {
			pages := append(searchIP.Pages, data.Page)
			modifiedIPstat = bson.D{{"$set", bson.D{
				{"hits", searchIP.Hits + 1},
				{"pages", pages},
			}}}
		}

		IPanalytics.UpdateOne(context.TODO(), filterIPstat, modifiedIPstat)
	}

	if searchDay.Day == "" {
		DayStat := bson.D{
			{"day", strings.TrimSpace(time.Now().String()[:11])},
			{"hits", 1},
			{"addresses", []string{data.IP}},
		}
		DayAnaytics.InsertOne(context.TODO(), DayStat)
	} else {
		var found bool = false
		for _, address := range searchDay.Addresses {
			if data.IP == address {
				found = true
				break
			}
		}
		// we will increment the day hits only if the request comes from a new IP
		if found == false {
			addresses := append(searchDay.Addresses, data.IP)
			modifiedDayStat := bson.D{{"$set", bson.D{
				{"hits", searchDay.Hits + 1},
				{"addresses", addresses},
			}}}
			DayAnaytics.UpdateOne(context.TODO(), filterDayStat, modifiedDayStat)
		}
	}
}
