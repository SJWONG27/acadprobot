import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

    const [selectedChatbotId, setSelectedChatbotId] = useState("");

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
            if (typeof selectedSessionId === "string" && selectedSessionId.startsWith("temp-")) return;

            try {
                const res = await getMessages(selectedSessionId);
                setMessages(res);
            } catch (error) {
                console.error("Failed to fetch chat messages", error);
            }
        };

        fetchMessages();
    }, [selectedSessionId]);


    //list of chatbot handling
    const [searchParams] = useSearchParams();
    const chatbotIdFromUrl = searchParams.get("chatbot_id");

    useEffect(() => {
        if (chatbotIdFromUrl) {
            setSelectedChatbotId(chatbotIdFromUrl);
        }
    }, [chatbotIdFromUrl, setSelectedChatbotId]);


    const handleSend = async () => {
        if (!input.trim()) return;
        if (!userId) {
            console.error("no user id fetched");
            return;
        }

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
            getChatSessions(userId)
                .then((res) => setChatSessions(res))
                .catch((err) => console.error("refresh chat sessions failed:", err));

        } catch (error) {
            console.error("Request handleSend failed:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops, something went wrong 😅" },
            ]);
        }
    };




    const toggleNewChat = () => {
        setSelectedSessionId(null);
        setMessages([]);
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
        } finally {
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
                selectedChatbotId,
                setSelectedChatbotId,
            })}
        >
            {children}
        </ChatContentContext.Provider>
    )

}

export const useChatContent = () => useContext(ChatContentContext)