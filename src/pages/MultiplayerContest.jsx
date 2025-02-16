import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import recording_animation from './../assets/recording_animation.gif';
import Microphone from '../components/SpeechRecognition';
import Timer from '../components/Timer';
import { InlineMath } from 'react-katex';
import axios from 'axios';
import { Setting2, Back} from 'iconsax-react';
import QuizComponent from '../components/QuizQuestion';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const MultiplayerContest = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const contestants = parseInt(localStorage.getItem('contestants'), 10) || 1;
    const [activeContestant, setActiveContestant] = useState(0);
    // const [timer, setTimer] = useState(30);
    const [scores, setScores] = useState(Array(contestants).fill(0));
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [gifKey, setGifKey] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [hasJoined, setHasJoined] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [mode, setMode] = useState(null);
    const [isCompetitionStarted, setIsCompetitionStarted] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideosRef = useRef(null);
    const [rtmClient, setRtmClient] = useState(null);
    const [rtmChannel, setRtmChannel] = useState(null);
    const [syncedTimer, setSyncedTimer] = useState(30);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    const rtc = {
        localAudioTrack: null,
        localVideoTrack: null,
        client,
    };

    useEffect(() => {
        const initializeRTM = async () => {
            const client = AgoraRTM.createInstance(options.appId);
            await client.login({ uid: options.uid.toString() });
            const channel = client.createChannel(options.channel);
            await channel.join();

            channel.on('ChannelMessage', handleChannelMessage);

            setRtmClient(client);
            setRtmChannel(channel);
        };

        initializeRTM();

        return () => {
            if (rtmChannel) rtmChannel.leave();
            if (rtmClient) rtmClient.logout();
        };
    }, []);

    const options = {
        appId: 'e2e07ac75a95411a9fcc062d9f004e17',
        channel: localStorage.getItem('channelName') || '',
        token: null,
        uid: Math.floor(Math.random() * 1000000),
    };
    const handleChannelMessage = (message, memberId) => {
        const data = JSON.parse(message.text);
        if (data.type === 'timer') {
            setSyncedTimer(data.value);
        }
    };

    const broadcastTimer = (time) => {
        if (rtmChannel) {
            rtmChannel.sendMessage({ text: JSON.stringify({ type: 'timer', value: time }) });
        }
    };

    useEffect(() => {
        const startBasicCall = async () => {
            rtc.client.on('user-published', async (user, mediaType) => {
                await rtc.client.subscribe(user, mediaType);
                console.log('subscribe success');

                if (mediaType === 'video') {
                    const remoteVideoTrack = user.videoTrack;
                    const remotePlayerContainer = document.createElement('div');
                    remotePlayerContainer.id = user.uid.toString();
                    remotePlayerContainer.textContent = 'Remote user ' + user.uid.toString();
                    remotePlayerContainer.style.width = '270px';
                    remotePlayerContainer.style.height = '240px';
                    remotePlayerContainer.style.margin = '10px';
                    remotePlayerContainer.style.border = '1px solid #ddd'; // Example border style
                    remotePlayerContainer.style.borderRadius = '0.5rem'; // Tailwind's rounded-lg equivalent
                    remotePlayerContainer.style.transition = 'transform 0.3s ease'; // Smooth transition for transform

                    if (remoteVideosRef.current) {
                        remoteVideosRef.current.append(remotePlayerContainer);
                    }

                    remoteVideoTrack.play(remotePlayerContainer);
                }

                if (mediaType === 'audio') {
                    const remoteAudioTrack = user.audioTrack;
                    remoteAudioTrack.play();
                }

                const { count } = await rtc.client.getUsers();
                if (count >= contestants) {
                    setIsCompetitionStarted(true);
                }
            });

            rtc.client.on('user-unpublished', (user) => {
                const remotePlayerContainer = document.getElementById(user.uid.toString());
                if (remotePlayerContainer) {
                    remotePlayerContainer.remove();
                }
            });

            rtc.client.on('user-joined', (user) => {
                console.log('User joined:', user.uid);
                if (user.uid !== options.uid) {
                    setIsCompetitionStarted(true);
                }
            });

            rtc.client.on('user-left', (user) => {
                console.log('User left:', user.uid);
                const remotePlayerContainer = document.getElementById(user.uid.toString());
                if (remotePlayerContainer) {
                    remotePlayerContainer.remove();
                }
            });
        };

        const initializeChannel = async () => {
            try {
                rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
                await startBasicCall();

                if (options.channel) {
                    setMode('join');
                    await joinChannel();
                } else {
                    setMode('create');
                }
            } catch (error) {
                console.error('Error initializing channel:', error);
            }
        };

        initializeChannel();

        return () => {
            if (rtc.client) {
                rtc.client.leave();
                if (rtc.localAudioTrack) rtc.localAudioTrack.close();
                if (rtc.localVideoTrack) rtc.localVideoTrack.close();
            }
        };
    }, []);


    useEffect(() => {
        // Create WebSocket connection when component mounts
        const roomId = options.channel || 'default-room';
    
        const ws = new WebSocket(`wss://9dr0x3rr-8000.euw.devtunnels.ms/multiplayer/ws/${roomId}`);
        
        ws.onopen = () => {
            console.log('WebSocket Connected');
            setConnected(true);
            setSocket(ws);
        };
    
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
                // case 'initial_state':
                //     // Server now sends only the current question instead of the full set.
                //     setQuestions([data.data.current_question]);
                //     setCurrentQuestionIndex(data.data.current_question_index);
                //     setTimer(data.data.timer);
                //     setActiveContestant(data.data.active_contestant);
                //     break;
    
                // case 'question_update':
                //     setCurrentQuestionIndex(data.data.current_question_index);
                //     // Replace current question with new question from the server.
                //     setQuestions([data.data.question]);
                //     setTimer(data.data.timer);
                //     setActiveContestant(data.data.active_contestant);
                //     break;
    
                case 'user_joined':
                    console.log(`${data.data.total_users} users in room`);
                    if (data.data.total_users >= 2) {
                        setIsCompetitionStarted(true);
                    }
                    break;
    
                // case 'timer':
                //     setTimer(data.data.timer);
                //     break;
    
                case 'next_contestant':
                    setActiveContestant(data.data.active_contestant);
                    setTimer(30);
                    setTranscript("");
                    setIsAnswering(true);
                    break;
    
                case 'answer_submitted':
                    setActiveContestant(data.data.next_contestant);
                    setCurrentQuestionIndex(data.data.current_question_index);
                    setTimer(30);
                    setTranscript("");
                    setIsAnswering(true);
                    break;
    
                case 'game_over':
                    alert("The game has ended!");
                    break;
    
                default:
                    console.log('Unknown message type:', data.type);
            }
        };
    
        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setConnected(false);
        };
    
        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    
        // Cleanup on component unmount
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [options.channel]);
    

    const joinChannel = async () => {
        try {
            if (!rtc.client) {
                throw new Error('AgoraRTC client is not initialized');
            }
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            await rtc.localVideoTrack.setEnabled(true);
            await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

            if (localVideoRef.current) {
                rtc.localVideoTrack.play(localVideoRef.current);
            }

            setHasJoined(true);
            console.log('publish success!');
        } catch (error) {
            console.error('Error joining or publishing:', error);
        }
    };

    const leaveChannel = async () => {
        try {
            if (rtc.localAudioTrack) rtc.localAudioTrack.close();
            if (rtc.localVideoTrack) rtc.localVideoTrack.close();

            if (localVideoRef.current) {
                localVideoRef.current.innerHTML = '';
            }

            if (remoteVideosRef.current) {
                remoteVideosRef.current.innerHTML = '';
            }

            await rtc.client.leave();
            setHasJoined(false);
            navigate('/');
        } catch (error) {
            console.error('Error leaving channel:', error);
        }
    };

    const handleCreateOrJoin = (action) => {
        if (channelName.trim() === '') {
            alert('Channel name cannot be empty');
            return;
        }
        setMode(action);
        if (action === 'join') {
            joinChannel();
        }
    };

    // useEffect(() => {
    //     fetch('http://127.0.0.1:8000/first_round/quiz')
    //       .then((response) => response.json())
    //       .then((data) => {
    //         console.log('Fetched questions:', data);
    //         setQuestions(data.questions || []);
    //       })
    //       .catch((error) => console.error('Error fetching questions:', error));
    //   }, []);

      const getCurrentQuestion = () => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
          const currentQuestion = questions[currentQuestionIndex];
          return currentQuestion['Question'];
        }
        return 'Loading questions...';
      };
    
    // useEffect(() => {
    //     if (questions.length > 0) {
    //       const questionText = extractPlainText(questions[currentQuestionIndex].Question);
    //       playQuestionAudio(questionText);
    //     }
    // }, [currentQuestionIndex, questions]);
      
    const extractPlainText = (question) => {
        if (typeof question === 'string') {
          return question;
        }
        if (Array.isArray(question)) {
          return question.map(part => 
            typeof part === 'string' ? part : ''
          ).join(' ');
        }
        return '';
    };
    
    const renderKatex = (text) => {
        const parts = text.split(/(\$.*?\$)/);
        return parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
            return <InlineMath key={index} math={part.slice(1, -1)} />;
          }
          return part;
        });
    };
    
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       setTimer((prevTimer) => {
    //         if (prevTimer === 1) {
    //           handleNextContestant();
    //           return 30;
    //         }
    //         return prevTimer - 1;
    //       });
    //     }, 1000);
    
    //     return () => clearInterval(interval);
    // }, [activeContestant, questions, currentQuestionIndex]);
    
    useEffect(() => {
        const gifInterval = setInterval(() => {
          setGifKey((prevKey) => prevKey + 1);
        }, 3000);
    
        return () => clearInterval(gifInterval);
    }, []);
    
    const handleNextContestant = () => {
        setActiveContestant((prev) => {
            const next = (prev + 1) % contestants;
            if (next === 0) {
                handleNextQuestion();
            }
            return next;
        });
        setTimer(30);
        setTranscript("");
        setIsAnswering(true);
    };
    
    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    };
    
    const handleTranscriptChange = (newTranscript) => {
        setTranscript(newTranscript);
    };
    
    const playQuestionAudio = (questionText) => {
        console.log('Playing question:', questionText);
    };
    
    const handleSubmitAnswer = () => {
        if (!questions[currentQuestionIndex]) return;
        
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = transcript.toLowerCase().includes(currentQuestion.Answer.toLowerCase());
    
        if (socket && connected) {
            socket.send(JSON.stringify({
                type: 'answer_submitted',
                data: {
                    contestant: activeContestant,
                    answer: transcript,
                    correct: isCorrect,
                    questionIndex: currentQuestionIndex
                }
            }));
        }
    
        setIsAnswering(false);
    };

    const handleStartCompetition = () => {
        if (contestants >= 2 && socket && connected) {
            socket.send(JSON.stringify({
                type: 'start_competition',
                data: {
                    contestants: contestants
                }
            }));
        } else if (contestants < 2) {
            alert('At least two users are required to start the competition.');
        }
    };

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
      };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            {isCompetitionStarted ? (
                <div className="relative text-center p-7 bg-white shadow-lg rounded-lg w-full max-w-6xl">
                    <div className="flex justify-between items-center">
                        <Back size="32" color="#555555" onClick={handleGoBack} className="cursor-pointer"/>
                        <Setting2 size="32" color="#555555" className="cursor-pointer"/>
                    </div>

                    <Timer 
                        socket={socket}
                        connected={connected}
                        activeContestant={activeContestant}
                    />
                    <div className='flex flex-col items-center'>
                        <div
                            className='border rounded-lg transition-transform'
                            style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}
                        >


                            <div
                                className='border rounded-lg transition-transform h-72'
                                ref={remoteVideosRef}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflowX: 'auto',
                                    alignItems: 'flex-start',
                                }}
                            >
                            <div
                                className='border rounded-lg transition-transform'
                                ref={localVideoRef}
                                style={{ width: '270px', height: '240px', margin: '11px' }}
                            >
                                Local user
                            </div>
                            </div>
                        </div>
                        <QuizComponent socket={socket} connected={connected} />
                        
                        <Microphone
                                socket={socket}
                                connected={connected}
                                activeContestant={activeContestant}
                                onTranscriptChange={(text) => setTranscript(text)}
                                showTranscript={true}
                            />
                    </div>
                        

                            <button className="GenerateFixtures bg-indigo-500 rounded-2xl shadow mt-5 p-1 mx-auto w-60 flex justify-center items-center" onClick={handleSubmitAnswer}>
                                <span className="SubmitAnswer text-white text-2xl font-light">Submit Answer</span>
                            </button>
                        
                </div>
            ) : (
                <div className="relative text-center p-10 bg-white shadow-lg rounded-lg w-full max-w-6xl">
                    <button
                        className='bg-green-500 text-white p-2 rounded mt-5'
                        type="button"
                        onClick={handleStartCompetition}
                        disabled={contestants < 2}
                    >
                        Start Competition!
                    </button>
                    <p className="text-lg mt-4">{contestants < 2 ? 'Waiting for more users to join...' : ''}</p>
                </div>
            )}
        </div>
    );
};

export default MultiplayerContest;