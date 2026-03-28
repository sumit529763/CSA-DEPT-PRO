import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./AuditLogs.css";

const API = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

const ACTION_CONFIG = {
  LOGIN:              { label: "Login",          icon: "fa-sign-in-alt",    color: "blue"   },
  CREATE_USER:        { label: "Create User",    icon: "fa-user-plus",      color: "green"  },
  UPDATE_USER:        { label: "Update User",    icon: "fa-user-edit",      color: "yellow" },
  DELETE_USER:        { label: "Delete User",    icon: "fa-user-minus",     color: "red"    },
  TOGGLE_USER_STATUS: { label: "Toggle Status",  icon: "fa-toggle-on",      color: "purple" },
  CREATE_NEWS:        { label: "Create News",    icon: "fa-newspaper",      color: "green"  },
  UPDATE_NEWS:        { label: "Update News",    icon: "fa-edit",           color: "yellow" },
  DELETE_NEWS:        { label: "Delete News",    icon: "fa-trash",          color: "red"    },
  CREATE_EVENT:       { label: "Create Event",   icon: "fa-calendar-plus",  color: "green"  },
  DELETE_EVENT:       { label: "Delete Event",   icon: "fa-calendar-times", color: "red"    },
};

const getActionConfig = (a) =>
  ACTION_CONFIG[a] || { label: a, icon: "fa-circle", color: "gray" };

const formatDate = (ts) => {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
};

const ITEMS_PER_PAGE = 15;

export default function AuditLogs() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filterAction, setFilter] = useState("ALL");
  const [page, setPage]       = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/logs`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setLogs(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const uniqueActions = useMemo(() =>
    [...new Set(logs.map((l) => l.action))].sort(), [logs]);

  const filtered = useMemo(() => logs.filter((log) => {
    const matchAction = filterAction === "ALL" || log.action === filterAction;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      log.user?.name?.toLowerCase().includes(q) ||
      log.user?.email?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.ipAddress?.toLowerCase().includes(q);
    return matchAction && matchSearch;
  }), [logs, search, filterAction]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (e) => { setFilter(e.target.value); setPage(1); };

  const stats = useMemo(() => ({
    total:   logs.length,
    logins:  logs.filter((l) => l.action === "LOGIN").length,
    creates: logs.filter((l) => l.action?.startsWith("CREATE")).length,
    deletes: logs.filter((l) => l.action?.startsWith("DELETE")).length,
  }), [logs]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="auditPage">

      <div className="auditHeader">
        <div>
          <h2>Audit Logs</h2>
          <p>Complete record of all admin activity in the system</p>
        </div>
        <button className="refreshBtn" onClick={fetchLogs}>
          <i className="fas fa-sync-alt"></i>
          <span>Refresh</span>
        </button>
      </div>

      <div className="auditStats">
        {[
          { icon: "fa-list-alt",    color: "blue",   num: stats.total,   label: "Total Events" },
          { icon: "fa-sign-in-alt", color: "green",  num: stats.logins,  label: "Logins"       },
          { icon: "fa-plus-circle", color: "purple", num: stats.creates, label: "Creates"      },
          { icon: "fa-trash",       color: "red",    num: stats.deletes, label: "Deletes"      },
        ].map(({ icon, color, num, label }) => (
          <div className="auditStat" key={label}>
            <i className={`fas ${icon} statIcon ${color}`}></i>
            <div className="statInfo">
              <span className="statNum">{num}</span>
              <span className="statLabel">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="auditFilters">
        <div className="searchBox">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search admin, action, details, IP…"
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button className="clearSearch" onClick={() => { setSearch(""); setPage(1); }}>✕</button>
          )}
        </div>
        <select value={filterAction} onChange={handleFilter} className="filterSelect">
          <option value="ALL">All Actions</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{getActionConfig(a).label || a}</option>
          ))}
        </select>
      </div>

      {!loading && (
        <p className="resultsCount">
          Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> logs
          {filterAction !== "ALL" && <span> · <strong>{getActionConfig(filterAction).label}</strong></span>}
        </p>
      )}

      <div className="auditTableWrap">
        {loading ? (
          <div className="auditLoading">
            <div className="spinner"></div>
            <p>Loading audit logs…</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="auditEmpty">
            <i className="fas fa-clipboard-list"></i>
            <p>No logs found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="tableScroll">
              <table className="auditTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Timestamp</th>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log, idx) => {
                    const { date, time } = formatDate(log.timestamp || log.createdAt);
                    const cfg = getActionConfig(log.action);
                    return (
                      <tr key={log._id}>
                        <td className="logNum">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                        <td className="logTime">
                          <span className="logDate">{date}</span>
                          <span className="logTimeSmall">{time}</span>
                        </td>
                        <td className="logAdmin">
                          <div className="adminAvatar">{log.user?.name?.charAt(0).toUpperCase() || "?"}</div>
                          <div className="adminInfo">
                            <span className="adminName">{log.user?.name || "Unknown"}</span>
                            <span className="adminEmail">{log.user?.email || ""}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`actionTag ${cfg.color}`}>
                            <i className={`fas ${cfg.icon}`}></i>{cfg.label || log.action}
                          </span>
                        </td>
                        <td className="logDetails" title={log.details}>{log.details || "—"}</td>
                        <td className="logIp"><i className="fas fa-network-wired"></i>{log.ipAddress || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobileCards">
              {paginated.map((log, idx) => {
                const { date, time } = formatDate(log.timestamp || log.createdAt);
                const cfg = getActionConfig(log.action);
                return (
                  <div className="mobileCard" key={log._id}>
                    <div className="mcTop">
                      <div className="logAdmin">
                        <div className="adminAvatar">{log.user?.name?.charAt(0).toUpperCase() || "?"}</div>
                        <div className="adminInfo">
                          <span className="adminName">{log.user?.name || "Unknown"}</span>
                          <span className="adminEmail">{log.user?.email || ""}</span>
                        </div>
                      </div>
                      <div className="mcTime">
                        <span className="logDate">{date}</span>
                        <span className="logTimeSmall">{time}</span>
                      </div>
                    </div>
                    <div className="mcMiddle">
                      <span className={`actionTag ${cfg.color}`}>
                        <i className={`fas ${cfg.icon}`}></i>{cfg.label || log.action}
                      </span>
                    </div>
                    {log.details && <div className="mcDetails">{log.details}</div>}
                    <div className="mcBottom">
                      <span className="mcSeq">#{(page - 1) * ITEMS_PER_PAGE + idx + 1}</span>
                      <span className="mcIp"><i className="fas fa-network-wired"></i>{log.ipAddress || "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="auditPagination">
          <button className="pageBtn" disabled={page === 1} onClick={() => setPage(1)}>
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button className="pageBtn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <i className="fas fa-angle-left"></i>
          </button>
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`d${i}`} className="pageDots">…</span>
            ) : (
              <button
                key={p}
                className={`pageBtn ${page === p ? "active" : ""}`}
                onClick={() => setPage(p)}
                aria-current={page === p ? "page" : undefined}
              >{p}</button>
            )
          )}
          <button className="pageBtn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            <i className="fas fa-angle-right"></i>
          </button>
          <button className="pageBtn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}