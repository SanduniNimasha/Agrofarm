import React, { useEffect, useState } from "react";
import "./MainSection.css";
import { BiSearch } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import Card from "./components/Card";
import ModelPopup from "../ModelPopup/ModelPopup";
import { axiosGet } from "../../axiosServices";
import EditDetailsModal from "../ModelPopup/EditDetailsModal";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    color: "#444",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  employeeCard: {
    marginBottom: 20,
    padding: 10,
    borderBottom: "1px solid #ccc",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    fontSize: 10,
  },
  headerCell: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: "#666",
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
  }
});

// Define All Employees PDF Document component
const AllEmployeesPDFDocument = ({ employees }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>All Customers Report</Text>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Total Customers: {employees.length}</Text>
        
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.headerCell]}>Name</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Email</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Position</Text>
          </View>
          
          {employees.map((emp, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{`${emp.firstname} ${emp.lastname}`}</Text>
              <Text style={styles.tableCell}>{emp.email}</Text>
              <Text style={styles.tableCell}>{emp.job}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.summary}>
          <Text>Report generated on: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>
      
      <Text style={styles.footer}>This is an official report of all customers</Text>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
    
    {/* Detailed customer pages */}
    {employees.map((emp, index) => (
      <Page key={index} size="A4" style={styles.page}>
        <Text style={styles.header}>Customer Details</Text>
        <View style={styles.section}>
          <View style={styles.employeeCard}>
            <Text style={styles.subHeader}>{emp.firstname} {emp.lastname}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.headerCell]}>Field</Text>
                <Text style={[styles.tableCell, styles.headerCell]}>Information</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Full Name</Text>
                <Text style={styles.tableCell}>{`${emp.firstname} ${emp.lastname}`}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Email</Text>
                <Text style={styles.tableCell}>{emp.email}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Position</Text>
                <Text style={styles.tableCell}>{emp.job}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>ID</Text>
                <Text style={styles.tableCell}>{emp._id}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    ))}
  </Document>
);

const MainSection = ({ setEmployeeId }) => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [empById, setEmpById] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const getAllEmployee = async () => {
    try {
      const res = await axiosGet('/employee');
      setEmployees(res.data);
    }
    catch (err) {
      console.log(err);
    }
  };
  
  const getEmployeeById = async (id) => {
    try {
      const res = await axiosGet(`/employee/${id}`);
      setEmpById(res.data);
    }
    catch (err) {
      console.log(err);
    }
  };
  
  const handleSearch = async (e) => {
    try {
      const res = await axiosGet(`/searchemployee/${e.target.value}`);
      setEmployees(res.data);
    }
    catch (err) {
      console.log(err.message);
    }
  };
  
  const handleEdit = async (id) => {
    getEmployeeById(id);
    setEditModal(true);
  };
  
  const handleReRender = () => {
    setReRender(true);
  };

  useEffect(() => {
    getAllEmployee();
    setReRender(false);
  }, [showModal, editModal, reRender]);
  
  return (
    <>
      {showModal && <ModelPopup setShowModal={setShowModal} />}
      {editModal && <EditDetailsModal setEditModal={setEditModal} empById={empById} />}

      <main className="mainContainer">
        <div className="mainWrapper">
          <div className="header-actions">
            <h1>
              Total customers <span className="emp-count">{employees.length}</span>
            </h1>
            
            {/* All Customers Report Button */}
            <div className="report-actions">
              <PDFDownloadLink
                document={<AllEmployeesPDFDocument employees={employees} />}
                fileName="all-customers-report.pdf"
                className="pdf-download-button"
                onClick={() => setGeneratingPDF(true)}
              >
                {({ blob, url, loading, error }) => (
                  <button 
                    className="report-btn"
                    disabled={loading || generatingPDF}
                  >
                    <FaFilePdf size={16} style={{ marginRight: '8px' }} />
                    {loading || generatingPDF ? "Generating Report..." : "Generate All Customers Report"}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
          
          <div className="employeeHeader">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by customer's name"
                onChange={handleSearch}
              />
              <BiSearch size={20} />
            </div>
            <button 
              className="add-btn"
              onClick={() => setShowModal(true)}
            >
              <IoMdAdd size="20" color="#fffff" />Add Customer
            </button>
          </div>
          
          <div className="employees">
            {employees && employees.map((emp) => {
              return (
                <div key={emp._id} onClick={() => setEmployeeId(emp._id)}>
                  <Card
                    empData={emp}
                    handleEdit={handleEdit}
                    handleReRender={handleReRender} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default MainSection;