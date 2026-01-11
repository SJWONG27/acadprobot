import springapi from './springapi'

const SPRING_API = "/superadmin";

export const createChatbot = async (chatbotName, adminEmail) => {
    const response = await springapi.post(`${SPRING_API}/createchatbot`, { chatbotName, adminEmail });
    return response.data;
}

export const getAllChatbots = async () => {
    const response = await springapi.get(`${SPRING_API}/chatbots`);
    return response.data;
}

export const deleteChatbot = async (id) => {
    return await springapi.delete(`${SPRING_API}/chatbots/${id}`)
}

export const requestAdminChatbot = async (
    email,
    fullname,
    title,
    chatbot_name,
    department_program,
    purpose
) => {
    const response = await springapi.post(`${SPRING_API}/requestadmin`, {
        email,
        fullname,
        title,
        chatbot_name,
        department_program,
        purpose
    });
    return response.data;
}


export const getAllRequest = async(status) =>{
    const response = await springapi.get(`${SPRING_API}/requestadmin`,{
        params: {status}
    });
    return response.data;
}

export const approveRequest = async(request_id) =>{
    const response = await springapi.post(`${SPRING_API}/approverequest`, null,{
        params: {request_id}
    })
    return response.data;
}

export const rejectRequest = async(request_id) =>{
    const response = await springapi.post(`${SPRING_API}/rejectrequest`, null, {
        params: {request_id}
    })
    return response.data;
}

export const downloadReport = async() =>{
    const response = await springapi.get(`${SPRING_API}/downloadreport`, {
    responseType: 'blob',
  })
    return response.data;
}