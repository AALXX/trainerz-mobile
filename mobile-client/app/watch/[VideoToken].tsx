import { RefreshControl, ScrollView, StyleSheet } from 'react-native'
import { BackGroundView, View } from '../../components/Themed'

import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
// import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
// import FullScreenVideoPlayer from '../../components/VideoPlayer/FullScreenVideoPlayer'
// import CommenView from '../../components/VideoPlayer/CommentSection/CommentView'

const WatchVideo = () => {
    const { VideoToken }: { VideoToken: string } = useLocalSearchParams()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [refreshKey, setRefreshKey] = useState<number>(0)
    const [fullScreen, setFullScreen] = useState<boolean>(false)

    const handleRefresh = async () => {
        setRefreshing(true)
        // Update the key to force a re-render of the VideoPlayer component
        setRefreshKey(prevKey => prevKey + 1)
        setRefreshing(false)
    }

    return (
        <ScrollView
            className=" w-full h-full flex"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={async () => {
                        await handleRefresh()
                    }}
                />
            }
        >
            <BackGroundView>
                {/* {fullScreen ? (
                    <FullScreenVideoPlayer key={refreshKey} VideoToken={VideoToken} setFullScreen={setFullScreen} />
                ) : (
                    <View>
                        <VideoPlayer key={refreshKey} VideoToken={VideoToken} setFullScreen={setFullScreen} />
                        <CommenView VideoToken={VideoToken} />
                    </View>
                )} */}
            </BackGroundView>
        </ScrollView>
    )
}

export default WatchVideo
