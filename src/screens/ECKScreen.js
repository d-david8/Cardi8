import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from '../../styles/styles';
import BottomMenu from '../components/BottomMenu';

const EcgScreen = ({navigation}) => {
  const [ecgData, setEcgData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (isGenerating) {
      const intervalId = setInterval(generateRandomData, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isGenerating]);

  const generateRandomData = () => {
    const randomValue = Math.random() * 50 - 25; // Generate values between -25 and 25
    setEcgData(prevData => [...prevData, randomValue]);
  };

  const handleStartStop = () => {
    setIsGenerating(prevState => !prevState);
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.ecgContainer}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${screenWidth} ${screenHeight * 0.6}`}>
          <Path
            fill="none"
            stroke="red"
            strokeWidth="2"
            d={`M0,${screenHeight * 0.3} ` + ecgData.map((value, index) => `L${index * 10},${screenHeight * 0.3 - value}`).join(' ')}
          />
        </Svg>
        <View style={localStyles.backgroundLines} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStartStop}>
        <Text style={styles.buttonText}>{isGenerating ? 'Stop ECG' : 'Start ECG'}</Text>
      </TouchableOpacity>
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ecgContainer: {
    width: '80%',
    height: '60%',
    backgroundColor: '#f0f0f0',
    borderWidth:2,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  backgroundLines: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    borderBottomColor: 'rgba(0, 0, 255, 0.1)',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
});

export default EcgScreen;
