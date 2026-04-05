import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import ExamForm from "./ExamForm";
import "./ManageExam.css";

const TABS = [
  { key:"Schedules", icon:"fa-calendar-alt",  singular:"Schedule"  },
  { key:"Results",   icon:"fa-poll",           singular:"Result"    },
  { key:"Resources", icon:"fa-folder-open",    singular:"Resource"  },
];

export default function ManageExam() {
  const { isSuperAdmin } = useAuth(); // ✅

  const [activeTab, setActiveTab]     = useState("Schedules");
  const [allData, setAllData]         = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [isEditMode, setIsEditMode]   = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [search, setSearch]           = useState("");

  const emptyForm = {
    id:null, category:"Schedules", title:"", examDate:"", code:"",
    releaseDate:"", resourceType:"PDF", fileUrl:"", isPublished:true,
  };
  const [formData, setFormData]           = useState(emptyForm);
  const [file, setFile]                   = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");

  const location = useLocation();
  const API_URL  = `${import.meta.env.VITE_API_BASE_URL}/api/exam`;

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/all`,{ headers:{ Authorization:`Bearer ${token}` } });
      setAllData(res.data.data||[]);
    } catch{ } finally{ setLoading(false); }
  };

  useEffect(()=>{ fetchAll(); },[location.key]);

  useEffect(()=>{
    let temp=allData.filter(d=>d.category===activeTab);
    if(search) temp=temp.filter(d=>d.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(temp);
  },[activeTab,search,allData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data  = new FormData();
    data.append("category",formData.category); data.append("title",formData.title);
    data.append("isPublished",formData.isPublished);
    if(formData.category==="Schedules"){ data.append("code",formData.code); if(formData.examDate) data.append("examDate",formData.examDate); }
    if(formData.category==="Results"){ if(formData.releaseDate) data.append("releaseDate",formData.releaseDate); }
    if(formData.category==="Resources"){ data.append("resourceType",formData.resourceType); if(formData.fileUrl) data.append("fileUrl",formData.fileUrl); }
    if(file) data.append("file",file);
    try {
      setLoadingAction(true);
      const config={headers:{Authorization:`Bearer ${token}`,"Content-Type":"multipart/form-data"}};
      if(isEditMode) await axios.put(`${API_URL}/${formData.id}`,data,config);
      else           await axios.post(API_URL,data,config);
      toast.success(isEditMode?"Updated successfully!":"Created successfully!");
      setShowModal(false); fetchAll();
    } catch(err){ toast.error(err.response?.data?.message||"Something went wrong"); }
    finally{ setLoadingAction(false); }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false); setFormData({...emptyForm,category:activeTab});
    setFile(null); setExistingFileUrl(""); setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setFormData({ id:item._id, category:item.category, title:item.title,
      examDate:item.examDate?item.examDate.split("T")[0]:"", code:item.code||"",
      releaseDate:item.releaseDate?item.releaseDate.split("T")[0]:"",
      resourceType:item.resourceType||"PDF", fileUrl:item.fileUrl||"", isPublished:item.isPublished });
    setFile(null); setExistingFileUrl(item.fileUrl||""); setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if(!window.confirm(`Delete "${title}"?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`,{ headers:{ Authorization:`Bearer ${token}` } });
      toast.success("Deleted successfully!");
      fetchAll();
    } catch(err){ toast.error(err.response?.data?.message||"Delete failed"); }
  };

  const togglePublish = async (item) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_URL}/${item._id}`,{ isPublished:!item.isPublished },
        { headers:{ Authorization:`Bearer ${token}` } });
      fetchAll();
    } catch{ toast.error("Update failed"); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"numeric" }) : "—";
  const activeTabMeta = TABS.find(t=>t.key===activeTab);

  return (
    <div className="exam-page">
      <div className="exam-header">
        <div><h2>Manage Examination</h2><p>Manage exam schedules, results and resources</p></div>
        <button className="exam-add-btn" onClick={handleOpenAdd}>
          <i className="fas fa-plus"/><span>Add {activeTabMeta.singular}</span>
        </button>
      </div>

      <div className="exam-stats">
        {TABS.map(({key,icon})=>(
          <div className="exam-stat" key={key}>
            <i className={`fas ${icon} exam-stat-icon`}/>
            <div className="exam-stat-info">
              <span className="exam-stat-num">{allData.filter(d=>d.category===key).length}</span>
              <span className="exam-stat-label">{key}</span>
            </div>
          </div>
        ))}
        <div className="exam-stat">
          <i className="fas fa-globe exam-stat-icon published-icon"/>
          <div className="exam-stat-info">
            <span className="exam-stat-num">{allData.filter(d=>d.isPublished).length}</span>
            <span className="exam-stat-label">Published</span>
          </div>
        </div>
      </div>

      <div className="exam-tabs">
        {TABS.map(({key,icon})=>(
          <button key={key} className={`exam-tab ${activeTab===key?"active":""}`}
            onClick={()=>{ setActiveTab(key); setSearch(""); }}>
            <i className={`fas ${icon}`}/><span>{key}</span>
            <span className="exam-tab-count">{allData.filter(d=>d.category===key).length}</span>
          </button>
        ))}
      </div>

      <div className="exam-toolbar">
        <div className="exam-search">
          <i className="fas fa-search"/>
          <input type="text" placeholder={`Search ${activeTab.toLowerCase()}…`} value={search} onChange={(e)=>setSearch(e.target.value)}/>
          {search&&<button className="exam-search-clear" onClick={()=>setSearch("")}>✕</button>}
        </div>
        {!loading&&<p className="exam-count"><strong>{filtered.length}</strong> {activeTab.toLowerCase()}</p>}
      </div>

      {/* ✅ ROLE NOTICE */}
      {!isSuperAdmin && (
        <div className="role-notice">
          <i className="fas fa-info-circle" />
          You can create and edit exam entries. Only Super Admin can delete.
        </div>
      )}

      {loading ? (
        <div className="exam-skeletons">
          {[1,2,3,4].map(n=>(
            <div key={n} className="exam-skeleton-row">
              <div className="sk sk-title"/><div className="sk sk-date"/><div className="sk sk-badge"/><div className="sk sk-acts"/>
            </div>
          ))}
        </div>
      ) : filtered.length===0 ? (
        <div className="exam-empty"><i className="fas fa-inbox"/><h4>No {activeTab} found</h4><p>Click "Add {activeTabMeta.singular}" to create an entry</p></div>
      ) : (
        <>
          <div className="exam-table-wrap">
            <table className="exam-table">
              <thead><tr>
                <th>#</th><th>Title</th>
                {activeTab==="Schedules"&&<><th>Code</th><th>Exam Date</th></>}
                {activeTab==="Results"&&<th>Released On</th>}
                {activeTab==="Resources"&&<th>Type</th>}
                <th>Status</th><th>File</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((item,idx)=>(
                  <tr key={item._id}>
                    <td className="exam-num">{idx+1}</td>
                    <td className="exam-title-cell">{item.title}</td>
                    {activeTab==="Schedules"&&<><td><span className="exam-code">{item.code||"—"}</span></td><td className="exam-date">{formatDate(item.examDate)}</td></>}
                    {activeTab==="Results"&&<td className="exam-date">{formatDate(item.releaseDate)}</td>}
                    {activeTab==="Resources"&&<td><span className="exam-res-type">{item.resourceType||"—"}</span></td>}
                    <td><button className={`exam-toggle ${item.isPublished?"published":"draft"}`} onClick={()=>togglePublish(item)}>{item.isPublished?"● Published":"○ Draft"}</button></td>
                    <td>{item.fileUrl?<a href={item.fileUrl} target="_blank" rel="noreferrer" className="exam-file-link"><i className="fas fa-file-alt"/> View</a>:<span className="exam-no-file">—</span>}</td>
                    <td>
                      <div className="exam-actions">
                        <button className="exam-btn-edit" onClick={()=>handleOpenEdit(item)}><i className="fas fa-edit"/> <span>Edit</span></button>
                        {/* ✅ Delete only for superadmin */}
                        {isSuperAdmin && (
                          <button className="exam-btn-delete" onClick={()=>handleDelete(item._id,item.title)}><i className="fas fa-trash"/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="exam-mobile-cards">
            {filtered.map((item,idx)=>(
              <div className="exam-card" key={item._id}>
                <div className="ec-top">
                  <div className="ec-meta">
                    <span className="ec-num">#{idx+1}</span>
                    {activeTab==="Schedules"&&item.code&&<span className="exam-code">{item.code}</span>}
                    {activeTab==="Resources"&&<span className="exam-res-type">{item.resourceType}</span>}
                  </div>
                  <button className={`exam-toggle ${item.isPublished?"published":"draft"}`} onClick={()=>togglePublish(item)}>
                    {item.isPublished?"● Published":"○ Draft"}
                  </button>
                </div>
                <p className="ec-title">{item.title}</p>
                {activeTab==="Schedules"&&item.examDate&&<p className="ec-date"><i className="fas fa-calendar-alt"/> {formatDate(item.examDate)}</p>}
                {activeTab==="Results"&&item.releaseDate&&<p className="ec-date"><i className="fas fa-clock"/> Released: {formatDate(item.releaseDate)}</p>}
                <div className="ec-bottom">
                  {item.fileUrl?<a href={item.fileUrl} target="_blank" rel="noreferrer" className="exam-file-link"><i className="fas fa-file-alt"/> View File</a>:<span className="exam-no-file">No file</span>}
                  <div className="exam-actions">
                    <button className="exam-btn-edit" onClick={()=>handleOpenEdit(item)}><i className="fas fa-edit"/> Edit</button>
                    {/* ✅ Delete only for superadmin */}
                    {isSuperAdmin && (
                      <button className="exam-btn-delete" onClick={()=>handleDelete(item._id,item.title)}><i className="fas fa-trash"/></button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ExamForm
        show={showModal} onClose={()=>setShowModal(false)} onSubmit={handleSubmit}
        isEdit={isEditMode} loading={loadingAction} formData={formData} setFormData={setFormData}
        file={file} existingFileUrl={existingFileUrl}
        onFileChange={(e)=>setFile(e.target.files[0]||null)}
      />
    </div>
  );
}