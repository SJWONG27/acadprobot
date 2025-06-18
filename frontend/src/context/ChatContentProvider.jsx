import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from '../services/authService'
import { sendMessage, getMessages, getChatSessions, deleteChatSession } from "../services/chatService";


const ChatContentContext = createContext();

export const ChatContentProvider = ({ children }) => {
    const [successAlertMessage, setSuccessAlertMessage] = useState("");
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [pendingDeleteID, setPendingDeleteID] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userId, setUserId] = useState("");
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token");
                return;
            }

            try {
                const data = await getCurrentUser(token);
                setUserId(data.data.id);
            } catch (error) {
                console.error("Fetch user id error: ", error)
            }
        }
        fetchUser();
    }, [])


    useEffect(() => {
        const fetchChatSession = async () => {
            if (!userId) return;
            try {
                const res = await getChatSessions(userId);
                setChatSessions(res);
            } catch (error) {
                console.error("Fetch chat session error: ", error)
            }
        }
        fetchChatSession();
    }, [userId])


    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedSessionId) return;

            try {
                const res = await getMessages(selectedSessionId);
                setMessages(res);
            } catch (error) {
                console.error("Failed to fetch chat messages", error);
            }
        };

        fetchMessages();
    }, [selectedSessionId]);

    
    const handleSend = async () => {
        if (!input.trim()) return;
        if (!userId) {
            console.error("no user id fetched");
        }
        const newMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        try {
            const data = await sendMessage(userId, input, selectedSessionId);
            setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);

            if (data.session_id && !selectedSessionId) setSelectedSessionId(data.session_id);

            const res = await getChatSessions(userId);
            setChatSessions(res);
        } catch (error) {
            console.error("Request handleSend failed:", error);
        }
    };

    const toggleNewChat = () => {
        setSelectedSessionId(null);
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
        if(!pendingDeleteID) return;

        try {
            await deleteChatSession(pendingDeleteID);

            const res = await getChatSessions(userId);
            setChatSessions(res);
            const mes = await getMessages(selectedSessionId);
            setMessages(mes);
        } catch (error) {
            console.error("Delete chat: ", error);
        } finally{
            setPendingDeleteID(null);
            setConfirmationModal(false);  
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
                successAlertMessage, 
                setSuccessAlertMessage,
                confirmationModal, 
                setConfirmationModal,
                confirmDelete,
                cancelDelete,
                isSidebarOpen,
                setIsSidebarOpen,
                userId,
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
            })}
        >
            {children}
        </ChatContentContext.Provider>
    )

}

export const useChatContent = () => useContext(ChatContentContext)