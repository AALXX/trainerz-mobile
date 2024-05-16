export interface ICommentSection {
    VideoToken: string
}

export interface ICommentCard {
    id: number
    ownerToken: string
    comment: string
    ownerName: string
    viwerPublicToken: string
    DeleteComment: (CommentID: number) => void
}
