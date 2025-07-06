import { createContext, useContext, useState, useEffect } from "react";
import {
    uploadDocs,
    getDocs,
    uploadWebsiteDocs,
    getWebsiteDocs,
    deleteDocument,
    deleteWebsiteDocument
} from "../services/adminService";

const AdminContentContext = createContext();

export const AdminContentProvider = ({ children }) => {
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

    const handleDocsUpload = async () => {
        if (!fileUpload) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token in handleDocsUpload");
            return;
        }

        try {
            await uploadDocs(fileUpload, token);
            setFileUpload(null);
            setShowDocPanel(false);

            const updatedDocs = await getDocs(token);
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

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token in handleWebsiteDocsUpload");
            return;
        }

        try {
            await uploadWebsiteDocs(websiteUpload, token);
            setWebsiteUpload(null);
            setShowWebsiteDocPanel(false);

            const updatedSites = await getWebsiteDocs(token);
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
        const token = localStorage.getItem("token");
        if (!token || !pendingDeleteID) {
            return;
        }
        try {
            await deleteDocument(pendingDeleteID);
            const updatedDocs = await getDocs(token);
            setDocuments(updatedDocs);
        } catch (err) {
            console.error("Delete doc error:", err);
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
        }
    };

    const hanldeDeleteWebsiteDoc = async () => {
        const token = localStorage.getItem("token");
        if (!token || !pendingDeleteID) {
            return;
        }

        try {
            await deleteWebsiteDocument(pendingDeleteID);

            const updatedSites = await getWebsiteDocs(token);
            setWebsites(updatedSites);
        } catch (err) {
            console.error("Delete website error:", err);
        } finally {
            setConfirmationModal(false);
            setPendingDeleteID(null);
        }
    };


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
            }}
        >
            {children}
        </AdminContentContext.Provider>
    );
};

export const useAdminContent = () => useContext(AdminContentContext);