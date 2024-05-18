package controllers

import (
	"database/sql"

	// "fmt"
	"log"
	"strings"

	"net/http"
	// "search-server/config"
	"search-server/models"

	"github.com/blevesearch/bleve"

	"github.com/gin-gonic/gin"
)

func GetSerchedVideos(c *gin.Context, db *sql.DB, index bleve.Index) {
	search_query := c.Param("search_query")

	// Split the search query into terms
	terms := strings.Fields(search_query)

	// Create a Boolean query with OR clauses for each term
	boolQuery := bleve.NewBooleanQuery()
	for _, term := range terms {

		fuzzyQuery := bleve.NewFuzzyQuery(term)
		fuzzyQuery.SetField("UserName") // Replace with the field you want to search
		boolQuery.AddShould(fuzzyQuery)
		fuzzyQuery.SetFuzziness(2)
	}

	searchRequest := bleve.NewSearchRequest(boolQuery)
	searchRequest.Fields = []string{"*"} // Specify the field to return *= everything
	searchRequest.Highlight = bleve.NewHighlight()
	searchResults, err := index.Search(searchRequest)

	if err != nil {
		log.Fatal(err)
	}

	// Map search results into an array
	var mappedResults []models.SearchResult
	for _, hit := range searchResults.Hits {
		log.Println("result")
		var result models.SearchResult

		// Define the fields to convert
		fieldsToConvert := []struct {
			FieldName string
			Target    interface{} // Use interface{} to handle various types
		}{
			{"UserName", &result.UserName},
			{"UserPublicToken", &result.UserPublicToken},
			{"Rating", &result.Rating}, // Directly assign integer value
			{"AccountType", &result.AccountType}, // Directly assign integer value
			{"Sport", &result.Sport},
		}

		for _, fieldInfo := range fieldsToConvert {
			field, found := hit.Fields[fieldInfo.FieldName]
			if !found {
				log.Printf("Warning: Field '%s' not found for document ID %s\n", fieldInfo.FieldName, hit.ID)
				continue // Skip this result and move to the next one
			}

			switch v := field.(type) {
			case int:
				*fieldInfo.Target.(*int) = v // Type assertion and assign to integer pointer
			case float64:
				*fieldInfo.Target.(*int) = int(v) // Convert float64 to int and assign to integer pointer
			case string:
				*fieldInfo.Target.(*string) = string(v) // Convert float64 to int and assign to integer pointer
			default:
				log.Printf("Warning: Field '%s' is not a valid type for document ID %s\n", fieldInfo.FieldName, hit.ID)
				continue // Skip this result and move to the next one
			}
		}

		// Assuming SearchResult struct includes the fields you want to convert
		mappedResults = append(mappedResults, result)
	}

	// Return the user data in the response
	c.JSON(http.StatusCreated, gin.H{"usersResults": mappedResults})
}

func AddToIndex(c *gin.Context, db *sql.DB, index bleve.Index) {

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "msg": err.Error()})
		return
	}

	newVideo := models.User{
		UserName:        user.UserName,
		UserPublicToken: user.UserPublicToken,
		Rating:          user.Rating,
		Sport:           user.Sport,
	}

	if err := index.Index(user.UserPublicToken, newVideo); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusCreated, gin.H{"error": true})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"error": false})
}

func UpdateIndexedVideo(c *gin.Context, db *sql.DB, index bleve.Index) {

	// var video models.VideoReq
	// if err := c.ShouldBindJSON(&video); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": true, "msg": err.Error()})
	// 	return
	// }

	// if !config.VideoOwnerTokenCheck(UserPublicToken, video.VideoToken, db) {

	// 	c.JSON(http.StatusCreated, gin.H{"error": true})
	// 	return
	// }

	// newVideo := models.Video{
	// 	VideoTitle:      video.VideoTitle,
	// 	VideoToken:      video.VideoToken,
	// 	VideoVisibility: video.VideoVisibility,
	// }

	// // First, remove the old document from the index.
	// if err := index.Delete(video.VideoToken); err != nil {
	// 	log.Fatal(err)
	// 	c.JSON(http.StatusCreated, gin.H{"error": true})
	// 	return
	// }

	// if err := index.Index(video.VideoToken, newVideo); err != nil {
	// 	log.Fatal(err)
	// 	c.JSON(http.StatusCreated, gin.H{"error": true})
	// 	return
	// }

	c.JSON(http.StatusCreated, gin.H{"error": false})
}

func DeleteIndexedVideo(c *gin.Context, db *sql.DB, index bleve.Index) {

	// var video models.VideoReq
	// if err := c.ShouldBindJSON(&video); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": true, "msg": err.Error()})
	// 	return
	// }

	// var UserPublicToken = config.GetPublicTokenByPrivateToken(video.UserPrivateToken, db)
	// if config.VideoOwnerTokenCheck(UserPublicToken, video.VideoToken, db) == false {
	// 	log.Println("ERROR")
	// 	c.JSON(http.StatusCreated, gin.H{"error": true})
	// 	return
	// }

	// // First, remove the old document from the index.
	// if err := index.Delete(video.VideoToken); err != nil {
	// 	log.Fatal(err)
	// 	c.JSON(http.StatusCreated, gin.H{"error": true})
	// 	return
	// }
	c.JSON(http.StatusCreated, gin.H{"error": false})
}
