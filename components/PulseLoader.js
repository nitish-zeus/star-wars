import React from 'react';
import { View, Image, TouchableOpacity, Animated, Easing,Dimensions } from 'react-native';
import Pulse from './Pulse';
const {height, width} = Dimensions.get('window');



export default class LocationPulseLoader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			circles: []
		};

		this.counter = 1;
		this.setInterval = null;
		this.anim = new Animated.Value(1);
	}

	componentDidMount() {
		this.setCircleInterval();
    }
    
    componentWillUnmount() {
        clearInterval(this.setInterval);
    }

	setCircleInterval() {
		this.setInterval = setInterval(this.addCircle.bind(this), this.props.interval);
		this.addCircle();
	}

	addCircle() {
		this.setState({ circles: [...this.state.circles, this.counter] });
		this.counter++;
	}

	onPressIn() {
		Animated.timing(this.anim, {
			toValue: this.props.pressInValue,
			duration: this.props.pressDuration,
            easing: this.props.pressInEasing,
            useNativeDriver: true
		}).start(() => clearInterval(this.setInterval));
	}

	onPressOut() {
		Animated.timing(this.anim, {
			toValue: 1,
			duration: this.props.pressDuration,
            easing: this.props.pressOutEasing,
            useNativeDriver: true
		}).start(this.setCircleInterval.bind(this));
	}

	render() {
		const { size, avatar, avatarBackgroundColor, interval } = this.props;

		return (
			<View style={{
				// flex: 1,
				height:height,
				backgroundColor: 'transparent',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor:'white',
				// borderRadius:1,
				// borderWidth:0.5
			}}>
				{this.state.circles.map((circle) => (
					<Pulse
						key={circle}
						{...this.props}
					/>
				))}

				<TouchableOpacity
					activeOpacity={1}
					onPressIn={this.onPressIn.bind(this)}
					onPressOut={this.onPressOut.bind(this)}
					style={{
						transform: [{
							scale: this.anim
						}]
					}}
				>
					<Image
						source={avatar}
						style={{
							width: size,
							height: size,
							borderRadius: size/2,
							borderWidth:0.5,
							overflow:'hidden',
						}}
					/>
				</TouchableOpacity>
			</View>
		);
	}	
}

// LocationPulseLoader.propTypes = {
//   interval: React.PropTypes.number,
//   size: React.PropTypes.number,
//   pulseMaxSize: React.PropTypes.number,
//   avatar: React.PropTypes.any.isRequired,
//   avatarBackgroundColor: React.PropTypes.any,
//   pressInValue: React.PropTypes.number,
//   pressDuration: React.PropTypes.number,
//   borderColor: React.PropTypes.string,
//   backgroundColor: React.PropTypes.string,
//   getStyle: React.PropTypes.func,
// };

LocationPulseLoader.defaultProps = {
  interval: 2000,
  size: 100,
  pulseMaxSize: 250,
  avatar: undefined,
  avatarBackgroundColor: 'white',
  pressInValue: 0.8,
  pressDuration: 150,
  pressInEasing: Easing.in,
  pressOutEasing: Easing.in,
  borderColor: '#D8335B',
  backgroundColor: '#ED225B55',
  getStyle: undefined,
};