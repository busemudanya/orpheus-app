import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onContinue: () => void;
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const textOpacity1 = useRef(new Animated.Value(1)).current;
  const textOpacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    const textTransition = Animated.loop(
      Animated.sequence([
        Animated.delay(3000),
        Animated.parallel([
          Animated.timing(textOpacity1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(3000),
        Animated.parallel([
          Animated.timing(textOpacity1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    floatAnimation.start();
    textTransition.start();

    return () => {
      floatAnimation.stop();
      textTransition.stop();
      floatAnim.setValue(0);
      textOpacity1.setValue(1);
      textOpacity2.setValue(0);
    };
  }, [floatAnim, textOpacity1, textOpacity2]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.imgur.com/StWdLAS.png' }}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.characterContainer,
            {
              transform: [{ translateY: floatAnim }],
            },
          ]}
        >
          <Image
            source={{ uri: 'https://i.imgur.com/cwYuJnH.png' }}
            style={styles.character}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.welcomeText,
              {
                opacity: textOpacity1,
                position: 'absolute',
              },
            ]}
          >
            Welcome to Orpheus
          </Animated.Text>
          <Animated.Text
            style={[
              styles.welcomeText,
              {
                opacity: textOpacity2,
                position: 'absolute',
              },
            ]}
          >
            Take a breath and relax
          </Animated.Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onContinue} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1120',
  },
  background: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 17, 33, 0.6)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 96,
  },
  characterContainer: {
    width: width * 0.7,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginTop: 48,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  button: {
    marginTop: 96,
    backgroundColor: '#3b82f6',
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 48,
    minWidth: width * 0.6,
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});
