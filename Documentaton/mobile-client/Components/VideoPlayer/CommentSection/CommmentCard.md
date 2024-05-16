## CommentCard Component

The `CommentCard` component is used to display individual comments within the comment section. 

### Props

- **ownerToken**: *(required)* A string representing the token of the comment owner.
- **ownerName**: *(required)* A string representing the name of the comment owner.
- **viwerPublicToken**: *(required)* A string representing the public token of the viewer.
- **comment**: *(required)* A string representing the content of the comment.
- **DeleteComment**: *(required)* A function to delete the comment.

### Usage

```tsx
<CommentCard 
    ownerToken={ownerToken} 
    ownerName={ownerName} 
    viwerPublicToken={viewerPublicToken} 
    comment={comment} 
    DeleteComment={deleteCommentFunction} 
/>