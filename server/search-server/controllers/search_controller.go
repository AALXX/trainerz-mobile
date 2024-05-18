package controllers

import (
	"database/sql"

	// "fmt"
	"log"
	"strings"

	"net/http"
	"search-server/config"
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
		fuzzyQuery.SetField("VideoTitle") // Replace with the field you want to search
		boolQuery.AddShould(fuzzyQuery)
		fuzzyQuery.SetFuzziness(2)
	}

	searchRequest := bleve.NewSearchRequest(boolQuery)
	searchRequest.Fields = []string{"*"} // Specify the field to return
	searchRequest.Highlight = bleve.NewHighlight()
	searchResults, err := index.Search(searchRequest)
	if err != nil {
		log.Fatal(err)
	}

	// Map search results into an array
	var mappedResults []models.SearchResult
	for _, hit := range searchResults.Hits {

		var result models.SearchResult

		// Define the fields to convert
		//this transfers data from fieldt to the result var
		fieldsToConvert := []struct {
			FieldName string
			Target    *string
		}{
			{"VideoTitle", &result.VideoTitle},
			{"VideoToken", &result.VideoToken},           // Add more fields as needed
			{"VideoVisibility", &result.VideoVisibility}, // Add more fields as needed
		}

		for _, fieldInfo := range fieldsToConvert {
			field, found := hit.Fields[fieldInfo.FieldName]
			if !found {
				log.Printf("Warning: Field '%s' not found for document ID %s\n", fieldInfo.FieldName, hit.ID)
				continue // Skip this result and move to the next one
			}

			title, ok := field.(string)
			if !ok {
				log.Printf("Warning: Field '%s' is not a string for document ID %s\n", fieldInfo.FieldName, hit.ID)
				continue // Skip this result and move to the next one
			}

			*fieldInfo.Target = title
		}
		log.Println(result)

		if result.VideoVisibility == "public" {

			// Assuming SearchResult struct includes the fields you want to convert
			mappedResults = append(mappedResults, result)
		}

	}

	// Return the user data in the response
	c.JSON(http.StatusCreated, gin.H{"videoSearchedResults": mappedResults})
}

func AddToIndex(c *gin.Context, db *sql.DB, index bleve.Index) {

	var video models.Video
	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "msg": err.Error()})
		return
	}

	// var UserPublicToken = GetPublicTokenByPrivateToken(video.OwnerPrivateToken, db)

	newVideo := models.Video{
		VideoTitle:      video.VideoTitle,
		VideoToken:      video.VideoToken,
		VideoVisibility: video.VideoVisibility,
	}

	if err := index.Index(video.VideoToken, newVideo); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusCreated, gin.H{"error": true})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"error": false})
}

func UpdateIndexedVideo(c *gin.Context, db *sql.DB, index bleve.Index) {

	var video models.VideoReq
	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "msg": err.Error()})
		return
	}

	var UserPublicToken = config.GetPublicTokenByPrivateToken(video.UserPrivateToken, db)
	if !config.VideoOwnerTokenCheck(UserPublicToken, video.VideoToken, db) {

		c.JSON(http.StatusCreated, gin.H{"error": true})
		return
	}

	newVideo := models.Video{
		VideoTitle:      video.VideoTitle,
		VideoToken:      video.VideoToken,
		VideoVisibility: video.VideoVisibility,
	}

	// First, remove the old document from the index.
	if err := index.Delete(video.VideoToken); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusCreated, gin.H{"error": true})
		return
	}

	if err := index.Index(video.VideoToken, newVideo); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusCreated, gin.H{"error": true})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"error": false})
}

func DeleteIndexedVideo(c *gin.Context, db *sql.DB, index bleve.Index) {

	var video models.VideoReq
	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "msg": err.Error()})
		return
	}

	var UserPublicToken = config.GetPublicTokenByPrivateToken(video.UserPrivateToken, db)
	if config.VideoOwnerTokenCheck(UserPublicToken, video.VideoToken, db) == false {
		log.Println("ERROR")
		c.JSON(http.StatusCreated, gin.H{"error": true})
		return
	}

	// First, remove the old document from the index.
	if err := index.Delete(video.VideoToken); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusCreated, gin.H{"error": true})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"error": false})
}
