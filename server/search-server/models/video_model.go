package models

type VideoReq struct {
	VideoTitle        string `json:"VideoTitle"`
	VideoToken        string `json:"VideoToken"`
	UserPrivateToken string `json:"UserPrivateToken"`
	VideoVisibility   string `json:"VideoVisibility"`
}

type VideoDeleteReq struct {
	VideoToken        string `json:"VideoToken"`
	OwnerPrivateToken string `json:"OwnerPrivateToken"`
}

type Video struct {
	VideoTitle      string `json:"VideoTitle"`
	VideoToken      string `json:"VideoToken"`
	VideoVisibility string `json:"VideoVisibility"`
}

type SearchResult struct {
	VideoTitle      string
	VideoToken      string
	VideoVisibility string
	Score           float64
}
