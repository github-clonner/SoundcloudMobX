
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';

export default class Modal extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        items: PropTypes.array,
        close: PropTypes.func.isRequired,
    };

    state = {
        show: false,
        fadein: new Animated.Value(0),
        translateY: new Animated.Value(height),
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.show) {
            this.setState({
                show: true,
            });

            Animated.timing(this.state.fadein, {
                toValue: 1,
                duration: 300,
            }).start(() => {
                Animated.timing(this.state.translateY, {
                    toValue: 0,
                    duration: 200,
                }).start();
            });
        } else {
            Animated.timing(this.state.translateY, {
                toValue: height,
                duration: 200,
            }).start(() => {
                Animated.timing(this.state.fadein, {
                    toValue: 0,
                    duration: 200,
                }).start(() => {
                    this.setState({
                        show: false,
                    });
                });
            });
        }
    }

    render() {
        var items = this.props.items;
        var backgroundColor = this.state.fadein.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.3)'],
        });
        var opacity = this.state.translateY.interpolate({
            inputRange: [0, height],
            outputRange: [1, 0],
        });

        if (!this.props.show && !this.state.show) {
            return false;
        }

        return (
            <Animated.View style={[styles.container, {
                backgroundColor,
            }]}>
                <Animated.View style={[styles.options, {
                    transform: [{
                        translateY: this.state.translateY,
                    }],
                    opacity,
                }]}>

                    {
                        items.map((e, index) => {
                            return (
                                <TouchableOpacity
                                    style={[styles.item, index === items.length - 1 && { borderBottomWidth: 0 }]}
                                    key={index}
                                    onPress={() => {
                                        var callback = e.callback;

                                        if (typeof callback === 'function') {
                                            callback();
                                            this.props.close();
                                        }
                                    }}>
                                    <Text style={styles.title}>{e.title}</Text>
                                </TouchableOpacity>
                            );
                        })
                    }

                    <TouchableOpacity onPress={this.props.close} style={[styles.item, {
                        marginTop: 5,
                    }]}>
                        <Text style={styles.cacel}>CANCEL</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width,
        height,
        backgroundColor: 'rgba(0,0,0,.3)',
        zIndex: 99,
    },

    options: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width,
        backgroundColor: '#dfdfdf',
    },

    title: {
        fontSize: 13,
        fontWeight: '100',
        color: '#333',
    },

    item: {
        height: 40,
        backgroundColor: '#fff',
        borderBottomWidth: .3,
        borderBottomColor: '#dfdfdf',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cacel: {
        fontWeight: '100',
        fontSize: 13,
        color: 'red',
        letterSpacing: 1,
    },
});
