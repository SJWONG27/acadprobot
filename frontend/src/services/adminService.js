import axios from "axios";

const API = "http://127.0.0.1:8000/admin";

export const getUsersOfAdmin = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadDocs = async(file, token)=>{
  const formData = new FormData();
  formData.append("file", file);

  try{
    const res = await axios.post(`${API}/upload`, formData, {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  }catch(err){
    throw err.response?.data || err;
  }
}

export const getDocs = async(token)=>{
  try{
    const res = await axios.get(`${API}/documents`,  {
      headers:{
        "Authorization": `Bearer ${token}`,
      }
    });
    return res.data;
  }catch(err){
    throw err.response?.data || err;
  }
}

export const uploadWebsiteDocs = async(websiteurl, token)=>{

  try{
    const res = await axios.post(`${API}/uploadwebsite`, {url: websiteurl}, {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  }catch(err){
    throw err.response?.data || err;
  }
}

export const getWebsiteDocs = async(token)=>{
  try{
    const res = await axios.get(`${API}/websitedocuments`,  {
      headers:{
        "Authorization": `Bearer ${token}`,
      }
    });
    return res.data;
  }catch(err){
    throw err.response?.data || err;
  }
}