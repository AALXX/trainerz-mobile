import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ICommentSection, ICommentCard } from './ICommentSection'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import CommmentCard from './CommmentCard'

const CommentSection = (props: ICommentSection) => {
    const [videoComments, setVideoComments] = useState<Array<ICommentCard>>([])
    const [commentInput, setCommentInput] = useState<string>('')
    const [userPublicToken, setUserPublicToken] = useState<string>('')

    useEffect(() => {
        ;(async () => {
            const userToken = (await AsyncStorage.getItem('userPublicToken')) as string
            setUserPublicToken(userToken)
            const getCommentsForVideo = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/get-video-comments/${props.VideoToken}`)
            const sortedComments = getCommentsForVideo.data.comments.sort((a, b) => new Date(b.SentAt).getTime() - new Date(a.SentAt).getTime())

            setVideoComments(sortedComments)
        })()
    }, [])

    const DeleteComment = async (CommentID: number) => {
        const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/delete-comment`, {
            UserPrivateToken: (await AsyncStorage.getItem('userToken')) as string,
            VideoToken: props.VideoToken,
            CommentID: CommentID
        })
    }

    const postComment = async () => {
        const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/post-comment`, {
            UserPrivateToken: (await AsyncStorage.getItem('userToken')) as string,
            VideoToken: props.VideoToken,
            Comment: commentInput
        })

        if (res.data.error === false) {
            setVideoComments(videoComments => [
                ...videoComments,
                {
                    id: res.data.id,
                    viwerPublicToken: userPublicToken,
                    comment: commentInput,
                    sentAt: new Date(),
                    ownerName: res.data.userName,
                    ownerToken: userPublicToken,
                    DeleteComment: () => {
                        DeleteComment(res.data.id)
                    }
                }
            ])
        }
    }

    return (
        <View className="flex">
            <View className="flex  h-[10vh] w-full">
                <View className="flex flex-row bg-[#00000065] rounded-2xl h-12 w-[95%] m-auto ">
                    <TextInput className="text-white h-full self-center indent-3 w-[88%] " placeholder="Comment..." value={commentInput} onChangeText={text => setCommentInput(text)} />
                    <TouchableOpacity
                        className="flex justify-center w-10 h-full ml-auto"
                        onPress={() => {
                            postComment()
                        }}
                    >
                        <Image source={require(`../../../assets/CommentsIcons/SendComment_icon.svg`)} className=" w-8 h-8 self-center ml-auto " />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {Object.keys(videoComments).length > 0 ? (
                    <View>
                        {videoComments.map((comment: ICommentCard, index: number) => (
                            <CommmentCard
                                key={index}
                                id={comment.id}
                                ownerToken={comment.ownerToken}
                                comment={comment.comment}
                                ownerName={comment.ownerName}
                                viwerPublicToken={userPublicToken}
                                DeleteComment={() => {
                                    DeleteComment(comment.id)
                                }}
                            />
                        ))}
                    </View>
                ) : null}
            </View>
        </View>
    )
}

export default CommentSection
