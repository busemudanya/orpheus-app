import React, { useState, useEffect } from 'react';
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
  ImageSourcePropType
} from 'react-native';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledImageBackground = styled(ImageBackground);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

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
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {
    title: "I am confident",
    affirmations: [
      "I appreciate the little things you do for me",
      "You are a force of positivity and strength",
      "You are worthy of all the good things coming your way",
      "You are my anchor. You keep me grounded through the storms.",
      "You are a fantastic leader"
    ]
  };
};

const generateMeditation = async (thought: string): Promise<Content> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {
    title: "Peace and Clarity",
    script: [
      "Let's begin by finding a comfortable position...",
      "Notice the sensation of your breath...",
      "Your thought about feeling lacking is just that - a thought...",
      "You are complete exactly as you are...",
      "Let this truth settle into your being..."
    ]
  };
};

// Floating Character Component
interface FloatingCharacterProps {
  source: ImageSourcePropType;
  delay?: number;
  style?: any;
}

const FloatingCharacter: React.FC<FloatingCharacterProps> = ({ source, delay = 0, style }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      <StyledImage source={source} className="w-32 h-32" resizeMode="contain" />
    </Animated.View>
  );
};

// Breathing Animation Component
const BreathingAnimation: React.FC = () => {
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, []);

  return (
    <StyledView className="items-center justify-center">
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <StyledImage
          source={{ uri: 'https://i.imgur.com/S7Y4wsi.png' }}
          className="w-40 h-40"
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
          transform: [{ scale: scaleValue }]
        }}
      />
    </StyledView>
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(600);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
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
        setChatMessages([{
          sender: 'ai',
          text: `Hey ${userName}, how are you feeling today?`
        }]);
        setIsAITyping(false);
      }, 1500);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    const newMessage: Message = {
      sender: 'user',
      text: userInput
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    if (chatStep === 0) {
      setThought(userInput);
    } else if (chatStep === 1) {
      setSituation(userInput);
    }
    
    setUserInput('');
    
    setTimeout(() => {
      setIsAITyping(true);
      setTimeout(() => {
        let aiResponse = '';
        const nextStep = chatStep + 1;
        
        if (nextStep === 1) {
          aiResponse = 'Could you specify to me if there is any specific thoughts or situations causing you this?';
        } else if (nextStep === 2) {
          aiResponse = 'What exactly makes you nervous when you think of it?';
        } else if (nextStep === 3) {
          aiResponse = `I am creating a ${sessionType} for you. Meanwhile, could you let me know what kind of metaphors or words make you soothed?`;
        } else if (nextStep === 4) {
          aiResponse = `Great, here is the ${sessionType} for you.`;
          setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
          setIsAITyping(false);
          setMetaphors(userInput);
          
          setTimeout(() => {
            setLoading(true);
            setScreen('loading');
            startCreation();
          }, 2000);
          return;
        }
        
        setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        setIsAITyping(false);
        setChatStep(nextStep);
      }, 1500);
    }, 500);
  };

  const startCreation = async () => {
    const result = sessionType === 'meditation' 
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <StyledImageBackground
        source={{ uri: 'https://i.imgur.com/fbzJOtU.png' }}
        className="flex-1"
        resizeMode="cover"
      >
        <StyledView className="flex-1 p-6">
          <StyledView className="p-6">
            <StyledText className="text-4xl font-bold text-white mb-2">
              Welcome to Orpheus!
            </StyledText>
            <StyledText className="text-lg text-gray-300 leading-relaxed">
              Personalized affirmations and meditations to reset your mind and reduce stress.
            </StyledText>
          </StyledView>

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

          <StyledView className="absolute bottom-6 left-6 right-6">
            <StyledTouchableOpacity
              onPress={() => setScreen('name')}
              className="bg-blue-500 py-4 rounded-2xl"
            >
              <StyledText className="text-white text-xl font-semibold text-center">
                Get Started
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledImageBackground>
    );
  }

  // Name Input Screen
  if (screen === 'name') {
    return (
      <StyledView className="flex-1 bg-[#141529] p-6">
        <StyledText className="text-3xl font-bold text-white mb-8">
          What should we call you?
        </StyledText>
        
        <StyledTextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="Type something..."
          placeholderTextColor="#9ca3af"
          className="bg-indigo-900/50 text-white p-4 rounded-xl border border-indigo-800 mb-8"
        />

        <StyledView className="absolute bottom-6 left-6 right-6">
          <StyledTouchableOpacity
            onPress={() => setScreen('home')}
            disabled={!userName.trim()}
            className={`py-4 rounded-2xl ${userName.trim() ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            <StyledText className="text-white text-xl font-semibold text-center">
              Continue
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    );
  }

  // Home Screen
  if (screen === 'home') {
    return (
      <StyledView className="flex-1 bg-[#141529] p-6">
        <StyledText className="text-3xl font-bold text-white mb-8">
          What do you need right now?
        </StyledText>
        
        <StyledView className="space-y-4">
          <StyledTouchableOpacity
            onPress={() => startChat('meditation')}
            className="w-full h-64 rounded-3xl overflow-hidden"
          >
            <StyledImageBackground
              source={{ uri: 'https://i.imgur.com/WPshCbq.png' }}
              className="w-full h-full justify-end p-4"
              resizeMode="cover"
            >
              <StyledText className="text-xl font-semibold text-white">
                Meditation
              </StyledText>
            </StyledImageBackground>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={() => startChat('affirmations')}
            className="w-full h-64 rounded-3xl overflow-hidden mt-4"
          >
            <StyledImageBackground
              source={{ uri: 'https://i.imgur.com/zoY5y9X.png' }}
              className="w-full h-full justify-end p-4"
              resizeMode="cover"
            >
              <StyledText className="text-xl font-semibold text-white">
                Affirmations
              </StyledText>
            </StyledImageBackground>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    );
  }

  // Chat Screen
  if (screen === 'chat') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-[#141529]"
      >
        <StyledView className="flex-row justify-between items-center p-6">
          <StyledTouchableOpacity onPress={() => setScreen('home')} className="p-2">
            <StyledText className="text-white text-2xl">←</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={() => setScreen('home')} className="p-2">
            <StyledText className="text-white text-2xl">×</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledScrollView className="flex-1 px-6">
          {chatMessages.map((msg, index) => (
            <StyledView
              key={index}
              className={`mb-4 ${msg.sender === 'ai' ? 'items-start' : 'items-end'}`}
            >
              <StyledView
                className={`max-w-[75%] p-4 rounded-2xl ${
                  msg.sender === 'ai' ? 'bg-purple-900/20' : 'bg-blue-500'
                }`}
              >
                <StyledText className="text-white text-base">
                  {msg.text}
                </StyledText>
              </StyledView>
            </StyledView>
          ))}
          
          {isAITyping && (
            <StyledView className="items-start mb-4">
              <StyledView className="bg-purple-900/20 p-4 rounded-2xl flex-row space-x-1">
                <StyledView className="w-2 h-2 bg-purple-400 rounded-full" />
                <StyledView className="w-2 h-2 bg-purple-400 rounded-full" />
                <StyledView className="w-2 h-2 bg-purple-400 rounded-full" />
              </StyledView>
            </StyledView>
          )}
        </StyledScrollView>

        <StyledView className="flex-row items-center p-4 border-t border-indigo-800">
          <StyledTextInput
            value={userInput}
            onChangeText={setUserInput}
            onSubmitEditing={handleSendMessage}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-indigo-900/30 text-white px-4 py-3 rounded-3xl mr-3"
          />
          <StyledTouchableOpacity
            onPress={handleSendMessage}
            disabled={!userInput.trim()}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              userInput.trim() ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <StyledText className="text-white text-xl">➤</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </KeyboardAvoidingView>
    );
  }

  // Loading Screen
  if (loading || screen === 'loading') {
    return (
      <StyledView className="flex-1 bg-[#141529] items-center justify-center">
        <BreathingAnimation />
        <StyledText className="text-white text-xl mt-12">
          {sessionType === 'affirmations' ? 'Creating affirmation audio' : 'Creating meditation audio'}
        </StyledText>
      </StyledView>
    );
  }

  // Player Screen
  if (screen === 'player' && content) {
    return (
      <StyledScrollView className="flex-1 bg-[#141529] p-6">
        <StyledView className="flex-row justify-between items-center mb-8">
          <StyledTouchableOpacity onPress={() => setScreen('rating')} className="p-2">
            <StyledText className="text-white text-2xl">←</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledView className="items-center">
          <StyledView className="w-80 h-80 rounded-full overflow-hidden mb-6">
            <StyledImage
              source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </StyledView>

          <StyledText className="text-2xl font-bold text-white mb-6">
            {content.title}
          </StyledText>

          <StyledView className="w-full bg-indigo-900/30 rounded-xl p-4 mb-6">
            {(sessionType === 'affirmations' ? content.affirmations : content.script)?.map((line, i) => (
              <StyledText key={i} className="text-sm text-gray-300 mb-2">
                {line}
              </StyledText>
            ))}
          </StyledView>

          <StyledView className="w-full space-y-3">
            <StyledTouchableOpacity
              onPress={() => setScreen('chat')}
              className="w-full bg-blue-500 py-4 rounded-2xl"
            >
              <StyledText className="text-white text-lg font-semibold text-center">
                ✨ Change
              </StyledText>
            </StyledTouchableOpacity>
            
            <StyledTouchableOpacity
              onPress={() => setScreen('rating')}
              className="w-full bg-blue-500 py-4 rounded-2xl"
            >
              <StyledText className="text-white text-lg font-semibold text-center">
                ✨ Save To Library
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    );
  }

  // Rating Screen
  if (screen === 'rating') {
    return (
      <StyledView className="flex-1 bg-[#141529] items-center justify-center p-6">
        <StyledView className="items-center mb-12">
          <BreathingAnimation />
          <StyledText className="text-3xl font-bold text-white mb-4 mt-8">
            How helpful was this session?
          </StyledText>
          <StyledText className="text-gray-300">
            Your feedback helps us personalize future sessions
          </StyledText>
        </StyledView>

        <StyledView className="flex-row space-x-4 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <StyledTouchableOpacity
              key={star}
              onPress={() => handleRating(star)}
            >
              <StyledText className={`text-5xl ${star <= rating ? 'text-yellow-400' : 'text-gray-500'}`}>
                ★
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>

        {rating > 0 && (
          <StyledView className="items-center">
            <StyledText className="text-green-400 text-xl mb-2">
              ✓ Thank you for your feedback!
            </StyledText>
            <StyledText className="text-gray-400">
              Redirecting to home...
            </StyledText>
          </StyledView>
        )}
      </StyledView>
    );
  }

  return null;
}
