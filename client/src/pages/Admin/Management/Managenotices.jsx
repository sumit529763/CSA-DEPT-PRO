import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import NoticeForm from "./Noticeform";
import "./ManageNotices.css";

const TYPE_COLORS = { Exam:"type-exam", General:"type-general", Holiday:"type-holiday", Academic:"type-academic" };

export default function ManageNotices() {
  const { isSuperAdmin } = useAuth(); // ✅

  const [notices, setNotices]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState("All");

  const emptyForm = {
    id:null, title:"", date:new Date().toISOString().split("T")[0],
    type:"General", isUrgent:false, isPublished:true,
  };
  const [formData, setFormData]       = useState(emptyForm);
  const [file, setFile]               = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");

  const location = useLocation();
  const API_URL  = `${import.meta.env.VITE_API_BASE_URL}/api/notices`;

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/all`, { headers:{ Authorization:`Bearer ${token}` } });
      const data = (res.data.data||[]).sort((a,b)=>new Date(b.date)-new Date(a.date));
      setNotices(data); setFiltered(data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchNotices(); },[location.key]);

  useEffect(()=>{
    let temp=[...notices];
    if(search) temp=temp.filter(n=>n.title.toLowerCase().includes(search.toLowerCase()));
    if(filterType!=="All") temp=temp.filter(n=>n.type===filterType);
    setFiltered(temp);
  },[search,filterType,notices]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data  = new FormData();
    data.append("title",formData.title); data.append("date",formData.date);
    data.append("type",formData.type); data.append("isUrgent",formData.isUrgent);
    data.append("isPublished",formData.isPublished);
    if(file) data.append("file",file);
    try {
      setLoadingAction(true);
      const config={headers:{Authorization:`Bearer ${token}`,"Content-Type":"multipart/form-data"}};
      if(isEditMode) await axios.put(`${API_URL}/${formData.id}`,data,config);
      else           await axios.post(API_URL,data,config);
      toast.success(isEditMode?"Notice updated!":"Notice published!");
      setShowModal(false); fetchNotices();
    } catch(err){ toast.error(err.response?.data?.message||"Something went wrong"); }
    finally{ setLoadingAction(false); }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false); setFormData(emptyForm);
    setFile(null); setExistingFileUrl(""); setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setFormData({ id:item._id, title:item.title, date:item.date?item.date.split("T")[0]:"",
      type:item.type, isUrgent:item.isUrgent, isPublished:item.isPublished });
    setFile(null); setExistingFileUrl(item.fileUrl||""); setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if(!window.confirm(`Delete notice: "${title}"?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`,{ headers:{ Authorization:`Bearer ${token}` } });
      toast.success("Notice deleted!");
      fetchNotices();
    } catch(err){ toast.error(err.response?.data?.message||"Delete failed"); }
  };

  const togglePublish = async (item) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_URL}/${item._id}`,{ isPublished:!item.isPublished },
        { headers:{ Authorization:`Bearer ${token}` } });
      fetchNotices();
    } catch{ toast.error("Failed to update"); }
  };

  return (
    <div className="mn-page">
      <div className="mn-header">
        <div><h2>Manage Notices</h2><p>Post, update and manage official department notices</p></div>
        <button className="mn-add-btn" onClick={handleOpenAdd}>+ Add Notice</button>
      </div>

      <div className="mn-tools">
        <input placeholder="Search notices..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        <div className="mn-filter-tabs">
          {["All","Exam","General","Holiday","Academic"].map((t)=>(
            <button key={t} className={`mn-filter-tab ${filterType===t?"active":""}`} onClick={()=>setFilterType(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="mn-stats-bar">
        <span>Total: <strong>{notices.length}</strong></span>
        <span>Published: <strong>{notices.filter(n=>n.isPublished).length}</strong></span>
        <span>Urgent: <strong>{notices.filter(n=>n.isUrgent).length}</strong></span>
      </div>

      {/* ✅ ROLE NOTICE */}
      {!isSuperAdmin && (
        <div className="role-notice">
          <i className="fas fa-info-circle" />
          You can create and edit notices. Only Super Admin can delete.
        </div>
      )}

      {loading ? (
        <div className="mn-loading">
          {[1,2,3,4].map(n=>(
            <div key={n} className="mn-skeleton-row">
              <div className="sk sk-date"/><div className="sk sk-title"/><div className="sk sk-badge"/><div className="sk sk-actions"/>
            </div>
          ))}
        </div>
      ) : filtered.length===0 ? (
        <div className="mn-empty"><i className="fas fa-bell-slash"/><h4>No notices found</h4><p>Click "Add Notice" to create your first notice</p></div>
      ) : (
        <div className="mn-table-wrap">
          <table className="mn-table">
            <thead><tr><th>Date</th><th>Title</th><th>Type</th><th>Status</th><th>File</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item)=>(
                <tr key={item._id} className={item.isUrgent?"mn-urgent-row":""}>
                  <td><span className="mn-date-box"><strong>{new Date(item.date).getDate()}</strong>{new Date(item.date).toLocaleString("en-US",{month:"short"})}</span></td>
                  <td className="mn-title-cell"><span className="mn-title">{item.title}</span>{item.isUrgent&&<span className="mn-badge mn-urgent">Urgent</span>}</td>
                  <td><span className={`mn-type-tag ${TYPE_COLORS[item.type]||""}`}>{item.type}</span></td>
                  <td><button className={`mn-toggle ${item.isPublished?"published":"draft"}`} onClick={()=>togglePublish(item)}>{item.isPublished?"Published":"Draft"}</button></td>
                  <td>{item.fileUrl?<a href={item.fileUrl} target="_blank" rel="noreferrer" className="mn-file-link"><i className="fas fa-file-pdf"/> View</a>:<span className="mn-no-file">—</span>}</td>
                  <td className="mn-actions">
                    <button className="mn-btn-edit" onClick={()=>handleOpenEdit(item)}><i className="fas fa-edit"/></button>
                    {/* ✅ Delete only for superadmin */}
                    {isSuperAdmin && (
                      <button className="mn-btn-delete" onClick={()=>handleDelete(item._id,item.title)}><i className="fas fa-trash"/></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NoticeForm
        show={showModal} onClose={()=>setShowModal(false)} onSubmit={handleSubmit}
        isEdit={isEditMode} loading={loadingAction} formData={formData} setFormData={setFormData}
        file={file} existingFileUrl={existingFileUrl}
        onFileChange={(e)=>setFile(e.target.files[0]||null)}
      />
    </div>
  );
}