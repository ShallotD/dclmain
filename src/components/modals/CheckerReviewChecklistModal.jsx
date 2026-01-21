// // export default CheckerReviewChecklistModal;

// // / export default CheckerReviewChecklistModal;
// import { Select } from "antd";
// import { DatePicker } from "antd";
// import dayjs from "dayjs";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Button,
//   Table,
//   Tag,
//   Input,
//   Card,
//   Row,
//   Col,
//   Progress,
//   Space,
//   List,
//   Avatar,
//   Spin,
//   Drawer,
//   Typography,
//   Collapse,
//   Divider,
//   message,
//   Tooltip,
// } from "antd";
// import {
//   CheckCircleOutlined,
//   EyeOutlined,
//   UploadOutlined,
//   DownloadOutlined,
//   UserOutlined,
//   PaperClipOutlined,
//   FileTextOutlined,
//   FilePdfOutlined,
//   FileImageOutlined,
//   FileWordOutlined,
//   FileExcelOutlined,
//   FileZipOutlined,
//   CalendarOutlined,
//   ClockCircleOutlined as TimeOutlined,
//   UserAddOutlined,
//   RightOutlined,
//   LeftOutlined,
// } from "@ant-design/icons";

// import {
//   useUpdateCheckerStatusMutation,
//   useGetChecklistCommentsQuery,
//   useSaveChecklistDraftMutation,
// } from "../../api/checklistApi";

// // Import shared utilities
// import {
//   getFullUrl,
//   getExpiryStatus as getExpiryStatusUtil,
  
//   THEME,
  
// } from "../../utils/checklistUtils";

// // Import new shared components
// import CommentHistory from "../common/CommentHistory";

// const { Option } = Select;
// const { Text } = Typography;

// const GREEN = THEME?.GREEN || "#52c41a";
// const RED = "red";
// const PRIMARY_BLUE = THEME?.PRIMARY_BLUE || "#164679";
// const ACCENT_LIME = THEME?.ACCENT_LIME || "#b5d334";
// const SECONDARY_PURPLE = THEME?.SECONDARY_PURPLE || "#7e6496";

// const API_BASE_URL =
//   import.meta.env?.VITE_APP_API_URL || "http://localhost:5000";

// // ------------------ ENHANCED PROGRESS CALCULATION FUNCTIONS ------------------
// const calculateDocumentStats = (docs) => {
//   const total = docs.length;

//   // Count all status types from CO perspective
//   const submitted = docs.filter(
//     (d) =>
//       d.status?.toLowerCase() === "submitted" ||
//       d.action?.toLowerCase() === "submitted" ||
//       d.coStatus?.toLowerCase() === "submitted",
//   ).length;

//   const pendingFromRM = docs.filter(
//     (d) =>
//       d.status?.toLowerCase() === "pendingrm" ||
//       d.action?.toLowerCase() === "pendingrm" ||
//       d.coStatus?.toLowerCase() === "pendingrm",
//   ).length;

//   const pendingFromCo = docs.filter(
//     (d) =>
//       d.status?.toLowerCase() === "pendingco" ||
//       d.action?.toLowerCase() === "pendingco" ||
//       d.coStatus?.toLowerCase() === "pendingco",
//   ).length;

//   const deferred = docs.filter(
//     (d) =>
//       d.status?.toLowerCase() === "deferred" ||
//       d.action?.toLowerCase() === "deferred" ||
//       d.coStatus?.toLowerCase() === "deferred",
//   ).length;

//   const sighted = docs.filter(
//     (d) =>
//       d.status?.toLowerCase() === "sighted" ||
//       d.action?.toLowerCase() === "sighted" ||
//       d.coStatus?.toLowerCase() === "sighted",
//   ).length;

//   const waived = docs.filter(
//     (d) =>
//       d.status?.toLowerCase() === "waived" ||
//       d.action?.toLowerCase() === "waived" ||
//       d.coStatus?.toLowerCase() === "waived",
//   ).length;

//   const tbo = docs.filter(
//     (d) =>
//       d.status?.toLowerCase() === "tbo" ||
//       d.action?.toLowerCase() === "tbo" ||
//       d.coStatus?.toLowerCase() === "tbo",
//   ).length;

//   // Checker review statuses - UPDATED to be more accurate
//   const checkerApproved = docs.filter(
//     (d) => d.checkerStatus && d.checkerStatus.toLowerCase() === "approved",
//   ).length;

//   const checkerRejected = docs.filter(
//     (d) => d.checkerStatus && d.checkerStatus.toLowerCase() === "rejected",
//   ).length;

//   const checkerReviewed = docs.filter(
//     (d) =>
//       d.checkerStatus &&
//       !["not reviewed", "pending", null, undefined, ""].includes(
//         d.checkerStatus?.toLowerCase(),
//       ),
//   ).length;

//   const checkerPending = docs.filter(
//     (d) =>
//       !d.checkerStatus ||
//       ["not reviewed", "pending", null, undefined, ""].includes(
//         d.checkerStatus?.toLowerCase(),
//       ),
//   ).length;

//   // RM statuses
//   const rmSubmitted = docs.filter(
//     (d) =>
//       d.rmStatus &&
//       (d.rmStatus.toLowerCase().includes("submitted") ||
//         d.rmStatus.toLowerCase().includes("approved") ||
//         d.rmStatus.toLowerCase().includes("satisfactory")),
//   ).length;

//   const rmPending = docs.filter(
//     (d) =>
//       d.rmStatus &&
//       (d.rmStatus.toLowerCase().includes("pending") ||
//         d.rmStatus.toLowerCase().includes("awaiting")),
//   ).length;

//   const rmDeferred = docs.filter(
//     (d) =>
//       d.rmStatus &&
//       (d.rmStatus.toLowerCase().includes("deferred") ||
//         d.rmStatus.toLowerCase().includes("returned")),
//   ).length;

//   const progressPercent =
//     total === 0
//       ? 0
//       : docs.filter(
//             (d) =>
//               d.action?.toLowerCase() === "pendingco" ||
//               d.status?.toLowerCase() === "pendingco",
//           ).length === 0
//         ? 100
//         : Math.round((submitted / total) * 100);

//   return {
//     total,
//     submitted,
//     pendingFromRM,
//     pendingFromCo,
//     deferred,
//     sighted,
//     waived,
//     tbo,
//     checkerApproved,
//     checkerRejected,
//     checkerReviewed,
//     checkerPending,
//     rmSubmitted,
//     rmPending,
//     rmDeferred,
//     progressPercent,
//   };
// };

// // ------------------ DOCUMENT SIDEBAR COMPONENT ------------------
// const DocumentSidebar = ({ documents, open, onClose, supportingDocs }) => {
//   const uploadedDocs = documents.filter(
//     (d) => d.uploadData && d.uploadData.status !== "deleted",
//   );

//   // Combine regular docs and supporting docs for sidebar
//   const allDocs = [...uploadedDocs, ...supportingDocs]; // ADD THIS - but supportingDocs needs to be passed as prop or available in scope

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };
//   const groupedDocs = allDocs.reduce((acc, doc) => {
//     // CHANGE uploadedDocs to allDocs
//     const group = doc.category || "Main Documents";
//     if (!acc[group]) acc[group] = [];
//     acc[group].push(doc);
//     return acc;
//   }, {});

//   const lastUpload =
//     allDocs.length > 0 // CHANGE uploadedDocs to allDocs
//       ? allDocs // CHANGE uploadedDocs to allDocs
//           .map((d) => new Date(d.uploadData?.createdAt || d.updatedAt || 0))
//           .sort((a, b) => b - a)[0]
//       : null;

//   return (
//     <Drawer
//       title={
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <span style={{ fontWeight: 600 }}>Uploaded Documents</span>
//           <Tag color="blue">{allDocs.length} doc</Tag>{" "}
//           {/* CHANGE uploadedDocs to allDocs */}
//         </div>
//       }
//       placement="right"
//       width={420}
//       open={open}
//       onClose={onClose}
//     >
//       <div style={{ marginBottom: 12, color: "#6b7280", fontSize: 13 }}>
//         📄 Documents uploaded to this checklist
//       </div>

//       {Object.entries(groupedDocs).map(([category, docs]) => (
//         <Collapse
//           key={category}
//           defaultActiveKey={[category]}
//           expandIconPosition="end"
//           style={{ marginBottom: 16 }}
//           items={[
//             {
//               key: category,
//               label: (
//                 <b style={{ color: "#164679" }}>
//                   {category} ({docs.length})
//                 </b>
//               ),
//               children: docs.map((doc, idx) => (
//                 <Card
//                   key={idx}
//                   size="small"
//                   style={{
//                     borderRadius: 10,
//                     marginBottom: 12,
//                     border: "1px solid #e5e7eb",
//                   }}
//                 >
//                   {/* HEADER */}
//                   <div
//                     style={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <b>{doc.uploadData?.fileName || doc.name}</b>
//                     <Tag
//                       color={
//                         doc.uploadData?.status === "active" ? "green" : "red"
//                       }
//                     >
//                       {doc.uploadData?.status === "active"
//                         ? "Active"
//                         : "Deleted"}
//                     </Tag>
//                   </div>

//                   {/* DOC ID */}
//                   <div
//                     style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}
//                   >
//                     ID: {doc.uploadData?._id || doc._id || "—"}
//                   </div>

//                   {/* META */}
//                   <div style={{ fontSize: 12, color: "#374151" }}>
//                     🕒{" "}
//                     {doc.uploadData?.createdAt
//                       ? dayjs(doc.uploadData.createdAt).format(
//                           "DD MMM YYYY HH:mm:ss",
//                         )
//                       : "N/A"}
//                     {"  •  "}
//                     {doc.uploadData?.fileSize
//                       ? formatFileSize(doc.uploadData.fileSize)
//                       : "N/A"}
//                     {"  •  "}
//                     {doc.uploadData?.fileType || "Unknown"}
//                   </div>

//                   {/* CATEGORY */}
//                   <div style={{ marginTop: 6 }}>
//                     <Tag color="purple">{doc.category}</Tag>
//                   </div>

//                   {/* UPLOAD INFO */}
//                   <div
//                     style={{
//                       marginTop: 10,
//                       paddingLeft: 10,
//                       borderLeft: "3px solid #84cc16",
//                       fontSize: 12,
//                     }}
//                   >
//                     <div>
//                       Uploaded by{" "}
//                       <b>{doc.uploadData?.uploadedBy || "Current User"}</b>
//                     </div>
//                     <div style={{ color: "#6b7280" }}>
//                       {doc.uploadData?.createdAt
//                         ? dayjs(doc.uploadData.createdAt).format(
//                             "DD MMM YYYY HH:mm:ss",
//                           )
//                         : ""}
//                     </div>
//                   </div>

//                   {/* OWNER + DOWNLOAD */}
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginTop: 10,
//                       fontSize: 12,
//                     }}
//                   >
//                     <div>
//                       👤 Document:{" "}
//                       <b>{doc.uploadData?.documentName || doc.name}</b>
//                     </div>

//                     {doc.uploadData?.status === "active" && (
//                       <Button
//                         type="link"
//                         icon={<DownloadOutlined />}
//                         onClick={() =>
//                           window.open(
//                             `${API_BASE_URL}${doc.uploadData.fileUrl}`,
//                             "_blank",
//                           )
//                         }
//                       >
//                         Download
//                       </Button>
//                     )}
//                   </div>
//                 </Card>
//               )),
//             },
//           ]}
//         />
//       ))}

//       {/* FOOTER SUMMARY */}
//       <Card size="small" style={{ marginTop: 24 }}>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <span>Total Documents:</span>
//           <b>{allDocs.length}</b> {/* CHANGE uploadedDocs to allDocs */}
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 6,
//           }}
//         >
//           <span>Last Upload:</span>
//           <b>
//             {lastUpload
//               ? dayjs(lastUpload).format("DD MMM YYYY HH:mm:ss")
//               : "—"}
//           </b>
//         </div>
//       </Card>
//     </Drawer>
//   );
// };

// const CheckerReviewChecklistModal = ({
//   checklist,
//   open,
//   onClose,
//   isReadOnly = false,
// }) => {
//   const [docs, setDocs] = useState([]);
//   const [checkerComment, setCheckerComment] = useState("");
//   const [supportingDocs, _] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [confirmAction, setConfirmAction] = useState(null);
//   const [showDocumentSidebar, setShowDocumentSidebar] = useState(false);
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

//   const [submitCheckerStatus] = useUpdateCheckerStatusMutation();
//   const [saveDraft, { isLoading: isSavingDraft }] =
//     useSaveChecklistDraftMutation();
//   const { data: comments, isLoading: commentsLoading } =
//     useGetChecklistCommentsQuery(checklist?._id, { skip: !checklist?._id });

//   // Calculate document stats using the new function
//   const documentStats = useMemo(() => {
//     return calculateDocumentStats(docs);
//   }, [docs]);

//   // Get document stats from the calculation
//   const {
//     total,
//     submitted,
//     deferred,
//     sighted,
//     waived,
//     tbo,
//     checkerApproved,
//     checkerRejected,
//     checkerReviewed,
//     progressPercent,
//   } = documentStats;

//   useEffect(() => {
//     if (!checklist?.documents) return;
//     const flatDocs = checklist.documents.reduce((acc, item) => {
//       if (item.docList?.length) {
//         const nested = item.docList.map((doc) => ({
//           ...doc,
//           category: item.category,
//           coStatus: doc.status || doc.action || "pending",
//         }));
//         return acc.concat(nested);
//       }
//       if (item.category) return acc.concat(item);
//       return acc;
//     }, []);

//     // FIX: If checklist is approved (isReadOnly), set all checkerStatus to "approved"
//     const shouldForceApproved =
//       isReadOnly || checklist?.status?.toLowerCase() === "approved";

//     setDocs(
//       flatDocs.map((doc, idx) => ({
//         ...doc,
//         key: doc._id || `doc-${idx}`,
//         status: doc.status || doc.action || "pending",
//         approved: shouldForceApproved ? true : doc.approved || false,
//         // FIX: Force checkerStatus to "approved" for completed checklists
//         checkerStatus: shouldForceApproved
//           ? "approved"
//           : doc.checkerStatus || (doc.approved ? "approved" : "pending"),
//         comment: doc.comment || "",
//         fileUrl: doc.fileUrl || null,
//         expiryDate: doc.expiryDate || null,
//         deferralNo: doc.deferralNo || null,
//       })),
//     );
//   }, [checklist, isReadOnly]);

//   const API_BASE_URL =
//     import.meta.env?.VITE_APP_API_URL || "http://localhost:5000";

//   const docsCount = docs.filter((d) => d.fileUrl).length;
//   const supportingDocsCount = supportingDocs.filter((d) => d.fileUrl).length;

//   // Function to generate and download PDF
//   const downloadChecklistAsPDF = async () => {
//     setIsGeneratingPDF(true);

//     try {
//       const jsPDF = (await import("jspdf")).default;
//       const html2canvas = await import("html2canvas");

//       // Helper function to calculate document counts for PDF
//       const calculateDocumentCounts = (docs) => {
//         const counts = {
//           submitted: 0,
//           waived: 0,
//           deferred: 0,
//           sighted: 0,
//           tbo: 0,
//           pendingrm: 0,
//           pendingco: 0,
//           pending: 0,
//           approved: 0,
//           completed: 0,
//           total: docs.length,
//         };

//         docs.forEach((doc) => {
//           const status = (doc.status || doc.action || "").toLowerCase().trim();

//           if (status === "submitted") {
//             counts.submitted++;
//           } else if (status === "waived") {
//             counts.waived++;
//           } else if (status === "deferred") {
//             counts.deferred++;
//           } else if (status === "sighted") {
//             counts.sighted++;
//           } else if (status === "tbo") {
//             counts.tbo++;
//           } else if (status === "approved") {
//             counts.approved++;
//           } else if (status === "pendingrm") {
//             counts.pendingrm++;
//           } else if (status === "pendingco") {
//             counts.pendingco++;
//           } else if (status === "pending") {
//             if (doc.category && doc.category.toLowerCase().includes("rm")) {
//               counts.pendingrm++;
//             } else {
//               counts.pendingco++;
//             }
//           }
//         });

//         counts.pending = counts.pendingrm + counts.pendingco;
//         counts.completed = counts.total - counts.pending;

//         return counts;
//       };

//       // Calculate statistics for PDF
//       const documentCounts = calculateDocumentCounts(docs);
//       const totalDocs = documentCounts.total;
//       const totalDocsReviewed = totalDocs; // All documents reviewed for completed checklist
//       const isCompletedChecklist =
//         checklist?.status === "completed" || checklist?.status === "approved";

//       const pdfContainer = document.createElement("div");
//       pdfContainer.style.position = "absolute";
//       pdfContainer.style.left = "-9999px";
//       pdfContainer.style.top = "0";
//       pdfContainer.style.width = "794px";
//       pdfContainer.style.padding = "20px 30px";
//       pdfContainer.style.backgroundColor = "#ffffff";
//       pdfContainer.style.fontFamily = "'Calibri', 'Arial', sans-serif";
//       pdfContainer.style.color = "#333333";

//       const bankColors = {
//         primary: "#1a365d",
//         secondary: "#2c5282",
//         accent: "#0f766e",
//         success: "#047857",
//         warning: "#d97706",
//         danger: "#dc2626",
//         light: "#f8fafc",
//         border: "#e2e8f0",
//         text: "#334155",
//         textLight: "#64748b",
//       };

//       const getStatusColor = (status) => {
//         const statusLower = (status || "").toLowerCase();
//         switch (statusLower) {
//           case "submitted":
//           case "approved":
//             return { bg: "#d1fae5", color: "#065f46", border: "#10b981" };
//           case "pendingrm":
//             return { bg: "#fee2e2", color: "#991b1b", border: "#ef4444" };
//           case "pendingco":
//             return { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" };
//           case "waived":
//             return { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" };
//           case "sighted":
//             return { bg: "#dbeafe", color: "#1e40af", border: "#3b82f6" };
//           case "deferred":
//             return { bg: "#e0e7ff", color: "#3730a3", border: "#6366f1" };
//           case "tbo":
//             return { bg: "#f1f5f9", color: "#475569", border: "#94a3b8" };
//           case "rejected":
//             return { bg: "#fee2e2", color: "#991b1b", border: "#ef4444" };
//           case "reviewed":
//             return { bg: "#e0e7ff", color: "#3730a3", border: "#6366f1" };
//           default:
//             return { bg: "#f1f5f9", color: "#64748b", border: "#cbd5e1" };
//         }
//       };

//       const truncateText = (text, maxLength) => {
//         if (!text) return "";
//         if (text.length <= maxLength) return text;
//         return text.substring(0, maxLength - 3) + "...";
//       };

//       // Get checklist information
//       const customerNumber =
//         checklist?.customerNumber ||
//         checklist?.title?.split("-")?.pop() ||
//         "N/A";
//       const dclNo = checklist?.dclNo || "N/A";
//       const ibpsNo = checklist?.ibpsNo || "Not provided";
//       const loanType = checklist?.loanType || "N/A";
//       const createdBy = checklist?.createdBy?.name || "N/A";
//       const rm = checklist?.assignedToRM?.name || "N/A";
//       const coChecker =
//         checklist?.assignedToCoChecker?.name ||
//         checklist?.coChecker ||
//         "Pending";
//       const status = checklist?.status || "pending";
//       const completedAt =
//         checklist?.completedAt || checklist?.updatedAt || "N/A";

//       // Helper function for expiry status
//       const getExpiryStatusForPDF = (expiryDate) => {
//         if (!expiryDate) return null;
//         const today = dayjs().startOf("day");
//         const expiry = dayjs(expiryDate).startOf("day");
//         return expiry.isBefore(today) ? "expired" : "current";
//       };

//       pdfContainer.innerHTML = `
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
        
//         .pdf-header {
//           border-bottom: 2px solid ${bankColors.primary};
//           padding-bottom: 15px;
//           margin-bottom: 20px;
//           position: relative;
//         }
       
//         .bank-logo {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 12px;
//         }
       
//         .logo-circle {
//           width: 50px;
//           height: 50px;
//           background: ${bankColors.primary};
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: bold;
//           font-size: 20px;
//         }
       
//         .bank-name {
//           font-size: 20px;
//           font-weight: bold;
//           color: ${bankColors.primary};
//           letter-spacing: 0.5px;
//         }
       
//         .bank-tagline {
//           font-size: 10px;
//           color: ${bankColors.textLight};
//           margin-top: 2px;
//           letter-spacing: 0.3px;
//         }
       
//         .document-title {
//           font-size: 16px;
//           font-weight: bold;
//           color: ${bankColors.secondary};
//           margin-bottom: 5px;
//         }
       
//         .document-subtitle {
//           font-size: 12px;
//           color: ${bankColors.textLight};
//           display: flex;
//           gap: 15px;
//           flex-wrap: wrap;
//         }
       
//         .document-badge {
//           background: ${bankColors.light};
//           padding: 4px 8px;
//           border-radius: 4px;
//           font-size: 10px;
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//         }
       
//         .badge-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//         }
       
//         .section-card {
//           background: white;
//           border: 1px solid ${bankColors.border};
//           border-radius: 6px;
//           padding: 15px;
//           margin-bottom: 15px;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//         }
       
//         .section-title {
//           font-size: 14px;
//           font-weight: bold;
//           color: ${bankColors.primary};
//           margin-bottom: 12px;
//           padding-bottom: 6px;
//           border-bottom: 1px solid ${bankColors.light};
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
       
//         .section-title::before {
//           content: "▌";
//           color: ${bankColors.accent};
//           font-size: 12px;
//         }
       
//         .info-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 10px;
//           margin-bottom: 8px;
//           font-size: 10px;
//         }
       
//         .info-item {
//           padding: 8px;
//           background: ${bankColors.light};
//           border-radius: 4px;
//           border-left: 3px solid ${bankColors.secondary};
//         }
       
//         .info-label {
//           font-size: 9px;
//           color: ${bankColors.textLight};
//           text-transform: uppercase;
//           letter-spacing: 0.3px;
//           margin-bottom: 2px;
//         }
       
//         .info-value {
//           font-size: 11px;
//           font-weight: 600;
//           color: ${bankColors.text};
//         }
       
//         .summary-cards {
//           display: grid;
//           grid-template-columns: repeat(10, 1fr);
//           gap: 8px;
//           margin-bottom: 15px;
//           font-size: 9px;
//         }
       
//         .summary-card {
//           padding: 8px;
//           border-radius: 6px;
//           text-align: center;
//           background: ${bankColors.light};
//           border: 1px solid ${bankColors.border};
//         }
       
//         .summary-number {
//           font-size: 16px;
//           font-weight: bold;
//           color: ${bankColors.primary};
//           margin: 4px 0;
//         }
       
//         .summary-label {
//           font-size: 8px;
//           color: ${bankColors.textLight};
//           text-transform: uppercase;
//           letter-spacing: 0.3px;
//         }
       
//         .progress-bar {
//           height: 6px;
//           background: ${bankColors.border};
//           border-radius: 3px;
//           overflow: hidden;
//           margin: 12px 0;
//         }
       
//         .progress-fill {
//           height: 100%;
//           background: linear-gradient(90deg, ${bankColors.success}, ${bankColors.accent});
//           border-radius: 3px;
//         }
       
//         .progress-text {
//           display: flex;
//           justify-content: space-between;
//           font-size: 10px;
//           color: ${bankColors.textLight};
//         }
       
//         .table-container {
//           overflow-x: auto;
//           margin-top: 12px;
//         }
       
//         .document-table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 9px;
//           table-layout: fixed;
//         }
       
//         .document-table th {
//           background: ${bankColors.primary};
//           color: white;
//           text-align: left;
//           padding: 8px 6px;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.3px;
//           border-right: 1px solid rgba(255,255,255,0.2);
//           word-wrap: break-word;
//           overflow-wrap: break-word;
//         }
       
//         .document-table td {
//           padding: 6px;
//           border-bottom: 1px solid ${bankColors.border};
//           vertical-align: top;
//           word-wrap: break-word;
//           overflow-wrap: break-word;
//         }
       
//         .document-table tr:nth-child(even) {
//           background: ${bankColors.light};
//         }
       
//         .status-badge {
//           padding: 2px 6px;
//           border-radius: 10px;
//           font-size: 8px;
//           font-weight: 600;
//           display: inline-block;
//           border: 1px solid;
//           text-align: center;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
       
//         .comment-box {
//           background: ${bankColors.light};
//           border-left: 3px solid ${bankColors.accent};
//           padding: 10px;
//           border-radius: 4px;
//           margin-top: 8px;
//           font-size: 10px;
//           line-height: 1.4;
//         }
       
//         .comment-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 5px;
//         }
       
//         .comment-author {
//           font-weight: 600;
//           color: ${bankColors.primary};
//           font-size: 10px;
//         }
       
//         .comment-date {
//           font-size: 9px;
//           color: ${bankColors.textLight};
//         }
       
//         .watermark {
//           position: fixed;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%) rotate(-45deg);
//           font-size: 60px;
//           color: rgba(0,0,0,0.03);
//           font-weight: bold;
//           pointer-events: none;
//           z-index: 1;
//         }
       
//         .footer {
//           margin-top: 30px;
//           padding-top: 15px;
//           border-top: 1px solid ${bankColors.border};
//           text-align: center;
//           font-size: 9px;
//           color: ${bankColors.textLight};
//           line-height: 1.4;
//         }
       
//         .disclaimer {
//           background: ${bankColors.light};
//           padding: 8px;
//           border-radius: 3px;
//           margin-top: 8px;
//           font-size: 8px;
//         }
        
//         .header-content {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-top: 10px;
//           padding-top: 10px;
//           border-top: 1px solid ${bankColors.border};
//         }
        
//         .document-info {
//           flex: 1;
//         }
        
//         .current-status-section {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-end;
//           min-width: 140px;
//         }
        
//         .status-label {
//           font-size: 9px;
//           color: ${bankColors.textLight};
//           text-transform: uppercase;
//           letter-spacing: 0.3px;
//           margin-bottom: 4px;
//         }
        
//         .status-display {
//           padding: 5px 10px;
//           border-radius: 4px;
//           font-size: 11px;
//           font-weight: 600;
//           text-align: center;
//           border: 2px solid;
//           min-width: 120px;
//         }
        
//         .checker-review-badge {
//           background: #3b82f6;
//           color: white;
//           padding: 2px 8px;
//           border-radius: 4px;
//           font-size: 9px;
//           font-weight: bold;
//         }
        
//         .completed-badge {
//           background: #10b981;
//           color: white;
//           padding: 2px 8px;
//           border-radius: 4px;
//           font-size: 9px;
//           font-weight: bold;
//         }
//       </style>

//       <!-- Watermark -->
//       <div class="watermark">COMPLETED CHECKLIST</div>

//       <!-- Header with Bank Logo -->
//       <div class="pdf-header">
//         <div class="bank-logo">
//           <div class="logo-circle">NCBA</div>
//           <div>
//             <div class="bank-name">COMPLETED CHECKLIST REVIEW</div>
//             <div class="bank-tagline">Document Control System</div>
//           </div>
//         </div>
       
//         <!-- Document Info and Status Section -->
//         <div class="header-content">
//           <div class="document-info">
//             <div class="document-title">Completed Checklist Review Report</div>
//             <div class="document-subtitle">
//               <span class="document-badge">
//                 <span class="badge-dot" style="background: ${bankColors.primary}"></span>
//                 DCL No: <strong>${dclNo}</strong>
//               </span>
//               <span class="document-badge">
//                 <span class="badge-dot" style="background: ${bankColors.secondary}"></span>
//                 Customer: <strong>${customerNumber}</strong>
//               </span>
//               <span class="document-badge">
//                 <span class="badge-dot" style="background: ${bankColors.accent}"></span>
//                 Completed: <strong>${completedAt ? dayjs(completedAt).format("DD MMM YYYY, HH:mm:ss") : "N/A"}</strong>
//               </span>
//               <span class="completed-badge">COMPLETED</span>
//             </div>
//           </div>
          
//           <!-- Current Status Display -->
//           <div class="current-status-section">
//             <div class="status-label">Overall Status</div>
//             <div class="status-display" style="
//               background: #d1fae5;
//               color: #065f46;
//               border-color: #10b981;
//             ">
//               ${status.toUpperCase().replace(/_/g, " ")}
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Checklist Information -->
//       <div class="section-card">
//         <div class="section-title">Checklist Information</div>
//         <div class="info-grid">
//           <div class="info-item">
//             <div class="info-label">Customer Number</div>
//             <div class="info-value">${customerNumber}</div>
//           </div>
//           <div class="info-item">
//             <div class="info-label">DCL Number</div>
//             <div class="info-value">${dclNo}</div>
//           </div>
//           <div class="info-item">
//             <div class="info-label">IBPS Number</div>
//             <div class="info-value">${ibpsNo}</div>
//           </div>
//           <div class="info-item">
//             <div class="info-label">Loan Type</div>
//             <div class="info-value">${loanType}</div>
//           </div>
//           <div class="info-item">
//             <div class="info-label">Created By</div>
//             <div class="info-value">${createdBy}</div>
//           </div>
//           <div class="info-item">
//             <div class="info-label">Relationship Manager</div>
//             <div class="info-value">${rm}</div>
//           </div>
//           <div class="info-item">
//             <div class="info-label">Co-Checker</div>
//             <div class="info-value">${coChecker}</div>
//           </div>
//           <div class="info-item">
//             <div class="info-label">Status</div>
//             <div class="info-value" style="color: #10b981; font-weight: bold;">Completed</div>
//           </div>
//         </div>
//       </div>

//       <!-- Document Summary -->
//       <div class="section-card">
//         <div class="section-title">Document Summary</div>
       
//         <div class="summary-cards">
//           <div class="summary-card">
//             <div class="summary-label">Total</div>
//             <div class="summary-number">${totalDocs}</div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Submitted</div>
//             <div class="summary-number" style="color: ${bankColors.success};">
//               ${documentCounts.submitted}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Approved</div>
//             <div class="summary-number" style="color: ${bankColors.success};">
//               ${documentCounts.approved}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Deferred</div>
//             <div class="summary-number" style="color: #8b5cf6;">
//               ${documentCounts.deferred}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Sighted</div>
//             <div class="summary-number" style="color: #3b82f6;">
//               ${documentCounts.sighted}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Waived</div>
//             <div class="summary-number" style="color: ${bankColors.warning};">
//               ${documentCounts.waived}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">TBO</div>
//             <div class="summary-number" style="color: #06b6d4;">
//               ${documentCounts.tbo}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Pending RM</div>
//             <div class="summary-number" style="color: ${bankColors.warning};">
//               ${documentCounts.pendingrm}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Pending Co</div>
//             <div class="summary-number" style="color: ${bankColors.danger};">
//               ${documentCounts.pendingco}
//             </div>
//           </div>
//           <div class="summary-card">
//             <div class="summary-label">Reviewed</div>
//             <div class="summary-number" style="color: ${bankColors.success};">
//               ${totalDocsReviewed}
//             </div>
//           </div>
//         </div>
       
//         <div class="progress-text">
//           <span>Review Progress:</span>
//           <span>${totalDocsReviewed}/${totalDocs} documents reviewed (100%)</span>
//         </div>
//         <div class="progress-bar">
//           <div class="progress-fill" style="width: 100%"></div>
//         </div>
//         <div style="font-size: 9px; color: ${bankColors.success}; margin-top: 8px; text-align: center; font-weight: 600;">
//           ✓ All ${totalDocs} documents have been reviewed and processed
//         </div>
//       </div>

//       <!-- Document Details -->
//       <div class="section-card">
//         <div class="section-title">Document Details</div>
//         <div class="table-container">
//           <table class="document-table">
//             <thead>
//               <tr>
//                 <th width="15%">Category</th>
//                 <th width="25%">Document Name</th>
//                 <th width="12%">CO Status</th>
//                 <th width="12%">Checker Status</th>
//                 <th width="18%">CO Comment</th>
//                 <th width="10%">Expiry Date</th>
//                 <th width="8%">Validity</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${docs
//                 .map((doc, index) => {
//                   const coStatus = doc.status || doc.action || "pending";
//                   const statusColor = getStatusColor(coStatus);

//                   // For completed checklists, checker status should be "approved"
//                   let checkerStatus = doc.checkerStatus || "approved";
//                   // Force approved status for completed checklists
//                   if (isCompletedChecklist) {
//                     checkerStatus = "approved";
//                   }

//                   const checkerStatusColor = getStatusColor(checkerStatus);

//                   const coStatusLabel =
//                     coStatus === "deferred" &&
//                     (doc.deferralNo || doc.deferralNumber)
//                       ? `Deferred (${doc.deferralNo || doc.deferralNumber})`
//                       : (coStatus || "N/A").toUpperCase();

//                   const checkerStatusLabel = checkerStatus
//                     ? checkerStatus.toUpperCase()
//                     : "APPROVED";

//                   const expiryStatus = (doc.category || "")
//                     .toLowerCase()
//                     .includes("compliance")
//                     ? getExpiryStatusForPDF(doc.expiryDate)
//                     : null;

//                   const truncatedName = truncateText(doc.name, 35);
//                   const truncatedCoComment = truncateText(doc.comment, 30);

//                   return `
//                 <tr>
//                   <td style="font-weight: 600; color: ${bankColors.secondary};">
//                     ${doc.category || "N/A"}
//                   </td>
//                   <td title="${doc.name || "N/A"}">${truncatedName}</td>
//                   <td>
//                     <span class="status-badge" style="
//                       background: ${statusColor.bg};
//                       color: ${statusColor.color};
//                       border-color: ${statusColor.border};
//                     ">
//                       ${coStatusLabel}
//                     </span>
//                   </td>
//                   <td>
//                     <span class="status-badge" style="
//                       background: ${checkerStatusColor.bg};
//                       color: ${checkerStatusColor.color};
//                       border-color: ${checkerStatusColor.border};
//                     ">
//                       ${checkerStatusLabel}
//                     </span>
//                   </td>
//                   <td title="${doc.comment || "—"}">
//                     ${truncatedCoComment || "—"}
//                   </td>
//                   <td style="font-family: monospace; font-size: 8px;">
//                     ${doc.expiryDate ? dayjs(doc.expiryDate).format("DD/MM/YY") : "—"}
//                   </td>
//                   <td>
//                     ${(() => {
//                       if (!expiryStatus) return "—";
//                       return `<span class="status-badge" style="
//                         background: ${expiryStatus === "current" ? "#d1fae5" : "#fee2e2"};
//                         color: ${expiryStatus === "current" ? "#065f46" : "#991b1b"};
//                         border-color: ${expiryStatus === "current" ? "#10b981" : "#ef4444"};
//                       ">
//                         ${expiryStatus === "current" ? "CUR" : "EXP"}
//                       </span>`;
//                     })()}
//                   </td>
//                 </tr>
//               `;
//                 })
//                 .join("")}
//             </tbody>
//           </table>
//         </div>
//         <div style="font-size: 8px; color: ${bankColors.success}; margin-top: 10px; text-align: center; font-weight: 600;">
//           ✓ All ${totalDocs} documents have been reviewed and approved by checker
//         </div>
//       </div>

//       <!-- Comment History -->
//       ${
//         comments && comments.length > 0
//           ? `
//         <div class="section-card">
//           <div class="section-title">Comment Trail & History</div>
//           <div style="max-height: 200px; overflow-y: auto; border: 1px solid ${bankColors.border}; border-radius: 4px; padding: 10px;">
//             ${comments
//               .slice()
//               .sort(
//                 (a, b) =>
//                   new Date(b.createdAt || b.timestamp) -
//                   new Date(a.createdAt || a.timestamp),
//               )
//               .slice(0, 5)
//               .map((comment, index) => {
//                 const userName = comment.userId?.name || "System";
//                 const userRole = comment.userId?.role || "system";
//                 const message = comment.message || "";
//                 const timestamp = comment.createdAt || comment.timestamp;
//                 const formattedTime = dayjs(timestamp).format(
//                   "DD MMM YYYY HH:mm:ss",
//                 );

//                 // Determine role tag color
//                 let roleColor = "blue";
//                 const roleLower = (userRole || "").toLowerCase();
//                 switch (roleLower) {
//                   case "rm":
//                     roleColor = "purple";
//                     break;
//                   case "creator":
//                     roleColor = "green";
//                     break;
//                   case "co_checker":
//                   case "checker":
//                     roleColor = "volcano";
//                     break;
//                   case "system":
//                     roleColor = "default";
//                     break;
//                   default:
//                     roleColor = "blue";
//                 }

//                 const roleBg =
//                   roleColor === "purple"
//                     ? "#d6c1ff"
//                     : roleColor === "green"
//                       ? "#d4edda"
//                       : roleColor === "volcano"
//                         ? "#ffccc7"
//                         : roleColor === "default"
//                           ? "#f0f0f0"
//                           : "#d0e8ff";

//                 const roleText =
//                   roleColor === "purple"
//                     ? "#7e6496"
//                     : roleColor === "green"
//                       ? "#155724"
//                       : roleColor === "volcano"
//                         ? "#721c24"
//                         : roleColor === "default"
//                           ? "#666"
//                           : "#004085";

//                 return `
//                 <div style="margin-bottom: ${index < 4 ? "10px" : "0"}; padding-bottom: ${index < 4 ? "10px" : "0"}; border-bottom: ${index < 4 ? `1px dashed ${bankColors.border}` : "none"};">
//                   <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
//                     <div style="display: flex; align-items: center; gap: 8px;">
//                       <div style="width: 24px; height: 24px; border-radius: 50%; background: ${bankColors.primary}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px;">
//                         ${userName.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <div style="font-weight: bold; color: ${bankColors.primary}; font-size: 10px;">
//                           ${userName}
//                         </div>
//                         <span style="
//                           display: inline-block;
//                           padding: 1px 6px;
//                           border-radius: 8px;
//                           background: ${roleBg};
//                           color: ${roleText};
//                           font-size: 8px;
//                           font-weight: bold;
//                           text-transform: uppercase;
//                           margin-top: 2px;
//                         ">
//                           ${roleLower.replace(/_/g, " ")}
//                         </span>
//                       </div>
//                     </div>
//                     <div style="font-size: 9px; color: ${bankColors.textLight};">
//                       ${formattedTime}
//                     </div>
//                   </div>
//                   <div style="margin-left: 32px; font-size: 10px; line-height: 1.4; color: ${bankColors.text}; word-break: break-word;">
//                     ${message}
//                   </div>
//                 </div>
//               `;
//               })
//               .join("")}
//           </div>
//         </div>
//       `
//           : `
//         <div class="section-card">
//           <div class="section-title">Comment Trail & History</div>
//           <div style="text-align: center; padding: 20px; color: ${bankColors.textLight}; font-size: 10px; border: 1px dashed ${bankColors.border}; border-radius: 4px;">
//             No historical comments yet.
//           </div>
//         </div>
//       `
//       }

//       <!-- Footer -->
//       <div class="footer">
//         <div>
//           <strong>COMPLETED CHECKLIST REVIEW REPORT</strong> •
//           Document Control System •
//           Generated by: ${coChecker || "System"} •
//           Page 1 of 1
//         </div>
//         <div class="disclaimer">
//           This is a system-generated document for completed checklists. For official purposes only.
//           Any unauthorized reproduction or distribution is strictly prohibited.
//           Generated on ${dayjs().format("DD MMM YYYY, HH:mm:ss")} •
//           DCL: ${dclNo} • Customer: ${customerNumber} • Status: ${status
//             .toUpperCase()
//             .replace(/_/g, " ")} • Total Documents: ${totalDocs}
//         </div>
//       </div>
//     `;

//       document.body.appendChild(pdfContainer);

//       // Wait for images to load
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const canvas = await html2canvas.default(pdfContainer, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: "#ffffff",
//         allowTaint: true,
//         width: pdfContainer.offsetWidth,
//         height: pdfContainer.scrollHeight,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a4",
//         compress: true,
//       });

//       const imgWidth = 297;
//       const pageHeight = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(
//         imgData,
//         "PNG",
//         0,
//         position,
//         imgWidth,
//         imgHeight,
//         "",
//         "FAST",
//       );
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(
//           imgData,
//           "PNG",
//           0,
//           position,
//           imgWidth,
//           imgHeight,
//           "",
//           "FAST",
//         );
//         heightLeft -= pageHeight;
//       }

//       const fileName = `Completed_Checklist_${dclNo}_${dayjs().format(
//         "YYYYMMDD_HHmmss",
//       )}.pdf`;
//       pdf.save(fileName);

//       document.body.removeChild(pdfContainer);

//       message.success("Checklist PDF generated successfully!");
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       message.error("Failed to generate PDF. Please try again.");
//     } finally {
//       setIsGeneratingPDF(false);
//     }
//   };

//   const handleDocApprove = (index) => {
//     setDocs((prev) => {
//       const updated = [...prev];
//       updated[index].approved = true;
//       updated[index].checkerStatus = "approved";
//       return updated;
//     });
//   };

//   const handleDocReject = (index) => {
//     setDocs((prev) => {
//       const updated = [...prev];
//       updated[index].approved = false;
//       updated[index].checkerStatus = "rejected";
//       return updated;
//     });
//   };

//   const submitCheckerAction = async (action) => {
//     if (!checklist?._id) return alert("Checklist ID missing");

//     // VALIDATION: Check if trying to approve with rejected documents
//     if (action === "approved") {
//       if (checkerRejected > 0) {
//         message.error("Cannot approve checklist: Some documents are rejected");
//         setConfirmAction(null);
//         return;
//       }

//       if (checkerReviewed !== total) {
//         message.error(
//           "Cannot approve checklist: Not all documents have been reviewed",
//         );
//         setConfirmAction(null);
//         return;
//       }

//       if (checkerApproved !== total) {
//         message.error(
//           "Cannot approve checklist: All documents must be approved",
//         );
//         setConfirmAction(null);
//         return;
//       }
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         id: checklist._id,
//         action: action,
//         checkerDecisions: docs.map((doc) => ({
//           documentId: doc._id || doc.key,
//           checkerStatus:
//             doc.checkerStatus ||
//             (action === "approved" ? "approved" : "rejected"),
//           checkerComment: doc.checkerComment || "",
//         })),
//         checkerComments: checkerComment,
//       };

//       await submitCheckerStatus(payload).unwrap();
//       setConfirmAction(null);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert(err?.data?.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStatusTag = (status) => {
//     if (!status) return <Tag>Unknown</Tag>;

//     const normalized = status.toLowerCase().replace(/_/g, " ");

//     let color = "default";

//     switch (normalized) {
//       case "pending":
//         color = "red";
//         break;
//       case "approved":
//         color = "green";
//         break;
//       case "rejected":
//         color = "volcano";
//         break;
//       case "submitted for review":
//         color = "blue";
//         break;
//       default:
//         color = "default";
//     }

//     return <Tag color={color}>{normalized}</Tag>;
//   };

//   // FIX: Disable actions if checklist is approved (read-only mode)
//   const isDisabled =
//     isReadOnly ||
//     !["check_review", "co_checker_review"].includes(checklist?.status);

//   // This is the existing getExpiryStatus function used in the table
//   function getExpiryStatus(record) {
//     if (!record.expiryDate) {
//       return { status: "-", color: "default" };
//     }

//     const today = dayjs().startOf("day");
//     const expiry = dayjs(record.expiryDate).startOf("day");

//     if (expiry.isBefore(today)) {
//       return { status: "Expired", color: "red" };
//     }

//     return { status: "Current", color: "green" };
//   }

//   // Function to check if checklist can be approved
//   const canApproveChecklist = () => {
//     // Can't approve if disabled
//     if (isDisabled) return false;

//     // Must have reviewed ALL documents
//     if (checkerReviewed !== total) return false;

//     // Must have ZERO rejected documents
//     if (checkerRejected > 0) return false;

//     // Must have ALL documents approved
//     if (checkerApproved !== total) return false;

//     return true;
//   };

//   const getApproveButtonTooltip = () => {
//     if (isDisabled) return "Checklist is not in review state";
//     if (checkerReviewed !== total)
//       return `${total - checkerReviewed} document(s) not reviewed yet`;
//     if (checkerRejected > 0) return `${checkerRejected} document(s) rejected`;
//     if (checkerApproved !== total)
//       return `${total - checkerApproved} document(s) not approved`;
//     return "Approve this checklist";
//   };

//   const columns = [
//     { title: "Category", dataIndex: "category" },
//     { title: "Document Name", dataIndex: "name" },
//     {
//       title: "Co Status",
//       render: (_, record) => {
//         const coStatus = record.status || record.action || "pending";

//         let color = "default";
//         let displayText = coStatus;

//         switch (coStatus.toLowerCase()) {
//           case "submitted":
//             color = "#22c55e";
//             break;
//           case "sighted":
//             color = "#22c55e";
//             break;
//           case "waived":
//             color = " #ffbf00";
//             break;
//           case "deferred":
//             color = " #ffbf00";
//             displayText = record.deferralNo
//               ? `Deferred (${record.deferralNo})`
//               : "Deferred";
//             break;
//           case "tbo":
//             color = " #ffbf00";
//             break;
//           case "pendingrm":
//             color = "#ef4444";
//             break;
//           case "pendingco":
//             color = "#ef4444";
//             break;
//           default:
//             color = "default";
//         }

//         return <Tag color={color}>{displayText}</Tag>;
//       },
//     },
//     { title: "Co Comment", dataIndex: "comment" },
//     {
//       title: "Expiry Date",
//       dataIndex: "expiryDate",
//       width: 120,
//       render: (text, record) =>
//         record.expiryDate ? dayjs(record.expiryDate).format("YYYY-MM-DD") : "-",
//     },
//     {
//       title: "Expiry Status",
//       dataIndex: "expiryStatus",
//       render: (_, record) => {
//         if (record.category !== "Compliance Documents") return "-";
//         const { status, color } = getExpiryStatus(record);
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Checker Status",
//       dataIndex: "checkerStatus",
//       render: (status) => {
//         // FIX: If it's a completed/approved checklist, always show "approved"
//         const finalStatus = isReadOnly ? "approved" : status;
//         return renderStatusTag(finalStatus);
//       },
//     },
//     {
//       title: "Action",
//       render: (_, record, index) => (
//         <Space className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
//           {!isReadOnly && (
//             <>
//               <Button
//                 size="small"
//                 type="primary"
//                 onClick={() => handleDocApprove(index)}
//                 disabled={isDisabled}
//               >
//                 Approve
//               </Button>
//               <Button
//                 size="small"
//                 danger
//                 onClick={() => handleDocReject(index)}
//                 disabled={isDisabled}
//               >
//                 Reject
//               </Button>
//             </>
//           )}

//           {record.fileUrl && (
//             <>
//               <Button
//                 size="small"
//                 icon={<EyeOutlined />}
//                 onClick={() =>
//                   window.open(
//                     getFullUrl(record.fileUrl || record.uploadData?.fileUrl),
//                     "_blank",
//                   )
//                 }
//                 style={{ borderRadius: 6 }}
//               >
//                 View
//               </Button>
//             </>
//           )}
//         </Space>
//       ),
//     },
//   ];

//   // Custom styles for the component
//   const customStyles = `
//     .doc-sidebar-toggle {
//       position: absolute;
//       top: 20px;
//       right: 20px;
//       z-index: 1000;
//     }
//     .doc-item {
//       margin-bottom: 16px;
//       padding: 12px;
//       border: 1px solid #e2e8f0;
//       border-radius: 8px;
//       background: white;
//     }
//     .doc-header {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       margin-bottom: 8px;
//     }
//     .doc-title {
//       font-weight: 600;
//       color: #164679;
//       flex-grow: 1;
//     }
//     .version-badge {
//       background: #b5d334;
//       color: #1a202c;
//       padding: 2px 6px;
//       border-radius: 4px;
//       font-size: 10px;
//       font-weight: bold;
//     }
//     .doc-meta {
//       font-size: 11px;
//       color: #718096;
//       display: flex;
//       align-items: center;
//       gap: 6px;
//       margin-bottom: 8px;
//     }
//     .doc-meta-icon {
//       margin-right: 4px;
//     }
//     .upload-timestamp {
//       font-size: 9px;
//       color: #a0aec0;
//       marginTop: 2px;
//     }
//     .doc-divider {
//       margin: 8px 0;
//     }
//     .doc-icon {
//       font-size: 16px;
//     }
//     .status-breakdown-bar {
//       height: 8px;
//       background: #f0f0f0;
//       border-radius: 4px;
//       overflow: hidden;
//       display: flex;
//     }
//     .status-breakdown-item {
//       height: 100%;
//     }
//   `;

//   return (
//     <>
//       <style>{customStyles}</style>

//       <div
//         className={`fixed inset-0 z-50 overflow-auto bg-black/40 flex justify-center items-start pt-10 ${
//           open ? "" : "hidden"
//         }`}
//       >
//         <div className="bg-white dark:bg-gray-800 w-[95%] max-w-6xl p-6 rounded-lg shadow-lg relative">
//           {/* Close Button */}
//           <button
//             className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white text-4xl font-bold"
//             onClick={onClose}
//           >
//             ×
//           </button>

//           {/* 🔹 VIEW DOCUMENTS BUTTON (ADDED) */}
//           <div style={{ position: "absolute", top: 16, right: 90, zIndex: 10 }}>
//             <Button
//               icon={showDocumentSidebar ? <LeftOutlined /> : <RightOutlined />}
//               onClick={() => setShowDocumentSidebar(!showDocumentSidebar)}
//             >
//               View Documents
//               {docsCount > 0 && (
//                 <Tag color="green" style={{ marginLeft: 6 }}>
//                   Docs: {docsCount}
//                 </Tag>
//               )}
//               {supportingDocsCount > 0 && (
//                 <Tag color="blue" style={{ marginLeft: 6 }}>
//                   Supporting: {supportingDocsCount}
//                 </Tag>
//               )}
//             </Button>
//           </div>

//           {/* Document Sidebar */}
//           <DocumentSidebar
//             documents={docs}
//             supportingDocs={supportingDocs}
//             open={showDocumentSidebar}
//             onClose={() => setShowDocumentSidebar(false)}
//           />

//           {/* Checklist Info */}
//           <Card className="mb-4">
//             <Row gutter={16}>
//               <Col span={8}>
//                 <p>
//                   <b>DCL No:</b>{" "}
//                   <span className="text-grey-700">{checklist?.dclNo}</span>
//                 </p>
//                 <p>
//                   <b>Loan Type:</b> {checklist?.loanType}
//                 </p>
//                 <p>
//                   <b>IBPS No:</b>
//                   <span className="text-grey-700">
//                     {checklist?.ibpsNo || "Not provided"}
//                   </span>
//                 </p>
//               </Col>
//               <Col span={8}>
//                 <p>
//                   <b>Created By:</b> {checklist?.createdBy?.name}
//                 </p>
//                 <p>
//                   <b>RM:</b> {checklist.assignedToRM?.name || "N/A"}
//                 </p>
//               </Col>
//               <Col span={8}>
//                 <p>
//                   <b>Co-Checker:</b>{" "}
//                   {checklist.assignedToCoChecker?.name ||
//                     checklist.coChecker ||
//                     "Pending"}
//                 </p>
//                 <p>
//                   <b>Created At:</b> {checklist?.createdAt}
//                 </p>
//                 {/* FIX: Show "APPROVED" badge for completed checklists */}
//                 {isReadOnly && (
//                   <p>
//                     <b>Status:</b>{" "}
//                     <Tag color="green" style={{ fontWeight: "bold" }}>
//                       APPROVED
//                     </Tag>
//                   </p>
//                 )}
//               </Col>
//             </Row>
//           </Card>

//           {/* Enhanced Progress Section - Applied the same concept as first code */}
//           <div
//             style={{
//               padding: "16px",
//               background: "#f7f9fc",
//               borderRadius: 8,
//               border: "1px solid #e0e0e0",
//               marginBottom: 18,
//             }}
//           >
//             {/* Stats Row - counts of each status */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: 12,
//                 flexWrap: "wrap",
//                 gap: "8px",
//               }}
//             >
//               <div style={{ fontWeight: "700", color: PRIMARY_BLUE }}>
//                 Total: {total}
//               </div>
//               <div style={{ fontWeight: "700", color: "green" }}>
//                 Submitted: {submitted}
//               </div>
//               <div style={{ fontWeight: "700", color: "#ef4444" }}>
//                 Deferred: {deferred}
//               </div>
//               <div style={{ fontWeight: "700", color: "#3b82f6" }}>
//                 Sighted: {sighted}
//               </div>
//               <div style={{ fontWeight: "700", color: "#f59e0b" }}>
//                 Waived: {waived}
//               </div>
//               <div style={{ fontWeight: "700", color: "#06b6d4" }}>
//                 TBO: {tbo}
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div style={{ marginBottom: 8 }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginBottom: 4,
//                 }}
//               >
//                 <span style={{ fontSize: "12px", color: "#666" }}>
//                   Completion Progress
//                 </span>
//                 <span
//                   style={{
//                     fontSize: "12px",
//                     fontWeight: 600,
//                     color: PRIMARY_BLUE,
//                   }}
//                 >
//                   {progressPercent}%
//                 </span>
//               </div>
//               <Progress
//                 percent={progressPercent}
//                 strokeColor={{
//                   "0%": PRIMARY_BLUE,
//                   "100%": ACCENT_LIME,
//                 }}
//                 strokeWidth={6}
//               />
//             </div>

//             {/* Review Progress Bar */}
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginBottom: 4,
//                 }}
//               >
//                 <span style={{ fontSize: "12px", color: "#666" }}>
//                   Review Progress ({checkerReviewed}/{total})
//                 </span>
//                 <span
//                   style={{
//                     fontSize: "12px",
//                     fontWeight: 600,
//                     color: SECONDARY_PURPLE,
//                   }}
//                 >
//                   {checkerReviewed > 0
//                     ? Math.round((checkerReviewed / total) * 100)
//                     : 0}
//                   %
//                 </span>
//               </div>
//               <Progress
//                 percent={
//                   checkerReviewed > 0
//                     ? Math.round((checkerReviewed / total) * 100)
//                     : 0
//                 }
//                 strokeColor={{
//                   "0%": SECONDARY_PURPLE,
//                   "100%": "#8b5cf6",
//                 }}
//                 strokeWidth={4}
//               />
//             </div>
//           </div>

//           <Table columns={columns} dataSource={docs} pagination={false} />

//           <CommentHistory comments={comments} isLoading={commentsLoading} />

//           {/* Checker Comment */}
//           <div className="mt-4">
//             <label
//               htmlFor="checkerComment"
//               className="block text-sm font-semibold text-gray-700 mb-1"
//             >
//               Checker Comment
//             </label>
//             <textarea
//               id="checkerComment"
//               rows={3}
//               value={checkerComment}
//               onChange={(e) => setCheckerComment(e.target.value)}
//               placeholder="Add your comment..."
//               disabled={isDisabled}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
//             />
//           </div>

//           {/* Bottom Buttons */}
//           <div className="mt-6 flex justify-between items-center">
//             <Space>
//               {!isReadOnly && (
//                 <Button icon={<UploadOutlined />} disabled={isDisabled}>
//                   Upload Documents
//                 </Button>
//               )}

//               {/* Save Draft Button */}
//               <Button
//                 onClick={async () => {
//                   try {
//                     message.loading({
//                       content: "Saving draft...",
//                       key: "saveDraft",
//                     });
//                     const payload = {
//                       checklistId: checklist._id,
//                       draftData: {
//                         documents: docs.map((doc) => ({
//                           _id: doc._id,
//                           name: doc.name,
//                           category: doc.category,
//                           status: doc.status,
//                           action: doc.action,
//                           checkerStatus: doc.checkerStatus,
//                           checkerComment: doc.checkerComment || "",
//                           comment: doc.comment,
//                           fileUrl: doc.fileUrl,
//                           expiryDate: doc.expiryDate,
//                           deferralNo: doc.deferralNo,
//                         })),
//                         creatorComment: checkerComment,
//                       },
//                     };

//                     await saveDraft(payload).unwrap();

//                     console.log("Draft saved successfully!", payload);
//                     message.success({
//                       content: "Draft saved successfully!",
//                       key: "saveDraft",
//                       duration: 3,
//                     });
//                   } catch (error) {
//                     console.error("Save draft error:", error);
//                     message.error({
//                       content: "Failed to save draft",
//                       key: "saveDraft",
//                     });
//                   }
//                 }}
//                 loading={isSavingDraft}
//                 disabled={isReadOnly}
//                 style={{
//                   borderColor: ACCENT_LIME,
//                   color: PRIMARY_BLUE,
//                 }}
//               >
//                 Save Draft
//               </Button>

//               {/* PDF Download Button - ALWAYS ACTIVE */}
//               <Button
//                 icon={<FilePdfOutlined />}
//                 onClick={downloadChecklistAsPDF}
//                 loading={isGeneratingPDF}
//                 style={{
//                   backgroundColor: PRIMARY_BLUE,
//                   borderColor: PRIMARY_BLUE,
//                   color: "white",
//                 }}
//               >
//                 Download as PDF
//               </Button>
//             </Space>

//             {!isReadOnly && (
//               <Space>
//                 <Button
//                   danger
//                   onClick={() => setConfirmAction("co_creator_review")}
//                   disabled={isDisabled}
//                 >
//                   Return to Creator
//                 </Button>

//                 <Tooltip title={getApproveButtonTooltip()}>
//                   <Button
//                     type="primary"
//                     icon={<CheckCircleOutlined />}
//                     disabled={!canApproveChecklist()}
//                     onClick={() => {
//                       if (!canApproveChecklist()) {
//                         message.error(getApproveButtonTooltip());
//                         return;
//                       }
//                       setConfirmAction("approved");
//                     }}
//                   >
//                     Approve
//                   </Button>
//                 </Tooltip>
//               </Space>
//             )}
//           </div>

//           {/* Custom Confirmation Card - Only show if not read-only */}
//           {!isReadOnly && confirmAction && (
//             <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
//               <div className="bg-white dark:bg-gray-700 p-6 rounded-lg w-96 shadow-lg text-center">
//                 <h3 className="text-lg font-bold mb-4">
//                   {confirmAction === "approved"
//                     ? "Approve Checklist?"
//                     : "Return to Creator?"}
//                 </h3>
//                 <p className="mb-6">
//                   {confirmAction === "approved"
//                     ? checkerRejected > 0
//                       ? `Cannot approve: ${checkerRejected} document(s) are rejected. Please review all documents.`
//                       : checkerReviewed !== total
//                         ? `Cannot approve: ${
//                             total - checkerReviewed
//                           } document(s) not reviewed yet.`
//                         : checkerApproved !== total
//                           ? `Cannot approve: ${
//                               total - checkerApproved
//                             } document(s) not approved.`
//                           : `This will approve all ${checkerApproved} approved documents. This action is final.`
//                     : "This will send the checklist back to the creator."}
//                 </p>
//                 <div className="flex justify-center gap-4">
//                   <Button onClick={() => setConfirmAction(null)}>Cancel</Button>
//                   <Button
//                     type="primary"
//                     loading={loading}
//                     onClick={() => {
//                       // Add validation before submitting
//                       if (
//                         confirmAction === "approved" &&
//                         !canApproveChecklist()
//                       ) {
//                         message.error(
//                           "Cannot approve checklist: All documents must be approved",
//                         );
//                         setConfirmAction(null);
//                         return;
//                       }
//                       submitCheckerAction(confirmAction);
//                     }}
//                     // Also disable the confirm button if conditions are not met
//                     disabled={
//                       confirmAction === "approved" && !canApproveChecklist()
//                     }
//                   >
//                     Confirm
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CheckerReviewChecklistModal;







import { Select } from "antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Table,
  Tag,
  Input,
  Card,
  Row,
  Col,
  Progress,
  Space,
  List,
  Avatar,
  Spin,
  Drawer,
  Typography,
  Collapse,
  Divider,
  message,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  UploadOutlined,
  DownloadOutlined,
  UserOutlined,
  PaperClipOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  CalendarOutlined,
  ClockCircleOutlined as TimeOutlined,
  UserAddOutlined,
  RightOutlined,
  LeftOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import {
  useUpdateCheckerStatusMutation,
  useGetChecklistCommentsQuery,
  useSaveChecklistDraftMutation,
} from "../../api/checklistApi";

// Import shared utilities
import {
  getFullUrl,
  getExpiryStatus as getExpiryStatusUtil,
  getModalStyles,
  THEME,
  getUniqueCategories,
} from "../../utils/checklistUtils";

// Import new shared components
import CommentHistory from "../common/CommentHistory";

const { Option } = Select;
const { Text, Title } = Typography;

const GREEN = THEME?.GREEN || "#52c41a";
const RED = "red";
const PRIMARY_BLUE = "#164679"; // Updated to match screenshot blue
const ACCENT_LIME = "#b5d334";
const SECONDARY_PURPLE = "#7e6496";
const LIGHT_BLUE = "#e6f4ff";
const LIGHT_GREY = "#f5f5f5";

// ------------------ ENHANCED PROGRESS CALCULATION FUNCTIONS ------------------
const calculateDocumentStats = (docs) => {
  const total = docs.length;

  // Count all status types from CO perspective
  const submitted = docs.filter(
    (d) =>
      d.status?.toLowerCase() === "submitted" ||
      d.action?.toLowerCase() === "submitted" ||
      d.coStatus?.toLowerCase() === "submitted"
  ).length;

  const pendingFromRM = docs.filter(
    (d) =>
      d.status?.toLowerCase() === "pendingrm" ||
      d.action?.toLowerCase() === "pendingrm" ||
      d.coStatus?.toLowerCase() === "pendingrm"
  ).length;

  const pendingFromCo = docs.filter(
    (d) =>
      d.status?.toLowerCase() === "pendingco" ||
      d.action?.toLowerCase() === "pendingco" ||
      d.coStatus?.toLowerCase() === "pendingco"
  ).length;

  const deferred = docs.filter(
    (d) =>
      d.status?.toLowerCase() === "deferred" ||
      d.action?.toLowerCase() === "deferred" ||
      d.coStatus?.toLowerCase() === "deferred"
  ).length;

  const sighted = docs.filter(
    (d) =>
      d.status?.toLowerCase() === "sighted" ||
      d.action?.toLowerCase() === "sighted" ||
      d.coStatus?.toLowerCase() === "sighted"
  ).length;

  const waived = docs.filter(
    (d) =>
      d.status?.toLowerCase() === "waived" ||
      d.action?.toLowerCase() === "waived" ||
      d.coStatus?.toLowerCase() === "waived"
  ).length;

  const tbo = docs.filter(
    (d) =>
      d.status?.toLowerCase() === "tbo" ||
      d.action?.toLowerCase() === "tbo" ||
      d.coStatus?.toLowerCase() === "tbo"
  ).length;

  // Checker review statuses - UPDATED to be more accurate
  const checkerApproved = docs.filter(
    (d) => d.checkerStatus && d.checkerStatus.toLowerCase() === "approved"
  ).length;

  const checkerRejected = docs.filter(
    (d) => d.checkerStatus && d.checkerStatus.toLowerCase() === "rejected"
  ).length;

  const checkerReviewed = docs.filter(
    (d) =>
      d.checkerStatus &&
      !["not reviewed", "pending", null, undefined, ""].includes(
        d.checkerStatus?.toLowerCase()
      )
  ).length;

  const checkerPending = docs.filter(
    (d) =>
      !d.checkerStatus ||
      ["not reviewed", "pending", null, undefined, ""].includes(
        d.checkerStatus?.toLowerCase()
      )
  ).length;

  // RM statuses
  const rmSubmitted = docs.filter(
    (d) =>
      d.rmStatus &&
      (d.rmStatus.toLowerCase().includes("submitted") ||
        d.rmStatus.toLowerCase().includes("approved") ||
        d.rmStatus.toLowerCase().includes("satisfactory"))
  ).length;

  const rmPending = docs.filter(
    (d) =>
      d.rmStatus &&
      (d.rmStatus.toLowerCase().includes("pending") ||
        d.rmStatus.toLowerCase().includes("awaiting"))
  ).length;

  const rmDeferred = docs.filter(
    (d) =>
      d.rmStatus &&
      (d.rmStatus.toLowerCase().includes("deferred") ||
        d.rmStatus.toLowerCase().includes("returned"))
  ).length;

  const progressPercent =
    total === 0
      ? 0
      : docs.filter(
          (d) =>
            d.action?.toLowerCase() === "pendingco" ||
            d.status?.toLowerCase() === "pendingco"
        ).length === 0
        ? 100
        : Math.round((submitted / total) * 100);

  return {
    total,
    submitted,
    pendingFromRM,
    pendingFromCo,
    deferred,
    sighted,
    waived,
    tbo,
    checkerApproved,
    checkerRejected,
    checkerReviewed,
    checkerPending,
    rmSubmitted,
    rmPending,
    rmDeferred,
    progressPercent,
  };
};

// ------------------ DOCUMENT SIDEBAR COMPONENT ------------------
const DocumentSidebar = ({ documents, open, onClose }) => {
  const { Title, Text } = Typography;
  const { Panel } = Collapse;

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileTextOutlined className="doc-icon" />;
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return (
          <FilePdfOutlined className="doc-icon" style={{ color: "#FF6B6B" }} />
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <FileImageOutlined
            className="doc-icon"
            style={{ color: "#4ECDC4" }}
          />
        );
      case "doc":
      case "docx":
        return (
          <FileWordOutlined className="doc-icon" style={{ color: "#2E86C1" }} />
        );
      case "xls":
      case "xlsx":
        return (
          <FileExcelOutlined
            className="doc-icon"
            style={{ color: "#27AE60" }}
          />
        );
      case "zip":
      case "rar":
        return (
          <FileZipOutlined className="doc-icon" style={{ color: "#ED8936" }} />
        );
      default:
        return <FileTextOutlined className="doc-icon" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/,/g, "");
  };

  // Process real documents with upload timestamps
  const processedDocs =
    documents && documents.length > 0
      ? documents
          .filter((doc) => doc.fileUrl)
          .map((doc, idx) => ({
            id: idx,
            title: doc.name || `Document ${idx + 1}`,
            category: doc.category,
            fileName: doc.fileUrl
              ? doc.fileUrl.split("/").pop()
              : "document.pdf",
            version: "1.0",
            size: 102400, // Default size
            pages: "1",
            owner: "Current User",
            uploadedBy: "Current User",
            uploadDate: doc.uploadDate || new Date().toISOString(),
            modifiedDate: doc.modifiedDate || new Date().toISOString(),
            fileUrl: doc.fileUrl,
            uploadHistory: [
              {
                timestamp: new Date().toISOString(),
                user: "Current User",
                action: "Uploaded",
              },
            ],
          }))
      : [];

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PaperClipOutlined style={{ color: "#164679" }} />
          <span>Uploaded Documents</span>
          <span
            style={{
              fontSize: "12px",
              color: "#666",
              marginLeft: "auto",
              backgroundColor: "#f0f5ff",
              padding: "2px 8px",
              borderRadius: "12px",
            }}
          >
            {processedDocs.length} {processedDocs.length === 1 ? "doc" : "docs"}
          </span>
        </div>
      }
      placement="right"
      closable={true}
      onClose={onClose}
      open={open}
      width={380}
      className="document-sidebar"
      headerStyle={{
        borderBottom: `2px solid #b5d334`,
        background: "white",
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <div style={{ marginBottom: "16px" }}>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          <CalendarOutlined style={{ marginRight: 6, fontSize: "10px" }} />
          Documents uploaded to this checklist
        </Text>
      </div>

      <Collapse
        ghost
        defaultActiveKey={["1"]}
        expandIconPosition="end"
        style={{ background: "transparent" }}
      >
        <Panel
          header={
            <Text strong style={{ color: "#164679" }}>
              Main Documents ({processedDocs.length})
            </Text>
          }
          key="1"
        >
          <div style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}>
            {processedDocs.map((doc) => (
              <div key={doc.id} className="doc-item">
                {/* Main document header */}
                <div className="doc-header">
                  {getFileIcon(doc.fileName || doc.title)}
                  <div className="doc-title">
                    {doc.fileName ? doc.title : doc.title}
                  </div>
                  <div className="version-badge">v{doc.version}</div>
                </div>

                {/* File name for sub-documents */}
                {doc.fileName && doc.fileName !== doc.title && (
                  <div
                    style={{
                      marginLeft: "28px",
                      fontSize: "12px",
                      color: "#4a5568",
                      marginBottom: "6px",
                    }}
                  >
                    {doc.fileName}
                  </div>
                )}

                {/* Document metadata */}
                <div className="doc-meta">
                  <span>
                    <TimeOutlined className="doc-meta-icon" />
                    {formatDateTime(doc.modifiedDate || doc.uploadDate)}
                  </span>
                  <span>•</span>
                  <span>{formatFileSize(doc.size)}</span>
                  {doc.pages && (
                    <>
                      <span>•</span>
                      <span>
                        {doc.pages} Page{doc.pages !== "1" ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>

                {/* Category for main documents */}
                {doc.category && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#7e6496",
                      fontWeight: "600",
                      marginTop: "4px",
                      backgroundColor: "#7e649610",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      display: "inline-block",
                    }}
                  >
                    {doc.category}
                  </div>
                )}

                {/* Upload timeline */}
                <div style={{ marginTop: "10px" }}>
                  <div className="upload-timeline">
                    {doc.uploadHistory &&
                      doc.uploadHistory.map((history, idx) => (
                        <div
                          key={idx}
                          style={{ marginBottom: "8px", position: "relative" }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "-22px",
                              top: "2px",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#b5d334",
                              border: `2px solid white`,
                            }}
                          />
                          <div
                            style={{
                              fontSize: "10px",
                              fontWeight: "500",
                              color: "#4a5568",
                            }}
                          >
                            {history.action} by{" "}
                            <span style={{ color: "#164679" }}>
                              {history.user}
                            </span>
                          </div>
                          <div className="upload-timestamp">
                            {formatDateTime(history.timestamp)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Owner information */}
                <Divider className="doc-divider" />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "11px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <UserAddOutlined
                      style={{ fontSize: "10px", color: "#718096" }}
                    />
                    <span style={{ color: "#718096" }}>Owner:</span>
                    <span style={{ fontWeight: "500", color: "#164679" }}>
                      {doc.owner || doc.uploadedBy || "badmin"}
                    </span>
                  </div>
                  {doc.fileUrl && (
                    <Button
                      type="link"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        const API_BASE =
                          import.meta.env?.VITE_APP_API_URL ||
                          "http://localhost:5000";
                        const url = doc.fileUrl.startsWith("http") ||
                          doc.fileUrl.startsWith("blob:")
                          ? doc.fileUrl
                          : `${API_BASE}${doc.fileUrl}`;
                        window.open(url, "_blank");
                      }}
                      style={{ padding: "0", fontSize: "11px" }}
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Collapse>

      <Divider style={{ margin: "16px 0" }} />

      {/* Summary section */}
      <div
        style={{
          background: "#f8fafc",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            marginBottom: "6px",
          }}
        >
          <Text type="secondary">Total Documents:</Text>
          <Text strong>{processedDocs.length}</Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
          }}
        >
          <Text type="secondary">Last Upload:</Text>
          <Text>
            {processedDocs.length > 0
              ? formatDateTime(
                  processedDocs[processedDocs.length - 1].uploadDate
                )
              : "N/A"}
          </Text>
        </div>
      </div>
    </Drawer>
  );
};

// Detail Item Helper Component
const DetailItem = ({ label, value, isStatus = false }) => (
  <div style={{ display: "flex", marginBottom: "8px" }}>
    <div style={{
      width: "120px",
      color: "#666",
      fontSize: "14px",
      fontWeight: "400"
    }}>
      <b>{label}:</b>
    </div>
    <div style={{
      color: "#333",
      fontSize: "14px",
      fontWeight: "500"
    }}>
      {isStatus ? (
        <span className="status-badge">{value}</span>
      ) : value}
    </div>
  </div>
);

const CheckerReviewChecklistModal = ({
  checklist,
  open,
  onClose,
  isReadOnly = false,
}) => {
  const [docs, setDocs] = useState([]);
  const [checkerComment, setCheckerComment] = useState("");
  const [commentThread, setCommentThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showDocumentSidebar, setShowDocumentSidebar] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [submitCheckerStatus] = useUpdateCheckerStatusMutation();
  const [saveDraft, { isLoading: isSavingDraft }] =
    useSaveChecklistDraftMutation();
  const { data: comments, isLoading: commentsLoading } =
    useGetChecklistCommentsQuery(checklist?._id, { skip: !checklist?._id });

  // Calculate uploaded documents count
  const uploadedDocsCount = useMemo(() => {
    return docs.filter((doc) => doc.fileUrl).length;
  }, [docs]);

  // Calculate document stats using the new function
  const documentStats = useMemo(() => {
    return calculateDocumentStats(docs);
  }, [docs]);

  // Get document stats from the calculation
  const {
    total,
    submitted,
    pendingFromRM,
    pendingFromCo,
    deferred,
    sighted,
    waived,
    tbo,
    checkerApproved,
    checkerRejected,
    checkerReviewed,
    checkerPending,
    rmSubmitted,
    rmPending,
    rmDeferred,
    progressPercent,
  } = documentStats;

  useEffect(() => {
    if (!checklist?.documents) return;
    const flatDocs = checklist.documents.reduce((acc, item) => {
      if (item.docList?.length) {
        const nested = item.docList.map((doc) => ({
          ...doc,
          category: item.category,
          coStatus: doc.status || doc.action || "pending",
        }));
        return acc.concat(nested);
      }
      if (item.category) return acc.concat(item);
      return acc;
    }, []);

    // FIX: If checklist is approved (isReadOnly), set all checkerStatus to "approved"
    const shouldForceApproved =
      isReadOnly || checklist?.status?.toLowerCase() === "approved";

    setDocs(
      flatDocs.map((doc, idx) => ({
        ...doc,
        key: doc._id || `doc-${idx}`,
        status: doc.status || doc.action || "pending",
        approved: shouldForceApproved ? true : doc.approved || false,
        // FIX: Force checkerStatus to "approved" for completed checklists
        checkerStatus: shouldForceApproved
          ? "approved"
          : doc.checkerStatus || (doc.approved ? "approved" : "pending"),
        comment: doc.comment || "",
        fileUrl: doc.fileUrl || null,
        expiryDate: doc.expiryDate || null,
        deferralNo: doc.deferralNo || null,
      }))
    );
  }, [checklist, isReadOnly]);

  // Function to generate and download PDF
  const downloadChecklistAsPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = await import("html2canvas");

      // Helper function to calculate document counts for PDF
      const calculateDocumentCounts = (docs, isCompletedChecklist = false) => {
        const counts = {
          submitted: 0,
          waived: 0,
          deferred: 0,
          sighted: 0,
          tbo: 0,
          pendingrm: 0,
          pendingco: 0,
          pending: 0,
          approved: 0,
          completed: 0,
          total: docs.length,
        };

        docs.forEach((doc) => {
          const coStatus = (doc.status || doc.action || "")
            .toLowerCase()
            .trim();
          const checkerStatus = (doc.checkerStatus || "").toLowerCase().trim();

          // Count CO statuses
          if (coStatus === "submitted") {
            counts.submitted++;
          } else if (coStatus === "waived") {
            counts.waived++;
          } else if (coStatus === "deferred") {
            counts.deferred++;
          } else if (coStatus === "sighted") {
            counts.sighted++;
          } else if (coStatus === "tbo") {
            counts.tbo++;
          } else if (coStatus === "approved") {
            // Count CO approved
          } else if (coStatus === "pendingrm") {
            counts.pendingrm++;
          } else if (coStatus === "pendingco") {
            counts.pendingco++;
          } else if (coStatus === "pending") {
            if (doc.category && doc.category.toLowerCase().includes("rm")) {
              counts.pendingrm++;
            } else {
              counts.pendingco++;
            }
          }

          // Count approved documents - check both CO status and checker status
          if (coStatus === "approved" || checkerStatus === "approved") {
            counts.approved++;
          }

          // For completed checklists, all documents should be approved
          if (
            isCompletedChecklist &&
            !(coStatus === "approved" || checkerStatus === "approved")
          ) {
            counts.approved++; // Force count as approved for completed checklists
          }
        });

        counts.pending = counts.pendingrm + counts.pendingco;
        counts.completed = counts.total - counts.pending;

        return counts;
      };

      // Calculate statistics for PDF
      const isCompletedChecklist =
        checklist?.status === "completed" || checklist?.status === "approved";
      const documentCounts = calculateDocumentCounts(docs, isCompletedChecklist);
      const totalDocs = documentCounts.total;
      const totalDocsReviewed = totalDocs; // All documents reviewed for completed checklist

      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "794px";
      pdfContainer.style.padding = "20px 30px";
      pdfContainer.style.backgroundColor = "#ffffff";
      pdfContainer.style.fontFamily = "'Calibri', 'Arial', sans-serif";
      pdfContainer.style.color = "#333333";

      const bankColors = {
        primary: "#1a365d",
        secondary: "#2c5282",
        accent: "#0f766e",
        success: "#047857",
        warning: "#d97706",
        danger: "#dc2626",
        light: "#f8fafc",
        border: "#e2e8f0",
        text: "#334155",
        textLight: "#64748b",
      };

      const getStatusColor = (status) => {
        const statusLower = (status || "").toLowerCase();
        switch (statusLower) {
          case "submitted":
          case "approved":
            return { bg: "#d1fae5", color: "#065f46", border: "#10b981" };
          case "pendingrm":
            return { bg: "#fee2e2", color: "#991b1b", border: "#ef4444" };
          case "pendingco":
            return { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" };
          case "waived":
            return { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" };
          case "sighted":
            return { bg: "#dbeafe", color: "#1e40af", border: "#3b82f6" };
          case "deferred":
            return { bg: "#e0e7ff", color: "#3730a3", border: "#6366f1" };
          case "tbo":
            return { bg: "#f1f5f9", color: "#475569", border: "#94a3b8" };
          case "rejected":
            return { bg: "#fee2e2", color: "#991b1b", border: "#ef4444" };
          case "reviewed":
            return { bg: "#e0e7ff", color: "#3730a3", border: "#6366f1" };
          default:
            return { bg: "#f1f5f9", color: "#64748b", border: "#cbd5e1" };
        }
      };

      const truncateText = (text, maxLength) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + "...";
      };

      // Get checklist information
      const customerNumber =
        checklist?.customerNumber ||
        checklist?.title?.split("-")?.pop() ||
        "N/A";
      const dclNo = checklist?.dclNo || "N/A";
      const ibpsNo = checklist?.ibpsNo || "Not provided";
      const loanType = checklist?.loanType || "N/A";
      const createdBy = checklist?.createdBy?.name || "N/A";
      const rm = checklist?.assignedToRM?.name || "N/A";
      const coChecker =
        checklist?.assignedToCoChecker?.name ||
        checklist?.coChecker ||
        "Pending";
      const status = checklist?.status || "pending";
      const completedAt = checklist?.completedAt || checklist?.updatedAt || "N/A";

      // Helper function for expiry status
      const getExpiryStatusForPDF = (expiryDate) => {
        if (!expiryDate) return null;
        const today = dayjs().startOf("day");
        const expiry = dayjs(expiryDate).startOf("day");
        return expiry.isBefore(today) ? "expired" : "current";
      };

      pdfContainer.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
       
        .pdf-header {
          border-bottom: 2px solid ${bankColors.primary};
          padding-bottom: 15px;
          margin-bottom: 20px;
          position: relative;
        }
       
        .bank-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
       
        .logo-circle {
          width: 50px;
          height: 50px;
          background: ${bankColors.primary};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }
       
        .bank-name {
          font-size: 20px;
          font-weight: bold;
          color: ${bankColors.primary};
          letter-spacing: 0.5px;
        }
       
        .bank-tagline {
          font-size: 10px;
          color: ${bankColors.textLight};
          margin-top: 2px;
          letter-spacing: 0.3px;
        }
       
        .document-title {
          font-size: 16px;
          font-weight: bold;
          color: ${bankColors.secondary};
          margin-bottom: 5px;
        }
       
        .document-subtitle {
          font-size: 12px;
          color: ${bankColors.textLight};
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
       
        .document-badge {
          background: ${bankColors.light};
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
       
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
       
        .section-card {
          background: white;
          border: 1px solid ${bankColors.border};
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
       
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: ${bankColors.primary};
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid ${bankColors.light};
          display: flex;
          align-items: center;
          gap: 8px;
        }
       
        .section-title::before {
          content: "▌";
          color: ${bankColors.accent};
          font-size: 12px;
        }
       
        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 8px;
          font-size: 10px;
        }
       
        .info-item {
          padding: 8px;
          background: ${bankColors.light};
          border-radius: 4px;
          border-left: 3px solid ${bankColors.secondary};
        }
       
        .info-label {
          font-size: 9px;
          color: ${bankColors.textLight};
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 2px;
        }
       
        .info-value {
          font-size: 11px;
          font-weight: 600;
          color: ${bankColors.text};
        }
       
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 8px;
          margin-bottom: 15px;
          font-size: 9px;
        }
       
        .summary-card {
          padding: 8px;
          border-radius: 6px;
          text-align: center;
          background: ${bankColors.light};
          border: 1px solid ${bankColors.border};
        }
       
        .summary-number {
          font-size: 16px;
          font-weight: bold;
          color: ${bankColors.primary};
          margin: 4px 0;
        }
       
        .summary-label {
          font-size: 8px;
          color: ${bankColors.textLight};
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
       
        .progress-bar {
          height: 6px;
          background: ${bankColors.border};
          border-radius: 3px;
          overflow: hidden;
          margin: 12px 0;
        }
       
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, ${bankColors.success}, ${bankColors.accent});
          border-radius: 3px;
        }
       
        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: ${bankColors.textLight};
        }
       
        .table-container {
          overflow-x: auto;
          margin-top: 12px;
        }
       
        .document-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          table-layout: fixed;
        }
       
        .document-table th {
          background: ${bankColors.primary};
          color: white;
          text-align: left;
          padding: 8px 6px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-right: 1px solid rgba(255,255,255,0.2);
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
       
        .document-table td {
          padding: 6px;
          border-bottom: 1px solid ${bankColors.border};
          vertical-align: top;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
       
        .document-table tr:nth-child(even) {
          background: ${bankColors.light};
        }
       
        .status-badge {
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 8px;
          font-weight: 600;
          display: inline-block;
          border: 1px solid;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
       
        .comment-box {
          background: ${bankColors.light};
          border-left: 3px solid ${bankColors.accent};
          padding: 10px;
          border-radius: 4px;
          margin-top: 8px;
          font-size: 10px;
          line-height: 1.4;
        }
       
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
       
        .comment-author {
          font-weight: 600;
          color: ${bankColors.primary};
          font-size: 10px;
        }
       
        .comment-date {
          font-size: 9px;
          color: ${bankColors.textLight};
        }
       
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          color: rgba(0,0,0,0.03);
          font-weight: bold;
          pointer-events: none;
          z-index: 1;
        }
       
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid ${bankColors.border};
          text-align: center;
          font-size: 9px;
          color: ${bankColors.textLight};
          line-height: 1.4;
        }
       
        .disclaimer {
          background: ${bankColors.light};
          padding: 8px;
          border-radius: 3px;
          margin-top: 8px;
          font-size: 8px;
        }
       
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid ${bankColors.border};
        }
       
        .document-info {
          flex: 1;
        }
       
        .current-status-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 140px;
        }
       
        .status-label {
          font-size: 9px;
          color: ${bankColors.textLight};
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 4px;
        }
       
        .status-display {
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          border: 2px solid;
          min-width: 120px;
        }
       
        .checker-review-badge {
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
        }
       
        .completed-badge {
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
        }
      </style>

      <!-- Watermark -->
      <div class="watermark">COMPLETED CHECKLIST</div>

      <!-- Header with Bank Logo -->
      <div class="pdf-header">
        <div class="bank-logo">
          <div class="logo-circle">NCBA</div>
          <div>
            <div class="bank-name">COMPLETED CHECKLIST REVIEW</div>
            <div class="bank-tagline">Document Control System</div>
          </div>
        </div>
       
        <!-- Document Info and Status Section -->
        <div class="header-content">
          <div class="document-info">
            <div class="document-title">Completed Checklist Review Report</div>
            <div class="document-subtitle">
              <span class="document-badge">
                <span class="badge-dot" style="background: ${bankColors.primary}"></span>
                DCL No: <strong>${dclNo}</strong>
              </span>
              <span class="document-badge">
                <span class="badge-dot" style="background: ${bankColors.secondary}"></span>
                Customer: <strong>${customerNumber}</strong>
              </span>
              <span class="document-badge">
                <span class="badge-dot" style="background: ${bankColors.accent}"></span>
                Completed: <strong>${completedAt ? dayjs(completedAt).format("DD MMM YYYY, HH:mm:ss") : "N/A"}</strong>
              </span>
              <span class="completed-badge">COMPLETED</span>
            </div>
          </div>
         
          <!-- Current Status Display -->
          <div class="current-status-section">
            <div class="status-label">Overall Status</div>
            <div class="status-display" style="
              background: #d1fae5;
              color: #065f46;
              border-color: #10b981;
            ">
              ${status.toUpperCase().replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>

      <!-- Checklist Information -->
      <div class="section-card">
        <div class="section-title">Checklist Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Customer Number</div>
            <div class="info-value">${customerNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">DCL Number</div>
            <div class="info-value">${dclNo}</div>
          </div>
          <div class="info-item">
            <div class="info-label">IBPS Number</div>
            <div class="info-value">${ibpsNo}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Loan Type</div>
            <div class="info-value">${loanType}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Created By</div>
            <div class="info-value">${createdBy}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Relationship Manager</div>
            <div class="info-value">${rm}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Co-Checker</div>
            <div class="info-value">${coChecker}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value" style="color: #10b981; font-weight: bold;">Completed</div>
          </div>
        </div>
      </div>

      <!-- Document Summary -->
      <div class="section-card">
        <div class="section-title">Document Summary</div>
       
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-label">Total</div>
            <div class="summary-number">${totalDocs}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Approved</div>
            <div class="summary-number" style="color: ${bankColors.success};">
              ${documentCounts.approved}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Submitted</div>
            <div class="summary-number" style="color: #0f766e;">
              ${documentCounts.submitted}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Deferred</div>
            <div class="summary-number" style="color: #8b5cf6;">
              ${documentCounts.deferred}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Sighted</div>
            <div class="summary-number" style="color: #3b82f6;">
              ${documentCounts.sighted}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Waived</div>
            <div class="summary-number" style="color: ${bankColors.warning};">
              ${documentCounts.waived}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">TBO</div>
            <div class="summary-number" style="color: #06b6d4;">
              ${documentCounts.tbo}
            </div>
          </div>
         
          </div>
          <div class="summary-card">
            <div class="summary-label">Reviewed</div>
            <div class="summary-number" style="color: ${bankColors.success};">
              ${totalDocsReviewed}
            </div>
          </div>
        </div>
       
        <div class="progress-text">
          <span>Review Progress:</span>
          <span>${totalDocsReviewed}/${totalDocs} documents reviewed (100%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 100%"></div>
        </div>
        <div style="font-size: 9px; color: ${bankColors.success}; margin-top: 8px; text-align: center; font-weight: 600;">
          ✓ All ${totalDocs} documents have been reviewed and processed
        </div>
      </div>

      <!-- Document Details -->
      <div class="section-card">
        <div class="section-title">Document Details</div>
        <div class="table-container">
          <table class="document-table">
            <thead>
              <tr>
                <th width="15%">Category</th>
                <th width="25%">Document Name</th>
                <th width="12%">CO Status</th>
                <th width="12%">Checker Status</th>
                <th width="18%">CO Comment</th>
                <th width="10%">Expiry Date</th>
                <th width="8%">Validity</th>
              </tr>
            </thead>
            <tbody>
              ${docs
                .map((doc, index) => {
                  const coStatus = doc.status || doc.action || "pending";
                  const statusColor = getStatusColor(coStatus);

                  // For completed checklists, checker status should be "approved"
                  let checkerStatus = doc.checkerStatus || "approved";
                  // Force approved status for completed checklists
                  if (isCompletedChecklist) {
                    checkerStatus = "approved";
                  }

                  const checkerStatusColor = getStatusColor(checkerStatus);

                  const coStatusLabel =
                    coStatus === "deferred" &&
                    (doc.deferralNo || doc.deferralNumber)
                      ? `Deferred (${doc.deferralNo || doc.deferralNumber})`
                      : (coStatus || "N/A").toUpperCase();

                  const checkerStatusLabel = checkerStatus
                    ? checkerStatus.toUpperCase()
                    : "APPROVED";

                  const expiryStatus = (doc.category || "")
                    .toLowerCase()
                    .includes("compliance")
                    ? getExpiryStatusForPDF(doc.expiryDate)
                    : null;

                  const truncatedName = truncateText(doc.name, 35);
                  const truncatedCoComment = truncateText(doc.comment, 30);

                  return `
                <tr>
                  <td style="font-weight: 600; color: ${bankColors.secondary};">
                    ${doc.category || "N/A"}
                  </td>
                  <td title="${doc.name || "N/A"}">${truncatedName}</td>
                  <td>
                    <span class="status-badge" style="
                      background: ${statusColor.bg};
                      color: ${statusColor.color};
                      border-color: ${statusColor.border};
                    ">
                      ${coStatusLabel}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" style="
                      background: ${checkerStatusColor.bg};
                      color: ${checkerStatusColor.color};
                      border-color: ${checkerStatusColor.border};
                    ">
                      ${checkerStatusLabel}
                    </span>
                  </td>
                  <td title="${doc.comment || "—"}">
                    ${truncatedCoComment || "—"}
                  </td>
                  <td style="font-family: monospace; font-size: 8px;">
                    ${doc.expiryDate ? dayjs(doc.expiryDate).format("DD/MM/YY") : "—"}
                  </td>
                  <td>
                    ${(() => {
                      if (!expiryStatus) return "—";
                      return `<span class="status-badge" style="
                        background: ${expiryStatus === "current" ? "#d1fae5" : "#fee2e2"};
                        color: ${expiryStatus === "current" ? "#065f46" : "#991b1b"};
                        border-color: ${expiryStatus === "current" ? "#10b981" : "#ef4444"};
                      ">
                        ${expiryStatus === "current" ? "CUR" : "EXP"}
                      </span>`;
                    })()}
                  </td>
                </tr>
              `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
        <div style="font-size: 8px; color: ${bankColors.success}; margin-top: 10px; text-align: center; font-weight: 600;">
          ✓ All ${totalDocs} documents have been reviewed and approved by checker
        </div>
      </div>

      <!-- Comment History -->
      ${
        comments && comments.length > 0
          ? `
        <div class="section-card">
          <div class="section-title">Comment Trail & History</div>
          <div style="max-height: 200px; overflow-y: auto; border: 1px solid ${bankColors.border}; border-radius: 4px; padding: 10px;">
            ${comments
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt || b.timestamp) -
                  new Date(a.createdAt || a.timestamp)
              )
              .slice(0, 5)
              .map((comment, index) => {
                const userName = comment.userId?.name || "System";
                const userRole = comment.userId?.role || "system";
                const message = comment.message || "";
                const timestamp = comment.createdAt || comment.timestamp;
                const formattedTime = dayjs(timestamp).format(
                  "DD MMM YYYY HH:mm:ss"
                );

                // Determine role tag color
                let roleColor = "blue";
                const roleLower = (userRole || "").toLowerCase();
                switch (roleLower) {
                  case "rm":
                    roleColor = "purple";
                    break;
                  case "creator":
                    roleColor = "green";
                    break;
                  case "co_checker":
                  case "checker":
                    roleColor = "volcano";
                    break;
                  case "system":
                    roleColor = "default";
                    break;
                  default:
                    roleColor = "blue";
                }

                const roleBg =
                  roleColor === "purple"
                    ? "#d6c1ff"
                    : roleColor === "green"
                    ? "#d4edda"
                    : roleColor === "volcano"
                    ? "#ffccc7"
                    : roleColor === "default"
                    ? "#f0f0f0"
                    : "#d0e8ff";

                const roleText =
                  roleColor === "purple"
                    ? "#7e6496"
                    : roleColor === "green"
                    ? "#155724"
                    : roleColor === "volcano"
                    ? "#721c24"
                    : roleColor === "default"
                    ? "#666"
                    : "#004085";

                return `
                <div style="margin-bottom: ${index < 4 ? "10px" : "0"}; padding-bottom: ${index < 4 ? "10px" : "0"}; border-bottom: ${index < 4 ? `1px dashed ${bankColors.border}` : "none"};">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 24px; height: 24px; border-radius: 50%; background: ${bankColors.primary}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px;">
                        ${userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style="font-weight: bold; color: ${bankColors.primary}; font-size: 10px;">
                          ${userName}
                        </div>
                        <span style="
                          display: inline-block;
                          padding: 1px 6px;
                          border-radius: 8px;
                          background: ${roleBg};
                          color: ${roleText};
                          font-size: 8px;
                          font-weight: bold;
                          text-transform: uppercase;
                          margin-top: 2px;
                        ">
                          ${roleLower.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <div style="font-size: 9px; color: ${bankColors.textLight};">
                      ${formattedTime}
                    </div>
                  </div>
                  <div style="margin-left: 32px; font-size: 10px; line-height: 1.4; color: ${bankColors.text}; word-break: break-word;">
                    ${message}
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      `
          : `
        <div class="section-card">
          <div class="section-title">Comment Trail & History</div>
          <div style="text-align: center; padding: 20px; color: ${bankColors.textLight}; font-size: 10px; border: 1px dashed ${bankColors.border}; border-radius: 4px;">
            No historical comments yet.
          </div>
        </div>
      `}

      <!-- Footer -->
      <div class="footer">
        <div>
          <strong>COMPLETED CHECKLIST REVIEW REPORT</strong> •
          Document Control System •
          Generated by: ${coChecker || "System"} •
          Page 1 of 1
        </div>
        <div class="disclaimer">
          This is a system-generated document for completed checklists. For official purposes only.
          Any unauthorized reproduction or distribution is strictly prohibited.
          Generated on ${dayjs().format("DD MMM YYYY, HH:mm:ss")} •
          DCL: ${dclNo} • Customer: ${customerNumber} • Status: ${status
        .toUpperCase()
        .replace(/_/g, " ")} • Total Documents: ${totalDocs}
        </div>
      </div>
    `;

      document.body.appendChild(pdfContainer);

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas.default(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        width: pdfContainer.offsetWidth,
        height: pdfContainer.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST"
        );
        heightLeft -= pageHeight;
      }

      const fileName = `Completed_Checklist_${dclNo}_${dayjs().format(
        "YYYYMMDD_HHmmss"
      )}.pdf`;
      pdf.save(fileName);

      document.body.removeChild(pdfContainer);

      message.success("Checklist PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDocApprove = (index) => {
    setDocs((prev) => {
      const updated = [...prev];
      updated[index].approved = true;
      updated[index].checkerStatus = "approved";
      return updated;
    });
  };

  const handleDocReject = (index) => {
    setDocs((prev) => {
      const updated = [...prev];
      updated[index].approved = false;
      updated[index].checkerStatus = "rejected";
      return updated;
    });
  };

  const submitCheckerAction = async (action) => {
    if (!checklist?._id) return alert("Checklist ID missing");

    // VALIDATION: Check if trying to approve with rejected documents
    if (action === "approved") {
      if (checkerRejected > 0) {
        message.error("Cannot approve checklist: Some documents are rejected");
        setConfirmAction(null);
        return;
      }

      if (checkerReviewed !== total) {
        message.error(
          "Cannot approve checklist: Not all documents have been reviewed"
        );
        setConfirmAction(null);
        return;
      }

      if (checkerApproved !== total) {
        message.error(
          "Cannot approve checklist: All documents must be approved"
        );
        setConfirmAction(null);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        id: checklist._id,
        action: action,
        checkerDecisions: docs.map((doc) => ({
          documentId: doc._id || doc.key,
          checkerStatus:
            doc.checkerStatus ||
            (action === "approved" ? "approved" : "rejected"),
          checkerComment: doc.checkerComment || "",
        })),
        checkerComments: checkerComment,
      };

      await submitCheckerStatus(payload).unwrap();
      setConfirmAction(null);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const postComment = () => {
    if (!checkerComment.trim()) return;
    setCommentThread((prev) => [
      {
        user: "Checker",
        comment: checkerComment,
        time: new Date().toLocaleString(),
      },
      ...prev,
    ]);
    setCheckerComment("");
  };

  const renderStatusTag = (status) => {
    if (!status) return <Tag>Unknown</Tag>;

    const normalized = status.toLowerCase().replace(/_/g, " ");

    let color = "default";

    switch (normalized) {
      case "pending":
        color = "red";
        break;
      case "approved":
        color = "green";
        break;
      case "rejected":
        color = "volcano";
        break;
      case "submitted for review":
        color = "blue";
        break;
      default:
      color = "default";
    }

    return <Tag color={color}>{normalized}</Tag>;
  };

  // FIX: Disable actions if checklist is approved (read-only mode)
  const isDisabled =
    isReadOnly ||
    !["check_review", "co_checker_review"].includes(checklist?.status);

  // This is the existing getExpiryStatus function used in the table
  function getExpiryStatus(record) {
    if (!record.expiryDate) {
      return { status: "-", color: "default" };
    }

    const today = dayjs().startOf("day");
    const expiry = dayjs(record.expiryDate).startOf("day");

    if (expiry.isBefore(today)) {
      return { status: "Expired", color: "red" };
    }

    return { status: "Current", color: "green" };
  }

  // Function to check if checklist can be approved
  const canApproveChecklist = () => {
    // Can't approve if disabled
    if (isDisabled) return false;

    // Must have reviewed ALL documents
    if (checkerReviewed !== total) return false;

    // Must have ZERO rejected documents
    if (checkerRejected > 0) return false;

    // Must have ALL documents approved
    if (checkerApproved !== total) return false;

    return true;
  };

  const getApproveButtonTooltip = () => {
    if (isDisabled) return "Checklist is not in review state";
    if (checkerReviewed !== total)
      return `${total - checkerReviewed} document(s) not reviewed yet`;
    if (checkerRejected > 0) return `${checkerRejected} document(s) rejected`;
    if (checkerApproved !== total)
      return `${total - checkerApproved} document(s) not approved`;
    return "Approve this checklist";
  };

  const columns = [
    { title: "Category", dataIndex: "category" },
    { title: "Document Name", dataIndex: "name" },
    {
      title: "Co Status",
      render: (_, record) => {
        const coStatus = record.status || record.action || "pending";

        let color = "default";
        let displayText = coStatus;

        switch (coStatus.toLowerCase()) {
          case "submitted":
            color = "#22c55e";
            break;
          case "sighted":
            color = "#22c55e";
            break;
          case "waived":
            color = " #ffbf00";
            break;
          case "deferred":
            color = " #ffbf00";
            displayText = record.deferralNo
              ? `Deferred (${record.deferralNo})`
              : "Deferred";
            break;
          case "tbo":
            color = " #ffbf00";
            break;
          case "pendingrm":
            color = "#ef4444";
            break;
          case "pendingco":
            color = "#ef4444";
            break;
          default:
            color = "default";
        }

        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    { title: "Co Comment", dataIndex: "comment" },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      width: 120,
      render: (text, record) =>
        record.expiryDate ? dayjs(record.expiryDate).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Expiry Status",
      dataIndex: "expiryStatus",
      render: (_, record) => {
        if (record.category !== "Compliance Documents") return "-";
        const { status, color } = getExpiryStatus(record);
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Checker Status",
      dataIndex: "checkerStatus",
      render: (status) => {
        // FIX: If it's a completed/approved checklist, always show "approved"
        const finalStatus = isReadOnly ? "approved" : status;
        return renderStatusTag(finalStatus);
      },
    },
    {
      title: "Action",
      render: (_, record, index) => (
        <Space className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
          {!isReadOnly && (
            <>
              <Button
                size="small"
                type="primary"
                onClick={() => handleDocApprove(index)}
                disabled={isDisabled}
              >
                Approve
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleDocReject(index)}
                disabled={isDisabled}
              >
                Reject
              </Button>
            </>
          )}
          {record.fileUrl && (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => window.open(record.fileUrl, "_blank")}
            >
              View
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Custom styles for the component
  const customStyles = `
    .review-checklist-modal {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden;
    }
   
    .modal-header {
      background: ${PRIMARY_BLUE};
      color: white;
      padding: 16px 20px;
      border-bottom: 2px solid ${ACCENT_LIME};
    }
   
    .modal-header h3 {
      color: white;
      margin: 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
   
    .modal-body {
      padding: 20px;
      max-height: 85vh;
      overflow-y: auto;
    }
   
    .doc-sidebar-toggle {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 1000;
    }
   
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: ${PRIMARY_BLUE};
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
   
    .checklist-details-box {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }
   
    .status-badge {
      background: #d1fae5;
      color: #065f46;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      border: 1px solid #10b981;
    }
   
    .progress-section {
      background: ${LIGHT_GREY};
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }
   
    .stat-item {
      font-size: 13px;
      font-weight: 600;
    }
   
    .table-container {
      background: white;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 16px;
    }
   
    .comment-section {
      background: white;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }
   
    .action-buttons {
      background: ${LIGHT_GREY};
      padding: 16px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
   
    .doc-item {
      margin-bottom: 16px;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
    }
   
    .doc-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
   
    .doc-title {
      font-weight: 600;
      color: ${PRIMARY_BLUE};
      flex-grow: 1;
    }
   
    .version-badge {
      background: ${ACCENT_LIME};
      color: #1a202c;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
    }
   
    .doc-meta {
      font-size: 11px;
      color: #718096;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
   
    .doc-meta-icon {
      margin-right: 4px;
    }
   
    .upload-timestamp {
      font-size: 9px;
      color: #a0aec0;
      marginTop: 2px;
    }
   
    .doc-divider {
      margin: 8px 0;
    }
   
    .doc-icon {
      font-size: 16px;
    }
   
    .status-breakdown-bar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
    }
   
    .status-breakdown-item {
      height: 100%;
    }
   
    .close-button {
      color: white !important;
      background: transparent !important;
      border: none !important;
      font-size: 20px !important;
      padding: 0 !important;
      width: 32px !important;
      height: 32px !important;
    }
   
    .close-button:hover {
      background: rgba(255,255,255,0.1) !important;
      border-radius: 4px !important;
    }
   
    .view-documents-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 1px solid ${PRIMARY_BLUE};
      color: ${PRIMARY_BLUE};
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
   
    .view-documents-btn:hover {
      background: ${LIGHT_BLUE};
    }
   
    .docs-count {
      background: ${ACCENT_LIME};
      color: #1a202c;
      border-radius: 10px;
      padding: 0 6px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 4px;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>

      <div
        className={`fixed inset-0 z-50 overflow-auto bg-black/40 flex justify-center items-start pt-10 ${
          open ? "" : "hidden"
        }`}
      >
        <div className="review-checklist-modal w-[95%] max-w-6xl">
          {/* Blue Top Bar Header */}
          <div className="modal-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileTextOutlined style={{ fontSize: "20px", color: "white" }} />
                <Title level={4} style={{ color: "white", margin: 0, fontWeight: 600 }}>
                  Review Checklist
                </Title>
                <div
                  style={{
                    fontSize: "12px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: 500,
                  }}
                >
                  DCL: {checklist?.dclNo || "N/A"}
                </div>
              </div>
             
              <Button
                className="close-button"
                icon={<CloseOutlined />}
                onClick={onClose}
              />
            </div>
          </div>

          {/* Document Sidebar */}
          <DocumentSidebar
            documents={docs}
            open={showDocumentSidebar}
            onClose={() => setShowDocumentSidebar(false)}
          />

          {/* Modal Body Content */}
          <div className="modal-body">
            {/* Checklist Details Section - Matching Screenshot */}
            <div className="section-title">
              <span>Checklist Details</span>
              <button
                className="view-documents-btn"
                onClick={() => setShowDocumentSidebar(!showDocumentSidebar)}
              >
                <PaperClipOutlined style={{ fontSize: "14px" }} />
                View Documents
                {uploadedDocsCount > 0 && (
                  <span className="docs-count">{uploadedDocsCount}</span>
                )}
              </button>
            </div>

            {/* Checklist Details Box - Exact layout matching screenshot */}
            <div className="checklist-details-box">
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px 24px"
              }}>
                {/* Left Column */}
                <div>
                  <DetailItem
                    label="DCL No"
                    value={checklist?.dclNo || "N/A"}
                  />
                  <DetailItem
                    label="IBPS No"
                    value={checklist?.ibpsNo || "Not provided"}
                  />
                  <DetailItem
                    label="Created At"
                    value={checklist?.createdAt ? dayjs(checklist.createdAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                  />
                  <DetailItem
                    label="Loan Type"
                    value={checklist?.loanType || "N/A"}
                  />
                </div>
               
                {/* Right Column */}
                <div>
                  <DetailItem
                    label="Created By"
                    value={checklist?.createdBy?.name || "N/A"}
                  />
                  <DetailItem
                    label="RM"
                    value={checklist.assignedToRM?.name || "N/A"}
                  />
                  <DetailItem
                    label="Co-Checker"
                    value={checklist.assignedToCoChecker?.name || checklist.coChecker || "Pending"}
                  />
                  <DetailItem
                    label="Status"
                    value={checklist?.status ? checklist.status.toUpperCase() : "PENDING"}
                    isStatus={true}
                  />
                  <DetailItem
                    label="Completed At"
                    value={checklist?.completedAt ? dayjs(checklist.completedAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                  />
                </div>
              </div>
            </div>

            {/* Progress Section - Matching screenshot design */}
            <div className="progress-section">
              {/* Stats Row - counts of each status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div className="stat-item" style={{ color: PRIMARY_BLUE }}>
                  Total: {total}
                </div>
                <div className="stat-item" style={{ color: "green" }}>
                  Submitted: {submitted}
                </div>
                <div className="stat-item" style={{ color: "#ef4444" }}>
                  Deferred: {deferred}
                </div>
                <div className="stat-item" style={{ color: "#3b82f6" }}>
                  Sighted: {sighted}
                </div>
                <div className="stat-item" style={{ color: "#f59e0b" }}>
                  Waived: {waived}
                </div>
                <div className="stat-item" style={{ color: "#06b6d4" }}>
                  TBO: {tbo}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Completion Progress
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: PRIMARY_BLUE,
                    }}
                  >
                    {progressPercent}%
                  </span>
                </div>
                <Progress
                  percent={progressPercent}
                  strokeColor={{
                    "0%": PRIMARY_BLUE,
                    "100%": ACCENT_LIME,
                  }}
                  strokeWidth={6}
                />
              </div>

              {/* Review Progress Bar */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Review Progress ({checkerReviewed}/{total})
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: SECONDARY_PURPLE,
                    }}
                  >
                    {checkerReviewed > 0
                      ? Math.round((checkerReviewed / total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  percent={checkerReviewed > 0 ? Math.round((checkerReviewed / total) * 100) : 0}
                  strokeColor={{
                    "0%": SECONDARY_PURPLE,
                    "100%": "#8b5cf6",
                  }}
                  strokeWidth={4}
                />
              </div>
            </div>

            {/* Document Table */}
            <div className="table-container">
              <Table columns={columns} dataSource={docs} pagination={false} />
            </div>

            {/* Comment History */}
            <CommentHistory comments={comments} isLoading={commentsLoading} />

            {/* Checker Comment Section */}
            <div className="comment-section">
              <label
                htmlFor="checkerComment"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Checker Comment
              </label>
              <textarea
                id="checkerComment"
                rows={3}
                value={checkerComment}
                onChange={(e) => setCheckerComment(e.target.value)}
                placeholder="Add your comment..."
                disabled={isDisabled}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <div className="flex justify-between items-center">
                <Space>
                  {!isReadOnly && (
                    <Button
                      icon={<UploadOutlined />}
                      disabled={isDisabled}
                      style={{ borderColor: PRIMARY_BLUE, color: PRIMARY_BLUE }}
                    >
                      Upload Documents
                    </Button>
                  )}

                  {/* Save Draft Button */}
                  <Button
                    onClick={async () => {
                      try {
                        message.loading({
                          content: "Saving draft...",
                          key: "saveDraft",
                        });
                        const payload = {
                          checklistId: checklist._id,
                          draftData: {
                            documents: docs.map((doc) => ({
                              _id: doc._id,
                              name: doc.name,
                              category: doc.category,
                              status: doc.status,
                              action: doc.action,
                              checkerStatus: doc.checkerStatus,
                              checkerComment: doc.checkerComment || "",
                              comment: doc.comment,
                              fileUrl: doc.fileUrl,
                              expiryDate: doc.expiryDate,
                              deferralNo: doc.deferralNo,
                            })),
                            creatorComment: checkerComment,
                          },
                        };

                        await saveDraft(payload).unwrap();

                        console.log("Draft saved successfully!", payload);
                        message.success({
                          content: "Draft saved successfully!",
                          key: "saveDraft",
                          duration: 3,
                        });
                      } catch (error) {
                        console.error("Save draft error:", error);
                        message.error({
                          content: "Failed to save draft",
                          key: "saveDraft",
                        });
                      }
                    }}
                    loading={isSavingDraft}
                    disabled={isReadOnly}
                    style={{
                      borderColor: ACCENT_LIME,
                      color: PRIMARY_BLUE,
                    }}
                  >
                    Save Draft
                  </Button>

                  {/* PDF Download Button - ALWAYS ACTIVE */}
                  <Button
                    icon={<FilePdfOutlined />}
                    onClick={downloadChecklistAsPDF}
                    loading={isGeneratingPDF}
                    style={{
                      backgroundColor: PRIMARY_BLUE,
                      borderColor: PRIMARY_BLUE,
                      color: "white",
                    }}
                  >
                    Download as PDF
                  </Button>
                </Space>

                {!isReadOnly && (
                  <Space>
                    <Button
                      danger
                      onClick={() => setConfirmAction("co_creator_review")}
                      disabled={isDisabled}
                    >
                      Return to Creator
                    </Button>

                    <Tooltip title={getApproveButtonTooltip()}>
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        disabled={!canApproveChecklist()}
                        onClick={() => {
                          if (!canApproveChecklist()) {
                            message.error(getApproveButtonTooltip());
                            return;
                          }
                          setConfirmAction("approved");
                        }}
                        style={{
                          backgroundColor: canApproveChecklist() ? PRIMARY_BLUE : "#ccc",
                          borderColor: canApproveChecklist() ? PRIMARY_BLUE : "#ccc",
                        }}
                      >
                        Approve
                      </Button>
                    </Tooltip>
                  </Space>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Confirmation Card - Only show if not read-only */}
        {!isReadOnly && confirmAction && (
          <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg w-96 shadow-lg text-center">
              <h3 className="text-lg font-bold mb-4">
                {confirmAction === "approved"
                  ? "Approve Checklist?"
                  : "Return to Creator?"}
              </h3>
              <p className="mb-6">
                {confirmAction === "approved"
                  ? checkerRejected > 0
                    ? `Cannot approve: ${checkerRejected} document(s) are rejected. Please review all documents.`
                    : checkerReviewed !== total
                    ? `Cannot approve: ${
                        total - checkerReviewed
                      } document(s) not reviewed yet.`
                    : checkerApproved !== total
                    ? `Cannot approve: ${
                        total - checkerApproved
                      } document(s) not approved.`
                    : `This will approve all ${checkerApproved} approved documents. This action is final.`
                  : "This will send the checklist back to the creator."}
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setConfirmAction(null)}>Cancel</Button>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => {
                    // Add validation before submitting
                    if (
                      confirmAction === "approved" &&
                      !canApproveChecklist()
                    ) {
                      message.error(
                        "Cannot approve checklist: All documents must be approved"
                      );
                      setConfirmAction(null);
                      return;
                    }
                    submitCheckerAction(confirmAction);
                  }}
                  // Also disable the confirm button if conditions are not met
                  disabled={
                    confirmAction === "approved" && !canApproveChecklist()
                  }
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckerReviewChecklistModal;