import springapi from './springapi'

const SPRING_API = "/adminrequest";

export const createAdminRequest = async (
    email,
    fullname,
    title,
    chatbot_name,
    department_program,
    purpose
) => {
    const response = await springapi.post(`${SPRING_API}`, {
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
    const response = await springapi.get(`${SPRING_API}`,{
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