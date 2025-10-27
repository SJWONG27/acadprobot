import { createContext, useContext, useState, useEffect } from "react";

import {
    createChatbot,
    deleteChatbot,
    getAllChatbots,
    getAllRequest
} from "../services/superadminService"

const SuperAdminContentContext = createContext();

export const SuperAdminContentProvider = ({ children }) => {
    const [chatbotName, setChatbotName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");

    const [successAlertMessage, setSuccessAlertMessage] = useState("");
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [pendingDeleteID, setPendingDeleteID] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState("");

    const handleChatbotCreate = async (chatbotName, adminEmail) => {
        try {
            await createChatbot(chatbotName, adminEmail);
        } catch (error) {
            console.error("Error creating chatbot", error)
        }
    }

    const confirmDelete = async (id) => {
        setPendingDeleteID(id);
        setConfirmationModal(true);
    };

    const [chatbots, setChatbots] = useState([]);

    const fetchChatbotsDetails = async()=>{
        try {
            const response = await getAllChatbots();
            console.log(response);
            setChatbots(response);
        } catch (error) {
            console.error("Failed to fetch chatbots :", error);
        }
    }

    const handleDeleteChatbot = async() => {
        try {
            await deleteChatbot(pendingDeleteID);
            
            fetchChatbotsDetails;
        } catch (error) {
            console.error("Delete chatbot error: ", error);
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
            fetchChatbotsDetails();
        }
    }

    const cancelDelete = () => {
        setConfirmationModal(false);
        setPendingDeleteID(null);
    }

    // access management
    const [activeTab, setActiveTab] = useState("pending");
    const [requestSubmitted, setRequestSubmitted] = useState([]);

    useEffect(()=>{
        const fetchAllRequestByStatus = async() =>{
            try {
                const response = await getAllRequest(activeTab);
                console.log(response)
                setRequestSubmitted(response);
            } catch (error) {
                console.error("fetchAllRequestByStatus", error);
            }
        }
        fetchAllRequestByStatus()
    },[activeTab])

    return (
        <SuperAdminContentContext.Provider
            value={{
                chatbotName,
                setChatbotName,
                adminEmail,
                setAdminEmail,
                handleChatbotCreate,
                confirmDelete,
                cancelDelete,
                handleDeleteChatbot,
                chatbots,     //details
                setChatbots,  //details
                confirmationModal,
                setConfirmationModal,
                requestSubmitted
            }}
        >
            {children}
        </SuperAdminContentContext.Provider>
    );
};

export const useSuperAdminContent = () => useContext(SuperAdminContentContext);