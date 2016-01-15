'use strict'

import React, {StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, PanResponder, ScrollView} from 'react-native';

var screen_w = Dimensions.get('window').width;
var Carousel  = React.createClass ({
    getInitialState() {
        var imgs = this.props.imgs

        // copy first one to last, to make carousel effect
        imgs.push(imgs[0])
        imgs.unshift(imgs[imgs.length - 2])
        // console.log(imgs);
        return {
            scrollOffset: screen_w,
            x0: 0,
            xOffset: 0,
        };
    },
    getDefaultProps() {
        return {}
    },
    _next() {
        this.state.scrollOffset = this.state.scrollOffset + screen_w
        this.refs.scrollView.scrollTo(0, this.state.scrollOffset)
    },
    _last() {
        this.state.scrollOffset = this.state.scrollOffset - screen_w
        this.refs.scrollView.scrollTo(0, this.state.scrollOffset)
    },
    componentWillMount: function(){
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                this.state.x0 = gestureState.x0
            },
            onPanResponderMove: (evt, gestureState) => {
                var xOffset = this.state.xOffset = this.state.x0 - gestureState.moveX
                // console.log(xOffset);
                this.refs.scrollView.scrollWithoutAnimationTo(0, this.state.scrollOffset + xOffset);

                // The most recent move distance is gestureState.move{X,Y}

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                if(this.state.xOffset > 50){
                    this._next()
                } else if(this.state.xOffset < -50){
                    this._last()
                }
            },
        });
    },

    scrollEnd: function() {
        // when get last picture, reset scroller to 0
        if(this.state.scrollOffset >= screen_w * (this.props.imgs.length - 2)){
            this.state.scrollOffset = 0
            this.refs.scrollView.scrollWithoutAnimationTo(0, 0);
        }

        // when get first picture, reset scroller to end
        else if(this.state.scrollOffset === 0){
            this.state.scrollOffset = screen_w * (this.props.imgs.length - 2)
            this.refs.scrollView.scrollWithoutAnimationTo(0, this.state.scrollOffset);
        }
    },

    link: function(){
        console.log("hehe");
    },

    render() {
        return (
            <View style={styles.opeWrap}>
                <ScrollView
                    ref="scrollView"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    automaticallyAdjustContentInsets={false}
                    onMomentumScrollEnd={this.scrollEnd}
                    scrollEventThrottle={200}
                    {...this._panResponder.panHandlers}
                    contentOffset={{y:0, x: screen_w}}
                    style={styles.scrollView}
                    >
                    {this.props.imgs.map((uri, i) =>
                        <TouchableOpacity key={i} onPress={this.link} activeOpacity={1}>
                            <Image style={styles.img} source={{uri: uri}}/>
                        </TouchableOpacity>)
                    }
                </ScrollView>
                <TouchableOpacity style={styles.btn} onPress={this._next} activeOpacity={1}>
                    <Text style={styles.btnText}>next</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={this._last} activeOpacity={1}>
                    <Text style={styles.btnText}>last</Text>
                </TouchableOpacity>
            </View>
        )
    },
    getValue() {
        return this.state.value
    }
})

const styles = StyleSheet.create({
    img: {
        width: screen_w,
        height: 200,
    },
    btn: {
        width: screen_w ,
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: "center",
        backgroundColor: "#09c",
    },
    btnText: {
        color: "#fff",
    }
})

module.exports = Carousel
