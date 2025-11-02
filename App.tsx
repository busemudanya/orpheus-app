import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';

// Types
interface Message {
  sender: 'ai' | 'user';
  text: string;
}

interface Content {
  title: string;
  affirmations?: string[];
  script?: string[];
}

type ScreenType = 'welcome' | 'name' | 'home' | 'chat' | 'loading' | 'player' | 'rating';

// Mock API calls
const generateAffirmations = async (situation: string, metaphors: string): Promise<Content> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    title: 'I am confident',
    affirmations: [
      'I appreciate the little things you do for me',
      'You are a force of positivity and strength',
      'You are worthy of all the good things coming your way',
      'You are my anchor. You keep me grounded through the storms.',
      'You are a fantastic leader',
    ],
  };
};

const generateMeditation = async (thought: string): Promise<Content> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    title: 'Peace and Clarity',
    script: [
      "Let's begin by finding a comfortable position...",
      'Notice the sensation of your breath...',
      'Your thought about feeling lacking is just that - a thought...',
      'You are complete exactly as you are...',
      'Let this truth settle into your being...',
    ],
  };
};

// Floating Character Component
interface FloatingCharacterProps {
  source: ImageSourcePropType;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

const FloatingCharacter: React.FC<FloatingCharacterProps> = ({ source, delay = 0, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          delay: delay * 1000,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedValue, delay]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      <Image source={source} className="h-32 w-32" resizeMode="contain" />
    </Animated.View>
  );
};

// Breathing Animation Component
const BreathingAnimation: React.FC = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [scaleValue]);

  return (
    <View className="items-center justify-center">
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Image
          source={{ uri: 'https://i.imgur.com/S7Y4wsi.png' }}
          className="h-40 w-40"
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          borderWidth: 3,
          borderColor: '#3b82f6',
          marginTop: 32,
          opacity: 0.6,
          transform: [{ scale: scaleValue }],
        }}
      />
    </View>
  );
};

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isAITyping, setIsAITyping] = useState<boolean>(false);
  const [chatStep, setChatStep] = useState<number>(0);
  const [situation, setSituation] = useState<string>('');
  const [metaphors, setMetaphors] = useState<string>('');
  const [thought, setThought] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<Content | null>(null);
  const [sessionType, setSessionType] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const startChat = (type: string) => {
    setSessionType(type);
    setChatStep(0);
    setChatMessages([]);
    setScreen('chat');

    setTimeout(() => {
      setIsAITyping(true);
      setTimeout(() => {
        setChatMessages([
          {
            sender: 'ai',
            text: `Hey ${userName}, how are you feeling today?`,
          },
        ]);
        setIsAITyping(false);
      }, 1500);
    }, 500);
  };

  const handleSendMessage = () => {
    const messageText = userInput.trim();

    if (!messageText) return;

    const newMessage: Message = {
      sender: 'user',
      text: messageText,
    };

    setChatMessages((prev) => [...prev, newMessage]);

    if (chatStep === 0) {
      setThought(messageText);
    } else if (chatStep === 1) {
      setSituation(messageText);
    } else if (chatStep === 3) {
      setMetaphors(messageText);
    }

    setUserInput('');

    setTimeout(() => {
      setIsAITyping(true);
      setTimeout(() => {
        let aiResponse = '';
        const nextStep = chatStep + 1;

        if (nextStep === 1) {
          aiResponse =
            'Could you specify to me if there is any specific thoughts or situations causing you this?';
        } else if (nextStep === 2) {
          aiResponse = 'What exactly makes you nervous when you think of it?';
        } else if (nextStep === 3) {
          aiResponse = `I am creating a ${sessionType} for you. Meanwhile, could you let me know what kind of metaphors or words make you soothed?`;
        } else if (nextStep === 4) {
          aiResponse = `Great, here is the ${sessionType} for you.`;
          setChatMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
          setIsAITyping(false);
          setChatStep(nextStep);

          setTimeout(() => {
            setLoading(true);
            setScreen('loading');
            startCreation();
          }, 2000);
          return;
        }

        setChatMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
        setIsAITyping(false);
        setChatStep(nextStep);
      }, 1500);
    }, 500);
  };

  const startCreation = async () => {
    const result =
      sessionType === 'meditation'
        ? await generateMeditation(thought)
        : await generateAffirmations(situation, metaphors);
    setContent(result);
    setLoading(false);
    setScreen('player');
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    setTimeout(() => {
      setScreen('home');
      setSituation('');
      setMetaphors('');
      setThought('');
      setContent(null);
      setRating(0);
    }, 1500);
  };

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <ImageBackground
        source={{ uri: 'https://i.imgur.com/fbzJOtU.png' }}
        className="flex-1"
        resizeMode="cover">
        <View className="flex-1 p-6">
          <View className="p-6">
            <Text className="mb-2 text-4xl font-bold text-white">Welcome to Orpheus!</Text>
            <Text className="text-lg leading-relaxed text-gray-300">
              Personalized affirmations and meditations to reset your mind and reduce stress.
            </Text>
          </View>

          <FloatingCharacter
            source={{ uri: 'https://i.imgur.com/S7Y4wsi.png' }}
            delay={0}
            style={{ position: 'absolute', left: 40, top: '40%' }}
          />

          <FloatingCharacter
            source={{ uri: 'https://i.imgur.com/SycdrUU.png' }}
            delay={1.5}
            style={{ position: 'absolute', right: 40, bottom: 200, transform: [{ scale: 1.2 }] }}
          />

          <View className="absolute bottom-6 left-6 right-6">
            <TouchableOpacity
              onPress={() => setScreen('name')}
              className="rounded-2xl bg-blue-500 py-4">
              <Text className="text-center text-xl font-semibold text-white">Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  // Name Input Screen
  if (screen === 'name') {
    return (
      <View className="flex-1 bg-[#141529] p-6">
        <Text className="mb-8 text-3xl font-bold text-white">What should we call you?</Text>

        <TextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="Type something..."
          placeholderTextColor="#9ca3af"
          className="mb-8 rounded-xl border border-indigo-800 bg-indigo-900/50 p-4 text-white"
        />

        <View className="absolute bottom-6 left-6 right-6">
          <TouchableOpacity
            onPress={() => setScreen('home')}
            disabled={!userName.trim()}
            className={`rounded-2xl py-4 ${userName.trim() ? 'bg-blue-500' : 'bg-gray-600'}`}>
            <Text className="text-center text-xl font-semibold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Home Screen
  if (screen === 'home') {
    return (
      <View className="flex-1 bg-[#141529] p-6">
        <Text className="mb-8 text-3xl font-bold text-white">What do you need right now?</Text>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => startChat('meditation')}
            className="h-64 w-full overflow-hidden rounded-3xl">
            <ImageBackground
              source={{ uri: 'https://i.imgur.com/WPshCbq.png' }}
              className="h-full w-full justify-end p-4"
              resizeMode="cover">
              <Text className="text-xl font-semibold text-white">Meditation</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => startChat('affirmations')}
            className="mt-4 h-64 w-full overflow-hidden rounded-3xl">
            <ImageBackground
              source={{ uri: 'https://i.imgur.com/zoY5y9X.png' }}
              className="h-full w-full justify-end p-4"
              resizeMode="cover">
              <Text className="text-xl font-semibold text-white">Affirmations</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Chat Screen
  if (screen === 'chat') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-[#141529]">
        <View className="flex-row items-center justify-between p-6">
          <TouchableOpacity onPress={() => setScreen('home')} className="p-2">
            <Text className="text-2xl text-white">{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('home')} className="p-2">
            <Text className="text-2xl text-white">{'X'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6">
          {chatMessages.map((msg, index) => (
            <View
              key={index}
              className={`mb-4 ${msg.sender === 'ai' ? 'items-start' : 'items-end'}`}>
              <View
                className={`max-w-[75%] rounded-2xl p-4 ${
                  msg.sender === 'ai' ? 'bg-purple-900/20' : 'bg-blue-500'
                }`}>
                <Text className="text-base text-white">{msg.text}</Text>
              </View>
            </View>
          ))}

          {isAITyping && (
            <View className="mb-4 items-start">
              <View className="flex-row space-x-1 rounded-2xl bg-purple-900/20 p-4">
                <View className="h-2 w-2 rounded-full bg-purple-400" />
                <View className="h-2 w-2 rounded-full bg-purple-400" />
                <View className="h-2 w-2 rounded-full bg-purple-400" />
              </View>
            </View>
          )}
        </ScrollView>

        <View className="flex-row items-center border-t border-indigo-800 p-4">
          <TextInput
            value={userInput}
            onChangeText={setUserInput}
            onSubmitEditing={handleSendMessage}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            className="mr-3 flex-1 rounded-3xl bg-indigo-900/30 px-4 py-3 text-white"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!userInput.trim()}
            className={`h-12 w-12 items-center justify-center rounded-full ${
              userInput.trim() ? 'bg-blue-500' : 'bg-gray-600'
            }`}>
            <Text className="text-xl text-white">{'>'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Loading Screen
  if (loading || screen === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-[#141529]">
        <BreathingAnimation />
        <Text className="mt-12 text-xl text-white">
          {sessionType === 'affirmations'
            ? 'Creating affirmation audio'
            : 'Creating meditation audio'}
        </Text>
      </View>
    );
  }

  // Player Screen
  if (screen === 'player' && content) {
    return (
      <ScrollView className="flex-1 bg-[#141529] p-6">
        <View className="mb-8 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setScreen('rating')} className="p-2">
            <Text className="text-2xl text-white">{'<'}</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <View className="mb-6 h-80 w-80 overflow-hidden rounded-full">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
              }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>

          <Text className="mb-6 text-2xl font-bold text-white">{content.title}</Text>

          <View className="mb-6 w-full rounded-xl bg-indigo-900/30 p-4">
            {(sessionType === 'affirmations' ? content.affirmations : content.script)?.map(
              (line, i) => (
                <Text key={i} className="mb-2 text-sm text-gray-300">
                  {line}
                </Text>
              )
            )}
          </View>

          <View className="w-full space-y-3">
            <TouchableOpacity
              onPress={() => setScreen('chat')}
              className="w-full rounded-2xl bg-blue-500 py-4">
              <Text className="text-center text-lg font-semibold text-white">Change Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setScreen('rating')}
              className="w-full rounded-2xl bg-blue-500 py-4">
              <Text className="text-center text-lg font-semibold text-white">Save To Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Rating Screen
  if (screen === 'rating') {
    return (
      <View className="flex-1 items-center justify-center bg-[#141529] p-6">
        <View className="mb-12 items-center">
          <BreathingAnimation />
          <Text className="mb-4 mt-8 text-3xl font-bold text-white">
            How helpful was this session?
          </Text>
          <Text className="text-gray-300">Your feedback helps us personalize future sessions</Text>
        </View>

        <View className="mb-8 flex-row space-x-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <Text className={`text-5xl ${star <= rating ? 'text-yellow-400' : 'text-gray-500'}`}>
                {'\u2605'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <View className="items-center">
            <Text className="mb-2 text-xl text-green-400">
              {'\u2713'} Thank you for your feedback!
            </Text>
            <Text className="text-gray-400">Redirecting to home...</Text>
          </View>
        )}
      </View>
    );
  }

  return null;
}
