import React, {useState, useEffect} from 'react'
import Toggles from '../../component/Toggles'
import FrequencyCustom from '../../component/FrequencyCustom'
import TableWebScraping from '../../component/TableWebScraping'
import TableDocScraping from '../../component/TableDocScraping'
import { uploadDocs, getDocs, uploadWebsiteDocs, getWebsiteDocs } from '../../services/adminService'

const ChatbotContentPage = () => {
  const [fileUpload, setFileUpload] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showDocPanel, setShowDocPanel] = useState(false);

  const [websiteUpload, setWebsiteUpload] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [showWebsiteDocPanel, setShowWebsiteDocPanel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getDocs(token)
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Failed to fetch documents:", err));
  }, []);


  const handleDocsUpload = async() => {
    if(!fileUpload) return;
    const token = localStorage.getItem("token");
    if(!token){
      console.error("No token in handleDocsUpload");
    }
    try{
      const res = await uploadDocs(fileUpload, token);
      setFileUpload(null);
      setShowDocPanel(false);

      const data = await getDocs(token);
      setDocuments(data);
    } catch(err){
    } 
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getWebsiteDocs(token)
      .then((data) => setWebsites(data))
      .catch((err) => console.error("Failed to website url:", err));
  }, []);


  const handleWebsiteDocsUpload = async() => {
    if(!websiteUpload) return;
    if (!websiteUpload.startsWith("http")) {
      alert("Please enter a valid URL");
      return;
    }

    const token = localStorage.getItem("token");
    if(!token){
      console.error("No token in handleWebsiteDocsUpload");
    }
    try{
      const res = await uploadWebsiteDocs(websiteUpload, token);
      setWebsiteUpload(null);
      setShowWebsiteDocPanel(false);
      
      const data = await getWebsiteDocs(token);
      setWebsites(data);
    } catch(err){
    } 
  }

  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Chatbot Content</p>
      </div>

      <div className='flex flex-col pb-3'>
        <div>
          <p className='font-semibold text-lg text-indigo-600'>Web Scraping</p>
          <div className='flex flex-row justify-between mt-8'>
            <div className='flex flex-row w-md'>
              <span className='mr-4'>Auto Update</span>
              <Toggles />
            </div>
            <div className='flex w-md'>
              <FrequencyCustom />
            </div>
          </div>
          <div className='mt-12 mb-8'>
            <TableWebScraping 
              websiteUpload={websiteUpload}
              setWebsiteUpload={setWebsiteUpload}
              handleWebsiteDocsUpload={handleWebsiteDocsUpload}
              websites={websites}
              showWebsiteDocPanel={showWebsiteDocPanel}
              setShowWebsiteDocPanel={setShowWebsiteDocPanel}
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col pb-3 mt-8'>
        <div>
          <p className='font-semibold text-lg text-indigo-600'>Document Scraping</p>
          <div className='mt-12 mb-8'>
            <TableDocScraping 
              fileUpload={fileUpload}
              setFileUpload={setFileUpload}
              handleDocsUpload={handleDocsUpload}
              documents={documents}
              showDocPanel={showDocPanel}
              setShowDocPanel={setShowDocPanel}
            />
          </div>
        </div>
      </div>


    </div>
  )
}

export default ChatbotContentPage
