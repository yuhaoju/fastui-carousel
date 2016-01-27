'use strict'

import React, {StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, PanResponder, ScrollView} from 'react-native';

const screen_w = Dimensions.get('window').width;

let Carousel  = React.createClass ({
    getDefaultProps() {
        return {
            showPagination: true,
            paginationColor: '#fff',
            activePaginationColor: '#aaa',
            paginationSize: 16,
            paginationSpace: 20,
            paginationBottomOffset: 50,
        };
    },

    getInitialState() {
        return {
            activePage: 0,
            scrollerOffset: 0,
            x0: 0,
            xOffset: 0,
        };
    },

    componentWillMount: function(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            // get move start position
            onPanResponderGrant: (evt, gestureState) => {
                this.state.x0 = gestureState.x0
            },

            // get move offset
            onPanResponderMove: (evt, gestureState) => {
                const xOffset = this.state.x0 - gestureState.moveX,
                    notLeftmost = this.state.scrollerOffset + xOffset > 0,
                    notRightmost = this.state.scrollerOffset + xOffset < 640

                if(notLeftmost && notRightmost){
                    this.state.xOffset = xOffset
                } else{
                    this.state.xOffset = 0
                }
            },

            // decide which page to scroll to
            onPanResponderRelease: (evt, gestureState) => {
                const threshold = 50
                if(this.state.xOffset > threshold) {
                    this.scrollToNext()
                } else if(this.state.xOffset < -threshold) {
                    this.scrollToPrev()
                } else {
                    this.reposition()
                }
            },
        });
    },

    scrollToNext() {
        this.state.scrollerOffset = this.state.scrollerOffset + screen_w
        this.refs.scrollView.scrollTo(0, this.state.scrollerOffset)

        this.setState({
            activePage: this.state.activePage + 1
        })
    },

    scrollToPrev() {
        this.state.scrollerOffset = this.state.scrollerOffset - screen_w
        this.refs.scrollView.scrollTo(0, this.state.scrollerOffset)

        this.setState({
            activePage: this.state.activePage - 1
        })
    },

    reposition() {
        this.refs.scrollView.scrollTo(0, this.state.scrollerOffset)
    },

    renderPagination() {
        if (!this.props.showPagination) {
            return null;
        }

        let paginations = [],
            position = {
                width: this.props.children.length * this.props.paginationSpace,
                bottom: this.props.paginationBottomOffset,
            }

        position.left = (screen_w - position.width) / 2

        for (let i = 0, len = this.props.children.length; i < len; i++) {
            const paginationStyle = i === this.state.activePage
                                    ? { color: this.props.paginationColor }
                                    : { color: this.props.activePaginationColor }
            paginations.push(
                <Text key={i} style={[paginationStyle, { fontSize: this.props.paginationSize }]}>
                    &bull;
                </Text>
            )
        }

        return (
            <View style={[styles.pagePagination, position]}>
                {paginations}
            </View>
        )
    },

    render() {
        return (
            <View style={styles.opeWrap}>
                <ScrollView
                    ref="scrollView"
                    bounces={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    onMomentumScrollEnd={this.scrollEnd}
                    contentContainerStyle={styles.container}
                    {...this._panResponder.panHandlers}
                >
                    {this.props.children}
                </ScrollView>
                {this.renderPagination()}
            </View>
        )
    },
})

const styles = StyleSheet.create({
    opeWrap: {
        flex: 1,
        alignItems: 'stretch',
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    pagePagination: {
        position: 'absolute',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'stretch',
        opacity: 0.8,
        backgroundColor: 'transparent',
    },
})

module.exports = Carousel
