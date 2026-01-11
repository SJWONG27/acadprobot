import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUser } from '../services/authService'
import { sendMessage, getMessages, getChatSessions, deleteChatSession } from "../services/chatService";
import { joinChatbot, leaveChatbot, getChatbotUnderUser } from "../services/chatbotService";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const ChatContentContext = createContext();

export const ChatContentProvider = ({ children }) => {
    const [alertLoginChat, setAlertLoginChat] = useState(false);
    const [successAlertMessage, setSuccessAlertMessage] = useState("");
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [pendingDeleteID, setPendingDeleteID] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token");
                return;
            }

            try {
                const data = await getCurrentUser(token);
                setUserEmail(data.data.email);
                setUserId(data.data.id);
            } catch (error) {
                console.error("Fetch user id error: ", error)
                setAlertLoginChat(true);
            }
        }
        fetchUser();
    }, [localStorage.getItem("token")])

    //list of chatbot handling
    const [selectedChatbotId, setSelectedChatbotId] = useState("");
    const [refercode, setRefercode] = useState("");
    const [listChatbots, setListChatbots] = useState([]);

    const [searchParams] = useSearchParams();
    const chatbotIdFromUrl = searchParams.get("chatbot_id");

    useEffect(() => {
        if (chatbotIdFromUrl) {
            setSelectedChatbotId(chatbotIdFromUrl);
        }
    }, [chatbotIdFromUrl, setSelectedChatbotId]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatbots = async () => {
            if (!userId) return;
            try {
                const data = await getChatbotUnderUser(userId);
                setListChatbots(data);
            } catch (error) {
                console.error("Fetch chatbots error: ", error)
                toast.error("Unable to retrieve chatbots. Please try again!")
            }
        }
        fetchChatbots();
    }, [userId])

    const handleJoinChatbot = async () => {
        try {
            await joinChatbot(userId, refercode);
            toast.success("Chatbot joined successfully");

            const data = await getChatbotUnderUser(userId);
            setListChatbots(data);
        } catch (error) {
            console.error("HandleJoinChatbot: ", error);
            toast.error("Chatbot not found or already joined.")
        } finally {
            setRefercode("");
        }
    }

    const handleLeaveChatbot = async (chatbot_id) => {
        try {
            await leaveChatbot(userId, chatbot_id);
            toast.success("Chatbot leaved successfully");

            const data = await getChatbotUnderUser(userId);
            setListChatbots(data);
        } catch (error) {
            console.error("handleLeaveChatbot: ", error);
            toast.error("Fail to leave the chatbot. Please try again!")
        } 
    }


    const handleEnterChatbot = (chatbot_id) => {
        setSelectedChatbotId(chatbot_id);
        console.log(chatbot_id);
        navigate(`/chat?chatbot_id=${chatbot_id}`);
        window.location.reload();
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
        toast.success("Logout successfully");
    }


    // chat
    const handleClickRocket = () => {
        navigate("/listofchatbots")
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    useEffect(() => {
        const fetchChatSession = async () => {
            if (!userId || !selectedChatbotId) return;
            try {
                const res = await getChatSessions(userId, selectedChatbotId);
                setChatSessions(res);
            } catch (error) {
                console.error("Fetch chat session error: ", error)
                toast.error("Fail to fetch chat session. Please try again!")
            }
        }
        fetchChatSession();
    }, [userId, selectedChatbotId])


    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedSessionId) return;
            if (typeof selectedSessionId === "string" && selectedSessionId.startsWith("temp-")) return;

            try {
                const res = await getMessages(selectedSessionId);
                setMessages(res);
            } catch (error) {
                console.error("Failed to fetch messages", error);
                toast.error("Fail to fetch messages. Please try again!")
            }
        };

        fetchMessages();
    }, [selectedSessionId]);


    const handleSend = async () => {
        if (!input.trim()) return;
        if (!userId) {
            console.error("no user id fetched");
            return;
        }
        if(!selectedChatbotId) return;

        // ✨ Optimistically create a temp session ID (for new chat)
        let tempSessionId = selectedSessionId;
        if (!tempSessionId) {
            tempSessionId = `temp-${Date.now()}`;
            const tempSession = {
                id: tempSessionId,
                title: "New Chat",
                temp: true,
                messages: [],
            };
            setChatSessions((prev) => [tempSession, ...prev]);
            setSelectedSessionId(tempSessionId);
        }

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Show bot typing message
        const typingMsg = { role: "assistant", content: "..." };
        setMessages((prev) => [...prev, typingMsg]);

        try {
            // console.log(selectedChatbotId);
            const data = await sendMessage(userId, selectedChatbotId, input, selectedSessionId);

            // Replace typing msg with real bot response
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: data.response };
                return updated;
            });

            // 🆕 When backend returns actual session_id, replace temp one
            if (data.session_id && !selectedSessionId) {
                setSelectedSessionId(data.session_id);
                setChatSessions((prev) =>
                    prev.map((s) =>
                        s.id === tempSessionId
                            ? { id: data.session_id, title: "New Chat" }
                            : s
                    )
                );
            }

            // Refresh sessions (non-blocking)
            getChatSessions(userId, selectedChatbotId)
                .then((res) => setChatSessions(res))
                .catch((err) => console.error("refresh chat sessions failed:", err));

        } catch (error) {
            console.error("Request handleSend failed:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops, something went wrong 😅" },
            ]);
            toast.error("Fail to send message. Please try again!")
        }
    };

    const toggleNewChat = () => {
        setSelectedSessionId(null);
        setMessages([]);
        window.location.reload();
    }

    const confirmDelete = async (session_id) => {
        setPendingDeleteID(session_id);
        setConfirmationModal(true);
    };

    const cancelDelete = () => {
        setConfirmationModal(false);
        setPendingDeleteID(null);
    }

    const deleteChat = async () => {
        if (!pendingDeleteID) return;

        try {
            await deleteChatSession(pendingDeleteID);

            const res = await getChatSessions(userId);
            setChatSessions(res);
            const mes = await getMessages(selectedSessionId);
            setMessages(mes);
        } catch (error) {
            console.error("Delete chat: ", error);
            toast.error("Fail to delete chat session. Please try again!")
        } finally {
            setPendingDeleteID(null);
            setConfirmationModal(false);
            window.location.reload();
        }
    }

    const triggerConfirmationModal = (title) => {
        setConfirmationModal(title);
        triggerAlert("Deleted Successfully");
    }

    const triggerAlert = (message) => {
        setSuccessAlertMessage(message);
        setTimeout(() => setSuccessAlertMessage(""), 3000);
    };

    return (
        <ChatContentContext.Provider
            value={({
                alertLoginChat,
                setAlertLoginChat,
                successAlertMessage,
                setSuccessAlertMessage,
                confirmationModal,
                setConfirmationModal,
                confirmDelete,
                cancelDelete,
                isSidebarOpen,
                setIsSidebarOpen,
                userEmail,
                userId,
                refercode,
                setRefercode,
                listChatbots,
                setUserId,
                chatSessions,
                setChatSessions,
                selectedSessionId,
                setSelectedSessionId,
                messages,
                setMessages,
                input,
                setInput,
                toggleSidebar,
                deleteChat,
                handleSend,
                toggleNewChat,
                selectedChatbotId,
                setSelectedChatbotId,
                handleJoinChatbot,
                handleEnterChatbot,
                handleLeaveChatbot,
                handleLogout,
                handleClickRocket
            })}
        >
            {children}
        </ChatContentContext.Provider>
    )

}

export const useChatContent = () => useContext(ChatContentContext)