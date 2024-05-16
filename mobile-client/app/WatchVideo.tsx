import { RefreshControl, ScrollView, StyleSheet } from 'react-native'
import { BackGroundView, View } from '../components/Themed'

import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import VideoPlayer from '../components/VideoPlayer/VideoPlayer'
import CommentSection from '../components/VideoPlayer/CommentSection/CommentSection'

const WatchVideo = () => {
    const params = useLocalSearchParams()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [refreshKey, setRefreshKey] = useState<number>(0)

    const handleRefresh = async () => {
        setRefreshing(true)
        // Update the key to force a re-render of the VideoPlayer component
        setRefreshKey(prevKey => prevKey + 1)
        setRefreshing(false)
    }

    return (
        <BackGroundView>
            <ScrollView
                className="w-full h-full flex"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            await handleRefresh()
                        }}
                    />
                }
            >
                <VideoPlayer key={refreshKey} VideoToken={params.VideoToken as string} />
                <CommentSection VideoToken={params.VideoToken as string} />
            </ScrollView>
        </BackGroundView>
    )
}

export default WatchVideo
