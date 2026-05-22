import { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import {
    downloadReport
} from "../services/superadminService"

import {
    createChatbot,
    deleteChatbot,
    getAllChatbots
} from "../services/chatbotService"

import {
    getAllRequest,
    approveRequest,
    rejectRequest,
}
from "../services/adminRequestService"

import { sendAdminChatbotResultEmail } from "../services/emailService";



const SuperAdminContentContext = createContext();

export const SuperAdminContentProvider = ({ children }) => {
    const [chatbotName, setChatbotName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");

    const [successAlertMessage, setSuccessAlertMessage] = useState("");
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [pendingDeleteID, setPendingDeleteID] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState("");

    const [isLoading, setIsLoading] = useState(false);

   

    const confirmDelete = async (id) => {
        setPendingDeleteID(id);
        setConfirmationModal(true);
    };

    const [chatbots, setChatbots] = useState([]);

    const fetchChatbotsDetails = async () => {
        try {
            const response = await getAllChatbots();
            console.log(response);
            setChatbots(response);
        } catch (error) {
            console.error("Failed to fetch chatbots in  superadmin :", error);
            toast.error("Failed to create chatbot. Please try again!")
        }
    }

     const handleChatbotCreate = async (chatbotName, adminEmail) => {
        try {
            await createChatbot(chatbotName, adminEmail);
            fetchChatbotsDetails;
            toast.success("Chatbot created successfully");
        } catch (error) {
            console.error("Error creating chatbot", error)
            toast.error("Failed to create chatbot. Please try again!")
        }
    }

    const handleDeleteChatbot = async () => {
        try {
            await deleteChatbot(pendingDeleteID);
            fetchChatbotsDetails;
            toast.success("Chatbot deleted successfully");
        } catch (error) {
            console.error("Delete chatbot error: ", error);
            toast.error("Failed to delete chatbot. Please try again!")
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

    useEffect(() => {
        const fetchAllRequestByStatus = async () => {
            try {
                const response = await getAllRequest(activeTab);
                setRequestSubmitted(response);
            } catch (error) {
                console.error("fetchAllRequestByStatus", error);
                toast.error("Failed to retrieve request. Please try again!")
            }
        }
        fetchAllRequestByStatus()
    }, [activeTab])

    const [selectedRequest, setSelectedRequest] = useState([]);
    const [requestRemark, setRequestRemark] = useState("");
    const [showAPReviewApproveRequest, setShowAPReviewApproveRequest] = useState(false);
    const [showAPReviewRejectRequest, setShowAPReviewRejectRequest] = useState(false);

    const handleApproveRequest = async () => {
        if (!selectedRequest || !selectedRequest.id) {
            console.log("no selected request")
            return;
        }
        const request_id = selectedRequest.id;
        const title = selectedRequest.title;
        const fullname = selectedRequest.fullname;
        const chatbotName = selectedRequest.chatbot_name;
        const recipient_email = selectedRequest.email;
        const requestStatus = "approved";
        try {
            await approveRequest(request_id);
            await sendAdminChatbotResultEmail(
                title,
                fullname,
                chatbotName,
                recipient_email,
                requestStatus,
                requestRemark
            )
            console.log("Request approved and email sent!");

            const response = await getAllRequest(activeTab);
            setRequestSubmitted(response);
            toast.success("Request approved successfully");
        } catch (error) {
            console.error("handleApproveRequest", error)
            toast.error("Failed to approve request. Please try again!")
        }
    }

    const handleRejectRequest = async () => {
        if (!selectedRequest || !selectedRequest.id) {
            console.log("no selected request")
            return;
        }
        const request_id = selectedRequest.id;
        const title = selectedRequest.title;
        const fullname = selectedRequest.fullname;
        const chatbotName = selectedRequest.chatbot_name;
        const recipient_email = selectedRequest.email;
        const requestStatus = "rejected";
        try {
            await rejectRequest(request_id);
            await sendAdminChatbotResultEmail(
                title,
                fullname,
                chatbotName,
                recipient_email,
                requestStatus,
                requestRemark
            )

            const response = await getAllRequest(activeTab);
            setRequestSubmitted(response);
            toast.success("Request rejected successfully");
        } catch (error) {
            console.error("handleRejectRequest", error)
            toast.error("Failed to reject request. Please try again!")
        }
    }

    const handleDownloadReport = async () => {
        try {
            triggerAlert("Report is being downloaded. Please wait.");
            setIsLoading(true);

            const blob = await downloadReport();

            // Create a URL for the blob and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Irrelevant_Academic_Queries.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error("handleDownloadReport", error);
            toast.error("Fail to download the report. Please try again!")
        } finally {
            setIsLoading(false);
        }
    }

    const triggerAlert = (message) => {
        setSuccessAlertMessage(message);
        setTimeout(() => setSuccessAlertMessage(""), 3000);
    };

    return (
        <SuperAdminContentContext.Provider
            value={{
                isLoading,
                setIsLoading,
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
                requestSubmitted,
                activeTab,
                setActiveTab,
                selectedRequest,
                setSelectedRequest,
                handleApproveRequest,
                handleRejectRequest,
                requestRemark, setRequestRemark,
                showAPReviewApproveRequest, setShowAPReviewApproveRequest,
                showAPReviewRejectRequest, setShowAPReviewRejectRequest,
                handleDownloadReport
            }}
        >
            {children}
        </SuperAdminContentContext.Provider>
    );
};

export const useSuperAdminContent = () => useContext(SuperAdminContentContext);