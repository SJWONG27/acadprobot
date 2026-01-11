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
import { sendChatbotInvitation } from "../services/emailService";
import { getCurrentUser } from "../services/authService";
import { toast } from 'react-toastify';


const AdminContentContext = createContext();

export const AdminContentProvider = ({ children }) => {
    const [alertLogin, setAlertLogin] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [chatbotsUnderAdmin, setChatbotsUnderAdmin] = useState("");
    const [adminId, setAdminId] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
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

    const [showGroupAccessPanel, setShowGroupAccessPanel ] = useState(false);


    useEffect(() => {
        const fetchCurrentAdmin = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token in fetchCurrentAdmin");
                setAlertLogin(true)
                return;
            }
            try {
                const data = await getCurrentUser(token);
                setAdminId(data.data.id);
                setAdminEmail(data.data.email);
            } catch (error) {
                setAlertLogin(true)
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
                toast.error("Unable to retrieve chatbots. Please try again!");
            }
        }
        fetchChatbotsUnderAdmin();
    }, [adminId])

    const handleDocsUpload = async () => {
        if (!fileUpload) return;

        const chatbotId = selectedChatbot.id;
        if (!chatbotId) {
            console.error("No chatbot id");
            return;
        }
        setIsLoading(true);
        try {
            triggerAlert("Document uploading")
            await uploadDocs(fileUpload, chatbotId);
            setFileUpload(null);
            setShowDocPanel(false);

            const updatedDocs = await getDocs(chatbotId);
            setDocuments(updatedDocs);

            toast.success("Document uploaded successfully");
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Unable to upload. Please try again!");
        } finally {
            setIsLoading(false);
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
            triggerAlert("Website Uploading");
            await uploadWebsiteDocs(websiteUpload, chatbotId);
            setWebsiteUpload(null);
            setShowWebsiteDocPanel(false);

            const updatedSites = await getWebsiteDocs(chatbotId);
            setWebsites(updatedSites);
            toast.success("Website uploaded successfully");
        } catch (err) {
            console.error("Website upload error:", err);
            const updatedSites = await getWebsiteDocs(chatbotId);
            setWebsites(updatedSites);
            toast.error("Unable to upload. Please try again!");
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
        console.log(selectedChatbot);
        if (!chatbotId) {
            console.error("No chatbot id");
            return;
        }
        try {
            await deleteDocument(pendingDeleteID);

            const updatedDocs = await getDocs(chatbotId);
            setDocuments(updatedDocs);
            toast.success("Document deleted successfully");
        } catch (err) {
            console.error("Delete doc error:", err);
            toast.error("Unable to delete. Please try again!");
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
        }
    };

    const handleDeleteWebsiteDoc = async () => {
        const chatbotId = selectedChatbot.id;
        if (!chatbotId || !pendingDeleteID) {
            console.error("No chatbot id");
            return;
        }

        try {
            await deleteWebsiteDocument(pendingDeleteID);

            const updatedSites = await getWebsiteDocs(chatbotId);
            setWebsites(updatedSites);
            toast.success("Website deleted successfully");
        } catch (err) {
            console.error("Delete website error:", err);
            toast.error("Unable to delete. Please try again!");
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
            toast.success("Users revoked from chatbot successfully");
        } catch (error) {
            console.error("handleRevokeUserAccess", error)
            toast.error("Unable to revoke user access. Please try again!");
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
        }
    }

    // invitation to user
    const handleInviteUser = async (fileUpload) => {
        if (!selectedChatbot || !adminEmail || !fileUpload) {
            return;
        }
        setIsLoading(true);
        try {
            triggerAlert("Sending Invitation. Please wait.");
            await sendChatbotInvitation(fileUpload, selectedChatbot.refercode, selectedChatbot.name, adminEmail);
            setShowGroupAccessPanel(false);
            triggerAlert("Invitation sent");
            
            setFileUpload(null);
        } catch (err) {
            console.error("handleInviteUser:", err.response || err);
            toast.error("Unable to invite user. Please try again!");
        } finally{
            setIsLoading(false);
        }
        
    };

    // const triggerConfirmationModal = (title) => {
    //     setConfirmationModal(title);
    //     triggerAlert("Deleted Successfully");
    // }

    const triggerAlert = (message) => {
        setSuccessAlertMessage(message);
        setTimeout(() => setSuccessAlertMessage(""), 3000);
    };

    return (
        <AdminContentContext.Provider
            value={{
                alertLogin, 
                setAlertLogin,
                isLoading, 
                setIsLoading,
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
                handleDeleteWebsiteDoc,
                chatbotsUnderAdmin,
                adminId,
                selectedChatbot,
                setSelectedChatbot,
                usersUnderChatbot,
                confirmRevokeUser,
                handleRevokeUserAccess,
                handleInviteUser,
                showGroupAccessPanel, 
                setShowGroupAccessPanel
            }}
        >
            {children}
        </AdminContentContext.Provider>
    );
};

export const useAdminContent = () => useContext(AdminContentContext);