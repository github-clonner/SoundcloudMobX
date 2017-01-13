
import React, { Component, PropTypes } from 'react';
import MKIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Dimensions,
    StatusBar,
    Image,
    Animated,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    InteractionManager,
} from 'react-native';

import parseTimes from '../../utils/parseTimes';
import Loader from '../../components/Loader';

@inject(stores => ({
    songs: stores.chart.songs,
    genre: stores.chart.genre,
    doRefresh: stores.chart.doRefresh,
    showRefresh: stores.chart.showRefresh,
    player: stores.player,
}))
@observer
export default class Chart extends Component {

    static propTypes = {
        songs: PropTypes.object.isRequired,
        genre: PropTypes.object.isRequired,
        doRefresh: PropTypes.func.isRequired,
        showRefresh: PropTypes.bool.isRequired,
    };

    renderCoverWall(start = 0, end = 5) {

        return new Array(end - start).fill(0).map((e, index) => {

            var song = this.props.songs[start + index];

            return (
                <Image key={index + start} {...{
                    source: {
                        uri: song.artwork
                    },

                    style: {
                        height: 75,
                        width: 75,
                    }
                }}></Image>
            );
        });
    }

    state = {
        opacity: new Animated.Value(0)
    };

    render() {

        var { songs, genre, showRefresh } = this.props;
        var opacity = this.state.opacity.interpolate({
            inputRange: [-40, -10],
            outputRange: [1, 0],
        });

        return (
            <View style={styles.container}>

                <Loader {...{
                    show: true,
                    animate: showRefresh,
                    text: 'REFRESH',
                    style4container: {
                        top: 160,
                        width,
                        opacity: showRefresh ? 1 : opacity,
                        transform: [{
                            rotate: '0deg'
                        }]
                    }
                }}></Loader>

                <View style={styles.header}>
                    <View style={styles.coverWall}>
                        {
                            this.renderCoverWall(0, 5)
                        }
                    </View>
                    <View style={styles.coverWall}>
                        {
                            this.renderCoverWall(5, 10)
                        }
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()} style={styles.back}>
                        <MKIcon name="arrow-back" size={16} color="white"></MKIcon>
                    </TouchableOpacity>

                    <View style={styles.hero}>
                        <View>
                            <Text style={styles.genre}>
                                # {genre.name}
                            </Text>
                            <Text style={styles.count}>
                                {songs.length} Tracks
                            </Text>
                        </View>

                        <TouchableOpacity>
                            <Icon name="cloud-download" size={20} color="red"></Icon>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView

                onScrollEndDrag={e => {

                    if (e.nativeEvent.contentOffset.y < -40) {
                        this.props.doRefresh();
                    }
                }}

                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: {
                                y: this.state.opacity
                            }
                        }
                    }]
                )}

                style={[styles.songs, showRefresh && {
                    paddingTop: 40
                }]}>
                    {
                        songs.map((song, index) => {

                            var times = parseTimes(song.duration);

                            return (
                                <TouchableOpacity key={index} style={styles.song}>
                                    <View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{song.title}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.author}>{song.user.username}</Text>
                                    </View>

                                    <Icon name="heart" size={10} style={[styles.fav, song.fav && {
                                        color: 'red'
                                    }]}></Icon>

                                    <Text style={styles.times}>{times.minutes}:{times.seconds}</Text>
                                </TouchableOpacity>
                            );
                        })
                    }
                </ScrollView>

            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height: 150,
        zIndex: 9
    },

    back: {
        position: 'absolute',
        left: 20,
        top: 40,
        backgroundColor: 'transparent',
        zIndex: 9,
    },

    coverWall: {
        height: 75,
        width,
        flexDirection: 'row',
    },

    hero: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: 150,
        width,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 75,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,.4)'
    },

    genre: {
        color: '#fff'
    },

    count: {
        marginTop: 10,
        color: 'rgba(255,255,255,.8)',
        fontSize: 12,
        fontWeight: '100',
    },

    songs: {
        marginTop: 150,
        paddingTop: 20,
    },

    song: {
        width,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    title: {
        color: 'rgba(0,0,0,.7)',
        fontSize: 13,
        width: 240,
    },

    author: {
        marginTop: 5,
        color: 'rgba(0,0,0,.5)',
        fontSize: 11,
        width: 240,
    },

    fav: {
        marginLeft: 18,
    },

    times: {
        color: 'rgba(0,0,0,.5)',
        fontSize: 11,
    },
});