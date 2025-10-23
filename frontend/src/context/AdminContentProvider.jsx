import { createContext, useContext, useState, useEffect } from "react";
import {
    getChatbotsOfAdmin,
    uploadDocs,
    getDocs,
    uploadWebsiteDocs,
    getWebsiteDocs,
    deleteDocument,
    deleteWebsiteDocument,
    getUsersUnderChatbot,
    deleteUsersFromChatbot
} from "../services/adminService";

import { getCurrentUser } from "../services/authService";

const AdminContentContext = createContext();

export const AdminContentProvider = ({ children }) => {
    const [chatbotsUnderAdmin, setChatbotsUnderAdmin] = useState("");
    const [adminId, setAdminId] = useState("");
    const [chatbotId, setChatbotId] = useState("");
    const [selectedChatbot, setSelectedChatbot] = useState(null);

    const [successAlertMessage, setSuccessAlertMessage] = useState("");
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [pendingDeleteID, setPendingDeleteID] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState("");

    const [fileUpload, setFileUpload] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [showDocPanel, setShowDocPanel] = useState(false);

    const [websiteUpload, setWebsiteUpload] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [showWebsiteDocPanel, setShowWebsiteDocPanel] = useState(false);

    useEffect(() => {
        const fetchCurrentAdmin = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token in fetchCurrentAdmin");
                return;
            }
            try {
                const data = await getCurrentUser(token);
                setAdminId(data.data.id);
            } catch (error) {
                console.error("fetchCurrentAdmin", error);
            }
        }
        fetchCurrentAdmin();
    }, [])

    useEffect(() => {
        const fetchChatbotsUnderAdmin = async () => {
            if (!adminId || adminId.length < 10) return;
            try {
                const response = await getChatbotsOfAdmin(adminId);
                setChatbotsUnderAdmin(response);
            } catch (error) {
                console.error("fetchChatbotsUnderAdmin", error);
            }
        }
        fetchChatbotsUnderAdmin();
    }, [adminId])

    const handleDocsUpload = async () => {
        if (!fileUpload) return;

        const chatbotId = selectedChatbot.id;
        console.log(chatbotId)
        if (!chatbotId) {
            console.error("No chatbot id");
            return;
        }
        try {
            await uploadDocs(fileUpload, chatbotId);
            setFileUpload(null);
            setShowDocPanel(false);

            const updatedDocs = await getDocs(chatbotId);
            setDocuments(updatedDocs);

            triggerAlert("Document uploading");
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleWebsiteDocsUpload = async () => {
        if (!websiteUpload) return;
        if (!websiteUpload.startsWith("http")) {
            alert("Please enter a valid URL");
            return;
        }

        const chatbotId = selectedChatbot.id;
        if (!chatbotId) {
            console.error("No chatbot id");
            return;
        }

        try {
            await uploadWebsiteDocs(websiteUpload, chatbotId);
            setWebsiteUpload(null);
            setShowWebsiteDocPanel(false);

            const updatedSites = await getWebsiteDocs(chatbotId);
            setWebsites(updatedSites);

            triggerAlert("Website uploading");
        } catch (err) {
            console.error("Website upload error:", err);
        }
    };

    const confirmDelete = async (id) => {
        setPendingDeleteID(id);
        setConfirmationModal(true);
    };

    const confirmDeleteDoc = (id) => {
        setDeleteTarget("document");
        setPendingDeleteID(id);
        setConfirmationModal(true);
    };

    const confirmDeleteWebsiteDoc = (id) => {
        setDeleteTarget("website");
        setPendingDeleteID(id);
        setConfirmationModal(true);
    };


    const cancelDelete = () => {
        setConfirmationModal(false);
        setPendingDeleteID(null);
    }

    const handleDeleteDoc = async () => {
        const chatbotId = selectedChatbot.id;
        if (!chatbotId) {
            console.error("No chatbot id");
            return;
        }
        try {
            await deleteDocument(pendingDeleteID);
            const updatedDocs = await getDocs(chatbotId);
            setDocuments(updatedDocs);
        } catch (err) {
            console.error("Delete doc error:", err);
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
        }
    };

    const hanldeDeleteWebsiteDoc = async () => {
        const chatbotId = selectedChatbot.id;
        if (!chatbotId) {
            console.error("No chatbot id");
            return;
        }

        try {
            await deleteWebsiteDocument(pendingDeleteID);

            const updatedSites = await getWebsiteDocs(chatbotId);
            setWebsites(updatedSites);
        } catch (err) {
            console.error("Delete website error:", err);
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
        }
    };

    // access control page
    const [usersUnderChatbot, setUsersUnderChatbot] = useState([]);

    useEffect(() => {
        const fetchUsersUnderChatbot = async () => {
            if (!selectedChatbot) return;
            try {
                const data = await getUsersUnderChatbot(selectedChatbot.id);
                setUsersUnderChatbot(data);
            } catch (error) {
                console.error("fetchUsersUnderChatbot", error);
            }
        }
        fetchUsersUnderChatbot()
    }, [selectedChatbot])


    const confirmRevokeUser = async (userId) => {
        if (!selectedChatbot || !usersUnderChatbot) return;
        setPendingDeleteID(userId);
        setConfirmationModal(true);
    };

    const handleRevokeUserAccess = async() => {
        if (!selectedChatbot || !pendingDeleteID) {
            console.log("selectedChatbot: ", selectedChatbot?.id || null);
            console.log("pendingDeleteID: ", pendingDeleteID);
            return;
        };
        try {
            await deleteUsersFromChatbot(selectedChatbot.id, pendingDeleteID);

            const data = await getUsersUnderChatbot(selectedChatbot.id);
            setUsersUnderChatbot(data);
        } catch (error) {
            console.error("handleRevokeUserAccess", error)
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
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
        <AdminContentContext.Provider
            value={{
                confirmationModal,
                setConfirmationModal,
                confirmDelete,
                confirmDeleteDoc,
                confirmDeleteWebsiteDoc,
                cancelDelete,
                pendingDeleteID,
                setPendingDeleteID,
                deleteTarget,
                setDeleteTarget,
                successAlertMessage,
                setSuccessAlertMessage,
                fileUpload,
                setFileUpload,
                documents,
                setDocuments,
                showDocPanel,
                setShowDocPanel,
                websiteUpload,
                setWebsiteUpload,
                websites,
                setWebsites,
                showWebsiteDocPanel,
                setShowWebsiteDocPanel,
                handleDocsUpload,
                handleWebsiteDocsUpload,
                handleDeleteDoc,
                hanldeDeleteWebsiteDoc,
                chatbotsUnderAdmin,
                adminId,
                selectedChatbot,
                setSelectedChatbot,
                usersUnderChatbot,
                confirmRevokeUser,
                handleRevokeUserAccess
            }}
        >
            {children}
        </AdminContentContext.Provider>
    );
};

export const useAdminContent = () => useContext(AdminContentContext);