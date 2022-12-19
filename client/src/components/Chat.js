import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import io from 'socket.io-client';
import {Link, useOutletContext, useParams} from 'react-router-dom';

import {
    makeStyles,
    Avatar,
    IconButton
  } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Circle } from "better-react-spinkit";
import person_placeholder from '../img/person_placeholder.jpeg';
// import '../css/Chat.css';
//import 'bootstrap/dist/css/bootstrap.min.css';



const Chat = () => {
    const {
        eventId
    } = useParams();
    const auth = useOutletContext();
    const userId = auth.userId;
    console.log(eventId, userId);
    const classes = useStyles();
    // const [page404, setPage404] = useState(false);
    const [loading, setLoading] = useState(true);
    const [inputMsg, setInputMsg] = useState('');
    const endOfMsgsRef = useRef(null);
    const socketRef = useRef();
    const [eventChats, setEventChats] = useState([]);
    const [chatId, setChatId] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const {data} = await axios.get(`/chat/${eventId}/${userId}`);
                console.log(data);
                setEventChats(data.eventChats);
                setChatId(data.eventChats[0]?._id);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
        fetchData();
        socketRef.current = io('/');
        console.log('making connection');
        socketRef.current.on("connect", () => {
            console.log('socket id', socketRef.current.id);
            socketRef.current.emit("setupUser", {userId});
            setInputMsg('');
            scrollToBottom();
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on('message', (msgObj) => {
            console.log('socket id', socketRef.current.id);
            console.log('incoming msg', msgObj);
            console.log(eventChats);
            updateChat(msgObj);
            scrollToBottom();
        });
    }, [eventChats]);

    const updateChat = (msgObj) => {
        console.log('updating chat', msgObj);
        const copyChats = JSON.parse(JSON.stringify(eventChats));
        console.log(copyChats);
        copyChats.find(chat => chat._id === msgObj.chatId)?.messages.push(msgObj);
        setEventChats(copyChats);
    };

    const sendMessage = () => {
        console.log(inputMsg);
        const msgObj = {
            chatId,
            userId,
            msgText: inputMsg,
            timestamp: new Date().getTime()
        };
        updateChat(msgObj);
        socketRef.current.emit('message', msgObj);
        setInputMsg('');
        scrollToBottom();
    };

    const changeChat = (chatId) => {
        setChatId(chatId);
        setInputMsg('');
        scrollToBottom();
    };

    const scrollToBottom = () => {
        endOfMsgsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    const chatMsgs = eventChats.find(chat => chat._id === chatId);

    const showMsgs = () => {
        return chatMsgs?.messages.map((msg) => {
            const msgClass = msg.userId===userId ? classes.senderElement : classes.receiverElement;
            return (
                <div key={msg.msgId}>
                    <p className={msgClass}>
                        {msg.msgText}<span className={classes.msgTimestamp}>{msg.timestamp ? moment(msg.timestamp).format("LT") : "..."}</span>
                    </p>
                </div>
            );
        });
    };

    if (loading) return (
        <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
            <div>
                <img src={person_placeholder}
                    alt="placeholder"
                    style={{ marginBottom: 10 }}
                    height={200}
                />
                <Circle color="black" size={60} />
            </div>
        </center>
    );

    return (
        <div className={classes.page}>
            <div className={classes.sideBar}>
                <div className={classes.sideHeader}>
                    <div>
                        <IconButton>
                            <Link to={`/event/${eventId}`}>
                                <ArrowBackIcon />
                            </Link>
                        </IconButton>
                    </div>
                    <h3>Event Chat</h3>
                </div>
                {eventChats.map(chat => (
                    <div className={classes.chatTile} onClick={() => changeChat(chat._id)} key={chat._id}>
                        <Avatar className={classes.userAvatar} src={person_placeholder}/>
                        <p>{chat.userId===userId ? chat.hostName : chat.userName}</p>
                    </div >
                ))}
            </div>
            <div className={classes.chatContainer}>
                {chatMsgs ? <div className={classes.chatHeader}>
                    <Avatar src={person_placeholder} />
                    <div className={classes.headerInfo}>
                        <h3>{chatMsgs.userId===userId ? chatMsgs.hostName : chatMsgs.userName}</h3>
                    </div>
                </div> : undefined}
                <div className={classes.msgContainer}>
                    {showMsgs()}
                    <div className={classes.endOfMsg} ref={endOfMsgsRef}/>
                </div>
                <form className={classes.inputContainer}>
                    <input className={classes.input} value={inputMsg} onChange={e => setInputMsg(e.target.value)} />
                    <button hidden disabled={!inputMsg.trim()} type="submit" onClick={() => sendMessage()} />
                </form>
            </div>
        </div>
    );
};


export default Chat;


const useStyles = makeStyles({
    page: {
        'display': 'flex'
    },
    sideHeader: {
        'display': 'flex',
        'position': 'sticky',
        'top': 0,
        'background-color': 'white',
        'z-index': 1,
        'justify-content': 'start',
        'align-items': 'center',
        'padding': '15px',
        'height': '60px',
        'border-bottom': '1px solid whitesmoke'
    },
    chatTile: {
        'display': 'flex',
        'align-items': 'center',
        'cursor': 'pointer',
        'padding': '15px',
        'word-break': 'break-word',
        '&:hover': {
            'background-color': '#e9eaeb'
        }
    },
    userAvatar: {
        'margin': '5px',
        'margin-right': '15px'
    },
    sideBar: {
        'flex': '0.45',
        'border-right': '1px solid whitesmoke',
        'height': '100vh',
        'min-width': '300px',
        'max-width': '350px',
        'overflow-y': 'scroll',
        '&::-webkit-scrollbar': {
            'display': 'none'
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
    },
    chatContainer: {
        'flex': 1,
        'overflow': 'scroll',
        'height': '100vh',
        '&::-webkit-scrollbar': {
            'display': 'none'
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
    },
    chatHeader: {
        'position': 'sticky',
        'background-color': 'white',
        'z-index': '100',
        'top': 0,
        'display': 'flex',
        'padding': '11px',
        'height': '60px',
        'align-items': 'center',
        'border-bottom': '1px solid whitesmoke'
    },
    headerInfo: {
        'margin-left': '15px',
        'flex': 1,
        '& > h3': {
            'margin-bottom': '3px'
        },
        '& > p': {
            'font-size': '14px',
            'color': 'gray'
        }
    },
    msgContainer: {
        'padding': '30px',
        'background-color': '#e5ded8',
        'min-height': '90vh'
    },
    msgElement: {
        'width': 'fit-content',
        'padding': '15px',
        'border-radius': '8px',
        'margin': '10px',
        'min-width': '60px',
        'padding-bottom': '26px',
        'position': 'relative',
        'text-align': 'right'
    },
    senderElement: {
        'width': 'fit-content',
        'padding': '15px',
        'border-radius': '8px',
        'margin': '10px',
        'min-width': '60px',
        'padding-bottom': '26px',
        'position': 'relative',
        'text-align': 'right',
        'margin-left': 'auto',
        'background-color': '#dcf8c6'
    },
    receiverElement: {
        'width': 'fit-content',
        'padding': '15px',
        'border-radius': '8px',
        'margin': '10px',
        'min-width': '60px',
        'padding-bottom': '26px',
        'position': 'relative',
        'text-align': 'left',
        'background-color': 'whitesmoke'
    },
    msgTimestamp: {
        'color': '#6d6d6d',
        'padding': '10px',
        'font-size': '9px',
        'position': 'absolute',
        'bottom': 0,
        'text-align': 'right',
        'right': 0
    },
    endOfMsg: {
        'margin-bottom': '50px'
    },
    inputContainer: {
        'display': 'flex',
        'align-items': 'center',
        'padding': '10px',
        'position': 'sticky',
        'bottom': 0,
        'background-color': 'white',
        'z-index': 100
    },
    input: {
        'flex': 1,
        'outline': 0,
        'border': 'none',
        'border-radius': '10px',
        'background-color': 'whitesmoke',
        'padding': '20px',
        'margin-left': '15px',
        'margin-right': '15px'
    }
});